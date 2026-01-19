import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image?: string
  quantity: number
  variantId?: string
  variantName?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
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
            items: [...currentItems, { ...item, id: Math.random().toString(36).substring(7) }],
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

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'pg-closets-cart',
      storage: createJSONStorage(() => localStorage),
      // Don't persist isOpen state or computed values
      partialize: state => ({ items: state.items }),
    }
  )
)
