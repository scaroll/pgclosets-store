// Enhanced cart with optional product fields
'use client'

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Product recommendation types
interface RecommendedProduct {
  id: string
  name: string
  price: number
  image: string
  description?: string
}

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  selectedOptions: Record<string, string>
  installationIncluded: boolean
  sku?: string
  category?: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
}

export interface Address {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumPurchase?: number
  expiresAt?: string
  appliedAt?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  promoCode: PromoCode | null
  shippingAddress: Address | null
  billingAddress: Address | null
  sameAsShipping: boolean
  installationDate?: string
  specialInstructions?: string

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, options?: Record<string, string>) => void
  updateQuantity: (productId: string, quantity: number, options?: Record<string, string>) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Promo codes
  applyPromoCode: (code: string) => Promise<boolean>
  removePromoCode: () => void

  // Addresses
  setShippingAddress: (address: Address) => void
  setBillingAddress: (address: Address | null) => void
  setSameAsShipping: (same: boolean) => void

  // Installation
  setInstallationDate: (date: string) => void
  setSpecialInstructions: (instructions: string) => void
  toggleInstallation: (
    productId: string,
    include: boolean,
    options?: Record<string, string>
  ) => void

  // Calculations
  getSubtotal: () => number
  getInstallationTotal: () => number
  getDiscountAmount: () => number
  getShippingCost: () => number
  getTax: () => number
  getTotal: () => number
  getTotalItems: () => number

  // Utilities
  findItem: (productId: string, options?: Record<string, string>) => CartItem | undefined
  canApplyPromoCode: (code: PromoCode) => boolean
  estimateDelivery: () => { min: Date; max: Date }

  // AI Recommendations
  getUpsellProducts: () => Promise<RecommendedProduct[]>
  getSimilarProducts: (productId: string) => Promise<RecommendedProduct[]>
}

// Mock promo codes database
const VALID_PROMO_CODES: Record<string, PromoCode> = {
  WELCOME10: {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minimumPurchase: 100,
  },
  SAVE50: {
    code: 'SAVE50',
    discountType: 'fixed',
    discountValue: 50,
    minimumPurchase: 500,
  },
  INSTALL20: {
    code: 'INSTALL20',
    discountType: 'percentage',
    discountValue: 20,
    minimumPurchase: 1000,
  },
}

const TAX_RATE = 0.13 // Ontario HST
const FREE_SHIPPING_THRESHOLD = 500
const STANDARD_SHIPPING = 99
const INSTALLATION_BASE_RATE = 299

