export interface ArcatProduct {
  id: number
  name: string
  slug: string
  category: string
  price: number
  homeDepotImage: string
  arcatImages: string[]
  description: string
  features: string[]
  specifications: {
    width?: string
    height?: string
    thickness?: string
    material?: string
    trackLength?: string
    weightCapacity?: string
    finish?: string
  }
  installationTime: string
  inStock: boolean
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  heroImage: string
}

export interface ArcatDatabase {
  products: ArcatProduct[]
  categories: ProductCategory[]
}

// Import the database
import databaseJson from "./enhanced-renin-database.json"
const database = databaseJson as ArcatDatabase

export const arcatProducts = database.products
export const productCategories = database.categories

// Utility functions
export function getProductById(id: number): ArcatProduct | undefined {
  return arcatProducts.find((product) => product.id === id)
}

export function getProductBySlug(slug: string): ArcatProduct | undefined {
  return arcatProducts.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): ArcatProduct[] {
  return arcatProducts.filter((product) => product.category === category)
}

export function getCategoryById(id: string): ProductCategory | undefined {
  return productCategories.find((category) => category.id === id)
}

export function searchProducts(query: string): ArcatProduct[] {
  const lowercaseQuery = query.toLowerCase()
  return arcatProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
  )
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-CA")}`
}

export function calculateHST(price: number, hstRate = 0.13): number {
  return Math.round(price * hstRate * 100) / 100
}

export function calculateTotalWithHST(price: number, hstRate = 0.13): number {
  return Math.round(price * (1 + hstRate) * 100) / 100
}

export function getFeaturedProducts(): ArcatProduct[] {
  // Return first 6 products as featured
  return arcatProducts.slice(0, 6)
}

export function getRelatedProducts(productId: number, category: string, limit = 4): ArcatProduct[] {
  return arcatProducts.filter((product) => product.category === category && product.id !== productId).slice(0, limit)
}
