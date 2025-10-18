# Skeleton Screen Patterns - Implementation Guide

**Agent #13 Deliverable** - When and how to use each skeleton type

## Decision Matrix

### When to Use Which Skeleton

| Content Type | Skeleton Component | Use Case |
|--------------|-------------------|----------|
| Product card in grid | `ProductCardSkeleton` variant="grid" | Product listing pages, search results |
| Product in list view | `ProductCardSkeleton` variant="list" | Wishlist, comparison pages |
| Featured product | `ProductCardSkeleton` variant="featured" | Homepage hero, category pages |
| Full product page | `ProductDetailSkeleton` | Product detail pages (PDP) |
| Hero section | `HeroSkeleton` | Homepage, landing pages |
| Navigation menu | `NavigationSkeleton` | Site header during initial load |
| Form | `FormSkeleton` | Quote forms, contact forms |
| Data table | `TableSkeleton` | Admin dashboards, order history |
| Image gallery | `GallerySkeleton` | Product galleries, portfolios |
| Text content | `TextSkeleton` or `SmartSkeleton` | Blog posts, descriptions |
| Generic card | `CardSkeleton` | Reviews, testimonials, features |

## Pattern Library

### Pattern 1: Product Listing Page

**Scenario:** User navigates to /products or /collections/[slug]

```tsx
import { ProductGridSkeleton } from '@/components/ui/skeletons'

const ProductsPage = () => {
  const { state, data } = useLoadingState<Product[]>()

  // Show skeleton during loading
  if (state === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <ProductGridSkeleton count={12} />
      </div>
    )
  }

  // Render actual products
  return (
    <div className="grid grid-cols-4 gap-6">
      {data?.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
```

**Why:** Matches exact grid layout, prevents layout shift, maintains visual consistency.

### Pattern 2: Product Detail Page (PDP)

**Scenario:** User clicks on product card to view details

```tsx
import { ProductDetailSkeleton } from '@/components/ui/skeletons'

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const { state, data } = useLoadingState<Product>()

  useEffect(() => {
    execute(fetchProduct(params.slug))
  }, [params.slug])

  if (state === 'loading') {
    return <ProductDetailSkeleton showGallery showReviews showRelated />
  }

  return <ProductDetail product={data} />
}
```

**Why:** Comprehensive PDP skeleton prevents cumulative layout shift and maintains user context during navigation.

### Pattern 3: Infinite Scroll

**Scenario:** User scrolls to bottom of page to load more products

```tsx
import { ProductGridSkeleton } from '@/components/ui/skeletons'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const InfiniteProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { execute, isLoading } = useLoadingState()

  const loadMore = async () => {
    const newProducts = await execute(fetchProducts(page))
    setProducts(prev => [...prev, ...newProducts])
  }

  const { ref } = useInfiniteScroll({ onLoadMore: loadMore })

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Loading indicator at bottom */}
      {isLoading && (
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      )}

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-10" />
    </>
  )
}
```

**Why:** Shows loading indicator only for new content, keeps existing content visible, smooth user experience.

### Pattern 4: Search Results

**Scenario:** User types in search box, results update dynamically

```tsx
import { ProductCardSkeleton } from '@/components/ui/skeletons'
import { useDelayedLoading } from '@/lib/loading'

const SearchResults = ({ query }: { query: string }) => {
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Delay showing skeleton to prevent flash on fast searches
  const showSkeleton = useDelayedLoading(isSearching, 200)

  useEffect(() => {
    const searchProducts = async () => {
      setIsSearching(true)
      const data = await api.search(query)
      setResults(data)
      setIsSearching(false)
    }

    searchProducts()
  }, [query])

  if (showSkeleton) {
    return <ProductGridSkeleton count={8} />
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {results.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
```

**Why:** Delayed skeleton prevents flash on fast searches (< 200ms), improves perceived performance.

### Pattern 5: Form Submission

**Scenario:** User submits quote request form

```tsx
import { PremiumSpinner } from '@/components/ui/loaders'

const QuoteForm = () => {
  const { execute, isLoading } = useLoadingState()

  const handleSubmit = async (data: FormData) => {
    await execute(submitQuote(data))
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-charcoal-900 text-white rounded-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <PremiumSpinner size="sm" variant="copper" />
            Submitting...
          </span>
        ) : (
          'Get Free Quote'
        )}
      </button>
    </form>
  )
}
```

**Why:** Inline spinner in button provides immediate feedback, prevents double-submission.

### Pattern 6: Page Transition

**Scenario:** User navigates between pages

```tsx
import { PageSkeleton } from '@/components/ui/skeletons'
import { useRouter } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true)
    const handleComplete = () => setIsTransitioning(false)

    router.events?.on('routeChangeStart', handleStart)
    router.events?.on('routeChangeComplete', handleComplete)

    return () => {
      router.events?.off('routeChangeStart', handleStart)
      router.events?.off('routeChangeComplete', handleComplete)
    }
  }, [])

  if (isTransitioning) {
    return <PageSkeleton />
  }

  return children
}
```

**Why:** Provides visual continuity during navigation, prevents white flash between pages.

### Pattern 7: Optimistic UI Update

**Scenario:** User adds item to cart

