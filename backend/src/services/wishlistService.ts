import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { createError } from '../middleware/errorHandler.js';

const WISHLIST_INCLUDE = {
  product: {
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
} satisfies Prisma.WishlistInclude;

export type WishlistWithProducts = Prisma.WishlistGetPayload<{ include: typeof WISHLIST_INCLUDE }>;

export const getWishlist = async (sessionId: string) => {
  return prisma.wishlist.findMany({
    where: { sessionId },
    include: WISHLIST_INCLUDE,
    orderBy: { createdAt: 'desc' },
  });
};

export const addToWishlist = async (sessionId: string, productId: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw createError('Product not found', 404);
  }

  const existing = await prisma.wishlist.findFirst({
    where: { sessionId, productId },
  });

  if (existing) {
    return getWishlist(sessionId);
  }

  await prisma.wishlist.create({
    data: { sessionId, productId },
  });

  return getWishlist(sessionId);
};

export const removeFromWishlist = async (sessionId: string, itemId: string) => {
  const item = await prisma.wishlist.findFirst({
    where: { id: itemId, sessionId },
  });

  if (!item) {
    throw createError('Wishlist item not found', 404);
  }

  await prisma.wishlist.delete({ where: { id: itemId } });

  return getWishlist(sessionId);
};

export const removeProductFromWishlist = async (sessionId: string, productId: string) => {
  const item = await prisma.wishlist.findFirst({
    where: { sessionId, productId },
  });

  if (!item) {
    throw createError('Wishlist item not found', 404);
  }

  await prisma.wishlist.delete({ where: { id: item.id } });

  return getWishlist(sessionId);
};
