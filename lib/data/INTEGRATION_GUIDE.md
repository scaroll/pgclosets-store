# Integration Guide: JSON Product Data Access Layer

This guide shows how to integrate the JSON product data access layer into your existing PG Closets codebase.

## Quick Start

```typescript
// Import the functions you need
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductCategories,
  getFeaturedProducts,
} from '@/lib/data/products-json'
```

## Integration with Existing `/lib/products.ts`

### Current Structure

Your existing `/lib/products.ts` already has a database-first approach with JSON fallback. The new utility can be integrated seamlessly.

### Recommended Integration

**Option 1: Replace existing JSON fallback** (Recommended)

Update `/lib/products.ts` to use the new utility:

```typescript
// lib/products.ts
import { prisma } from './prisma'
import {
  getAllProducts as getJsonProducts,
  getProductBySlug as getJsonProductBySlug,
  getProductsByCategory as getJsonProductsByCategory,
} from './data/products-json'

export async function getProduct(slug: string) {
  try {
    // Try database first
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (product) {
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0

      return { ...product, averageRating, reviewCount: product.reviews.length }
    }

    // Fallback to JSON if not found in database
    return getJsonProductBySlug(slug)
  } catch (error) {
    // Database error - use JSON fallback
    console.warn('Database unavailable, using JSON fallback:', error)
    return getJsonProductBySlug(slug)
  }
}

export async function getProducts(options?: {
  categoryId?: string
  category?: string
  featured?: boolean
  bestseller?: boolean
  limit?: number
  skip?: number
}) {
  const { categoryId, category, featured, bestseller, limit, skip } = options || {}

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(featured !== undefined && { featured }),
        ...(bestseller !== undefined && { bestseller }),
        inStock: true,
      },
      include: {
        category: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
    })

    if (products.length > 0) {
      return products.map((product) => ({
        ...product,
        averageRating:
          product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            : 0,
        reviewCount: product.reviews.length,
      }))
    }

    // Fallback to JSON
    let jsonProducts = category
      ? getJsonProductsByCategory(category as any)
      : getJsonProducts()

    if (featured) {
      jsonProducts = jsonProducts.filter((p) => p.isFeatured)
    }

    if (limit) {
      jsonProducts = jsonProducts.slice(skip || 0, (skip || 0) + limit)
    }

    return jsonProducts
  } catch (error) {
    console.warn('Database unavailable, using JSON fallback:', error)

    let jsonProducts = category
      ? getJsonProductsByCategory(category as any)
      : getJsonProducts()

    if (featured) {
      jsonProducts = jsonProducts.filter((p) => p.isFeatured)
    }

    if (limit) {
      jsonProducts = jsonProducts.slice(skip || 0, (skip || 0) + limit)
    }

    return jsonProducts
  }
}
```

**Option 2: Keep both** (For gradual migration)

Keep the existing implementation and add new functions:

```typescript
// lib/products.ts

// Existing functions remain unchanged...

// Add new exports from JSON utility
export {
  getAllProducts as getAllProductsFromJson,
  getProductBySlug as getProductBySlugFromJson,
  getProductsByCategory as getProductsByCategoryFromJson,
  getProductCategories,
  getFeaturedProducts as getFeaturedProductsFromJson,
  getNewProducts,
  searchProducts,
  getProductStats,
} from './data/products-json'
```

## Usage in Server Components

### Product Listing Page

```typescript
// app/(shop)/products/page.tsx
import { getProducts } from '@/lib/products'
import ProductGrid from '@/components/products/product-grid'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; featured?: string }
}) {
  const products = await getProducts({
    category: searchParams.category,
    featured: searchParams.featured === 'true',
    limit: 20,
  })

  return (
    <div>
      <h1>Our Products</h1>
      <ProductGrid products={products} />
    </div>
  )
}
```

### Product Detail Page

```typescript
// app/(shop)/products/[slug]/page.tsx
import { getProduct } from '@/lib/products'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/products/product-detail'

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

// Static generation
export async function generateStaticParams() {
  const { getAllProducts } = await import('@/lib/data/products-json')
  const products = getAllProducts()

  return products.map((product) => ({
    slug: product.slug,
  }))
}
```

