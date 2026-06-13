import { Minus, Plus, Trash2 } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';
import { Link } from '@tanstack/react-router';
import useCart from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { useUpdateCartItem, useRemoveCartItem } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const isUpdating = updateItem.isPending || removeItem.isPending;

  return (
    <div className={`flex gap-4 py-4 border-b border-gray-200 ${isUpdating ? 'opacity-60' : ''}`}>
      {/* Image */}
      <Link
        to="/products/$productId"
        params={{ productId: item.productId }}
        className="flex-shrink-0"
      >
        <ProductImage
          images={item.product.images}
          alt={item.product.name}
          className="w-20 h-20 object-contain border border-gray-100 rounded"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to="/products/$productId"
          params={{ productId: item.productId }}
          className="text-sm font-medium text-gray-900 hover:text-amazon-orange line-clamp-2"
        >
          {item.product.name}
        </Link>

        {/* Stock status */}
        {item.product.stock > 0 ? (
          <p className="stock-in text-xs mt-0.5">In Stock</p>
        ) : (
          <p className="stock-out text-xs mt-0.5">Out of Stock</p>
        )}

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
            <button
              onClick={() =>
                item.quantity > 1
                  ? updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                  : removeItem.mutate(item.id)
              }
              disabled={isUpdating}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              {item.quantity === 1 ? (
                <Trash2 className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
            </button>
            <span className="px-3 text-sm font-medium border-x border-gray-300">
              {item.quantity}
            </span>
            <button
              onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
              disabled={isUpdating || item.quantity >= item.product.stock}
              className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeItem.mutate(item.id)}
            disabled={isUpdating}
            className="text-xs text-amazon-link-blue hover:text-amazon-orange hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="price-display text-base">
          {formatPrice(parseFloat(item.product.price) * item.quantity)}
        </p>
        {item.quantity > 1 && (
          <p className="text-xs text-gray-500">{formatPrice(item.product.price)} each</p>
        )}
      </div>
    </div>
  );
}
