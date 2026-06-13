import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Order, ShippingAddress } from '@/types';

export default function useOrders() {
  const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation<
      Order,
      Error,
      {
        shippingAddress: ShippingAddress;
        buyNow?: { productId: string; quantity: number };
      }
    >({
      mutationFn: async ({ shippingAddress, buyNow }) => {
        const res = await api.post<Order>('/orders', {
          shippingAddress,
          ...(buyNow
            ? { items: [{ productId: buyNow.productId, quantity: buyNow.quantity }] }
            : {}),
        });
        return res.data;
      },
      onSuccess: (order, { buyNow }) => {
        if (!buyNow) {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
        toast.success('Order placed successfully!');
        navigate({ to: '/order-confirmation/$orderId', params: { orderId: order.id } });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const useGetOrderById = (orderId: string) => {
    return useQuery<Order>({
      queryKey: ['order', orderId],
      queryFn: async () => {
        const res = await api.get<Order>(`/orders/${orderId}`);
        return res.data;
      },
      enabled: Boolean(orderId),
      retry: 1,
    });
  };

  const useGetOrders = () => {
    return useQuery<Order[]>({
      queryKey: ['orders'],
      queryFn: async () => {
        const res = await api.get<Order[]>('/orders');
        return res.data;
      },
      staleTime: 1000 * 60,
    });
  };
  return { useCreateOrder, useGetOrderById, useGetOrders };
}
