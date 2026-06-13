import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import WishlistItem from '@/components/wishlist/WishlistItem';
import useWishlist from '@/hooks/useWishlist';
import type { WishlistItem as WishlistItemType } from '@/types';

export const Route = createFileRoute('/_authenticated/wishlist')({
  component: WishlistPage,
});

function WishlistPage() {
  const { useGetWishlist } = useWishlist();
  const { data, isLoading } = useGetWishlist();

  const items = data?.items ?? [];

  return (
    <div className="page-container max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Wish List</h1>

      {isLoading ? (
        <div className="amazon-panel space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-24 h-24 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="amazon-panel text-center py-12 sm:py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Your Wish List is empty</h2>
          <p className="text-gray-500 text-sm mb-6">
            Save items you like by tapping the heart on any product.
          </p>
          <Link to="/">
            <Button variant="amazon">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="amazon-panel">
          <p className="text-sm text-gray-600 mb-4">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
          {items.map((item: WishlistItemType) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
