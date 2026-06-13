import { ProductImage } from '@/components/ui/product-image';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/types';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

interface OrderSummaryPanelProps {
  items: CartItem[];
}

export default function OrderSummaryPanel({ items }: OrderSummaryPanelProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="amazon-panel">
      <h2 className="font-bold text-lg mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative flex-shrink-0">
              <ProductImage
                images={item.product.images}
                alt={item.product.name}
                className="w-14 h-14 object-contain border border-gray-100 rounded"
              />
              <span className="absolute -top-1.5 -right-1.5 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm line-clamp-2">{item.product.name}</p>
              <p className="text-sm font-medium mt-0.5">
                {formatPrice(parseFloat(item.product.price) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="mb-3" />

      {/* Totals */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span className={shippingCost === 0 ? 'text-amazon-cart-green' : ''}>
            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>GST & Taxes:</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-xl font-bold">
          <span>Order Total:</span>
          <span className="text-[#B12704]">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
