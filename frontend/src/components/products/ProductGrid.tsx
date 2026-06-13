import { useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductSummary } from '@/types';
import type { InfiniteData } from '@tanstack/react-query';
import type { PaginatedProducts } from '@/types';

interface ProductGridProps {
  data: InfiniteData<PaginatedProducts> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export default function ProductGrid({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: ProductGridProps) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const allProducts: ProductSummary[] = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && allProducts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-xl font-medium mb-2">No results found</p>
        <p className="text-sm">Try adjusting your search or category filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {allProducts.map((product, index) => {
          const isLast = index === allProducts.length - 1;
          return (
            <div key={product.id} ref={isLast ? lastItemRef : undefined}>
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded p-4 space-y-3">
      <Skeleton className="aspect-square w-full rounded" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  );
}
