# Loading States System - Complete Guide

**Agent #13 Deliverable** - Premium loading experience system for PG Closets luxury e-commerce

## Overview

A comprehensive loading states system that maintains user engagement during data fetching, provides visual continuity, and eliminates blank screens or jarring content shifts.

### Core Principles

1. **Never Show Blank Screens** - Always display meaningful loading states
2. **Maintain Layout Stability** - Zero cumulative layout shift (CLS = 0)
3. **Prevent Flash** - 200ms delay before showing loading indicators
4. **Provide Context** - Show descriptive loading messages
5. **Smooth Transitions** - 300ms ease-out opacity transitions
6. **Offer Control** - Retry/cancel options for long operations

## Architecture

```
components/ui/
├── skeletons/           # Placeholder components
│   ├── ProductCardSkeleton.tsx
│   ├── ProductDetailSkeleton.tsx
│   ├── HeroSkeleton.tsx
│   ├── NavigationSkeleton.tsx
│   ├── FormSkeleton.tsx
│   ├── GallerySkeleton.tsx
│   └── TextSkeleton.tsx
├── loaders/             # Loading indicators
│   ├── PremiumSpinner.tsx
│   ├── ProgressBar.tsx
│   ├── PulseLoader.tsx
│   ├── ShimmerOverlay.tsx
│   └── InfiniteScrollLoader.tsx
├── streaming/           # Progressive loading
│   ├── StreamingText.tsx
│   ├── ProgressiveImage.tsx
│   ├── LazySection.tsx
│   └── SuspenseBoundary.tsx
└── error-states/        # Error handling
    ├── ErrorBoundary.tsx
    ├── NetworkError.tsx
    ├── NotFound.tsx
    └── TimeoutError.tsx

lib/loading/
├── loading-states.ts    # State management hooks
└── transitions.ts       # Transition utilities
```

## Component Library

### Skeleton Screens

#### ProductCardSkeleton

Matches product card layout exactly to prevent layout shift.

```tsx
import { ProductCardSkeleton, ProductGridSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton'

// Single card
<ProductCardSkeleton variant="grid" />

// List variant
<ProductCardSkeleton variant="list" />

// Featured variant
<ProductCardSkeleton variant="featured" />

// Full grid
<ProductGridSkeleton count={12} />
```

**Variants:**
- `grid` - Standard product card (aspect-square image)
- `list` - Horizontal layout for list views
- `featured` - Large featured product with detailed info

**Props:**
- `showImage` - Display image skeleton (default: true)
- `showPrice` - Display price skeleton (default: true)
- `showActions` - Display action buttons (default: true)

#### ProductDetailSkeleton

Comprehensive PDP loading state matching exact layout.

```tsx
import { ProductDetailSkeleton } from '@/components/ui/skeletons/ProductDetailSkeleton'

<ProductDetailSkeleton
  showGallery
  showReviews
  showRelated
/>
```

**Features:**
- Image gallery with thumbnails
- Product information section
- Specifications tabs
- Reviews section
- Related products grid

### Loading Indicators

#### PremiumSpinner

Elegant circular loader with copper accent.

```tsx
import { PremiumSpinner, PremiumSpinnerWithText } from '@/components/ui/loaders/PremiumSpinner'

// Basic spinner
<PremiumSpinner size="md" variant="copper" />

// With descriptive text
<PremiumSpinnerWithText
  text="Loading your closet designs..."
  subtext="This may take a few moments"
  size="lg"
  variant="luxury"
/>
```

**Variants:**
- `primary` - Charcoal spinner (default)
- `copper` - Copper accent spinner (premium)
- `subtle` - Gray subtle spinner
- `luxury` - Rose gold spinner (featured content)

**Sizes:** `xs` | `sm` | `md` | `lg` | `xl`

#### ShimmerOverlay

Sophisticated shimmer animation for skeleton screens.

```tsx
import { ShimmerOverlay } from '@/components/ui/loaders/ShimmerOverlay'

<div className="relative">
  <div className="h-48 bg-gray-200" />
  <ShimmerOverlay color="copper" duration={1500} />
</div>
```

**Props:**
- `color` - `gray` | `copper` | `neutral`
- `duration` - Animation duration in ms (default: 1500)
- `direction` - `ltr` | `rtl` (default: ltr)

### State Management

#### useLoadingState Hook

Advanced loading state management with retry logic, timeouts, and cancellation.

