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
      className="block no-underline"
    >
      <div className="product-card group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded bg-gray-50">
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
        <div className="flex flex-col flex-1">
          {/* Name */}
          <h3 className="text-sm text-gray-900 hover:text-amazon-orange line-clamp-2 mb-1 leading-snug">
            {truncate(product.name, 80)}
          </h3>

          {/* Rating */}
          {Number(product.ratingAvg) > 0 && (
            <div className="flex items-center gap-1 mb-1">
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
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="price-display">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {discount > 0 && <p className="discount-badge text-xs">Save {discount}%</p>}

            {/* Stock */}
            {product.stock === 0 ? (
              <p className="stock-out text-xs mt-1">Out of Stock</p>
            ) : product.stock <= 5 ? (
              <p className="text-[#CC0C39] text-xs mt-1">Only {product.stock} left in stock</p>
            ) : (
              <p className="stock-in text-xs mt-1">In Stock</p>
            )}
          </div>

          {/* Add to cart */}
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
    </Link>
  );
}
