import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AMZ-${dateStr}-${random}`;
};

const TAX_RATE = 0.08; // 8%
const FREE_SHIPPING_THRESHOLD = 499; // Free shipping above ₹499

export interface OrderLineItem {
  productId: string;
  quantity: number;
}

type OrderItemWithProduct = {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: { toString(): string } | number | string;
    stock: number;
    isActive: boolean;
  };
};

const resolveOrderItems = async (
  sessionId: string,
  buyNowItems?: OrderLineItem[]
): Promise<{ items: OrderItemWithProduct[]; cartId: string | null }> => {
  if (buyNowItems?.length) {
    const items: OrderItemWithProduct[] = [];

    for (const line of buyNowItems) {
      const product = await prisma.product.findUnique({ where: { id: line.productId } });
      if (!product || !product.isActive) {
        throw createError('Product not found', 404);
      }
      items.push({
        productId: line.productId,
        quantity: line.quantity,
        product,
      });
    }

    return { items, cartId: null };
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw createError('Cart is empty', 400);
  }

  return {
    cartId: cart.id,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
    })),
  };
};

export const createOrder = async (
  sessionId: string,
  shippingAddress: ShippingAddress,
  buyNowItems?: OrderLineItem[]
) => {
  const { items, cartId } = await resolveOrderItems(sessionId, buyNowItems);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw createError(`Product "${item.product.name}" is no longer available`, 400);
      }
      if (product.stock < item.quantity) {
        throw createError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          400
        );
      }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
    const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        sessionId,
        subtotal,
        tax,
        shippingCost,
        total,
        shippingAddress: shippingAddress as object,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: undefined,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Buy Now leaves the saved cart untouched
    if (cartId) {
      await tx.cartItem.deleteMany({ where: { cartId } });
    }

    return newOrder;
  });

  return order;
};

export const getOrderById = async (orderId: string, sessionId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      OR: [{ sessionId }, { sessionId: null }],
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!order) throw createError('Order not found', 404);
  return order;
};

export const getOrdersBySession = async (sessionId: string) => {
  return prisma.order.findMany({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
