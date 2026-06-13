import { Link } from '@tanstack/react-router';
import { MapPin, Package, User, Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useProducts from '@/hooks/useProducts';
import { CATEGORY_GROUPS } from '@/lib/categoryGroups';
import type { Category } from '@/types';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategoryId?: number;
  onCategorySelect: (categoryId?: number) => void;
}

export default function MobileMenu({
  open,
  onOpenChange,
  selectedCategoryId,
  onCategorySelect,
}: MobileMenuProps) {
  const { useGetCategories } = useProducts();
  const { data: categories } = useGetCategories();

  const bySlug = new Map(categories?.map((c: Category) => [c.slug, c]) ?? []);

  const handleCategory = (id: number) => {
    onCategorySelect(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 bg-amazon-navy text-white border-none [&>button]:text-white [&>button]:hover:bg-white/10">
        <SheetHeader className="px-4 py-3 border-b border-white/20 text-left">
          <SheetTitle className="text-white">Hello, Guest</SheetTitle>
        </SheetHeader>

        <nav className="overflow-y-auto flex-1">
          <div className="px-4 py-3 border-b border-white/20 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>
              Deliver to <span className="font-bold">India</span>
            </span>
          </div>

          <Link
            to="/"
            search={(prev) => ({ ...prev, search: undefined, categoryId: undefined })}
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white no-underline border-b border-white/10"
          >
            <User className="h-5 w-5" />
            <span>Account & Lists</span>
          </Link>

          <Link
            to="/orders"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white no-underline border-b border-white/10"
          >
            <Package className="h-5 w-5" />
            <span>Returns & Orders</span>
          </Link>

          <Link
            to="/wishlist"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white no-underline border-b border-white/10"
          >
            <Heart className="h-5 w-5" />
            <span>Your Wish List</span>
          </Link>

          <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-300">
            Shop by Category
          </div>

          <button
            type="button"
            onClick={() => {
              onCategorySelect(undefined);
              onOpenChange(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 ${
              !selectedCategoryId ? 'bg-white/10 font-medium' : ''
            }`}
          >
            All Categories
          </button>

          {CATEGORY_GROUPS.map((group) => {
            const items = group.slugs
              .map((slug) => bySlug.get(slug))
              .filter((c): c is Category => Boolean(c));

            if (items.length === 0) return null;

            return (
              <div key={group.label}>
                <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-300">{group.label}</p>
                {items.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${
                      selectedCategoryId === cat.id ? 'bg-white/10 font-medium' : ''
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
