import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/types';

interface CartStore {
  cart: Cart | null;
  isCartOpen: boolean;
  itemCount: number;
  subtotal: number;

  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: null,
      isCartOpen: false,
      itemCount: 0,
      subtotal: 0,

      setCart: (cart) =>
        set({
          cart,
          itemCount: cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
          subtotal:
            cart?.items.reduce(
              (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
              0
            ) ?? 0,
        }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
    }),
    {
      name: 'amazon-cart-store',
      partialize: (state) => ({ isCartOpen: state.isCartOpen }),
    }
  )
);
