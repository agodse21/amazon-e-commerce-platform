import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import ImageCarousel from '@/components/products/ImageCarousel';
import useProducts from '@/hooks/useProducts';
import useCart from '@/hooks/useCart';
import { formatPrice, formatDiscount } from '@/lib/utils';
import { ProductSpecification } from '@/types';

export const Route = createFileRoute('/_public/products/$productId')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { useGetProductById } = useProducts();
  const { data: product, isLoading, isError } = useGetProductById(productId ?? '');
  const { useAddToCart } = useCart();
  const addToCart = useAddToCart();

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    return (
      <div className="page-container text-center py-16">
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <p className="text-gray-500 mb-4">This product may be unavailable or removed.</p>
        <Link to="/">
          <Button variant="amazon">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice ? formatDiscount(product.price, product.originalPrice) : 0;

  const inStock = product.stock > 0;

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="text-xs text-amazon-link-blue mb-4 flex gap-1 flex-wrap">
        <Link to="/">Home</Link>
        <span className="text-gray-400">›</span>
        <Link to="/" search={{ categoryId: product.category.id }}>
          {product.category.name}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_300px] gap-4 md:gap-6">
        {/* Image carousel */}
        <div className="w-full max-w-full md:max-w-lg lg:max-w-none mx-auto">
          <ImageCarousel images={product.images} productName={product.name} productId={product.id} />
        </div>

        {/* Product info — middle column */}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 leading-snug">
            {product.name}
          </h1>

          {/* Brand / category */}
          <p className="text-sm text-amazon-link-blue mb-2">
            Visit the{' '}
            <Link to="/" search={{ categoryId: product.category.id }}>
              {product.category.name}
            </Link>{' '}
            Store
          </p>

          {/* Rating */}
          {Number(product.ratingAvg) > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(Number(product.ratingAvg))
                        ? 'fill-amazon-orange text-amazon-orange'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-amazon-link-blue hover:text-amazon-orange cursor-pointer">
                {product.ratingCount.toLocaleString()} ratings
              </span>
            </div>
          )}

          <Separator className="mb-3 bg-slate-300" />

          {/* Price */}
          <div className="mb-4">
            {discount > 0 && (
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="discount-badge font-bold">-{discount}%</span>
                <span className="original-price">M.R.P: {formatPrice(product.originalPrice!)}</span>
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-700">₹</span>
              <span className="text-2xl sm:text-3xl font-medium text-[#B12704]">
                {parseFloat(product.price).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-1">About this item</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Technical Details</h3>
              <table className="text-sm w-full block sm:table">
                <tbody className="block sm:table-row-group">
                  {product.specifications.map((spec: ProductSpecification) => (
                    <tr
                      key={spec.id}
                      className="block sm:table-row border-b border-gray-100 sm:border-0"
                    >
                      <td className="block sm:table-cell py-1.5 pr-4 text-gray-600 sm:w-2/5 font-medium">
                        {spec.key}
                      </td>
                      <td className="block sm:table-cell py-1.5 pb-3 sm:pb-1.5 text-gray-900">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Buy box — right column (also shown on mobile/tablet as sticky panel) */}
        <div className="amazon-panel h-fit lg:sticky lg:top-24">
          <div className="text-2xl font-medium text-[#B12704] mb-1">
            {formatPrice(product.price)}
          </div>

          <p className="text-xs text-gray-500 mb-3">Inclusive of all taxes</p>

          {/* Free delivery */}
          <div className="flex items-start gap-2 text-sm mb-3">
            <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">FREE Delivery</span> on orders over ₹499
            </div>
          </div>

          {/* Stock */}
          <div className="mb-4">
            {inStock ? (
              <p className="stock-in text-base font-medium">In Stock</p>
            ) : (
              <p className="stock-out text-base font-medium">Currently Unavailable</p>
            )}
            {inStock && product.stock <= 5 && (
              <p className="text-xs text-[#CC0C39] mt-0.5">
                Only {product.stock} left in stock — order soon
              </p>
            )}
          </div>

          {/* Quantity selector not needed — add to cart handles it */}

          <div className="space-y-2">
            <Button
              variant="amazon"
              size="full"
              disabled={!inStock || addToCart.isPending}
              onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
            >
              Add to Cart
            </Button>
            <Button
              className="btn-amazon-buy w-full rounded-full"
              disabled={!inStock}
              onClick={() =>
                navigate({
                  to: '/checkout',
                  search: { productId: product.id, quantity: 1 },
                })
              }
            >
              Buy Now
            </Button>
          </div>

          <Separator className="my-3" />

          {/* Trust signals */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gray-500" />
              Secure transaction
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-500" />
              Easy 30-day returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="page-container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="aspect-square rounded" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 rounded" />
      </div>
    </div>
  );
}
