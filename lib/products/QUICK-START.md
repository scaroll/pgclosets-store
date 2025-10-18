# Product Data System - Quick Start Guide

## 5-Minute Setup

### Step 1: Initialize the Store

```typescript
// In your app/layout.tsx or initialization file
import { initializeStore } from '@/lib/products'

export default async function RootLayout({ children }) {
  // Initialize product data on app startup
  await initializeStore()

  return <html>{children}</html>
}
```

### Step 2: Use in Your Pages

```typescript
// app/products/page.tsx
import { searchProducts } from '@/lib/products'

export default async function ProductsPage({ searchParams }) {
  const results = searchProducts(
    {
      query: searchParams.q,
      inStock: true,
      status: ['active']
    },
    searchParams.sort || 'relevance',
    { page: parseInt(searchParams.page) || 1, limit: 24 }
  )

  return (
    <div>
      <h1>Products ({results.total})</h1>
      <ProductGrid products={results.products} />
      <Pagination {...results} />
    </div>
  )
}
```

### Step 3: Product Detail Page

```typescript
// app/products/[handle]/page.tsx
import { getProductByHandle, getProductVariants } from '@/lib/products'

export default async function ProductPage({ params }) {
  const product = getProductByHandle(params.handle)
  if (!product) notFound()

  const variants = getProductVariants(product.id)

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <VariantSelector variants={variants} />
      <AddToCartButton product={product} />
    </div>
  )
}
```

## Common Use Cases

### Search with Filters

```typescript
import { searchProducts } from '@/lib/products'

// Basic search
const results = searchProducts({
  query: 'barn door',
  inStock: true
})

// Advanced filtering
const filtered = searchProducts({
  categoryIds: ['barn-doors'],
  priceMin: 30000, // $300 in cents
  priceMax: 70000, // $700 in cents
  tags: ['rustic'],
  featured: true
})
```

### Get Products by Category

```typescript
import { getProductsByCategory } from '@/lib/products'

// Get all products in category
const products = getProductsByCategory('barn-doors')

// Include subcategories
const allDoors = getProductsByCategory('doors', true)
```

### Calculate Pricing

```typescript
import { calculatePrice } from '@/lib/products'

const pricing = calculatePrice(49900, { // $499 in cents
  variantId: 'var_1',
  quantity: 1,
  customerType: 'contractor', // 15% discount
  taxRate: 0.13 // 13% HST
})

console.log(pricing.formatted.total) // "$424.25"
console.log(pricing.formatted.savings) // "$74.75"
```

### Get Featured Products

```typescript
import { getFeaturedProducts } from '@/lib/products'

// Homepage featured section
const featured = getFeaturedProducts(8)
```

### Get Related Products

```typescript
import { getRelatedProducts } from '@/lib/products'

// Product detail page "You may also like"
const related = getRelatedProducts(product.id, 4)
```

## Cheat Sheet

### Product Lookups

| Function | Usage | Returns |
|----------|-------|---------|
| `getProduct(id)` | Get by ID | `Product \| undefined` |
| `getProductByHandle(slug)` | Get by URL slug | `Product \| undefined` |
| `getProductBySKU(sku)` | Get by SKU | `Product \| undefined` |

### Search & Filter

| Function | Usage |
|----------|-------|
| `searchProducts(filter, sort?, pagination?)` | Search with filters |
| `getFeaturedProducts(limit?)` | Get featured |
| `getNewArrivals(limit?)` | Get newest |
| `getBestSellers(limit?)` | Get best selling |

### Categories

| Function | Usage |
|----------|-------|
| `getCategory(id)` | Get category |
| `getCategoryTree()` | Get hierarchy |
| `getProductsByCategory(id, includeSubcategories?)` | Get category products |

### Utilities

| Function | Usage |
|----------|-------|
| `formatPrice(cents, locale?)` | Format for display |
| `calculatePrice(basePrice, context)` | Calculate with discounts |
| `generateSKU(config, sequence, category?, variant?)` | Generate SKU |

## Filter Options

```typescript
interface ProductFilter {
  // Text search
  query?: string

  // Category
  categoryIds?: string[]
  categoryPath?: string[] // Include subcategories

  // Collections
  collectionIds?: string[]

  // Price (in cents)
  priceMin?: number
  priceMax?: number

  // Attributes
  brand?: string[]
  tags?: string[]

  // Availability
  inStock?: boolean
  onSale?: boolean
  featured?: boolean

  // Status
  status?: Array<'draft' | 'active' | 'archived' | 'discontinued'>
}
```

## Sort Options

```typescript
type ProductSort =
  | 'relevance'    // Best match (default with query)
  | 'price-asc'    // Price: Low to High
  | 'price-desc'   // Price: High to Low
  | 'name-asc'     // Name: A to Z
  | 'name-desc'    // Name: Z to A
  | 'newest'       // Recently Added
  | 'bestselling'  // Best Sellers
  | 'rating'       // Highest Rated
  | 'featured'     // Featured First
```

## Price Handling

**Important**: All prices are stored in cents!

