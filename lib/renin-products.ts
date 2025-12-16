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
