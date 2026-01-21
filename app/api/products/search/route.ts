import { checkRateLimit, generalRateLimiter, getClientIdentifier } from '@/lib/rate-limit'
import { createSecureHandler } from '@/lib/security/middleware'
import type { Product, ProductSearchResult } from '@/types/product'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Type definitions
interface SearchFilters {
  categories?: string[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  onSale?: boolean
  styles?: string[]
}

// Sample product data for demonstration
const SAMPLE_PRODUCTS: Product[] = [
  // Barn Doors
  {
    id: 'barn-1',
    name: 'Modern Farmhouse Barn Door',
    slug: 'modern-farmhouse-barn-door',
    category: 'barn-doors',
    price: 89900,
    salePrice: 74900,
    images: ['/api/placeholder/600/800'],
    description:
      'Beautiful modern farmhouse style barn door with rustic wood finish and black hardware.',
    features: [
      'Solid wood core',
      'Pre-drilled for hardware',
      'Reversible design',
      'Lifetime warranty',
    ],
    specifications: {
      width: '36"',
      height: '80"',
      thickness: '1.75"',
      material: 'Solid Pine Wood',
      style: 'Modern Farmhouse',
      weight: '75 lbs',
    },
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isNew: false,
    isFeatured: true,
    tags: ['farmhouse', 'rustic', 'wood', 'sliding'],
    brand: 'Renin',
  },
  {
    id: 'barn-2',
    name: 'Glass Panel Contemporary Barn Door',
    slug: 'glass-panel-contemporary-barn-door',
    category: 'barn-doors',
    price: 129900,
    images: ['/api/placeholder/600/800'],
    description: 'Sleek contemporary barn door with frosted glass panels and aluminum frame.',
    features: ['Tempered safety glass', 'Aluminum frame', 'Soft-close mechanism', 'Modern design'],
    specifications: {
      width: '42"',
      height: '84"',
      thickness: '1.5"',
      material: 'Glass & Aluminum',
      style: 'Contemporary',
      weight: '85 lbs',
    },
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    isFeatured: false,
    tags: ['modern', 'glass', 'contemporary', 'aluminum'],
    brand: 'Renin',
  },

  // Bifold Doors
  {
    id: 'bifold-1',
    name: 'Classic White Bifold Closet Door',
    slug: 'classic-white-bifold-closet-door',
    category: 'bifold-doors',
    price: 34900,
    images: ['/api/placeholder/600/800'],
    description: 'Traditional white bifold door perfect for closets and pantries.',
    features: [
      'Pre-finished white',
      'Easy installation',
      'Smooth operation',
      'Space-saving design',
    ],
    specifications: {
      width: '30"',
      height: '80"',
      thickness: '1.375"',
      material: 'MDF',
      style: 'Traditional',
      weight: '45 lbs',
    },
    rating: 4.5,
    reviewCount: 234,
    inStock: true,
    isNew: false,
    isFeatured: false,
    tags: ['traditional', 'white', 'closet', 'space-saving'],
    brand: 'Renin',
  },
  {
    id: 'bifold-2',
    name: 'Louvered Pine Bifold Door',
    slug: 'louvered-pine-bifold-door',
    category: 'bifold-doors',
    price: 44900,
    salePrice: 39900,
    images: ['/api/placeholder/600/800'],
    description: 'Louvered pine bifold door for ventilation and classic style.',
    features: [
      'Natural pine wood',
      'Louvered design',
      'Unfinished for customization',
      'Durable construction',
    ],
    specifications: {
      width: '36"',
      height: '80"',
      thickness: '1.375"',
      material: 'Pine Wood',
      style: 'Traditional',
      weight: '55 lbs',
    },
    rating: 4.6,
    reviewCount: 167,
    inStock: true,
    isNew: false,
    isFeatured: false,
    tags: ['louvered', 'pine', 'natural', 'ventilation'],
    brand: 'Renin',
  },

  // Bypass Doors
  {
    id: 'bypass-1',
    name: 'Mirror Bypass Closet Doors',
    slug: 'mirror-bypass-closet-doors',
    category: 'bypass-doors',
    price: 79900,
    images: ['/api/placeholder/600/800'],
    description: 'Full-length mirror bypass doors that make your space feel larger.',
    features: ['Full-length mirrors', 'Smooth gliding', 'Space enhancement', 'Easy maintenance'],
    specifications: {
      width: '48" per panel',
      height: '80"',
      thickness: '1"',
      material: 'Mirror & Aluminum',
      style: 'Modern',
      weight: '120 lbs total',
    },
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    isNew: false,
    isFeatured: true,
    tags: ['mirror', 'modern', 'space-saving', 'closet'],
    brand: 'Renin',
  },
  {
    id: 'bypass-2',
    name: 'Frosted Glass Bypass Doors',
    slug: 'frosted-glass-bypass-doors',
    category: 'bypass-doors',
    price: 94900,
    images: ['/api/placeholder/600/800'],
    description: 'Elegant frosted glass bypass doors for privacy with light transmission.',
    features: ['Frosted tempered glass', 'Aluminum frame', 'Quiet operation', 'Modern aesthetic'],
    specifications: {
      width: '36" per panel',
      height: '80"',
      thickness: '1.25"',
      material: 'Frosted Glass',
      style: 'Contemporary',
      weight: '100 lbs total',
    },
    rating: 4.8,
    reviewCount: 143,
    inStock: false,
    isNew: false,
    isFeatured: false,
    tags: ['glass', 'frosted', 'privacy', 'modern'],
    brand: 'Renin',
  },

  // Pivot Doors
  {
    id: 'pivot-1',
    name: 'Modern Pivot Entry Door',
    slug: 'modern-pivot-entry-door',
    category: 'pivot-doors',
    price: 189900,
    images: ['/api/placeholder/600/800'],
    description: 'Statement-making pivot door with contemporary design.',
    features: [
      'Heavy-duty pivot hardware',
      'Solid core',
      'Architectural design',
      'Smooth operation',
    ],
    specifications: {
      width: '42"',
      height: '96"',
      thickness: '2"',
      material: 'Solid Wood Core',
      style: 'Modern',
      weight: '150 lbs',
    },
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    isNew: true,
    isFeatured: true,
    tags: ['modern', 'pivot', 'statement', 'architectural'],
    brand: 'Renin',
  },

  // Room Dividers
  {
    id: 'divider-1',
    name: 'Japanese Style Room Divider',
    slug: 'japanese-style-room-divider',
    category: 'room-dividers',
    price: 149900,
    salePrice: 129900,
    images: ['/api/placeholder/600/800'],
    description: 'Elegant Japanese-inspired room divider with rice paper panels.',
    features: ['Traditional design', 'Light filtering', 'Flexible configuration', 'Easy assembly'],
    specifications: {
      width: '72" total',
      height: '72"',
      panels: '4',
      material: 'Wood & Rice Paper',
      style: 'Japanese',
      weight: '35 lbs',
    },
    rating: 4.6,
    reviewCount: 91,
    inStock: true,
    isNew: false,
    isFeatured: false,
    tags: ['japanese', 'room-divider', 'traditional', 'flexible'],
    brand: 'Renin',
  },

  // Hardware
  {
    id: 'hardware-1',
    name: 'Black Barn Door Hardware Kit',
    slug: 'black-barn-door-hardware-kit',
    category: 'hardware',
    price: 19900,
    images: ['/api/placeholder/600/800'],
    description: 'Complete barn door hardware kit in matte black finish.',
    features: ['Heavy-duty steel', 'Quiet operation', 'Complete kit', 'Easy installation'],
    specifications: {
      trackLength: '6 feet',
      weightCapacity: '200 lbs',
      finish: 'Matte Black',
      material: 'Steel',
      style: 'Industrial',
    },
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    isNew: false,
    isFeatured: true,
    tags: ['hardware', 'black', 'barn-door', 'industrial'],
    brand: 'Renin',
  },

  // Mirrors
  {
    id: 'mirror-1',
    name: 'Full Length Wall Mirror',
    slug: 'full-length-wall-mirror',
    category: 'mirrors',
    price: 29900,
    images: ['/api/placeholder/600/800'],
    description: 'Elegant full-length wall mirror with beveled edges.',
    features: ['Beveled edges', 'Shatter-resistant', 'Wall-mounted', 'Distortion-free'],
    specifications: {
      width: '24"',
      height: '60"',
      thickness: '1"',
      material: 'Glass',
      style: 'Classic',
      weight: '25 lbs',
    },
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    isNew: false,
    isFeatured: false,
    tags: ['mirror', 'full-length', 'wall', 'classic'],
    brand: 'Renin',
  },
]

// Vector embeddings simulator (in production, use actual embeddings)
function calculateSimilarity(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Simple keyword matching for demo
  const queryWords = queryLower.split(' ')
  const textWords = textLower.split(' ')

  let matches = 0
  for (const qWord of queryWords) {
    if (textWords.includes(qWord) || textWords.some(tWord => tWord.includes(qWord))) {
      matches++
    }
  }

  return matches / queryWords.length
}

// Semantic search function
function semanticSearch(query: string, products: Product[]): Product[] {
  if (!query) return products

  const scoredProducts = products.map(product => {
    // Calculate relevance score based on multiple factors
    const nameScore = calculateSimilarity(query, product.name) * 3
    const descScore = calculateSimilarity(query, product.description) * 2
    const categoryScore = calculateSimilarity(query, product.category.replace('-', ' '))
    const tagsScore = product.tags ? calculateSimilarity(query, product.tags.join(' ')) * 1.5 : 0
    const featuresScore = calculateSimilarity(query, product.features.join(' '))

    const totalScore = nameScore + descScore + categoryScore + tagsScore + featuresScore

    return { product, score: totalScore }
  })

  // Sort by score and filter out low relevance
  return scoredProducts
    .filter(item => item.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
}

// Input validation schema
const searchSchema = z.object({
  query: z.string().max(100, 'Query too long').optional(),
  filters: z
    .object({
      categories: z.array(z.string()).optional(),
      priceRange: z
        .object({
          min: z.number().min(0),
          max: z.number().max(10000),
        })
        .optional(),
      inStock: z.boolean().optional(),
      onSale: z.boolean().optional(),
      styles: z.array(z.string()).optional(),
    })
    .optional(),
  sort: z
    .object({
      field: z.enum(['price', 'name', 'rating', 'popularity', 'featured']),
      order: z.enum(['asc', 'desc']),
    })
    .optional(),
  page: z.coerce.number().int().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

async function handleSearchRequest(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const rateLimitResult = await checkRateLimit(getClientIdentifier(request), generalRateLimiter)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many search requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        },
      }
    )
  }

