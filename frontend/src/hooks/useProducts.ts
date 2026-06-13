import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PaginatedProducts, Product, Category } from '@/types';

interface ProductFilters {
  search?: string;
  categoryId?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export default function useProducts() {
  const useGetProducts = (filters: ProductFilters = {}) => {
    return useInfiniteQuery<PaginatedProducts>({
      queryKey: ['products', filters],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
        if (filters.limit) params.set('limit', String(filters.limit));
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        if (pageParam) params.set('cursor', pageParam as string);

        const res = await api.get<PaginatedProducts>(`/products?${params}`);
        return res.data;
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const useGetProductById = (id: string) => {
    return useQuery<Product>({
      queryKey: ['product', id],
      queryFn: async () => {
        const res = await api.get<Product>(`/products/${id}`);
        return res.data;
      },
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  const useGetCategories = () => {
    return useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: async () => {
        const res = await api.get<Category[]>('/categories');
        return res.data;
      },
      staleTime: 1000 * 60 * 30, // 30 minutes — categories rarely change
    });
  };

  return { useGetProducts, useGetProductById, useGetCategories };
}
