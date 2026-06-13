import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';

const CART_INCLUDE = {
  items: {
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  },
};

const getOrCreateCart = async (sessionId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: CART_INCLUDE,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: CART_INCLUDE,
    });
  }

  return cart;
};

export const getCart = async (sessionId: string) => {
  return getOrCreateCart(sessionId);
};

export const addToCart = async (
  sessionId: string,
  productId: string,
  quantity: number
) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw createError('Product not found', 404);
  }
  if (product.stock < quantity) {
    throw createError(`Only ${product.stock} items available in stock`, 400);
  }

  const cart = await getOrCreateCart(sessionId);

  const existingItem = cart.items.find((i) => i.productId === productId);

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > product.stock) {
      throw createError(`Only ${product.stock} items available in stock`, 400);
    }
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  return getOrCreateCart(sessionId);
};

export const updateCartItem = async (
  sessionId: string,
  itemId: string,
  quantity: number
) => {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!cart) throw createError('Cart not found', 404);

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw createError('Cart item not found', 404);

  const product = await prisma.product.findUnique({ where: { id: item.productId } });
  if (!product) throw createError('Product not found', 404);
  if (product.stock < quantity) {
    throw createError(`Only ${product.stock} items available in stock`, 400);
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  await prisma.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } });

  return getOrCreateCart(sessionId);
};

export const removeCartItem = async (sessionId: string, itemId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!cart) throw createError('Cart not found', 404);

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw createError('Cart item not found', 404);

  await prisma.cartItem.delete({ where: { id: itemId } });
  await prisma.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } });

  return getOrCreateCart(sessionId);
};

export const clearCart = async (sessionId: string) => {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } });
};
