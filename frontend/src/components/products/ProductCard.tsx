import { Link } from '@tanstack/react-router';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/components/ui/product-image';
import { formatPrice, formatDiscount, truncate } from '@/lib/utils';
import type { ProductSummary } from '@/types';
import useCart from '@/hooks/useCart';
import WishlistButton from '@/components/wishlist/WishlistButton';

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { useAddToCart } = useCart();
  const addToCart = useAddToCart();
  const discount = product.originalPrice ? formatDiscount(product.price, product.originalPrice) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="block h-full no-underline"
    >
      <div className="product-card group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded bg-gray-50 flex-shrink-0">
          {discount > 0 && (
            <Badge variant="discount" className="absolute top-2 left-2 z-10">
              -{discount}%
            </Badge>
          )}
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton productId={product.id} size="sm" />
          </div>
          <ProductImage
            images={product.images}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Name — fixed 2-line slot so titles align across the row */}
          <h3 className="text-sm text-gray-900 hover:text-amazon-orange line-clamp-2 min-h-[2.5rem] mb-1 leading-snug">
            {truncate(product.name, 80)}
          </h3>

          {/* Rating — fixed height slot (empty when no ratings) */}
          <div className="flex items-center gap-1 mb-2 min-h-[1.125rem]">
            {Number(product.ratingAvg) > 0 ? (
              <>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(Number(product.ratingAvg))
                          ? 'fill-amazon-orange text-amazon-orange'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-amazon-link-blue">
                  ({product.ratingCount.toLocaleString()})
                </span>
              </>
            ) : null}
          </div>

          {/* Price + CTA pinned to bottom */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="price-display text-lg sm:text-xl">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {discount > 0 ? (
              <p className="discount-badge text-xs">Save {discount}%</p>
            ) : (
              <p className="text-xs min-h-[1rem]" aria-hidden="true" />
            )}

            <p className="text-xs mt-1 min-h-[1rem]">
              {product.stock === 0 ? (
                <span className="stock-out">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="text-[#CC0C39]">Only {product.stock} left in stock</span>
              ) : (
                <span className="stock-in">In Stock</span>
              )}
            </p>

            <Button
              variant="amazon"
              size="sm"
              className="mt-3 w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