```typescript
// ❌ Wrong
product.basePrice = 499 // This is $4.99

// ✅ Correct
product.basePrice = 49900 // This is $499.00

// Display with formatPrice
formatPrice(49900) // "$499"
```

## Migration

Run once to migrate Renin data:

```bash
# Option 1: In your app initialization
await initializeStore()

# Option 2: Export to JSON files
node -e "require('./lib/products/migrate-renin-data').exportMigratedData('./migrated-data')"
```

## Troubleshooting

### Store Not Initialized

```typescript
// ❌ Error: Cannot read properties of undefined
const product = getProduct('prod_1')

// ✅ Solution: Initialize first
await initializeStore()
const product = getProduct('prod_1')
```

### No Search Results

```typescript
// ❌ Too restrictive
searchProducts({ status: ['published'] }) // No 'published' status

// ✅ Use correct status
searchProducts({ status: ['active'] })
```

### Price Range Not Working

```typescript
// ❌ Using dollars
searchProducts({ priceMin: 300, priceMax: 700 }) // $3-$7

// ✅ Using cents
searchProducts({ priceMin: 30000, priceMax: 70000 }) // $300-$700
```

## Category IDs Reference

### Root Categories
- `doors` - All door types
- `hardware` - Hardware & accessories
- `mirrors` - Mirror products

### Door Types
- `barn-doors` - Barn door systems
- `bypass-doors` - Bypass closet doors
- `bifold-doors` - Bifold doors
- `pivot-doors` - Pivot door systems
- `sliding-doors` - Sliding doors

### Hardware Types
- `barn-hardware` - Barn door hardware
- `handles-pulls` - Handles & pulls
- `track-systems` - Track systems

### Mirror Types
- `backlit-mirrors` - LED backlit mirrors
- `closet-mirrors` - Closet mirrors

## Collection IDs

- `coll_new` - New arrivals
- `coll_bestsellers` - Best sellers
- `coll_premium` - Premium products
- `coll_featured` - Featured products

## Example Components

### Product Card

```typescript
import { formatPrice } from '@/lib/products'

function ProductCard({ product }) {
  return (
    <div>
      <img src={product.images[0]} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{formatPrice(product.basePrice)}</p>
      <Link href={`/products/${product.handle}`}>View Details</Link>
    </div>
  )
}
```

### Filter Sidebar

```typescript
function FilterSidebar({ facets, onFilterChange }) {
  return (
    <div>
      {/* Categories */}
      <div>
        <h4>Categories</h4>
        {facets.categories.map(cat => (
          <label key={cat.id}>
            <input type="checkbox" onChange={() => onFilterChange('category', cat.id)} />
            {cat.name} ({cat.count})
          </label>
        ))}
      </div>

      {/* Price Ranges */}
      <div>
        <h4>Price</h4>
        {facets.priceRanges.map(range => (
          <label key={range.range}>
            <input type="radio" name="price" onChange={() => onFilterChange('price', range)} />
            ${range.min} - ${range.max === Infinity ? '+' : range.max} ({range.count})
          </label>
        ))}
      </div>

      {/* Brands */}
      <div>
        <h4>Brand</h4>
        {facets.brands.map(brand => (
          <label key={brand.value}>
            <input type="checkbox" onChange={() => onFilterChange('brand', brand.value)} />
            {brand.value} ({brand.count})
          </label>
        ))}
      </div>
    </div>
  )
}
```

### Search Bar with Autocomplete

```typescript
'use client'

import { useState, useMemo } from 'react'
import { searchProducts } from '@/lib/products'

function SearchBar() {
  const [query, setQuery] = useState('')

  const results = useMemo(
    () => query.length > 2
      ? searchProducts({ query, status: ['active'] }, 'relevance', { page: 1, limit: 5 })
      : null,
    [query]
  )

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {results && results.products.length > 0 && (
        <div className="autocomplete">
          {results.products.map(product => (
            <Link key={product.id} href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Performance Tips

1. **Use caching for expensive operations**
   ```typescript
   import { cache } from 'react'
   const getCachedProducts = cache(() => getProductsByCategory('barn-doors'))
   ```

2. **Always paginate large result sets**
   ```typescript
   searchProducts(filter, sort, { page: 1, limit: 24 })
   ```

3. **Use optimized images**
   ```typescript
   getOptimizedImageUrl(product.thumbnailId, 'card')
   ```

4. **Filter by status to reduce results**
   ```typescript
   searchProducts({ status: ['active'] }) // Only show active products
   ```

## Next Steps

1. ✅ Initialize store in your app
2. ✅ Add product listing page
3. ✅ Add product detail page
4. ✅ Add category pages
5. ✅ Implement search functionality
6. ✅ Add filters and sorting
7. ✅ Optimize images
8. ✅ Add analytics tracking

## Need Help?

- 📖 Read [README.md](./README.md) for detailed usage
- 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- 💻 Check [product-data.ts](./product-data.ts) for type definitions
- 🔧 Run migration with debug logging

---

**Pro Tip**: Start with the examples above and customize based on your needs. All functions are fully typed with TypeScript for excellent IDE autocomplete!
