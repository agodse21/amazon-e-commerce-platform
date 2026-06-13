import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export default function CartSummary({
  subtotal,
  itemCount,
  onCheckout,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="amazon-panel">
      {/* Free shipping banner */}
      {subtotal >= FREE_SHIPPING_THRESHOLD ? (
        <div className="flex items-center gap-1.5 text-amazon-cart-green text-sm mb-3">
          <CheckCircle2 className="h-4 w-4" />
          Your order qualifies for FREE Delivery!
        </div>
      ) : (
        <p className="text-sm mb-3">
          Add{' '}
          <span className="text-amazon-link-blue font-medium">
            {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
          </span>{' '}
          more to get FREE delivery
        </p>
      )}

      <Separator className="mb-3" />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} items):</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span className={shippingCost === 0 ? 'text-amazon-cart-green font-medium' : ''}>
            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>GST & Taxes:</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between text-lg font-bold">
          <span>Order Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <>
          {onCheckout ? (
            <Button
              variant="amazon"
              size="full"
              className="mt-4"
              onClick={onCheckout}
              disabled={itemCount === 0}
            >
              Proceed to Buy ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </Button>
          ) : (
            <Link to="/checkout">
              <Button
                variant="amazon"
                size="full"
                className="mt-4"
                disabled={itemCount === 0}
              >
                Proceed to Buy ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
