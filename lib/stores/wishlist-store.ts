import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  itemCount: number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.productId === item.productId)
        if (existing) {
          return state
        }
        return { items: [...state.items, item] }
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId),
      })),
      isInWishlist: (productId) => {
        return get().items.some(i => i.productId === productId)
      },
      clearWishlist: () => set({ items: [] }),
      get itemCount() {
        return get().items.length
      },
    }),
    { name: "wishlist-storage" }
  )
)

export type { WishlistItem, WishlistStore }
