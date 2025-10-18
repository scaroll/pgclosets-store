import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// Enhanced product interface for commerce
export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  sku: string
  specifications?: Record<string, string>
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceModifier?: number
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedVariants?: Record<string, string>
  addedAt: Date
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed values
  totalItems: () => number
  totalPrice: () => number
  getItemCount: (productId: string) => number
  isInCart: (productId: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, selectedVariants = {}) => {
        set((state) => {
          // Check if item with same product and variants already exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
          )

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += quantity
            return { items: updatedItems }
          } else {
            // Add new item
            const newItem: CartItem = {
              id: uuidv4(),
              product,
              quantity,
              selectedVariants,
              addedAt: new Date()
            }
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => {
          const basePrice = item.product.price
          const variantPrice = item.selectedVariants ?
            Object.values(item.product.variants || [])
              .filter(variant => Object.values(item.selectedVariants!).includes(variant.value))
              .reduce((sum, variant) => sum + (variant.priceModifier || 0), 0) : 0

          return total + ((basePrice + variantPrice) * item.quantity)
        }, 0)
      },

      getItemCount: (productId) => {
        return get().items
          .filter(item => item.product.id === productId)
          .reduce((total, item) => total + item.quantity, 0)
      },

      isInCart: (productId) => {
        return get().items.some(item => item.product.id === productId)
      }
    }),
    {
      name: 'pg-closets-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not UI state like isOpen
      partialize: (state) => ({ items: state.items })
    }
  )
)

// Export utility functions for cart operations
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)} CAD`
}

export const calculateItemTotal = (item: CartItem): number => {
  const basePrice = item.product.price
  const variantPrice = item.selectedVariants ?
    Object.values(item.product.variants || [])
      .filter(variant => Object.values(item.selectedVariants!).includes(variant.value))
      .reduce((sum, variant) => sum + (variant.priceModifier || 0), 0) : 0

  return (basePrice + variantPrice) * item.quantity
}