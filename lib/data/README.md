# JSON Product Data Access Layer

This directory contains the JSON-based product data access layer that serves as a fallback when the database is unavailable.

## Files

- **`products-json.ts`** - Main utility module with data access functions
- **`products-json.example.ts`** - Example usage and integration patterns
- **`categories.ts`** - Category definitions and utilities

## Overview

The `products-json.ts` utility provides a complete data access layer for product information using JSON files as the data source. This is particularly useful for:

- Development environments without database access
- Fallback when database connections fail
- Static site generation (SSG)
- Fast prototyping and testing
- Offline development

## Data Source

The utility imports product data from `/data/renin-products.json` and transforms it to match the `Product` interface defined in `/types/product.ts`.

## Available Functions

### Core Functions

#### `getAllProducts(): Product[]`
Returns all products from the JSON data.

```typescript
import { getAllProducts } from '@/lib/data/products-json'

const products = getAllProducts()
console.log(`Total products: ${products.length}`)
```

#### `getProductBySlug(slug: string): Product | null`
Finds and returns a single product by its slug.

```typescript
import { getProductBySlug } from '@/lib/data/products-json'

const product = getProductBySlug('renin-modern-barn-door-black')
if (product) {
  console.log(product.name, product.price)
}
```

#### `getProductsByCategory(category: ProductCategory): Product[]`
Returns all products in a specific category.

```typescript
import { getProductsByCategory } from '@/lib/data/products-json'

const barnDoors = getProductsByCategory('barn-doors')
const bifoldDoors = getProductsByCategory('bifold-doors')
```

#### `getProductCategories(): ProductCategory[]`
Returns all unique product categories.

```typescript
import { getProductCategories } from '@/lib/data/products-json'

const categories = getProductCategories()
// ['barn-doors', 'bifold-doors', 'bypass-doors', ...]
```

### Helper Functions

#### `getFeaturedProducts(limit?: number): Product[]`
Returns featured products, optionally limited to a specific count.

```typescript
import { getFeaturedProducts } from '@/lib/data/products-json'

const top5Featured = getFeaturedProducts(5)
```

#### `getNewProducts(limit?: number): Product[]`
Returns new products, optionally limited to a specific count.

```typescript
import { getNewProducts } from '@/lib/data/products-json'

const latestProducts = getNewProducts(10)
```

#### `searchProducts(query: string): Product[]`
Searches products by name, description, brand, or tags.

```typescript
import { searchProducts } from '@/lib/data/products-json'

const results = searchProducts('modern barn')
```

#### `getProductsByIds(ids: string[]): Product[]`
Returns products matching the provided IDs.

```typescript
import { getProductsByIds } from '@/lib/data/products-json'

const relatedProducts = getProductsByIds([
  'renin-barn-modern-01',
  'renin-barn-rustic-01'
])
```

#### `getProductStats()`
Returns statistics about the product catalog.

```typescript
import { getProductStats } from '@/lib/data/products-json'

const stats = getProductStats()
console.log(stats)
// {
//   total: 69,
//   inStock: 65,
//   outOfStock: 4,
//   featured: 12,
//   new: 8,
//   byCategory: {
//     'barn-doors': 32,
//     'bifold-doors': 15,
//     ...
//   }
// }
```

## Integration Patterns

### Pattern 1: Database with JSON Fallback

```typescript
// lib/products-with-fallback.ts
import { prisma } from '@/lib/prisma'
import { getAllProducts, getProductBySlug } from '@/lib/data/products-json'

export async function getProduct(slug: string) {
  try {
    // Try database first
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, variants: true }
    })

    if (product) return product

    // Fallback to JSON if not found
    return getProductBySlug(slug)
  } catch (error) {
    // Database error - use JSON fallback
    console.warn('Database unavailable, using JSON fallback:', error)
    return getProductBySlug(slug)
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    })

    if (products.length > 0) return products

    // Fallback to JSON if empty
    return getAllProducts()
  } catch (error) {
    console.warn('Database unavailable, using JSON fallback:', error)
    return getAllProducts()
  }
}
```

### Pattern 2: Next.js Server Component

```typescript
// app/(shop)/products/page.tsx
import { getAllProducts, getProductsByCategory } from '@/lib/data/products-json'

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  const products = searchParams.category
    ? getProductsByCategory(searchParams.category as any)
    : getAllProducts()

  return (
    <div>
      <h1>Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### Pattern 3: Next.js API Route

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { getAllProducts, searchProducts } from '@/lib/data/products-json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  const products = query
    ? searchProducts(query)
    : getAllProducts()

  return NextResponse.json({
    products,
    total: products.length
  })
}
```

### Pattern 4: Static Site Generation

```typescript
// app/(shop)/products/[slug]/page.tsx
import { getAllProducts, getProductBySlug } from '@/lib/data/products-json'

// Generate static paths for all products
export async function generateStaticParams() {
  const products = getAllProducts()

  return products.map(product => ({
    slug: product.slug
  }))
}

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
```

## Data Transformation

The utility transforms JSON product data to match the `Product` interface:

### Price Conversion
- JSON prices are in CAD dollars (e.g., `489`)
- Transformed to cents (e.g., `48900`)

### Category Mapping
- JSON categories (e.g., `"barn-doors"`) are mapped to `ProductCategory` type
- Supports: `barn-doors`, `bifold-doors`, `bypass-doors`, `pivot-doors`, `room-dividers`, `hardware`, `mirrors`

### Image Extraction
- Media array is filtered for `hero`, `detail`, and `gallery` roles
- URLs are extracted into a simple string array

### Variant Transformation
- JSON variants are converted to `ProductVariant` format
- Prices converted to cents
- Inventory status mapped from availability
- Options extracted from variant properties

### Specifications
- All specification fields are flattened into a `Record<string, string | number>`
- Dimensions are extracted and formatted (e.g., `"42 inches"`)
- Attributes are merged into specifications

## Type Safety

All functions are fully typed with TypeScript interfaces:
- Return types match the `Product` interface from `/types/product.ts`
- Category parameters use the `ProductCategory` union type
- Null safety with `Product | null` return types where appropriate

## Performance Considerations

- **Caching**: Consider implementing memoization for frequently accessed data
- **Lazy Loading**: Import only when needed to reduce initial bundle size
- **Filtering**: Filter operations create new arrays - consider pagination for large datasets
- **Search**: Linear search implementation - suitable for catalogs under 1000 products

## Testing

See `products-json.example.ts` for comprehensive usage examples and integration patterns.

## Maintenance

When updating the JSON data source:

1. Ensure `/data/renin-products.json` follows the expected structure
2. Verify all required fields are present (id, slug, name, variants, etc.)
3. Test transformation with `getAllProducts()` to ensure no errors
4. Run type checking: `npm run type-check`

## Future Enhancements

Potential improvements:
- [ ] Add pagination support
- [ ] Implement advanced filtering (price range, multiple categories)
- [ ] Add sorting options (price, name, date, popularity)
- [ ] Cache transformed products for better performance
- [ ] Support for multiple JSON data sources
- [ ] Add data validation with Zod or similar
