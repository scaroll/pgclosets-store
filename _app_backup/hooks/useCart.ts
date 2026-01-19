import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = { id: string; title: string; price: number; image: string; slug?: string; qty: number }
type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  addItem: (product: any, qty?: number) => void
  remove: (id: string) => void
  clear: () => void
  setQty: (id: string, qty: number) => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) return { items: state.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) }
          return { items: [...state.items, { ...item, qty }] }
        }),
      addItem: (product, qty = 1) =>
        set((state) => {
          const item = {
            id: product.id,
            title: product.title || product.name,
            price: product.price,
            image: product.image,
            slug: product.slug,
          }
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) return { items: state.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) }
          return { items: [...state.items, { ...item, qty }] }
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      setQty: (id, qty) => set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)) })),
    }),
    { name: "store-cart-v1" },
  ),
)
