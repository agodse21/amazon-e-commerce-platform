import { Link } from '@tanstack/react-router';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import useCart from '@/hooks/useCart';
import type { CartItem as CartItemType } from '@/types';

export default function CartSheet() {
  const { isCartOpen, closeCart, itemCount, subtotal } = useCartStore();
  const { useGetCartItems } = useCart();
  const { data: cart, isLoading } = useGetCartItems();

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">Loading cart…</div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-gray-500">
              <ShoppingCart className="h-12 w-12 opacity-30" />
              <p>Your cart is empty</p>
              <Button variant="amazon-outline" size="sm" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            cart.items.map((item: CartItemType) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t px-6 py-4 bg-white space-y-3">
            <div className="flex justify-between items-center font-bold text-base">
              <span>Subtotal ({itemCount} items):</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Separator />
            <div className="flex flex-col gap-2 w-full">
              <Button variant="amazon-outline" size="full" asChild>
                <Link to="/cart" onClick={closeCart}>
                  View Full Cart
                </Link>
              </Button>
              <Button variant="amazon" size="full" asChild>
                <Link to="/checkout" onClick={closeCart}>
                  Proceed to Checkout
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
