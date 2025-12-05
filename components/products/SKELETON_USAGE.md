# Product Skeleton Components Usage Guide

This guide demonstrates how to use the various product skeleton components for loading states.

## Available Skeleton Components

### 1. ProductCardSkeleton
Use for standard product grid cards.

```tsx
import { ProductCardSkeleton } from '@/components/products'

// In your component
<ProductCardSkeleton />
```

### 2. ProductCardCompactSkeleton
Use for smaller product cards in dense grids.

```tsx
import { ProductCardCompactSkeleton } from '@/components/products'

<ProductCardCompactSkeleton />
```

### 3. ProductCardFeaturedSkeleton
Use for large featured product cards.

```tsx
import { ProductCardFeaturedSkeleton } from '@/components/products'

<ProductCardFeaturedSkeleton />
```

### 4. ProductCardHorizontalSkeleton
Use for product list view cards.

```tsx
import { ProductCardHorizontalSkeleton } from '@/components/products'

<ProductCardHorizontalSkeleton />
```

### 5. ProductGallerySkeleton
Use for product image gallery loading.

```tsx
import { ProductGallerySkeleton } from '@/components/products'

<ProductGallerySkeleton />
```

### 6. ProductDetailSkeleton
Use for full product detail page loading.

```tsx
import { ProductDetailSkeleton } from '@/components/products'

// This includes gallery, info, reviews, and related products
<ProductDetailSkeleton />
```

### 7. ProductListSkeleton
Use for product listing pages with filters and grid/list toggle.

```tsx
import { ProductListSkeleton } from '@/components/products'

// Grid layout (default)
<ProductListSkeleton count={12} layout="grid" />

// List layout
<ProductListSkeleton count={8} layout="list" />
```

### 8. ProductQuickViewSkeleton
Use for quick view modal loading states.

```tsx
import { ProductQuickViewSkeleton } from '@/components/products'

<ProductQuickViewSkeleton />
```

### 9. ProductComparisonSkeleton
Use for product comparison loading.

```tsx
import { ProductComparisonSkeleton } from '@/components/products'

// Compare 3 products (default)
<ProductComparisonSkeleton count={3} />
```

## Common Usage Patterns

### Product Grid Page

```tsx
'use client'

import { Suspense } from 'react'
import { ProductCard, ProductCardSkeleton } from '@/components/products'

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Suspense fallback={
        <>
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </>
      }>
        <ProductGrid />
      </Suspense>
    </div>
  )
}
```

### Product Detail Page

```tsx
'use client'

import { Suspense } from 'react'
import { ProductDetailSkeleton } from '@/components/products'

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail slug={params.slug} />
      </Suspense>
    </div>
  )
}
```

### Product List with Filters

```tsx
'use client'

import { Suspense } from 'react'
import { ProductListSkeleton } from '@/components/products'

export default function CategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductListSkeleton count={12} layout="grid" />}>
        <FilterableProductList />
      </Suspense>
    </div>
  )
}
```

### With React Query / SWR

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { ProductCard, ProductCardSkeleton } from '@/components/products'

export function ProductGrid() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Next.js App Router Loading States

```tsx
// app/products/loading.tsx
import { ProductListSkeleton } from '@/components/products'

export default function Loading() {
  return <ProductListSkeleton count={12} layout="grid" />
}
```

```tsx
// app/products/[slug]/loading.tsx
import { ProductDetailSkeleton } from '@/components/products'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailSkeleton />
    </div>
  )
}
```

## Customization

All skeleton components accept a `className` prop for custom styling:

```tsx
<ProductCardSkeleton className="border border-gray-200 p-4" />
```

## Base Skeleton Component

All product skeletons use the base `Skeleton` component from `@/components/ui/skeleton`:

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Custom skeleton usage
<Skeleton className="h-12 w-full rounded-lg" />
```

## Animation

All skeletons include a subtle pulse animation by default using Tailwind's `animate-pulse` utility class.
