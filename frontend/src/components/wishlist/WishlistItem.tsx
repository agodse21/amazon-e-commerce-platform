import { Link } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { WishlistItem as WishlistItemType } from '@/types';
import useWishlist from '@/hooks/useWishlist';
import useCart from '@/hooks/useCart';

interface WishlistItemProps {
  item: WishlistItemType;
}

export default function WishlistItem({ item }: WishlistItemProps) {
  const { useRemoveFromWishlist } = useWishlist();
  const { useAddToCart } = useCart();
  const removeItem = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const isUpdating = removeItem.isPending || addToCart.isPending;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 py-4 border-b border-gray-200 last:border-0 ${isUpdating ? 'opacity-60' : ''}`}
    >
      <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
        <Link
          to="/products/$productId"
          params={{ productId: item.productId }}
          className="flex-shrink-0"
        >
          <ProductImage
            images={item.product.images}
            alt={item.product.name}
            className="w-16 h-16 sm:w-24 sm:h-24 object-contain border border-gray-100 rounded"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to="/products/$productId"
            params={{ productId: item.productId }}
            className="text-sm font-medium text-gray-900 hover:text-amazon-orange line-clamp-2"
          >
            {item.product.name}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{item.product.category.name}</p>
          <p className="price-display text-base mt-1">{formatPrice(item.product.price)}</p>
          {item.product.stock === 0 ? (
            <p className="stock-out text-xs mt-1">Out of Stock</p>
          ) : (
            <p className="stock-in text-xs mt-1">In Stock</p>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col gap-2 sm:items-end sm:justify-center flex-shrink-0">
        <Button
          variant="amazon"
          size="sm"
          className="flex-1 sm:flex-none sm:min-w-[8rem]"
          disabled={item.product.stock === 0 || addToCart.isPending}
          onClick={() => addToCart.mutate({ productId: item.productId, quantity: 1 })}
        >
          Add to Cart
        </Button>
        <Button
          variant="amazon-outline"
          size="sm"
          className="flex-1 sm:flex-none sm:min-w-[8rem]"
          disabled={removeItem.isPending}
          onClick={() => removeItem.mutate(item.id)}
        >
          <Trash2 className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      </div>
    </div>
  );
}
