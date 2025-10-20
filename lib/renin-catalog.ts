/**
 * Renin Products Catalog Helper Functions
 *
 * Complete catalog management for Renin barn doors, bifold, bypass,
 * pivot, hardware, and mirrors integration with PG Closets
 */

import type {
  Product,
  ProductVariant,
  ReninProduct,
  ReninCategory,
  DoorType,
  StyleType,
  FrameMaterial,
  FinishType,
  GlazingType,
  HardwareType
} from '@/types/product-enhanced'

// Import Renin product data
import reninProductsData from '@/data/renin-products.json'
import { getAllProducts as getPgClosetsProducts } from '@/lib/pgclosets-catalog'

// Type-safe product arrays
const reninProducts = reninProductsData as ReninProduct[]

/**
 * Get all Renin products
 */
export function getAllReninProducts(): ReninProduct[] {
  return reninProducts
}

/**
 * Get all products (PG Closets + Renin)
 */
export function getAllProducts(): Product[] {
  const pgClosetsProducts = getPgClosetsProducts()
  return [...pgClosetsProducts, ...reninProducts]
}

/**
 * Get Renin product by slug
 */
export function getReninProductBySlug(slug: string): ReninProduct | undefined {
  return reninProducts.find(product => product.slug === slug)
}

/**
 * Get product by slug (checks both catalogs)
 */
export function getProductBySlug(slug: string): Product | undefined {
  // Check PG Closets first
  const pgClosetsProduct = getPgClosetsProducts().find(p => p.slug === slug)
  if (pgClosetsProduct) return pgClosetsProduct

  // Check Renin products
  return getReninProductBySlug(slug)
}

/**
 * Get Renin products by category
 */
export function getReninProductsByCategory(category: ReninCategory): ReninProduct[] {
  return reninProducts.filter(product => product.category === category)
}

/**
 * Get products by door type (includes both catalogs)
 */
export function getProductsByType(type: DoorType): Product[] {
  const allProducts = getAllProducts()
  return allProducts.filter(product => product.attributes.type === type)
}

/**
 * Get Renin products by style
 */
export function getReninProductsByStyle(style: StyleType): ReninProduct[] {
  return reninProducts.filter(product => product.attributes.style === style)
}

/**
 * Get Renin products by finish
 */
export function getReninProductsByFinish(finish: FinishType): ReninProduct[] {
  return reninProducts.filter(product => product.attributes.finish === finish)
}

/**
 * Get Renin products by frame material
 */
export function getReninProductsByFrame(frame: FrameMaterial): ReninProduct[] {
  return reninProducts.filter(product => product.attributes.frame === frame)
}

/**
 * Get Renin products by glazing type
 */
export function getReninProductsByGlazing(glazing: GlazingType): ReninProduct[] {
  return reninProducts.filter(product => product.attributes.glazing === glazing)
}

/**
 * Get Renin products by collection
 */
export function getReninProductsByCollection(collection: string): ReninProduct[] {
  return reninProducts.filter(product => product.collection === collection)
}

/**
 * Get Renin products by series
 */
export function getReninProductsBySeries(series: string): ReninProduct[] {
  return reninProducts.filter(product => product.series === series)
}

/**
 * Get Renin hardware products
 */
export function getReninHardware(): ReninProduct[] {
  return reninProducts.filter(product => product.category === 'hardware')
}

/**
 * Get Renin mirror products
 */
export function getReninMirrors(): ReninProduct[] {
  return reninProducts.filter(product => product.category === 'mirrors')
}

/**
 * Get Renin barn doors
 */
export function getReninBarnDoors(): ReninProduct[] {
  return reninProducts.filter(product => product.category === 'barn-doors')
}

/**
 * Get Renin bifold doors
 */
export function getReninBifoldDoors(): ReninProduct[] {
  return reninProducts.filter(product => product.category === 'bifold-doors')
}

/**
 * Get Renin bypass doors
 */
export function getReninBypassDoors(): ReninProduct[] {
  return reninProducts.filter(product => product.category === 'bypass-doors')
}

/**
 * Get Renin pivot doors
 */
export function getReninPivotDoors(): ReninProduct[] {
  return reninProducts.filter(product => product.category === 'pivot-doors')
}

/**
 * Get Canadian-made Renin products
 */
export function getReninCanadianMade(): ReninProduct[] {
  return reninProducts.filter(product => product.attributes.madeInCanada === true)
}

/**
 * Get new Renin products
 */
export function getReninNewProducts(): ReninProduct[] {
  return reninProducts.filter(product => product.isNew === true)
}

/**
 * Get featured Renin products
 */
export function getReninFeaturedProducts(): ReninProduct[] {
  return reninProducts.filter(product => product.isFeatured === true)
}

/**
 * Get Renin best sellers
 */
export function getReninBestSellers(): ReninProduct[] {
  return reninProducts.filter(product => product.isBestSeller === true)
}

/**
 * Search Renin products by keyword
 */