  try {
    const body = (await request.json()) as unknown

    // Validate input
    const validation = searchSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          details: validation.error.errors[0]?.message,
        },
        { status: 400 }
      )
    }

    const {
      query = '',
      filters = {},
      sort = { field: 'featured', order: 'desc' },
      page = 1,
      limit = 24,
    } = validation.data

    // Start with all products
    let filteredProducts = [...SAMPLE_PRODUCTS]

    // Apply semantic search if query is provided
    if (query) {
      filteredProducts = semanticSearch(query, filteredProducts)
    }

    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      const categories = filters.categories
      filteredProducts = filteredProducts.filter(p => categories.includes(p.category))
    }

    if (filters.priceRange) {
      const priceRange = filters.priceRange
      filteredProducts = filteredProducts.filter(p => {
        const price = p.salePrice || p.price
        const minPrice = priceRange.min * 100
        const maxPrice = priceRange.max * 100
        return price >= minPrice && price <= maxPrice
      })
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.inStock)
    }

    if (filters.onSale) {
      filteredProducts = filteredProducts.filter(p => p.salePrice !== undefined)
    }

    if (filters.styles && filters.styles.length > 0) {
      const styles = filters.styles
      filteredProducts = filteredProducts.filter(p => {
        const productStyle = p.specifications?.style
        return productStyle && styles.includes(String(productStyle))
      })
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const order = sort.order === 'asc' ? 1 : -1

      switch (sort.field) {
        case 'price':
          return ((a.salePrice || a.price) - (b.salePrice || b.price)) * order
        case 'name':
          return a.name.localeCompare(b.name) * order
        case 'rating':
          return (b.rating - a.rating) * order
        case 'popularity':
          return (b.reviewCount - a.reviewCount) * order
        case 'featured':
        default:
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return 0
      }
    })

    // Calculate facets
    const facets = {
      categories: Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category))).map(cat => ({
        id: cat,
        name: cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: SAMPLE_PRODUCTS.filter(p => p.category === cat).length,
      })),
      brands: Array.from(
        new Set(SAMPLE_PRODUCTS.map(p => p.brand).filter((b): b is string => !!b))
      ).map(brand => ({
        value: brand,
        count: SAMPLE_PRODUCTS.filter(p => p.brand === brand).length,
      })),
      priceRanges: [
        {
          range: 'under-300',
          count: SAMPLE_PRODUCTS.filter(p => p.price < 30000).length,
          min: 0,
          max: 299,
        },
        {
          range: '300-500',
          count: SAMPLE_PRODUCTS.filter(p => p.price >= 30000 && p.price < 50000).length,
          min: 300,
          max: 499,
        },
        {
          range: '500-700',
          count: SAMPLE_PRODUCTS.filter(p => p.price >= 50000 && p.price < 70000).length,
          min: 500,
          max: 699,
        },
        {
          range: 'over-700',
          count: SAMPLE_PRODUCTS.filter(p => p.price >= 70000).length,
          min: 700,
          max: 10000,
        },
      ],
      tags: Array.from(new Set(SAMPLE_PRODUCTS.flatMap(p => p.tags || [])))
        .map(tag => ({
          value: tag,
          count: SAMPLE_PRODUCTS.filter(p => p.tags?.includes(tag)).length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
      inStock: {
        available: SAMPLE_PRODUCTS.filter(p => p.inStock).length,
        outOfStock: SAMPLE_PRODUCTS.filter(p => !p.inStock).length,
      },
    }

    // Paginate results
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedProducts = filteredProducts.slice(start, end)

    const result: ProductSearchResult = {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
      facets,
    }

    // Add search metadata
    const resultWithMeta = {
      ...result,
      searchMeta: {
        query,
        filters,
        sort,
        processingTimeMs: Date.now(),
        rateLimitRemaining: rateLimitResult.remaining - 1,
      },
    }

    return NextResponse.json(resultWithMeta)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}

// Export secure handlers
export const POST = createSecureHandler(handleSearchRequest, {
  rateLimit: { maxRequests: 20, windowMs: 60000 },
})

// GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Validate query parameters
  const query = searchParams.get('q')?.substring(0, 100) || ''
  const category = searchParams.get('category')?.substring(0, 50) || ''
  const page = Math.min(Math.max(parseInt(searchParams.get('page') || '1'), 1), 100)
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24'), 1), 50)

  const filters: SearchFilters = {}
  if (category) {
    filters.categories = [category]
  }

  // Create a POST request with the query parameters
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      filters,
      page,
      limit,
    }),
  })

  return handleSearchRequest(postRequest)
}