```tsx
import { useLoadingState } from '@/lib/loading/loading-states'

const MyComponent = () => {
  const {
    state,
    data,
    error,
    execute,
    retry,
    cancel
  } = useLoadingState<Product>({
    minLoadingTime: 400,      // Prevent flash
    maxLoadingTime: 10000,    // Timeout after 10s
    autoRetry: true,          // Auto retry on failure
    maxRetries: 3,            // Max 3 attempts
    retryDelay: 1000,         // Initial delay
    backoffMultiplier: 2      // Exponential backoff
  })

  useEffect(() => {
    execute(fetchProduct(productId))
  }, [productId])

  if (state === 'loading') return <ProductDetailSkeleton />
  if (state === 'error') return <ErrorState error={error} onRetry={retry} />
  if (state === 'success') return <ProductDetail data={data} />

  return null
}
```

**Returns:**
- `state` - Current state: `idle` | `loading` | `success` | `error`
- `data` - Loaded data or null
- `error` - Error object or null
- `isLoading` - Boolean shorthand
- `isSuccess` - Boolean shorthand
- `isError` - Boolean shorthand
- `execute(promise)` - Execute async operation
- `reset()` - Reset to idle state
- `retry()` - Retry last operation
- `cancel()` - Cancel ongoing operation

#### useDelayedLoading Hook

Prevent loading flash for fast operations.

```tsx
import { useDelayedLoading } from '@/lib/loading/loading-states'

const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const showLoading = useDelayedLoading(isLoading, 200)

  if (showLoading) return <Skeleton />
  return <Content />
}
```

#### useOptimistic Hook

Optimistic UI updates with automatic rollback on error.

```tsx
import { useOptimistic } from '@/lib/loading/loading-states'

const MyComponent = () => {
  const [items, setOptimisticItems, isPending] = useOptimistic(
    initialItems,
    async (newItems) => {
      return await api.updateItems(newItems)
    }
  )

  const addItem = (item) => {
    // Instant UI update, automatically rolled back if API fails
    setOptimisticItems(prev => [...prev, item])
  }

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      {isPending && <span>Saving...</span>}
    </div>
  )
}
```

## Design Specifications

### Visual Design

**Colors:**
- Skeleton base: `#E5E5E5` (gray-200)
- Shimmer highlight: `#F5F5F5` (gray-100)
- Copper accent: `#B87333` (copper-500)
- Dark mode base: `#2D2D2D`

**Animations:**
- Shimmer duration: 1.5s infinite
- Opacity transition: 300ms ease-out
- Fade-in delay: 0-500ms stagger for lists

**Timing:**
- Show loading after: 200ms delay
- Minimum loading time: 400ms
- Transition duration: 300ms
- Stagger increment: 50ms per item

### Accessibility

All loading components include:
- `role="status"` for loading regions
- `aria-label` with descriptive text
- `aria-live="polite"` for dynamic updates
- `sr-only` screen reader text
- Keyboard navigation support

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

## Performance Targets

### Core Web Vitals
- **First Contentful Paint (FCP):** <1.5s
- **Largest Contentful Paint (LCP):** <2.5s
- **Cumulative Layout Shift (CLS):** <0.1 (target: 0)
- **Time to Interactive (TTI):** <3.5s

### Loading Metrics
- Skeleton render: <100ms
- Transition duration: 200-300ms
- Layout shift: 0 (exact size matching)
- Perceived performance: >90% user satisfaction

## Usage Patterns

### Pattern 1: Product List

```tsx
const ProductList = () => {
  const { state, data } = useLoadingState<Product[]>()

  useEffect(() => {
    execute(fetchProducts())
  }, [])

  if (state === 'loading') {
    return <ProductGridSkeleton count={12} />
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {data?.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
```

### Pattern 2: Product Detail Page

```tsx
const ProductPage = ({ productId }) => {
  const { state, data, error, retry } = useLoadingState<Product>({
    minLoadingTime: 400,
    autoRetry: true,
    maxRetries: 3
  })

  useEffect(() => {
    execute(fetchProduct(productId))
  }, [productId])

  if (state === 'loading') {
    return <ProductDetailSkeleton showGallery showReviews />
  }

  if (state === 'error') {
    return <ErrorState error={error} onRetry={retry} />
  }

  return <ProductDetail product={data} />
}
```

### Pattern 3: Infinite Scroll

```tsx
const InfiniteList = () => {
  const [items, setItems] = useState([])
  const { execute, isLoading } = useLoadingState()

  const loadMore = async () => {
    const newItems = await execute(fetchMore())
    setItems(prev => [...prev, ...newItems])
  }

  return (
    <>
      {items.map(item => <Item key={item.id} {...item} />)}
      {isLoading && <ProductGridSkeleton count={4} />}
      <InfiniteScrollLoader onLoadMore={loadMore} />
    </>
  )
}
```

