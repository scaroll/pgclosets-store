# AppleCard Quick Start Guide

5-minute guide to using the AppleCard component in PG Closets.

## Installation

Already installed! Just import:

```tsx
import {
  AppleCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/AppleCard'
```

## Basic Usage

### Simple Content Card

```tsx
<AppleCard>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
</AppleCard>
```

## Common Patterns

### Product Card

```tsx
<AppleCard variant="elevated" abVariant="B">
  {/* Product Image */}
  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4" />

  <CardHeader>
    <CardTitle>{product.name}</CardTitle>
    <CardDescription>{product.category}</CardDescription>
  </CardHeader>

  <CardContent>
    <p className="text-2xl font-bold">${product.price}</p>
    <p className="text-sm text-gray-600">Free shipping</p>
  </CardContent>

  <CardFooter>
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
      Add to Cart
    </button>
  </CardFooter>
</AppleCard>
```

### Featured Product

```tsx
<AppleCard variant="featured" glow>
  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
    Best Seller
  </div>

  {/* Rest of card */}
</AppleCard>
```

### Hero Section Card

```tsx
<AppleCard variant="gradient" tilt>
  <CardHeader>
    <CardTitle className="text-white">Premium Offer</CardTitle>
    <CardDescription className="text-white/80">
      Limited time only
    </CardDescription>
  </CardHeader>
</AppleCard>
```

### Navigation Card

```tsx
<AppleCard
  variant="link"
  onClick={() => router.push('/services')}
  role="button"
  tabIndex={0}
>
  <CardHeader>
    <CardTitle>Our Services</CardTitle>
  </CardHeader>
</AppleCard>
```

## Quick Variant Guide

| Variant | When to Use | Example |
|---------|-------------|---------|
| `default` | Most content cards | Blog posts, content blocks |
| `elevated` | Important items | Featured products, highlights |
| `glass` | Overlays | Modals, floating elements |
| `dark` | Dark sections | Footer cards, contrast |
| `gradient` | CTAs | Hero sections, promotions |
| `featured` | Premium items | Best sellers, special offers |
| `minimal` | Lists | Dense content, secondary |
| `link` | Navigation | Service cards, category tiles |

## A/B Testing

Test different shadow styles:

```tsx
// Subtle (Conservative)
<AppleCard abVariant="A">

// Pronounced (Attention-grabbing)
<AppleCard abVariant="B">

// Flat (Ultra-minimal)
<AppleCard abVariant="C">
```

## Special Effects

### 3D Tilt (Hero sections only)

```tsx
<AppleCard tilt>
  {/* Content appears to float in 3D */}
</AppleCard>
```

### Gradient Glow (Premium products)

```tsx
<AppleCard glow>
  {/* Animated gradient border on hover */}
</AppleCard>
```

### Maximum Impact (Use sparingly!)

```tsx
<AppleCard variant="featured" tilt glow abVariant="B">
  {/* All effects combined */}
</AppleCard>
```

## Grid Layouts

### 3-Column Product Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map(product => (
    <AppleCard key={product.id} variant="elevated">
      {/* Product card content */}
    </AppleCard>
  ))}
</div>
```

### 2-Column Feature Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
  {features.map(feature => (
    <AppleCard key={feature.id} variant="default">
      {/* Feature card content */}
    </AppleCard>
  ))}
</div>
```

## Best Practices

### Do ✅

- Use `variant="default"` for most cards
- Use `variant="elevated"` for featured items
- Use `variant="minimal"` in dense lists
- Limit `tilt` to 1-2 cards per page
- Use `glow` for premium products only
- Test A/B variants to optimize conversions

### Don't ❌

- Don't use `tilt` on many cards (performance)
- Don't combine all effects everywhere (visual clutter)
- Don't use `gradient` variant excessively (loses impact)
- Don't forget dark mode text colors
- Don't skip accessibility attributes for clickable cards

## Accessibility

For clickable cards, add proper attributes:

```tsx
<AppleCard
  variant="link"
  onClick={handleClick}
  role="button"
  tabIndex={0}
  aria-label="Navigate to product details"
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  {/* content */}
</AppleCard>
```

## Dark Mode

All variants support dark mode automatically:

```tsx
<AppleCard variant="default">
  {/* Automatically adjusts for dark mode */}
</AppleCard>

{/* For manual dark mode adjustments */}
<CardDescription className="dark:text-gray-300">
  Custom dark mode text color
</CardDescription>
```

## Custom Styling

Override with className:

```tsx
<AppleCard className="max-w-md mx-auto">
  <CardHeader className="border-b pb-4">
    <CardTitle className="text-4xl">Large Title</CardTitle>
  </CardHeader>
</AppleCard>
```

## Performance Tips

1. **Use same variant** across similar cards (reduces CSS)
2. **Limit 3D tilt** to hero sections only
3. **Lazy load** off-screen cards in long grids
4. **Batch A/B variants** (don't mix all three in one grid)

## Common Issues

### Card not hovering?
- Check `hover={true}` (default)
- Verify parent doesn't block pointer events

### 3D tilt not working?
- Only works on desktop (requires mouse)
- Check browser supports 3D transforms

### Gradient glow not visible?
- Ensure `glow={true}` is set
- Check z-index conflicts

## Examples

See `/components/ui/AppleCardShowcase.tsx` for complete examples.

## Full Documentation

See `AppleCard.README.md` for complete API reference.

---

**Need Help?**
- Full API: `AppleCard.README.md`
- Examples: `AppleCardShowcase.tsx`
- Report issues: Contact development team
