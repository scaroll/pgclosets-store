// @ts-nocheck - Product data loader
/**
 * Product data loader for Renin products
 * Loads and normalizes products from JSON data files
 */

import simpleProducts from '@/data/simple-products.json'
import reninProducts from '@/data/renin-products.json'

// ============================================================================
// Types
// ============================================================================

export interface ProductImage {
  url: string
  alt: string
  role?: string
  width?: number
  height?: number
}

export interface ProductVariant {
  sku: string
  name: string
  priceCAD: number
  installAddonCAD?: number
  availability: string
  dimensions?: {
    width: number
    height: number
    unit: string
  }
  weight?: number
  finish?: string
  glazing?: string
}

export interface NormalizedProduct {
  id: string
  slug: string
  name: string
  title?: string
  brand?: string
  description: string
  shortDescription?: string
  price: number // Price in cents (CAD)
  salePrice?: number
  images: string[]
  category: string
  inStock: boolean
  featured: boolean
  bestseller: boolean
  tags?: string[]
  variants?: ProductVariant[]
  media?: ProductImage[]
  attributes?: Record<string, any>
  specifications?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Data Loading Functions
// ============================================================================

/**
 * Normalize simple products to standard format
 */
function normalizeSimpleProducts(): NormalizedProduct[] {
  return simpleProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.title,
    title: product.title,
    brand: 'Renin',
    description: product.description,
    shortDescription: product.description.substring(0, 150) + '...',
    price: product.price, // Already in cents
    images: product.image ? [product.image] : [],
    category: product.category,
    inStock: true,
    featured: false,
    bestseller: false,
    tags: [product.category],
  }))
}

/**
 * Normalize detailed Renin products to standard format
 */
function normalizeReninProducts(): NormalizedProduct[] {
  return reninProducts.map((product) => {
    // Extract images from media array
    const images: string[] = []

    if (product.media && Array.isArray(product.media)) {
      product.media.forEach((mediaItem) => {
        if (typeof mediaItem === 'object' && mediaItem.url) {
          images.push(mediaItem.url)
        }
      })
    }

    // Get price from first variant or default to 0
    let price = 0
    let salePrice: number | undefined

    if (product.variants && product.variants.length > 0) {
      price = product.variants[0].priceCAD * 100 // Convert to cents
    }

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      title: product.name,
      brand: product.brand || 'Renin',
      description: product.description,
      shortDescription: product.tagline || product.description.substring(0, 150) + '...',
      price,
      salePrice,
      images,
      category: mapProductCategory(product.category),
      inStock: product.variants?.[0]?.availability === 'InStock' ?? true,
      featured: product.isFeatured ?? false,
      bestseller: product.isBestSeller ?? false,
      tags: product.badges || [],
      variants: product.variants,
      media: product.media as ProductImage[],
      attributes: product.attributes,
      specifications: product.specifications,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  })
}

/**
 * Map product category to standardized category
 */
function mapProductCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'barn-doors': 'Barn Doors',
    'bifold-doors': 'Bifold Doors',
    'bypass-doors': 'Bypass Doors',
    'pivot-doors': 'Pivot Doors',
    'hardware': 'Hardware',
    'mirrors': 'Mirrors',
    'Renin Barn Doors': 'Barn Doors',
    'Renin Bifold Doors': 'Bifold Doors',
    'Renin Bypass Doors': 'Bypass Doors',
    'Renin Closet Doors': 'Closet Doors',
  }

  return categoryMap[category] || category
}

// ============================================================================
// Product Data API
// ============================================================================

/**
 * Get all products (merged from all sources)
 */
export function getAllProducts(): NormalizedProduct[] {
  const simple = normalizeSimpleProducts()
  const detailed = normalizeReninProducts()

  // Merge products, preferring detailed versions
  const productsMap = new Map<string, NormalizedProduct>()

  // Add simple products first
  simple.forEach((product) => {
    productsMap.set(product.id, product)
  })

  // Override with detailed products
  detailed.forEach((product) => {
    productsMap.set(product.id, product)
  })

  return Array.from(productsMap.values())
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): NormalizedProduct | null {
  const products = getAllProducts()
  return products.find((p) => p.slug === slug) || null
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): NormalizedProduct[] {
  const products = getAllProducts()
  const normalizedCategory = mapProductCategory(category)

  return products.filter((p) => {
    const productCategory = mapProductCategory(p.category)
    return productCategory === normalizedCategory
  })
}

/**
 * Get featured products
 */
export function getFeaturedProducts(limit?: number): NormalizedProduct[] {
  const products = getAllProducts()
  const featured = products.filter((p) => p.featured)

  return limit ? featured.slice(0, limit) : featured
}

/**
 * Get bestseller products
 */
export function getBestsellerProducts(limit?: number): NormalizedProduct[] {
  const products = getAllProducts()
  const bestsellers = products.filter((p) => p.bestseller)

  return limit ? bestsellers.slice(0, limit) : bestsellers
}

/**
 * Filter and sort products
 */
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  tags?: string[]
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'createdAt' | 'featured'
  direction: 'asc' | 'desc'
}

export function filterAndSortProducts(
  filters?: ProductFilters,
  sort?: ProductSortOptions,
  pagination?: { page: number; limit: number }
): {
  products: NormalizedProduct[]
  total: number
  page: number
  totalPages: number
} {
  let products = getAllProducts()

  // Apply filters
  if (filters) {
    if (filters.category) {
      products = getProductsByCategory(filters.category)
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice! * 100)
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice! * 100)
    }

    if (filters.inStock !== undefined) {
      products = products.filter((p) => p.inStock === filters.inStock)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      products = products.filter((p) =>
        p.tags?.some((tag) => filters.tags!.includes(tag))
      )
    }
  }

  // Apply sorting
  if (sort) {
    products.sort((a, b) => {
      let aVal: any = a[sort.field]
      let bVal: any = b[sort.field]

      // Handle special cases
      if (sort.field === 'featured') {
        aVal = a.featured ? 1 : 0
        bVal = b.featured ? 1 : 0
      }

      if (sort.direction === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })
  } else {
    // Default sort: featured first, then by name
    products.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return a.name.localeCompare(b.name)
    })
  }

  const total = products.length

  // Apply pagination
  if (pagination) {
    const { page, limit } = pagination
    const skip = (page - 1) * limit
    products = products.slice(skip, skip + limit)

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  return {
    products,
    total,
    page: 1,
    totalPages: 1,
  }
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const products = getAllProducts()
  const categories = new Set<string>()

  products.forEach((p) => {
    const normalized = mapProductCategory(p.category)
    categories.add(normalized)
  })

  return Array.from(categories).sort()
}

/**
 * Get product count by category
 */
export function getProductCountByCategory(): Record<string, number> {
  const products = getAllProducts()
  const counts: Record<string, number> = {}

  products.forEach((p) => {
    const category = mapProductCategory(p.category)
    counts[category] = (counts[category] || 0) + 1
  })

  return counts
}

/**
 * Get primary image for product with fallback
 */
export function getProductImage(product: NormalizedProduct, index = 0): string {
  if (product.images && product.images.length > index) {
    return product.images[index]
  }

  // Fallback to placeholder
  return `/api/placeholder/600/800?text=${encodeURIComponent(product.name)}`
}

/**
 * Format product price in CAD
 */
export function formatProductPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(priceInCents / 100)
}
