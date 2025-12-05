import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecentlyViewedProduct {
  id: string
  slug: string
  name: string
  price: number
  salePrice?: number
  image: string
  category?: string
  viewedAt: number
}

interface RecentlyViewedStore {
  products: RecentlyViewedProduct[]
  addProduct: (product: Omit<RecentlyViewedProduct, "viewedAt">) => void
  removeProduct: (productId: string) => void
  clearAll: () => void
  getProducts: () => RecentlyViewedProduct[]
}

const MAX_RECENTLY_VIEWED = 10

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => set((state) => {
        // Check if product already exists
        const existingIndex = state.products.findIndex(
          (p) => p.id === product.id
        )

        let updatedProducts: RecentlyViewedProduct[]

        if (existingIndex !== -1) {
          // If product exists, remove it from its current position
          updatedProducts = state.products.filter((p) => p.id !== product.id)
        } else {
          updatedProducts = [...state.products]
        }

        // Add product to the beginning with current timestamp
        updatedProducts.unshift({
          ...product,
          viewedAt: Date.now(),
        })

        // Keep only the last MAX_RECENTLY_VIEWED products
        if (updatedProducts.length > MAX_RECENTLY_VIEWED) {
          updatedProducts = updatedProducts.slice(0, MAX_RECENTLY_VIEWED)
        }

        return { products: updatedProducts }
      }),

      removeProduct: (productId) => set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      })),

      clearAll: () => set({ products: [] }),

      getProducts: () => {
        return get().products
      },
    }),
    {
      name: "recently-viewed-storage",
    }
  )
)

export type { RecentlyViewedProduct, RecentlyViewedStore }
