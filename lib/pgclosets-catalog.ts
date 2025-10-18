/**
 * PG Closets Product Catalog Helper Functions
 *
 * Query and filter functions for the comprehensive PG Closets product catalog
 * Following TypeScript interfaces from PG-CLOSETS-V2-MASTER-SPEC.md
 *
 * @module pgclosets-catalog
 */

import type {
  Product,
  ProductVariant,
  DoorType,
  StyleType,
  FrameMaterial,
  FinishType,
  GlazingType,
  AvailabilityStatus
} from '@/types/product'

// Import product data
import productsData from '@/data/pgclosets-products.json'

// Type-safe product array
const products = productsData as Product[]

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return products
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

/**
 * Get products by door type
 */
export function getProductsByType(type: DoorType): Product[] {
  return products.filter(product => product.attributes.type === type)
}

/**
 * Get products by style
 */
export function getProductsByStyle(style: StyleType): Product[] {
  return products.filter(product => product.attributes.style === style)
}

/**
 * Get products by frame material
 */
export function getProductsByFrame(frame: FrameMaterial): Product[] {
  return products.filter(product => product.attributes.frame === frame)
}

/**
 * Get products by finish
 */
export function getProductsByFinish(finish: FinishType): Product[] {
  return products.filter(product => product.attributes.finish === finish)
}

/**
 * Get products by glazing type
 */
export function getProductsByGlazing(glazing: GlazingType): Product[] {
  return products.filter(product => product.attributes.glazing === glazing)
}

/**
 * Get products in stock
 */
export function getInStockProducts(): Product[] {
  return products.filter(product =>
    product.variants.some(variant => variant.availability === 'InStock')
  )
}

/**
 * Get products by price range (minimum variant price)
 */
export function getProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
  return products.filter(product => {
    const prices = product.variants.map(v => v.priceCAD)
    const minProductPrice = Math.min(...prices)
    return minProductPrice >= minPrice && minProductPrice <= maxPrice
  })
}

/**
 * Get lowest price for a product
 */
export function getLowestPrice(product: Product): number {
  return Math.min(...product.variants.map(v => v.priceCAD))
}

/**
 * Get highest price for a product
 */
export function getHighestPrice(product: Product): number {
  return Math.max(...product.variants.map(v => v.priceCAD))
}

/**
 * Get price range display string
 */
export function getPriceRangeDisplay(product: Product): string {
  const lowest = getLowestPrice(product)
  const highest = getHighestPrice(product)

  if (lowest === highest) {
    return `$${lowest.toLocaleString('en-CA')} CAD`
  }

  return `From $${lowest.toLocaleString('en-CA')} CAD`
}

/**
 * Get variant by SKU
 */
export function getVariantBySku(sku: string): { product: Product; variant: ProductVariant } | undefined {
  for (const product of products) {
    const variant = product.variants.find(v => v.sku === sku)
    if (variant) {
      return { product, variant }
    }
  }
  return undefined
}

/**
 * Search products by keyword
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()

  return products.filter(product => {
    // Search in name, description, features, and tags
    return (
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tagline.toLowerCase().includes(lowerQuery) ||
      product.features.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
      product.badges.some(badge => badge.toLowerCase().includes(lowerQuery)) ||
      product.seo.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    )
  })
}

/**
 * Get related products
 */
export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId)
  if (!product || !product.relatedProductIds.length) {
    return []
  }

  return product.relatedProductIds
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined)
}

/**
 * Get products with specific badge
 */
export function getProductsByBadge(badge: string): Product[] {
  return products.filter(product =>
    product.badges.some(b => b.toLowerCase() === badge.toLowerCase())
  )
}

/**
 * Get best sellers (products with "Best Seller" badge)
 */
export function getBestSellers(): Product[] {
  return getProductsByBadge('Best Seller')
}

/**
 * Get Canadian-made products
 */
