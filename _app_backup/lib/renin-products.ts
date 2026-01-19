/**
 * Renin Products Types and Utilities
 */

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  images?: string[]
  sizes: string[]
  finishes: string[]
  features: string[]
  description?: string
  inStock?: boolean
}

// Re-export products from root
import { reninProducts } from '@/renin-products'
export { reninProducts }

// Utility functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price)
}

export function getProductById(id: string): Product | undefined {
  return reninProducts.find((p) => p.id === id) as Product | undefined
}

export function getProductsByCategory(category: string): Product[] {
  return reninProducts.filter((p) => p.category === category) as Product[]
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return reninProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.features.some((f) => f.toLowerCase().includes(lowerQuery))
  ) as Product[]
}

// Tax calculation for Ontario (13% HST)
const TAX_RATE = 0.13

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100
}

export function calculateTotal(subtotal: number): { tax: number; total: number } {
  const tax = calculateTax(subtotal)
  return {
    tax,
    total: subtotal + tax
  }
}
