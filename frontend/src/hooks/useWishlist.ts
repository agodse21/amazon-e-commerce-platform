import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Wishlist } from '@/types';

const WISHLIST_QUERY_KEY = ['wishlist'];

export default function useWishlist() {
  const useGetWishlist = () => {
    const query = useQuery<Wishlist>({
      queryKey: WISHLIST_QUERY_KEY,
      queryFn: async () => {
        const res = await api.get<Wishlist>('/wishlist');
        return res.data;
      },
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (query.data?.items !== undefined) {
        useWishlistStore.getState().setItems(query.data.items);
      }
    }, [query.data]);

    return query;
  };

  const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation<Wishlist, Error, string>({
      mutationFn: async (productId) => {
        const res = await api.post<Wishlist>('/wishlist/items', { productId });
        return res.data;
      },
      onSuccess: (wishlist) => {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlist);
        useWishlistStore.getState().setItems(wishlist.items);
        toast.success('Added to wishlist');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation<Wishlist, Error, string>({
      mutationFn: async (itemId) => {
        const res = await api.delete<Wishlist>(`/wishlist/items/${itemId}`);
        return res.data;
      },
      onSuccess: (wishlist) => {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlist);
        useWishlistStore.getState().setItems(wishlist.items);
        toast.success('Removed from wishlist');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const useRemoveProductFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation<Wishlist, Error, string>({
      mutationFn: async (productId) => {
        const res = await api.delete<Wishlist>(`/wishlist/products/${productId}`);
        return res.data;
      },
      onSuccess: (wishlist) => {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlist);
        useWishlistStore.getState().setItems(wishlist.items);
        toast.success('Removed from wishlist');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const useToggleWishlist = () => {
    const add = useAddToWishlist();
    const removeByProduct = useRemoveProductFromWishlist();

    return {
      toggle: (productId: string) => {
        const currentItems = useWishlistStore.getState().items;
        const existing = currentItems.find((item) => item.productId === productId);
        if (existing) {
          removeByProduct.mutate(productId);
        } else {
          add.mutate(productId);
        }
      },
      isPending: add.isPending || removeByProduct.isPending,
    };
  };

  return {
    useGetWishlist,
    useAddToWishlist,
    useRemoveFromWishlist,
    useRemoveProductFromWishlist,
    useToggleWishlist,
  };
}
