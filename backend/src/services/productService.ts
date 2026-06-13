import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  cursor?: string;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

const PRODUCT_INCLUDE = {
  images: {
    orderBy: { displayOrder: 'asc' as const },
  },
  category: {
    select: { id: true, name: true, slug: true },
  },
};

const PRODUCT_LIST_INCLUDE = {
  images: {
    where: { isPrimary: true },
    take: 1,
  },
  category: {
    select: { id: true, name: true, slug: true },
  },
};

export const getProducts = async (filters: ProductFilters) => {
  const { search, categoryId, cursor, limit = 20, sortBy = 'newest' } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === 'price_asc'
      ? { price: 'asc' }
      : sortBy === 'price_desc'
        ? { price: 'desc' }
        : sortBy === 'rating'
          ? { ratingAvg: 'desc' }
          : { createdAt: 'desc' };

  const products = await prisma.product.findMany({
    where,
    include: PRODUCT_LIST_INCLUDE,
    orderBy,
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasNextPage = products.length > limit;
  const items = hasNextPage ? products.slice(0, limit) : products;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return { items, nextCursor, hasNextPage };
};

export const getProductById = async (id: string) => {
  return prisma.product.findFirst({
    where: { id, isActive: true },
    include: {
      ...PRODUCT_INCLUDE,
      specifications: {
        orderBy: { id: 'asc' },
      },
    },
  });
};

export const getProductBySlug = async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      ...PRODUCT_INCLUDE,
      specifications: {
        orderBy: { id: 'asc' },
      },
    },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { name: 'asc' },
  });
};
