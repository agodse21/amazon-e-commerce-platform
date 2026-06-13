import { create } from 'zustand';
import type { WishlistItem } from '@/types';

interface WishlistStore {
  items: WishlistItem[];
  itemCount: number;
  setItems: (items: WishlistItem[]) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  itemCount: 0,

  setItems: (items) => set({ items, itemCount: items.length }),

  isInWishlist: (productId) => get().items.some((item) => item.productId === productId),
}));
