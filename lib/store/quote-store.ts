import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuoteItem } from '@/actions/quotes'

interface QuoteStore {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearItems: () => void
  itemCount: number
  totalItems: number
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex((i) => i.productId === item.productId)

        if (existingIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...items]
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + item.quantity,
          }
          set({ items: updatedItems })
        } else {
          // Add new item
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const items = get().items
        const updatedItems = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
        set({ items: updatedItems })
      },

      clearItems: () => {
        set({ items: [] })
      },

      get itemCount() {
        return get().items.length
      },

      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'pgclosets-quote-storage',
    }
  )
)
