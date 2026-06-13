import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useProducts from '@/hooks/useProducts';
import { CATEGORY_GROUPS } from '@/lib/categoryGroups';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const HOVER_CLOSE_DELAY_MS = 150;

interface CategoryNavDropdownsProps {
  selectedId?: number;
  onSelect: (categoryId: number) => void;
}

interface GroupDropdownProps {
  groupLabel: string;
  items: Category[];
  selectedId?: number;
  isOpen: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onClose: () => void;
  onSelect: (categoryId: number) => void;
}

function GroupDropdown({
  groupLabel,
  items,
  selectedId,
  isOpen,
  onOpen,
  onScheduleClose,
  onClose,
  onSelect,
}: GroupDropdownProps) {
  const selectedInGroup = items.find((c) => c.id === selectedId);

  return (
    <DropdownMenu
      open={isOpen}
      modal={false}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-0.5 text-sm whitespace-nowrap flex-shrink-0 cursor-pointer text-white transition-colors',
            'rounded-sm border border-transparent px-2 py-1',
            'hover:border-white hover:bg-white/10',
            isOpen && 'border-white bg-white/10 rounded-b-none border-b-transparent'
          )}
          onMouseEnter={onOpen}
          onMouseLeave={onScheduleClose}
        >
          {selectedInGroup ? selectedInGroup.name : groupLabel}
          <ChevronDown
            className={cn('h-3 w-3 opacity-80 transition-transform', isOpen && 'rotate-180')}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={0}
        className="min-w-[12rem] rounded-sm rounded-t-none border-t-0 shadow-lg"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        <DropdownMenuLabel className="text-xs text-gray-500 font-normal uppercase tracking-wide">
          {groupLabel}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((cat) => (
          <DropdownMenuItem
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              selectedId === cat.id && 'bg-amazon-orange/15 text-amazon-navy font-medium'
            )}
          >
            {cat.name}
            {cat._count && (
              <span className="ml-auto text-xs text-gray-400 pl-2">{cat._count.products}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function CategoryNavDropdowns({ selectedId, onSelect }: CategoryNavDropdownsProps) {
  const { useGetCategories } = useProducts();
  const { data: categories, isLoading } = useGetCategories();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openGroupMenu = useCallback(
    (label: string) => {
      clearCloseTimer();
      setOpenGroup(label);
    },
    [clearCloseTimer]
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenGroup(null), HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const closeNow = useCallback(() => {
    clearCloseTimer();
    setOpenGroup(null);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 flex-shrink-0 rounded bg-white/10" />
        ))}
      </div>
    );
  }

  const bySlug = new Map(categories?.map((c: Category) => [c.slug, c]) ?? []);

  const resolveGroupCategories = (slugs: readonly string[]): Category[] =>
    slugs.map((slug) => bySlug.get(slug)).filter((c): c is Category => Boolean(c));

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {CATEGORY_GROUPS.map((group) => {
        const items = resolveGroupCategories(group.slugs);
        if (items.length === 0) return null;

        return (
          <GroupDropdown
            key={group.label}
            groupLabel={group.label}
            items={items}
            selectedId={selectedId}
            isOpen={openGroup === group.label}
            onOpen={() => openGroupMenu(group.label)}
            onScheduleClose={scheduleClose}
            onClose={closeNow}
            onSelect={(id) => {
              onSelect(id);
              closeNow();
            }}
          />
        );
      })}
    </div>
  );
}
