import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductImage } from '@/components/ui/product-image';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import useOrders from '@/hooks/useOrders';
import { Order } from '@/types';

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrderHistoryPage,
});

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

function OrderHistoryPage() {
  const { useGetOrders } = useOrders();
  const { data: orders, isLoading } = useGetOrders();

  return (
    <div className="page-container max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="amazon-panel text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">When you place an order, it will appear here.</p>
          <Link to="/" className="text-amazon-link-blue hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="amazon-panel">
              {/* Header */}
              <div className="flex flex-wrap justify-between gap-4 mb-3 pb-3 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-6 text-xs text-gray-600">
                  <div>
                    <p className="uppercase font-bold mb-0.5">Order Placed</p>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase font-bold mb-0.5">Total</p>
                    <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="uppercase font-bold mb-0.5">Ship to</p>
                    <p>{order.shippingAddress.fullName}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 text-right">
                  <p className="font-bold uppercase mb-0.5">Order # {order.orderNumber}</p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${statusColors[order.status] ?? ''}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="flex gap-3 overflow-x-auto">
                {order.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-16">
                    <ProductImage
                      src={
                        item.product?.images
                          ? getPrimaryImage(item.product.images)
                          : item.productImage
                      }
                      alt={item.productName}
                      className="w-16 h-16 object-contain border border-gray-100 rounded"
                    />
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-gray-700 line-clamp-1">
                  {order.items[0]?.productName}
                  {order.items.length > 1 && ` and ${order.items.length - 1} more item(s)`}
                </p>
                <Link
                  to="/order-confirmation/$orderId"
                  params={{ orderId: order.id }}
                  className="text-sm text-amazon-link-blue hover:text-amazon-orange flex items-center gap-0.5"
                >
                  View Details <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
