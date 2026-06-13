import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import ProductGrid from '@/components/products/ProductGrid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import useProducts from '@/hooks/useProducts';

const searchSchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
});

export const Route = createFileRoute('/_public/')({
  validateSearch: searchSchema,
  component: HomePage,
});

function HomePage() {
  const { search, categoryId, sortBy } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { useGetProducts } = useProducts();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetProducts({
    search,
    categoryId,
    sortBy,
    limit: 20,
  });

  const totalItems = data?.pages.reduce((sum, p) => sum + p.items.length, 0) ?? 0;

  const handleSortChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, sortBy: value as typeof sortBy }),
    });
  };

  const clearSearch = () => {
    navigate({ search: (prev) => ({ ...prev, search: undefined }) });
  };

  return (
    <div className="page-container">
      {/* Hero banner (simple Amazon-style) */}
      {!search && !categoryId && (
        <div className="mb-6 rounded overflow-hidden bg-gradient-to-r from-amazon-navy to-amazon-navy-light h-48 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome to Amazon Clone</h1>
            <p className="text-gray-300">Discover great deals across all categories</p>
          </div>
        </div>
      )}

      {/* Active search indicator */}
      {search && (
        <div className="flex items-center gap-2 mb-4 bg-white rounded p-3 border border-gray-200">
          <Search className="h-4 w-4 text-gray-500" />
          <p className="text-sm">
            Results for: <span className="font-bold text-gray-900">"{search}"</span>
          </p>
          <button
            onClick={clearSearch}
            className="ml-auto text-amazon-link-blue hover:text-amazon-orange"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Results count + sort */}
      <div className="flex items-center justify-between gap-4 mb-4 bg-white rounded p-3 border border-gray-200">
        <p className="text-sm text-gray-600 min-w-0">
          {isLoading ? (
            'Loading results…'
          ) : totalItems > 0 ? (
            <>
              <span className="font-medium text-gray-900">{totalItems}+ results</span>
              {search && <> for &ldquo;{search}&rdquo;</>}
            </>
          ) : (
            'No results found'
          )}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-600 hidden sm:inline whitespace-nowrap">Sort by:</span>
          <Select value={sortBy ?? 'newest'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">New Arrivals</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Best Sellers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product grid */}
      <ProductGrid
        data={data}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
