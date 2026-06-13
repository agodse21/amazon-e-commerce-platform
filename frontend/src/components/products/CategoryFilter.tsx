import { Skeleton } from '@/components/ui/skeleton';
import useProducts from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface CategoryFilterProps {
  selectedId?: number;
  onChange: (id?: number) => void;
  /** `navbar` — sub-nav on dark background; `default` — chip pills on white */
  variant?: 'default' | 'navbar';
  /** Hide the "All" chip (e.g. when a separate All menu button exists) */
  showAll?: boolean;
}

const chipClass = (active: boolean) => (active ? 'category-chip-active' : 'category-chip');

const navbarClass = (active: boolean) =>
  cn(
    'navbar-link whitespace-nowrap flex-shrink-0 text-sm',
    active && 'ring-1 ring-white font-bold'
  );

export default function CategoryFilter({
  selectedId,
  onChange,
  variant = 'default',
  showAll = true,
}: CategoryFilterProps) {
  const { useGetCategories } = useProducts();
  const { data: categories, isLoading } = useGetCategories();
  const isNavbar = variant === 'navbar';
  const itemClass = (active: boolean) => (isNavbar ? navbarClass(active) : chipClass(active));

  if (isLoading) {
    return (
      <div className={cn('flex gap-2 overflow-x-auto scrollbar-hide', !isNavbar && 'pb-2')}>
        {Array.from({ length: isNavbar ? 10 : 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-7 flex-shrink-0 rounded',
              isNavbar ? 'w-20 bg-white/10' : 'h-8 w-24 rounded-full'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-1 overflow-x-auto scrollbar-hide', !isNavbar && 'gap-2 pb-2')}>
      {showAll && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={itemClass(selectedId === undefined)}
        >
          All
        </button>
      )}
      {categories?.map((cat: Category) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={itemClass(selectedId === cat.id)}
        >
          {cat.name}
          {!isNavbar && cat._count && (
            <span className="ml-1 text-xs opacity-70">({cat._count.products})</span>
          )}
        </button>
      ))}
    </div>
  );
}