```tsx
import { useOptimistic } from '@/lib/loading'
import { PulseLoader } from '@/components/ui/loaders'

const AddToCartButton = ({ product }: { product: Product }) => {
  const [cart, updateCart, isPending] = useOptimistic(
    currentCart,
    async (newCart) => await api.updateCart(newCart)
  )

  const addToCart = () => {
    updateCart(prev => [...prev, product])
  }

  return (
    <button
      onClick={addToCart}
      disabled={isPending}
      className="px-6 py-3 bg-charcoal-900 text-white rounded-lg"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <PulseLoader size="sm" color="white" />
          Adding...
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}
```

**Why:** Instant UI update provides immediate feedback, automatically rolls back on API failure.

## Skeleton Customization

### Matching Content Dimensions

Always match skeleton dimensions to actual content:

```tsx
// ✅ Good - Skeleton matches content
<div className="aspect-square">
  {isLoading ? (
    <Skeleton className="aspect-square" />
  ) : (
    <img src={product.image} alt={product.name} className="aspect-square" />
  )}
</div>

// ❌ Bad - Dimension mismatch causes layout shift
<div>
  {isLoading ? (
    <Skeleton className="h-40" />  // Wrong height
  ) : (
    <img src={product.image} alt={product.name} className="h-64" />
  )}
</div>
```

### Shimmer Timing

Stagger shimmer animations for list items:

```tsx
<div className="space-y-4">
  {Array.from({ length: 5 }).map((_, i) => (
    <ProductCardSkeleton
      key={i}
      style={{
        animationDelay: `${i * 50}ms`  // 50ms stagger
      }}
    />
  ))}
</div>
```

### Dark Mode Support

Skeletons automatically adapt to dark mode:

```tsx
// Skeleton colors defined in design system
const skeletonColors = {
  light: {
    base: 'bg-gray-200',
    shimmer: 'from-transparent via-white/60 to-transparent'
  },
  dark: {
    base: 'bg-gray-700',
    shimmer: 'from-transparent via-gray-600/40 to-transparent'
  }
}
```

## Performance Optimization

### Lazy Loading Skeletons

For off-screen content, delay skeleton rendering:

```tsx
import { useInView } from 'react-intersection-observer'

const LazyProductCard = ({ product }: { product: Product }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <div ref={ref}>
      {inView ? (
        <ProductCard {...product} />
      ) : (
        <ProductCardSkeleton />
      )}
    </div>
  )
}
```

### Skeleton Memoization

Prevent unnecessary re-renders:

```tsx
const MemoizedSkeleton = React.memo(ProductCardSkeleton)

// Use memoized version in lists
<div className="grid grid-cols-4 gap-6">
  {Array.from({ length: 12 }).map((_, i) => (
    <MemoizedSkeleton key={i} />
  ))}
</div>
```

## Accessibility Guidelines

### Screen Reader Announcements

All skeletons include proper ARIA attributes:

```tsx
<div
  role="status"
  aria-label="Loading product information"
  aria-live="polite"
>
  <ProductCardSkeleton />
  <span className="sr-only">Loading products, please wait</span>
</div>
```

### Loading State Communication

Communicate loading progress to users:

```tsx
<div
  role="status"
  aria-label="Loading products, 8 of 12 loaded"
  aria-live="polite"
>
  {/* Content */}
</div>
```

## Testing Skeleton Screens

### Visual Regression Testing

```tsx
describe('ProductCardSkeleton', () => {
  it('matches product card dimensions', () => {
    const { container: skeletonContainer } = render(<ProductCardSkeleton />)
    const { container: cardContainer } = render(<ProductCard {...mockProduct} />)

    const skeletonHeight = skeletonContainer.firstChild.offsetHeight
    const cardHeight = cardContainer.firstChild.offsetHeight

    expect(skeletonHeight).toBe(cardHeight)
  })
})
```

### Performance Testing

```tsx
describe('Performance', () => {
  it('renders skeleton in <100ms', () => {
    const startTime = performance.now()
    render(<ProductGridSkeleton count={12} />)
    const renderTime = performance.now() - startTime

    expect(renderTime).toBeLessThan(100)
  })
})
```

## Common Pitfalls

### ❌ Avoid These Mistakes

1. **Dimension Mismatch**
   ```tsx
   // Wrong - causes layout shift
   {isLoading ? <div className="h-20" /> : <div className="h-40" />}
   ```

2. **No Minimum Loading Time**
   ```tsx
   // Wrong - causes flash
   {isLoading && <Skeleton />}

   // Right - delayed appearance
   {useDelayedLoading(isLoading, 200) && <Skeleton />}
   ```

3. **Blank White Screen**
   ```tsx
   // Wrong - shows nothing
   if (isLoading) return null

   // Right - shows skeleton
   if (isLoading) return <ProductGridSkeleton />
   ```

4. **No Stagger Animation**
   ```tsx
   // Wrong - all animate together
   {items.map((_, i) => <Skeleton key={i} />)}

   // Right - staggered animation
   {items.map((_, i) => (
     <Skeleton key={i} style={{ animationDelay: `${i * 50}ms` }} />
   ))}
   ```

## Quick Reference

| Skeleton Type | Loading Time | CLS Target | Stagger |
|--------------|--------------|------------|---------|
| ProductCard | 400-800ms | 0 | 50ms |
| ProductDetail | 600-1200ms | 0 | 80ms |
| Hero | 300-600ms | 0 | N/A |
| Navigation | 200-400ms | 0 | N/A |
| Form | 300-600ms | 0 | 100ms |
| Gallery | 500-1000ms | 0 | 100ms |
| Text | 200-400ms | 0 | N/A |

---

**Created by Agent #13** - Part of the 50-agent PG Closets website upgrade initiative.