### Pattern 4: Optimistic Updates

```tsx
const CartButton = ({ product }) => {
  const [cart, updateCart, isPending] = useOptimistic(
    currentCart,
    async (newCart) => await api.updateCart(newCart)
  )

  const addToCart = () => {
    updateCart(prev => [...prev, product])
  }

  return (
    <button onClick={addToCart} disabled={isPending}>
      {isPending ? (
        <>
          <PulseLoader size="sm" />
          Adding...
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}
```

## Best Practices

### Do's ✅

1. **Always match skeleton to content layout**
   ```tsx
   // Skeleton matches exact dimensions
   <div className="aspect-square">
     <Skeleton className="aspect-square" />
   </div>
   ```

2. **Use delayed loading for fast operations**
   ```tsx
   const showLoading = useDelayedLoading(isLoading, 200)
   ```

3. **Provide descriptive loading messages**
   ```tsx
   <PremiumSpinnerWithText text="Loading your designs..." />
   ```

4. **Include retry/cancel options**
   ```tsx
   <ErrorState onRetry={retry} onCancel={cancel} />
   ```

5. **Stagger list animations**
   ```tsx
   {items.map((item, i) => (
     <Card key={i} style={{ animationDelay: `${i * 50}ms` }} />
   ))}
   ```

### Don'ts ❌

1. **Never show blank white screens**
   ```tsx
   // ❌ Bad
   if (isLoading) return null

   // ✅ Good
   if (isLoading) return <Skeleton />
   ```

2. **Don't cause layout shift**
   ```tsx
   // ❌ Bad - no height reservation
   {isLoading ? <Spinner /> : <Content />}

   // ✅ Good - skeleton matches content height
   {isLoading ? <ContentSkeleton /> : <Content />}
   ```

3. **Don't show instant loading indicators**
   ```tsx
   // ❌ Bad - causes flash
   {isLoading && <Spinner />}

   // ✅ Good - delayed appearance
   {useDelayedLoading(isLoading, 200) && <Spinner />}
   ```

4. **Don't suppress errors silently**
   ```tsx
   // ❌ Bad
   .catch(() => {})

   // ✅ Good
   .catch(error => setError(error))
   ```

## Testing

### Unit Tests

```tsx
describe('useLoadingState', () => {
  it('enforces minimum loading time', async () => {
    const { execute } = useLoadingState({ minLoadingTime: 400 })
    const startTime = Date.now()

    await execute(Promise.resolve('data'))

    expect(Date.now() - startTime).toBeGreaterThanOrEqual(400)
  })

  it('retries on failure with exponential backoff', async () => {
    const { execute } = useLoadingState({
      autoRetry: true,
      maxRetries: 3,
      retryDelay: 100,
      backoffMultiplier: 2
    })

    const failingPromise = Promise.reject(new Error('Failed'))
    await execute(failingPromise)

    // Should retry after 100ms, then 200ms, then 400ms
    expect(retryCount).toBe(3)
  })
})
```

### Performance Tests

```tsx
describe('Performance', () => {
  it('skeleton renders in <100ms', () => {
    const startTime = performance.now()
    render(<ProductCardSkeleton />)
    expect(performance.now() - startTime).toBeLessThan(100)
  })

  it('maintains zero layout shift', () => {
    const { rerender } = render(<ProductCardSkeleton />)
    const skeletonHeight = screen.getByRole('status').offsetHeight

    rerender(<ProductCard {...mockProduct} />)
    const contentHeight = screen.getByTestId('product-card').offsetHeight

    expect(skeletonHeight).toBe(contentHeight)
  })
})
```

## Success Metrics

- **Bounce Rate During Loading:** <3%
- **Perceived Performance Rating:** >90%
- **Layout Shifts:** 0 (CLS = 0)
- **Lazy Load Success Rate:** >95%
- **Average Transition Duration:** <200ms
- **User Engagement:** Maintained during loading states

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## Dependencies

- React 18+ (Suspense support)
- Next.js 15+ (dynamic imports)
- Tailwind CSS 3+
- Framer Motion (optional, for advanced animations)

## Changelog

### Version 1.0.0 (October 2025)
- Initial release
- Complete skeleton component library
- Premium loading indicators
- State management hooks
- Error state components
- Comprehensive documentation

---

**Created by Agent #13** - Part of the 50-agent PG Closets website upgrade initiative.
