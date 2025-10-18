export type Product = {
  slug: string
  title: string
  type: "Barn" | "Bypass" | "Bifold" | "Pivot" | "Hardware" | "Mirror"
  category?: "barn_doors" | "bypass_doors" | "bifold_doors" | "pivot_doors" | "hardware" | "mirrors"
  priceMin: number
  priceMax?: number
  priceMSRP?: number
  image?: string
  images?: string[]
  videos?: { title: string; thumb: string; src: string }[]
  badges?: string[]
  description?: string
  shortDescription?: string
  features?: string[]
  specs?: Record<string, string | number>
  options?: Record<string, string[]>
  sku?: string
  mpn?: string
  dimensions?: {
    width?: number
    height?: number
    thickness?: number
  }
  materials?: string[]
  finishes?: string[]
  inStock?: boolean
  leadTimeDays?: number
  warranty?: string
}

export type ProductStore = {
  currency: "CAD"
  taxRate: number
  items: Product[]
}

import store from "../data/products.json"
export const PRODUCTS = store as ProductStore

export function getAllProducts() {
  return PRODUCTS.items
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.items.find((p) => p.slug === slug)
}

export function getRelated(slug: string, type: Product["type"], n = 3) {
  return PRODUCTS.items.filter((p) => p.slug !== slug && p.type === type).slice(0, n)
}

export function getProductsByType(type: Product["type"]) {
  return PRODUCTS.items.filter((p) => p.type === type)
}

export function getProductsByCategory(category: string) {
  return PRODUCTS.items.filter((p) => p.category === category || p.type.toLowerCase().includes(category.toLowerCase()))
}

export function getFeaturedProducts(n = 6) {
  return PRODUCTS.items
    .filter((p) =>
      p.badges?.some((badge) => badge.toLowerCase().includes("premium") || badge.toLowerCase().includes("designer")),
    )
    .slice(0, n)
}

export function getProductsByPriceRange(min: number, max: number) {
  return PRODUCTS.items.filter((p) => p.priceMin >= min && (p.priceMax || p.priceMin) <= max)
}

export function searchProducts(query: string) {
  const lowercaseQuery = query.toLowerCase()
  return PRODUCTS.items.filter(
    (p) =>
      p.title.toLowerCase().includes(lowercaseQuery) ||
      p.type.toLowerCase().includes(lowercaseQuery) ||
      p.description?.toLowerCase().includes(lowercaseQuery) ||
      p.features?.some((feature) => feature.toLowerCase().includes(lowercaseQuery)) ||
      p.badges?.some((badge) => badge.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getProductImage(product: Product, fallback = "/placeholder-product.jpg"): string {
  return product.images?.[0] || product.image || fallback
}

export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images
  }
  if (product.image) {
    return [product.image]
  }
  return ["/placeholder-product.jpg"]
}

export function getCategories() {
  const categories = new Set(PRODUCTS.items.map((p) => p.type))
  return Array.from(categories)
}

export function getFinishes() {
  const finishes = new Set<string>()
  PRODUCTS.items.forEach((p) => {
    p.finishes?.forEach((finish) => finishes.add(finish))
  })
  return Array.from(finishes)
}

export function getMaterials() {
  const materials = new Set<string>()
  PRODUCTS.items.forEach((p) => {
    p.materials?.forEach((material) => materials.add(material))
  })
  return Array.from(materials)
}
