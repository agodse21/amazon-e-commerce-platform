import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Search, Loader2 } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import type { ProductSummary } from '@/types';

const formatPrice = (price: string) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(parseFloat(price));

const ProductSuggestionItem = ({
  product,
  isHighlighted,
  onMouseEnter,
  onClick,
}: {
  product: ProductSummary;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) => {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

  return (
    <li
      role="option"
      aria-selected={isHighlighted}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
        isHighlighted ? 'bg-amazon-orange/10' : 'hover:bg-gray-50'
      }`}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
        {primaryImage ? (
          <ProductImage
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            ?
          </div>
        )}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-gray-500">{product.category.name}</p>
      </div>

      {/* Price */}
      <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
        {formatPrice(product.price)}
      </span>
    </li>
  );
};

export default function SearchBar() {
  const urlSearch = useRouterState({
    select: (state) => {
      const home = state.matches.find((m) => m.pathname === '/');
      const params = home?.search as { search?: string } | undefined;
      return params?.search ?? '';
    },
  });

  const [query, setQuery] = useState(urlSearch);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Keep input in sync when URL search changes (e.g. clear on home page)
  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  const { suggestions, isLoading } = useSearchSuggestions(query);

  // Open/close dropdown based on query + suggestions
  useEffect(() => {
    setIsOpen(query.trim().length >= 2 && (isLoading || suggestions.length > 0));
    setHighlightedIndex(-1);
  }, [query, suggestions, isLoading]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigateToProduct = useCallback(
    (product: ProductSummary) => {
      setIsOpen(false);
      setQuery('');
      navigate({ to: '/products/$productId', params: { productId: product.id } });
    },
    [navigate]
  );

  const navigateToSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      setIsOpen(false);
      navigate({ to: '/', search: (prev) => ({ ...prev, search: q.trim() }) });
    },
    [navigate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
      navigateToProduct(suggestions[highlightedIndex]);
    } else {
      navigateToSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + 1; // +1 for "See all results" row

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0 max-w-6xl">
      <form onSubmit={handleSubmit} className="flex rounded overflow-hidden">
        {/* Category selector */}
        <select className="bg-[#f3f3f3] border-none text-xs text-gray-700 px-2 rounded-l hidden sm:block cursor-pointer focus:outline-none max-w-[5rem]">
          <option>All</option>
        </select>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length >= 2 && suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search Amazon.in"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="flex-1 min-w-0 px-2 sm:px-3 py-2 text-sm text-black focus:outline-none border-none"
        />

        {/* Search button */}
        <button
          type="submit"
          aria-label="Search"
          className="bg-amazon-orange hover:bg-amazon-orange-dark px-3 sm:px-4 flex items-center justify-center transition-colors flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-black animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-black" />
          )}
        </button>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-0.5 bg-white border border-gray-200 rounded shadow-xl overflow-hidden">
          {isLoading && suggestions.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500 text-center">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul role="listbox" aria-label="Search suggestions">
              {suggestions.map((product, idx) => (
                <ProductSuggestionItem
                  key={product.id}
                  product={product}
                  isHighlighted={highlightedIndex === idx}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => navigateToProduct(product)}
                />
              ))}

              {/* "See all results" footer row */}
              <li
                role="option"
                aria-selected={highlightedIndex === suggestions.length}
                onMouseEnter={() => setHighlightedIndex(suggestions.length)}
                onClick={() => navigateToSearch(query)}
                className={`px-4 py-2.5 cursor-pointer text-sm font-medium text-amazon-navy border-t border-gray-100 flex items-center gap-2 transition-colors ${
                  highlightedIndex === suggestions.length
                    ? 'bg-amazon-orange/10'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                See all results for &ldquo;{query}&rdquo;
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
