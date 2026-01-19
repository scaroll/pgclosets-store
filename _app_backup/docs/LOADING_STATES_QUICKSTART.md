# Loading States Quick Start Guide

**Get up and running with the PG Closets loading states system in 5 minutes.**

## Installation

No installation needed - all components are already in the project.

## Basic Usage

### 1. Product List Loading

```tsx
import { ProductGridSkeleton } from '@/components/ui/skeletons'
import { useLoadingState } from '@/lib/loading'

function ProductsPage() {
  const { state, data } = useLoadingState<Product[]>()

  useEffect(() => {
    execute(fetchProducts())
  }, [])

  if (state === 'loading') return <ProductGridSkeleton count={12} />
  if (state === 'success') return <ProductGrid products={data} />
}
```

### 2. Single Product Loading

```tsx
import { ProductCardSkeleton } from '@/components/ui/skeletons'

function ProductCard({ productId }) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) return <ProductCardSkeleton />
  return <div>{/* Product card content */}</div>
}
```

### 3. Button Loading State

```tsx
import { PremiumSpinner } from '@/components/ui/loaders'

function SubmitButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <button disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <PremiumSpinner size="sm" variant="copper" />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </button>
  )
}
```

## Common Patterns

### Delayed Loading (Prevent Flash)

```tsx
import { useDelayedLoading } from '@/lib/loading'

const showLoading = useDelayedLoading(isLoading, 200)
if (showLoading) return <Skeleton />
```

### With Error Handling

```tsx
import { useLoadingState } from '@/lib/loading'
import { ErrorBoundary } from '@/components/ui/error-states'

function MyComponent() {
  const { state, data, error, retry } = useLoadingState()

  if (state === 'loading') return <Skeleton />
  if (state === 'error') return <ErrorState error={error} onRetry={retry} />
  return <Content data={data} />
}
```

### Optimistic Updates

```tsx
import { useOptimistic } from '@/lib/loading'

const [items, updateItems, isPending] = useOptimistic(
  initialItems,
  async (newItems) => await api.save(newItems)
)

// Update instantly, auto-rollback on error
updateItems([...items, newItem])
```

## Component Cheat Sheet

### Skeletons
- `<ProductCardSkeleton variant="grid" />` - Product card
- `<ProductDetailSkeleton />` - Full product page
- `<ProductGridSkeleton count={12} />` - Product grid
- `<HeroSkeleton />` - Hero section
- `<FormSkeleton />` - Form fields
- `<TextSkeleton lines={3} />` - Text content

### Loaders
- `<PremiumSpinner variant="copper" />` - Circular spinner
- `<PulseLoader />` - Three-dot animation
- `<OrbitSpinner />` - Orbiting dots
- `<ShimmerOverlay />` - Shimmer effect

### Error States
- `<ErrorBoundary>` - Error catching
- `<NetworkError onRetry={fn} />` - Network errors
- `<OfflineIndicator />` - Offline banner

## Hooks Cheat Sheet

```tsx
// Full-featured loading state
const { state, data, error, execute, retry } = useLoadingState({
  minLoadingTime: 400,
  autoRetry: true,
  maxRetries: 3
})

// Delayed loading indicator
const showLoading = useDelayedLoading(isLoading, 200)

// Optimistic UI updates
const [data, setData, isPending] = useOptimistic(initial, updateFn)

// Minimum loading time wrapper
await withMinimumLoadingTime(promise, 400)
```

## Color Variants

- `primary` - Charcoal (default)
- `copper` - Premium copper accent ⭐
- `subtle` - Light gray
- `luxury` - Rose gold

## Sizes

- `xs` - Extra small (12px)
- `sm` - Small (16px)
- `md` - Medium (24px) ⭐ Default
- `lg` - Large (32px)
- `xl` - Extra large (48px)

## Best Practices

### ✅ Do
- Match skeleton dimensions to content
- Use delayed loading for fast operations
- Provide retry options on errors
- Stagger list animations

### ❌ Don't
- Show blank white screens
- Cause layout shift (CLS)
- Show instant loading indicators
- Suppress errors silently

## Performance Tips

1. **Prevent Flash:** Use 200-400ms delay
2. **Match Dimensions:** Ensure skeleton = content size
3. **Stagger Animations:** 50ms per item
4. **Memoize Skeletons:** Use React.memo for lists
5. **Lazy Load:** Only render visible skeletons

## Next Steps

- 📖 Read [Complete Guide](/docs/LOADING_STATES_GUIDE.md)
- 🎨 Review [Pattern Library](/docs/SKELETON_SCREEN_PATTERNS.md)
- 💻 Check component source code for more options

---

**Need help?** Check the full documentation or component JSDoc comments.