export const useEnhancedCart = create<CartState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        items: [],
        isOpen: false,
        promoCode: null,
        shippingAddress: null,
        billingAddress: null,
        sameAsShipping: true,
        installationDate: undefined,
        specialInstructions: undefined,

        addItem: item =>
          set(state => {
            const { quantity = 1, ...itemData } = item
            const existingIndex = state.items.findIndex(
              i =>
                i.productId === itemData.productId &&
                JSON.stringify(i.selectedOptions) === JSON.stringify(itemData.selectedOptions)
            )

            if (existingIndex >= 0) {
              const item = state.items[existingIndex]
              if (item) {
                item.quantity += quantity
              }
            } else {
              state.items.push({ ...itemData, quantity })
            }
          }),

        removeItem: (productId, options) =>
          set(state => {
            state.items = state.items.filter(
              item =>
                !(
                  item.productId === productId &&
                  (!options || JSON.stringify(item.selectedOptions) === JSON.stringify(options))
                )
            )
          }),

        updateQuantity: (productId, quantity, options) =>
          set(state => {
            if (quantity <= 0) {
              state.items = state.items.filter(
                item =>
                  !(
                    item.productId === productId &&
                    (!options || JSON.stringify(item.selectedOptions) === JSON.stringify(options))
                  )
              )
            } else {
              const itemIndex = state.items.findIndex(
                item =>
                  item.productId === productId &&
                  (!options || JSON.stringify(item.selectedOptions) === JSON.stringify(options))
              )
              if (itemIndex >= 0) {
                const item = state.items[itemIndex]
                if (item) {
                  item.quantity = quantity
                }
              }
            }
          }),

        clearCart: () =>
          set(state => {
            if (state) {
              state.items = []
              state.promoCode = null
              state.installationDate = undefined
              state.specialInstructions = undefined
            }
          }),

        toggleCart: () =>
          set(state => {
            state.isOpen = !state.isOpen
          }),

        openCart: () =>
          set(state => {
            state.isOpen = true
          }),

        closeCart: () =>
          set(state => {
            state.isOpen = false
          }),

        async applyPromoCode(code) {
          await Promise.resolve() // Simulate async operation
          const promo = VALID_PROMO_CODES[code.toUpperCase()]
          if (!promo) return false

          const subtotal = get().getSubtotal()
          if (promo.minimumPurchase && subtotal < promo.minimumPurchase) {
            return false
          }

          set(state => {
            state.promoCode = { ...promo, appliedAt: new Date().toISOString() }
          })
          return true
        },

        removePromoCode: () =>
          set(state => {
            state.promoCode = null
          }),

        setShippingAddress: address =>
          set(state => {
            state.shippingAddress = address
          }),

        setBillingAddress: address =>
          set(state => {
            state.billingAddress = address
          }),

        setSameAsShipping: same =>
          set(state => {
            state.sameAsShipping = same
            if (same) {
              state.billingAddress = null
            }
          }),

        setInstallationDate: date =>
          set(state => {
            state.installationDate = date
          }),

        setSpecialInstructions: instructions =>
          set(state => {
            state.specialInstructions = instructions
          }),

        toggleInstallation: (productId, include, options) =>
          set(state => {
            const itemIndex = state.items.findIndex(
              item =>
                item.productId === productId &&
                (!options || JSON.stringify(item.selectedOptions) === JSON.stringify(options))
            )
            if (itemIndex >= 0 && state.items[itemIndex]) {
              state.items[itemIndex].installationIncluded = include
            }
          }),

        getSubtotal: () => {
          const state = get()
          if (!state || !state.items) return 0
          return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
        },

        getInstallationTotal: () => {
          const { items } = get()
          const itemsWithInstallation = items.filter(item => item.installationIncluded)
          if (itemsWithInstallation.length === 0) return 0

          // Base rate plus additional per item
          return INSTALLATION_BASE_RATE + (itemsWithInstallation.length - 1) * 50
        },

        getDiscountAmount: () => {
          const { promoCode } = get()
          if (!promoCode) return 0

          const subtotal = get().getSubtotal()
          if (promoCode.discountType === 'percentage') {
            return (subtotal * promoCode.discountValue) / 100
          }
          return Math.min(promoCode.discountValue, subtotal)
        },

        getShippingCost: () => {
          const subtotal = get().getSubtotal()
          return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
        },

        getTax: () => {
          const subtotal = get().getSubtotal()
          const shipping = get().getShippingCost()
          const installation = get().getInstallationTotal()
          const discount = get().getDiscountAmount()
          return (subtotal + shipping + installation - discount) * TAX_RATE
        },

        getTotal: () => {
          const subtotal = get().getSubtotal()
          const shipping = get().getShippingCost()
          const installation = get().getInstallationTotal()
          const discount = get().getDiscountAmount()
          const tax = get().getTax()
          return subtotal + shipping + installation - discount + tax
        },

        getTotalItems: () => {
          const { items } = get()
          return items.reduce((total, item) => total + item.quantity, 0)
        },

        findItem: (productId, options) => {
          const { items } = get()
          return items.find(
            item =>
              item.productId === productId &&
              (!options || JSON.stringify(item.selectedOptions) === JSON.stringify(options))
          )
        },

        canApplyPromoCode: code => {
          const subtotal = get().getSubtotal()
          return !code.minimumPurchase || subtotal >= code.minimumPurchase
        },

        estimateDelivery: () => {
          const today = new Date()
          const min = new Date(today)
          const max = new Date(today)

          // Standard delivery: 7-14 business days
          min.setDate(min.getDate() + 7)
          max.setDate(max.getDate() + 14)

          // Skip weekends
          if (min.getDay() === 0) min.setDate(min.getDate() + 1)
          if (min.getDay() === 6) min.setDate(min.getDate() + 2)
          if (max.getDay() === 0) max.setDate(max.getDate() + 1)
          if (max.getDay() === 6) max.setDate(max.getDate() + 2)

          return { min, max }
        },

        getUpsellProducts() {
          // Mock AI recommendations - in production, this would call an API
          return Promise.resolve([
            {
              id: 'organizer-1',
              name: 'Premium Drawer Organizer',
              price: 89,
              image: '/images/products/organizer.jpg',
              description: 'Complete your closet with custom organizers',
            },
            {
              id: 'lighting-1',
              name: 'LED Strip Lighting Kit',
              price: 149,
              image: '/images/products/led-lighting.jpg',
              description: 'Illuminate your closet with smart lighting',
            },
          ])
        },

        getSimilarProducts() {
          // Mock similar products - in production, this would call an API
          return Promise.resolve([
            {
              id: 'similar-1',
              name: 'Alternative Door Style',
              price: 899,
              image: '/images/products/alt-door.jpg',
            },
          ])
        },
      })),
      {
        name: 'pg-closets-enhanced-cart',
        partialize: state => ({
          items: state.items,
          promoCode: state.promoCode,
          shippingAddress: state.shippingAddress,
          billingAddress: state.billingAddress,
          sameAsShipping: state.sameAsShipping,
          installationDate: state.installationDate,
          specialInstructions: state.specialInstructions,
        }),
      }
    )
  )
)

// Subscribe to cart changes for cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', e => {
    if (e.key === 'pg-closets-enhanced-cart' && e.newValue) {
      void useEnhancedCart.persist.rehydrate()
    }
  })
}
