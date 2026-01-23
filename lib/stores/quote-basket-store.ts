import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface QuoteBasketItem {
  id: string
  productId: string
  slug: string
  name: string
  category: string
  price: number
  image?: string
  quantity: number
  variantId?: string
  variantName?: string
  notes?: string
}

interface QuoteBasketState {
  items: QuoteBasketItem[]
  isOpen: boolean
  total: number
  itemCount: number
  addItem: (item: Omit<QuoteBasketItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateNotes: (itemId: string, notes: string) => void
  clearBasket: () => void
  openBasket: () => void
  closeBasket: () => void
  toggleBasket: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useQuoteBasketStore = create<QuoteBasketState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      addItem: item => {
        const currentItems = get().items
        // Check if item already exists (matching productId and variantId)
        const existingItemIndex = currentItems.findIndex(
          i => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingItemIndex > -1) {
          // Update quantity
          const newItems = [...currentItems]
          const existingItem = newItems[existingItemIndex]
          if (existingItem) {
            existingItem.quantity += item.quantity
          }
          set({ items: newItems, isOpen: true })
        } else {
          // Add new item
          set({
            items: [...currentItems, {
              ...item,
              id: typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(7)
            }],
            isOpen: true,
          })
        }
        // Update computed values
        set({ total: get().totalPrice(), itemCount: get().totalItems() })
      },

      removeItem: itemId => {
        set({ items: get().items.filter(i => i.id !== itemId) })
        set({ total: get().totalPrice(), itemCount: get().totalItems() })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map(i => (i.id === itemId ? { ...i, quantity } : i)),
        })
        set({ total: get().totalPrice(), itemCount: get().totalItems() })
      },

      updateNotes: (itemId, notes) => {
        set({
          items: get().items.map(i => (i.id === itemId ? { ...i, notes } : i)),
        })
      },

      clearBasket: () => set({ items: [], total: 0, itemCount: 0 }),

      openBasket: () => set({ isOpen: true }),
      closeBasket: () => set({ isOpen: false }),
      toggleBasket: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'pg-closets-quote-basket',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ items: state.items }),
    }
  )
)
