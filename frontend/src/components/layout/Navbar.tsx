import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { ShoppingCart, MapPin, ChevronDown, Menu } from 'lucide-react';
import CategoryNavDropdowns from './CategoryNavDropdowns';
import { useCartStore } from '@/store/cartStore';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { itemCount, openCart } = useCartStore();
  const navigate = useNavigate();

  const categoryId = useRouterState({
    select: (state) => {
      const home = state.matches.find((m) => m.pathname === '/');
      const search = home?.search as { categoryId?: number } | undefined;
      return search?.categoryId;
    },
  });

  const handleCategoryChange = (id?: number) => {
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, categoryId: id, search: undefined }),
    });
  };

  return (
    <header className="sticky top-0 z-40">
      {/* ── Main navbar ─────────────────────────────────── */}
      <div className="bg-amazon-navy flex items-center gap-2 px-4 py-2 min-h-[60px]">
        {/* Logo */}
        <Link
          to="/"
          search={(prev) => ({ ...prev, search: undefined, categoryId: undefined })}
          className="flex-shrink-0 mr-2"
        >
          <div className="text-white font-bold text-2xl leading-none border border-transparent hover:border-white rounded px-1 py-0.5">
            amazon
          </div>
        </Link>

        {/* Deliver to */}
        <div className="hidden md:flex flex-col text-white cursor-pointer border border-transparent hover:border-white rounded px-1 py-0.5">
          <span className="text-[11px] text-gray-300 flex items-center gap-0.5">
            <MapPin className="h-3 w-3" /> Deliver to
          </span>
          <span className="text-xs font-bold">India</span>
        </div>

        {/* Search bar with live suggestions */}
        <SearchBar />

        {/* Right nav items */}
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {/* Language */}
          <div className="navbar-link hidden lg:flex items-center gap-0.5">
            <span className="text-sm font-bold">EN</span>
            <ChevronDown className="h-3 w-3" />
          </div>

          {/* Account */}
          <Link to="/" className="navbar-link hidden md:block">
            <div className="text-[11px] text-gray-300">Hello, Guest</div>
            <div className="text-sm font-bold flex items-center gap-0.5">
              Account & Lists
              <ChevronDown className="h-3 w-3" />
            </div>
          </Link>

          {/* Returns & Orders */}
          <Link to="/orders" className="navbar-link hidden md:block">
            <div className="text-[11px] text-gray-300">Returns</div>
            <div className="text-sm font-bold">& Orders</div>
          </Link>

          {/* Cart */}
          <button onClick={openCart} className="navbar-link flex items-end gap-1 relative">
            <div className="relative">
              <ShoppingCart className="h-8 w-8 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amazon-orange text-black text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* ── Sub-navbar — category filter ────────────────── */}
      <div className="bg-amazon-navy-light flex items-center gap-3 px-4 py-1.5 min-h-[40px]">
        <button
          type="button"
          onClick={() => handleCategoryChange(undefined)}
          className="flex items-center gap-1 navbar-link whitespace-nowrap flex-shrink-0"
        >
          <Menu className="h-4 w-4" />
          <span className="text-sm font-bold">All</span>
        </button>
        <div className="flex-1 min-w-0">
          <CategoryNavDropdowns selectedId={categoryId} onSelect={handleCategoryChange} />
        </div>
      </div>
    </header>
  );
}