### Category Page

```typescript
// app/(shop)/collections/[category]/page.tsx
import { getProducts } from '@/lib/products'
import ProductGrid from '@/components/products/product-grid'

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const products = await getProducts({
    category: params.category,
  })

  return (
    <div>
      <h1>{params.category}</h1>
      <ProductGrid products={products} />
    </div>
  )
}
```

## Usage in API Routes

### Search API

```typescript
// app/api/products/search/route.ts
import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/data/products-json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  const results = searchProducts(query)

  return NextResponse.json({
    query,
    results,
    total: results.length,
  })
}
```

### Product Stats API

```typescript
// app/api/products/stats/route.ts
import { NextResponse } from 'next/server'
import { getProductStats } from '@/lib/data/products-json'

export async function GET() {
  const stats = getProductStats()
  return NextResponse.json(stats)
}
```

## Usage in Client Components

### Product Search

```typescript
'use client'

import { useState, useEffect } from 'react'

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    // Call API route that uses the JSON utility
    fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.results))
  }, [query])

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <div>
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

## Environment-Based Configuration

For environments without database access:

```typescript
// lib/products-env.ts
const USE_DATABASE = process.env.DATABASE_URL && process.env.NODE_ENV !== 'test'

export async function getProduct(slug: string) {
  if (!USE_DATABASE) {
    // Use JSON only
    const { getProductBySlug } = await import('@/lib/data/products-json')
    return getProductBySlug(slug)
  }

  // Use database with JSON fallback
  const { getProduct: getProductFromDb } = await import('@/lib/products')
  return getProductFromDb(slug)
}
```

## Testing

### Unit Tests

```typescript
// __tests__/products-json.test.ts
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductCategories,
} from '@/lib/data/products-json'

describe('JSON Product Data Access Layer', () => {
  it('should get all products', () => {
    const products = getAllProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  it('should get product by slug', () => {
    const product = getProductBySlug('renin-modern-barn-door-black')
    expect(product).toBeDefined()
    expect(product?.name).toContain('Modern Barn Door')
  })

  it('should get products by category', () => {
    const barnDoors = getProductsByCategory('barn-doors')
    expect(barnDoors.length).toBeGreaterThan(0)
    barnDoors.forEach((product) => {
      expect(product.category).toBe('barn-doors')
    })
  })

  it('should get all categories', () => {
    const categories = getProductCategories()
    expect(categories).toContain('barn-doors')
    expect(categories).toContain('bifold-doors')
  })
})
```

## Performance Optimization

### Memoization

```typescript
// lib/data/products-json-cached.ts
import { cache } from 'react'
import * as productsJson from './products-json'

export const getAllProducts = cache(productsJson.getAllProducts)
export const getProductBySlug = cache(productsJson.getProductBySlug)
export const getProductsByCategory = cache(productsJson.getProductsByCategory)
export const getProductCategories = cache(productsJson.getProductCategories)
```

### Lazy Loading

```typescript
// Only import when needed
async function getProductsLazy() {
  const { getAllProducts } = await import('@/lib/data/products-json')
  return getAllProducts()
}
```

## Migration Checklist

- [ ] Review existing `/lib/products.ts` implementation
- [ ] Decide on integration approach (replace vs. keep both)
- [ ] Update imports in server components
- [ ] Update API routes to use new utilities
- [ ] Test with database unavailable (set `DATABASE_URL=""`)
- [ ] Test static site generation
- [ ] Update tests to use new utilities
- [ ] Add caching if needed for performance
- [ ] Document usage for team members

## Common Issues

### Issue: "Cannot find module @/data/renin-products.json"

**Solution**: Ensure `tsconfig.json` has `"resolveJsonModule": true`

### Issue: Type errors with ProductCategory

**Solution**: Import the type: `import type { ProductCategory } from '@/types/product'`

### Issue: Slow performance with large datasets

**Solution**: Use the cached version or implement pagination

## Support

For questions or issues, refer to:
- Main documentation: `/lib/data/README.md`
- Example usage: `/lib/data/products-json.example.ts`
- Test script: `/scripts/test-products-json.mjs`
