import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import useCart from '@/hooks/useCart';
import type { CartItem as CartItemType } from '@/types';

export const Route = createFileRoute('/_public/cart')({
  component: CartPage,
});

function CartPage() {
  const { useGetCartItems } = useCart();
  const { data: cart, isLoading } = useGetCartItems();
  const { itemCount, subtotal } = useCartStore();

  if (isLoading) {
    return (
      <div className="page-container">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="amazon-panel space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-20 h-20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Cart items */}
        <div className="amazon-panel">
          <h1 className="text-2xl font-medium mb-1">Shopping Cart</h1>
          {cart && cart.items.length > 0 && (
            <p className="text-sm text-amazon-link-blue text-right mb-2">Price</p>
          )}
          <hr className="border-gray-200 mb-2" />

          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Your Amazon Cart is empty</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your shopping cart lives here. Start shopping and add items!
              </p>
              <Link to="/">
                <Button variant="amazon">Shop Today's Deals</Button>
              </Link>
            </div>
          ) : (
            <>
              {cart.items.map((item: CartItemType) => (
                <CartItem key={item.id} item={item} />
              ))}

              <div className="text-right text-lg mt-4">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):
                <span className="font-bold ml-1">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
        </div>

        {/* Summary sidebar */}
        {cart && cart.items.length > 0 && (
          <div className="sticky top-24">
            <CartSummary subtotal={subtotal} itemCount={itemCount} />
          </div>
        )}
      </div>
    </div>
  );
}
