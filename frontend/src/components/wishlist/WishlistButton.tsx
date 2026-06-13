import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import useWishlist from '@/hooks/useWishlist';
import { useWishlistStore } from '@/store/wishlistStore';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function WishlistButton({ productId, className, size = 'md' }: WishlistButtonProps) {
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(productId));
  const { useToggleWishlist } = useWishlist();
  const { toggle, isPending } = useToggleWishlist();

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'rounded-full border transition-colors disabled:opacity-50',
        buttonSize,
        isInWishlist
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
          : 'bg-white/90 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500',
        className
      )}
    >
      <Heart className={cn(iconSize, isInWishlist && 'fill-current')} />
    </button>
  );
}
