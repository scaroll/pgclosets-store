import { SAMPLE_PRODUCTS } from '@/lib/products'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const maxDuration = 10

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, filters = {}, limit = 5 } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      )
    }

    // AI disabled: always use fallback search
    return fallbackSearch(query, filters, limit)
  } catch (error) {
    console.error('[AI Search] Error:', error)

    // Fallback to simple search on error
    const body = await req.json().catch(() => ({}))
    return fallbackSearch(body.query || '', body.filters || {}, body.limit || 5)
  }
}

/**
 * Fallback search when AI is not available
 */
function fallbackSearch(query: string, filters: any, limit: number) {
  let results = [...SAMPLE_PRODUCTS]

  // Simple text search
  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(p => {
      const searchText =
        `${p.name} ${p.description} ${p.category} ${p.features.join(' ')}`.toLowerCase()
      return searchText.includes(lowerQuery)
    })
  }

  // Apply filters
  if (filters.category) {
    results = results.filter(p => p.category === filters.category)
  }
  if (filters.maxPrice) {
    results = results.filter(p => p.price <= filters.maxPrice)
  }
  if (filters.minPrice) {
    results = results.filter(p => p.price >= filters.minPrice)
  }

  results = results.slice(0, limit)

  return NextResponse.json({
    success: true,
    query,
    interpreted: {
      category: filters.category,
      priceRange:
        filters.minPrice || filters.maxPrice
          ? {
              min: filters.minPrice || 0,
              max: filters.maxPrice || 10000,
            }
          : undefined,
    },
    filters: [],
    products: results,
    count: results.length,
    sortBy: 'relevance',
    fallback: true,
  })
}