export function getCanadianMadeProducts(): Product[] {
  return products.filter(product =>
    product.badges.some(badge =>
      badge.toLowerCase().includes('canadian') ||
      badge.toLowerCase().includes('ontario')
    )
  )
}

/**
 * Filter products by multiple criteria
 */
export interface ProductFilters {
  type?: DoorType
  style?: StyleType
  frame?: FrameMaterial
  finish?: FinishType
  glazing?: GlazingType
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  badge?: string
}

export function filterProducts(filters: ProductFilters): Product[] {
  let filtered = products

  if (filters.type) {
    filtered = filtered.filter(p => p.attributes.type === filters.type)
  }

  if (filters.style) {
    filtered = filtered.filter(p => p.attributes.style === filters.style)
  }

  if (filters.frame) {
    filtered = filtered.filter(p => p.attributes.frame === filters.frame)
  }

  if (filters.finish) {
    filtered = filtered.filter(p => p.attributes.finish === filters.finish)
  }

  if (filters.glazing) {
    filtered = filtered.filter(p => p.attributes.glazing === filters.glazing)
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice ?? 0
    const max = filters.maxPrice ?? Infinity
    filtered = getProductsByPriceRange(min, max).filter(p => filtered.includes(p))
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter(p =>
      p.variants.some(v => v.availability === 'InStock')
    )
  }

  if (filters.badge) {
    filtered = filtered.filter(p =>
      p.badges.some(b => b.toLowerCase() === filters.badge!.toLowerCase())
    )
  }

  return filtered
}

/**
 * Get unique values for filter dropdowns
 */
export function getFilterOptions() {
  const types = new Set<DoorType>()
  const styles = new Set<StyleType>()
  const frames = new Set<FrameMaterial>()
  const finishes = new Set<FinishType>()
  const glazings = new Set<GlazingType>()
  const badges = new Set<string>()

  products.forEach(product => {
    types.add(product.attributes.type)
    styles.add(product.attributes.style)
    frames.add(product.attributes.frame)
    finishes.add(product.attributes.finish)
    glazings.add(product.attributes.glazing)
    product.badges.forEach(badge => badges.add(badge))
  })

  return {
    types: Array.from(types).sort(),
    styles: Array.from(styles).sort(),
    frames: Array.from(frames).sort(),
    finishes: Array.from(finishes).sort(),
    glazings: Array.from(glazings).sort(),
    badges: Array.from(badges).sort()
  }
}

/**
 * Get product statistics
 */
export function getProductStats() {
  const totalProducts = products.length
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0)
  const inStockCount = getInStockProducts().length
  const prices = products.flatMap(p => p.variants.map(v => v.priceCAD))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

  return {
    totalProducts,
    totalVariants,
    inStockCount,
    outOfStockCount: totalProducts - inStockCount,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: Math.round(avgPrice)
    }
  }
}

/**
 * Get product card data (optimized for display)
 */
export interface ProductCardData {
  id: string
  slug: string
  name: string
  tagline: string
  heroImage: {
    url: string
    alt: string
  }
  priceFrom: number
  badges: string[]
  availability: AvailabilityStatus | 'Mixed'
}

export function getProductCardData(product: Product): ProductCardData {
  const heroImage = product.media.find(m => m.role === 'hero') || product.media[0]
  const availabilities = product.variants.map(v => v.availability)
  const availability = availabilities.every(a => a === availabilities[0])
    ? availabilities[0]
    : 'Mixed' as const

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    heroImage: {
      url: heroImage.url,
      alt: heroImage.alt
    },
    priceFrom: getLowestPrice(product),
    badges: product.badges,
    availability
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number, includeCurrency = true): string {
  const formatted = price.toLocaleString('en-CA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  return includeCurrency ? `$${formatted} CAD` : `$${formatted}`
}

/**
 * Calculate total price with installation
 */
export function calculateTotalPrice(variant: ProductVariant, includeInstallation = false): number {
  return includeInstallation
    ? variant.priceCAD + variant.installAddonCAD
    : variant.priceCAD
}