export function searchReninProducts(query: string): ReninProduct[] {
  const lowerQuery = query.toLowerCase()

  return reninProducts.filter(product => {
    return (
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tagline.toLowerCase().includes(lowerQuery) ||
      product.features.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
      product.badges.some(badge => badge.toLowerCase().includes(lowerQuery)) ||
      product.seo.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
      product.category?.toLowerCase().includes(lowerQuery) ||
      product.collection?.toLowerCase().includes(lowerQuery) ||
      product.series?.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * Filter Renin products by multiple criteria
 */
export interface ReninProductFilters {
  category?: ReninCategory
  style?: StyleType
  frame?: FrameMaterial
  finish?: FinishType
  glazing?: GlazingType
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  canadianMadeOnly?: boolean
  collection?: string
  series?: string
  badges?: string[]
}

export function filterReninProducts(filters: ReninProductFilters): ReninProduct[] {
  let filtered = reninProducts

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category)
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

  if (filters.collection) {
    filtered = filtered.filter(p => p.collection === filters.collection)
  }

  if (filters.series) {
    filtered = filtered.filter(p => p.series === filters.series)
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice ?? 0
    const max = filters.maxPrice ?? Infinity
    filtered = filtered.filter(product => {
      const prices = product.variants.map(v => v.priceCAD)
      const minProductPrice = Math.min(...prices)
      return minProductPrice >= min && minProductPrice <= max
    })
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter(p =>
      p.variants.some(v => v.availability === 'InStock')
    )
  }

  if (filters.canadianMadeOnly) {
    filtered = filtered.filter(p => p.attributes.madeInCanada === true)
  }

  if (filters.badges && filters.badges.length > 0) {
    filtered = filtered.filter(p =>
      filters.badges!.some(badge => p.badges.some(pb => pb.toLowerCase() === badge.toLowerCase()))
    )
  }

  return filtered
}

/**
 * Get Renin product statistics
 */
export function getReninProductStats() {
  const totalProducts = reninProducts.length
  const totalVariants = reninProducts.reduce((sum, p) => sum + p.variants.length, 0)
  const inStockCount = reninProducts.filter(p =>
    p.variants.some(v => v.availability === 'InStock')
  ).length
  const canadianMadeCount = reninProducts.filter(p => p.attributes.madeInCanada).length
  const prices = reninProducts.flatMap(p => p.variants.map(v => v.priceCAD))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

  const categoryStats = reninProducts.reduce((acc, product) => {
    const category = product.category || 'uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalProducts,
    totalVariants,
    inStockCount,
    outOfStockCount: totalProducts - inStockCount,
    canadianMadeCount,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: Math.round(avgPrice)
    },
    categoryBreakdown: categoryStats
  }
}

/**
 * Get Renin filter options
 */
export function getReninFilterOptions() {
  const categories = new Set<ReninCategory>()
  const styles = new Set<StyleType>()
  const frames = new Set<FrameMaterial>()
  const finishes = new Set<FinishType>()
  const glazings = new Set<GlazingType>()
  const collections = new Set<string>()
  const series = new Set<string>()
  const badges = new Set<string>()

  reninProducts.forEach(product => {
    if (product.category) categories.add(product.category)
    if (product.collection) collections.add(product.collection)
    if (product.series) series.add(product.series)

    styles.add(product.attributes.style)
    frames.add(product.attributes.frame)
    finishes.add(product.attributes.finish)
    if (product.attributes.glazing) glazings.add(product.attributes.glazing)

    product.badges.forEach(badge => badges.add(badge))
  })

  return {
    categories: Array.from(categories).sort(),
    styles: Array.from(styles).sort(),
    frames: Array.from(frames).sort(),
    finishes: Array.from(finishes).sort(),
    glazings: Array.from(glazings).sort(),
    collections: Array.from(collections).sort(),
    series: Array.from(series).sort(),
    badges: Array.from(badges).sort()
  }
}

/**
 * Get Renin related products
 */
export function getReninRelatedProducts(productId: string): ReninProduct[] {
  const product = reninProducts.find(p => p.id === productId)
  if (!product || !product.relatedProductIds.length) {
    return []
  }

  return product.relatedProductIds
    .map(id => reninProducts.find(p => p.id === id))
    .filter((p): p is ReninProduct => p !== undefined)
}

/**
 * Get variant by SKU (checks both catalogs)
 */
export function getVariantBySku(sku: string): { product: Product; variant: ProductVariant } | undefined {
  // Check PG Closets first
  const pgClosetsProducts = getPgClosetsProducts()
  for (const product of pgClosetsProducts) {
    const variant = product.variants.find(v => v.sku === sku)
    if (variant) {
      return { product, variant }
    }
  }

  // Check Renin products
  for (const product of reninProducts) {
    const variant = product.variants.find(v => v.sku === sku)
    if (variant) {
      return { product, variant }
    }
  }

  return undefined
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
 * Get Renin product card data (optimized for display)
 */
export interface ReninProductCardData {
  id: string
  slug: string
  name: string
  tagline: string
  brand: string
  category?: string
  heroImage: {
    url: string
    alt: string
  }
  priceFrom: number
  badges: string[]
  availability: 'InStock' | 'OutOfStock' | 'MadeToOrder' | 'Mixed'
  isFeatured?: boolean
  isNew?: boolean
  isBestSeller?: boolean
  madeInCanada?: boolean
}

export function getReninProductCardData(product: ReninProduct): ReninProductCardData {
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
    brand: product.brand,
    category: product.category,
    heroImage: {
      url: heroImage.url,
      alt: heroImage.alt
    },
    priceFrom: getLowestPrice(product),
    badges: product.badges,
    availability,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    madeInCanada: product.attributes.madeInCanada
  }
}

/**
 * Get popular Renin products (based on featured status)
 */
export function getPopularReninProducts(limit = 8): ReninProduct[] {
  return reninProducts
    .filter(p => p.isFeatured || p.isBestSeller)
    .slice(0, limit)
}

/**
 * Get Renin products by price range
 */
export function getReninProductsByPriceRange(minPrice: number, maxPrice: number): ReninProduct[] {
  return reninProducts.filter(product => {
    const prices = product.variants.map(v => v.priceCAD)
    const minProductPrice = Math.min(...prices)
    return minProductPrice >= minPrice && minProductPrice <= maxPrice
  })
}

/**
 * Get in-stock Renin products
 */
export function getInStockReninProducts(): ReninProduct[] {
  return reninProducts.filter(product =>
    product.variants.some(variant => variant.availability === 'InStock')
  )
}