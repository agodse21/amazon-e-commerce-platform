import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummaryPanel from '@/components/checkout/OrderSummaryPanel';
import { Skeleton } from '@/components/ui/skeleton';
import useOrders from '@/hooks/useOrders';
import useProducts from '@/hooks/useProducts';
import type { CartItem, ShippingAddress } from '@/types';
import useCart from '@/hooks/useCart';

const checkoutSearchSchema = z.object({
  productId: z.string().optional(),
  quantity: z.coerce.number().min(1).max(99).optional(),
});

export const Route = createFileRoute('/_public/checkout')({
  validateSearch: checkoutSearchSchema,
  component: CheckoutPage,
});

function CheckoutPage() {
  const { productId, quantity = 1 } = Route.useSearch();
  const isBuyNow = Boolean(productId);

  const { useGetCartItems } = useCart();
  const { data: cart, isLoading: isCartLoading } = useGetCartItems();
  const { useGetProductById } = useProducts();
  const {
    data: buyNowProduct,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductById(productId ?? '');

  const { useCreateOrder } = useOrders();

  const createOrder = useCreateOrder();

  const isLoading = isBuyNow ? isProductLoading : isCartLoading;

  const checkoutItems: CartItem[] = isBuyNow
    ? buyNowProduct
      ? [
          {
            id: `buy-now-${buyNowProduct.id}`,
            productId: buyNowProduct.id,
            quantity,
            product: buyNowProduct,
          },
        ]
      : []
    : (cart?.items ?? []);

  const handlePlaceOrder = (address: ShippingAddress) => {
    createOrder.mutate({
      shippingAddress: address,
      ...(isBuyNow && productId ? { buyNow: { productId, quantity } } : {}),
    });
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <Skeleton className="h-8 w-56 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <Skeleton className="h-96 rounded" />
          <Skeleton className="h-64 rounded" />
        </div>
      </div>
    );
  }

  if (isBuyNow && (isProductError || !buyNowProduct)) {
    return (
      <div className="page-container text-center py-16">
        <h2 className="text-xl font-bold mb-2">Product not available</h2>
        <p className="text-gray-500 mb-4">This item can&apos;t be purchased right now.</p>
        <Link to="/" className="text-amazon-link-blue hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!isBuyNow && (!cart || cart.items.length === 0)) {
    return (
      <div className="page-container text-center py-16">
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">Add items to your cart before checking out.</p>
        <Link to="/" className="text-amazon-link-blue hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-amazon-navy">Checkout</h1>
        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
        <span className="text-xs sm:text-sm text-gray-500">Secure checkout</span>
      </div>

      {isBuyNow && (
        <p className="text-sm text-gray-600 mb-4">
          Buying now — only this item will be ordered. Your saved cart is unchanged.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="amazon-panel">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amazon-orange text-black text-sm flex items-center justify-center font-bold">
              1
            </span>
            Shipping Address
          </h2>
          <AddressForm onSubmit={handlePlaceOrder} isSubmitting={createOrder.isPending} />
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummaryPanel items={checkoutItems} />
        </div>
      </div>
    </div>
  );
}
