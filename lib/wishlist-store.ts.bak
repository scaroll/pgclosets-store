import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string;
  url: string;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const exists = state.items.find(i => i.id === item.id);
          if (exists) return state;

          return {
            items: [...state.items, { ...item, addedAt: new Date() }]
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      }
    }),
    {
      name: 'pg-closets-wishlist',
      skipHydration: true,
    }
  )
);