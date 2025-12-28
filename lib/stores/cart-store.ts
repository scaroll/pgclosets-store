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

      addItem: item => {
        const currentItems = get().items
        // Check if item already exists (matching productId and variantId)
        const existingItemIndex = currentItems.findIndex(
          i => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingItemIndex > -1) {
          // Update quantity
          const newItems = [...currentItems]
          newItems[existingItemIndex]!.quantity += item.quantity
          set({ items: newItems, isOpen: true })
        } else {
          // Add new item
          set({
            items: [...currentItems, { ...item, id: Math.random().toString(36).substring(7) }],
            isOpen: true,
          })
        }
      },

      removeItem: itemId => {
        set({ items: get().items.filter(i => i.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map(i => (i.id === itemId ? { ...i, quantity } : i)),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'pg-closets-cart',
      storage: createJSONStorage(() => localStorage),
      // Don't persist isOpen state
      partialize: state => ({ items: state.items }),
    }
  )
)
