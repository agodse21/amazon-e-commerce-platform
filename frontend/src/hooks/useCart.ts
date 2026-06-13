import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import type { Cart } from '@/types';

const CART_QUERY_KEY = ['cart'];

export default function useCart() {
  const useGetCartItems = () => {
    const query = useQuery<Cart>({
      queryKey: CART_QUERY_KEY,
      queryFn: async () => {
        const res = await api.get<Cart>('/cart');
        return res.data;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes — reduce unnecessary refetches
      refetchOnWindowFocus: false, // prevents refetch every time you switch tabs
    });

    // Sync into Zustand only when query.data changes — NOT during render
    useEffect(() => {
      if (query.data !== undefined) {
        useCartStore.getState().setCart(query.data);
      }
    }, [query.data]);

    return query;
  };

  const useAddToCart = () => {
    const queryClient = useQueryClient();
    const { openCart } = useCartStore();

    return useMutation<Cart, Error, { productId: string; quantity: number }>({
      mutationFn: async ({ productId, quantity }) => {
        const res = await api.post<Cart>('/cart/items', { productId, quantity });
        return res.data;
      },
      onSuccess: (cart) => {
        queryClient.setQueryData(CART_QUERY_KEY, cart);
        useCartStore.getState().setCart(cart);
        toast.success('Added to cart');
        openCart();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation<Cart, Error, { itemId: string; quantity: number }>({
      mutationFn: async ({ itemId, quantity }) => {
        const res = await api.put<Cart>(`/cart/items/${itemId}`, { quantity });
        return res.data;
      },
      onSuccess: (cart) => {
        queryClient.setQueryData(CART_QUERY_KEY, cart);
        useCartStore.getState().setCart(cart);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation<Cart, Error, string>({
      mutationFn: async (itemId) => {
        const res = await api.delete<Cart>(`/cart/items/${itemId}`);
        return res.data;
      },
      onSuccess: (cart) => {
        queryClient.setQueryData(CART_QUERY_KEY, cart);
        useCartStore.getState().setCart(cart);
        toast.success('Item removed');
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error>({
      mutationFn: async () => {
        await api.delete('/cart');
      },
      onSuccess: () => {
        queryClient.setQueryData(CART_QUERY_KEY, null);
        useCartStore.getState().setCart(null);
      },
    });
  };
  return { useGetCartItems, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart };
}
