import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductImage } from '@/components/ui/product-image';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import useOrders from '@/hooks/useOrders';
import { OrderItem } from '@/types';

export const Route = createFileRoute('/_public/order-confirmation/$orderId')({
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { orderId } = Route.useParams();
  const { useGetOrderById } = useOrders();
  const { data: order, isLoading, isError } = useGetOrderById(orderId);

  if (isLoading) {
    return (
      <div className="page-container max-w-3xl mx-auto">
        <Skeleton className="h-24 w-full rounded mb-6" />
        <Skeleton className="h-48 w-full rounded mb-6" />
        <Skeleton className="h-32 w-full rounded" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="page-container text-center py-16">
        <h2 className="text-xl font-bold mb-2">Order not found</h2>
        <Link to="/">
          <Button variant="amazon">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Success banner */}
      <div className="amazon-panel border-l-4 border-l-green-500 mb-6">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-green-800 mb-1">Order Placed Successfully!</h1>
            <p className="text-sm text-gray-600">
              Your order has been confirmed. You'll receive a confirmation shortly.
            </p>
            <p className="text-sm font-medium mt-1">
              Order ID: <span className="font-bold text-amazon-link-blue">{order.orderNumber}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Delivery timeline */}
      <div className="amazon-panel mb-6">
        <h2 className="font-bold text-base mb-4">Delivery Status</h2>
        <div className="flex items-center gap-2">
          {[
            { icon: CheckCircle2, label: 'Order Confirmed', done: true },
            { icon: Package, label: 'Processing', done: false },
            { icon: Truck, label: 'Shipped', done: false },
            { icon: Home, label: 'Delivered', done: false },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`rounded-full p-2 ${step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs text-center ${step.done ? 'font-medium text-green-700' : 'text-gray-500'}`}
                >
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i === 0 ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping address */}
        <div className="amazon-panel">
          <h2 className="font-bold text-base mb-3">Shipping To</h2>
          <p className="font-medium">{addr.fullName}</p>
          <p className="text-sm text-gray-600">{addr.street}</p>
          <p className="text-sm text-gray-600">
            {addr.city}, {addr.state} — {addr.zip}
          </p>
          <p className="text-sm text-gray-600">{addr.country}</p>
          {addr.phone && <p className="text-sm text-gray-600 mt-1">📞 {addr.phone}</p>}
        </div>

        {/* Order totals */}
        <div className="amazon-panel">
          <h2 className="font-bold text-base mb-3">Order Summary</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className={parseFloat(order.shippingCost) === 0 ? 'text-green-600' : ''}>
                {parseFloat(order.shippingCost) === 0 ? 'FREE' : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>GST & Taxes:</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-base">
              <span>Total:</span>
              <span className="text-[#B12704]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered items */}
      <div className="amazon-panel mb-6">
        <h2 className="font-bold text-base mb-4">
          Items Ordered ({order.items.reduce((s: number, i: OrderItem) => s + i.quantity, 0)})
        </h2>
        <div className="space-y-4">
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
              <ProductImage
                src={
                  item.product?.images ? getPrimaryImage(item.product.images) : item.productImage
                }
                alt={item.productName}
                className="w-16 h-16 object-contain border border-gray-100 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{item.productName}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium flex-shrink-0">
                {formatPrice(parseFloat(item.unitPrice) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="flex-1">
          <Button variant="amazon" size="full">
            Continue Shopping
          </Button>
        </Link>
        <Link to="/orders" className="flex-1">
          <Button variant="amazon-outline" size="full">
            View All Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
