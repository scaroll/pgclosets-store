# AppleCard Component System

A premium, feature-rich card component system inspired by Apple's design principles. Built with Framer Motion for smooth, performant animations and offering multiple variants for different use cases.

## Features

- **8 Visual Variants**: Default, Elevated, Glass, Dark, Gradient, Featured, Minimal, Link
- **3 A/B Test Variants**: Optimized shadow and interaction patterns for conversion testing
- **3D Tilt Effect**: Interactive parallax tilt on mouse movement
- **Gradient Glow**: Animated gradient border effect
- **Full Accessibility**: Proper ARIA attributes and keyboard navigation
- **Dark Mode Support**: Seamless dark mode integration
- **Composable Sub-components**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **TypeScript**: Full type safety with TypeScript

## Installation

The component is already installed in the project. Import it like this:

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

## Dependencies

- `framer-motion` - For smooth animations
- `clsx` & `tailwind-merge` - For className utilities (via `cn()`)
- Tailwind CSS - For styling

## Basic Usage

### Simple Card

```tsx
<AppleCard>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>A brief description of the card content</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your main content goes here</p>
  </CardContent>
</AppleCard>
```

### Product Card Example

```tsx
<AppleCard variant="elevated" abVariant="B">
  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4" />
  <CardHeader>
    <CardTitle>Premium Closet System</CardTitle>
    <CardDescription>Custom walk-in organization</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold mb-2">$2,499</p>
    <p className="text-sm text-gray-600">Professional installation included</p>
  </CardContent>
  <CardFooter>
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
      Get Quote
    </button>
  </CardFooter>
</AppleCard>
```

## Variants

### Default
Subtle shadow with clean borders. Perfect for standard content cards.

```tsx
<AppleCard variant="default">
  {/* content */}
</AppleCard>
```

### Elevated
More prominent shadow for emphasis and hierarchy.

```tsx
<AppleCard variant="elevated">
  {/* content */}
</AppleCard>
```

### Glass
Frosted glass effect with backdrop blur - ideal for layered interfaces.

```tsx
<AppleCard variant="glass">
  {/* content */}
</AppleCard>
```

### Dark
Dark background variant with light text.

```tsx
<AppleCard variant="dark">
  <CardTitle className="text-white">Dark Card</CardTitle>
  <CardDescription className="text-gray-300">Description</CardDescription>
  {/* content */}
</AppleCard>
```

### Gradient
Eye-catching gradient background for CTAs and promotions.

```tsx
<AppleCard variant="gradient">
  {/* content - text will be white by default */}
</AppleCard>
```

### Featured
Highlighted with colored border and glow effect.

```tsx
<AppleCard variant="featured">
  {/* content */}
</AppleCard>
```

### Minimal
Transparent background with subtle hover state.

```tsx
<AppleCard variant="minimal">
  {/* content */}
</AppleCard>
```

### Link
Interactive card with cursor pointer and hover border color change.

```tsx
<AppleCard
  variant="link"
  onClick={() => navigate('/destination')}
  role="button"
  tabIndex={0}
>
  {/* content */}
</AppleCard>
```

## A/B Test Variants

Test different shadow and interaction patterns to optimize conversion rates:

### Variant A: Subtle (Conservative)
- Minimal shadows (2px → 8px on hover)
- Gentle lift effect (-4px translate)
- Best for content-heavy pages

```tsx
<AppleCard abVariant="A">
  {/* content */}
</AppleCard>
```

### Variant B: Pronounced (Attention-grabbing)
- Strong shadows (8px → 16px on hover)
- Dramatic lift + scale effect
- Includes shine overlay on hover
- Best for conversion-focused elements

```tsx
<AppleCard abVariant="B">
  {/* content */}
</AppleCard>
```

### Variant C: Flat (Ultra-minimal)
- No shadows
- Background tint on hover only
- Modern, clean aesthetic

```tsx
<AppleCard abVariant="C">
  {/* content */}
</AppleCard>
```

## Special Effects

### 3D Tilt Effect

Interactive parallax tilt based on mouse position. Use sparingly for hero sections or featured items.

```tsx
<AppleCard variant="elevated" tilt>
  {/* Content appears to float in 3D space */}
</AppleCard>
```

**Technical Details:**
- Uses Framer Motion's `useMotionValue` and `useSpring`
- Rotates up to ±5 degrees on X and Y axes
- Smooth spring animation (stiffness: 300, damping: 30)
- Content has translateZ(20px) for depth effect

### Gradient Glow

Animated gradient border that appears on hover. Perfect for premium products.

```tsx
<AppleCard variant="featured" glow>
  {/* content */}
</AppleCard>
```

### Combined Effects

You can combine multiple effects for maximum impact:

```tsx
<AppleCard
  variant="featured"
  tilt
  glow
  abVariant="B"
>
  {/* Premium featured content with all effects */}
</AppleCard>
```

**Warning:** Use combined effects sparingly - only for the most important content to maintain visual hierarchy.

## Props API

### AppleCard Props

```tsx
interface AppleCardProps {
  // Visual variant
  variant?: 'default' | 'elevated' | 'glass' | 'dark' | 'gradient' | 'featured' | 'minimal' | 'link'

  // A/B test variant
  abVariant?: 'A' | 'B' | 'C'

  // Enable/disable hover effects
  hover?: boolean // default: true

  // Enable 3D tilt effect
  tilt?: boolean // default: false

  // Enable gradient glow
  glow?: boolean // default: false

  // Shorthand for glass variant
  glass?: boolean // default: false

  // Standard HTML div props
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  // ... all other div attributes
}
```

### Sub-component Props

All sub-components accept standard HTML attributes for their respective elements:

- `CardHeader`: `HTMLAttributes<HTMLDivElement>`
- `CardTitle`: `HTMLAttributes<HTMLHeadingElement>`
- `CardDescription`: `HTMLAttributes<HTMLParagraphElement>`
- `CardContent`: `HTMLAttributes<HTMLDivElement>`
- `CardFooter`: `HTMLAttributes<HTMLDivElement>`

## Styling & Customization

### Custom Styles

All components accept a `className` prop for custom styling:

```tsx
<AppleCard className="max-w-md mx-auto">
  <CardHeader className="border-b pb-4">
    <CardTitle className="text-4xl">Large Title</CardTitle>
  </CardHeader>
</AppleCard>
```

### Border Radius

Cards use large border radius by default:
- Mobile: `rounded-[20px]`
- Desktop: `md:rounded-[24px]`

Override with className:

```tsx
<AppleCard className="rounded-lg"> {/* smaller radius */}
  {/* content */}
</AppleCard>
```

### Padding

Default padding is generous:
- Mobile: `p-6`
- Desktop: `md:p-8`

Customize as needed:

```tsx
<AppleCard className="p-4"> {/* compact padding */}
  {/* content */}
</AppleCard>
```

## Animation Details

### Hover Animation
- Duration: 400ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (Apple's signature smooth ease)
- Transform: `translateY(-4px)` (varies by A/B variant)

### 3D Tilt Animation
- Spring physics: stiffness 300, damping 30
- Rotation range: ±5 degrees
- Resets to neutral on mouse leave

### Shine Overlay (Variant B)
- Fades in over 300ms
- Gradient: `from-white/20 via-transparent to-transparent`
- Only visible on hover

## Accessibility

The component follows accessibility best practices:

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy (CardTitle renders `<h3>`)
- ✅ Dark mode support
- ✅ Keyboard navigation support (when used as link/button)
- ✅ ARIA attributes support (pass through props)

For clickable cards, ensure you add proper attributes:

```tsx
<AppleCard
  variant="link"
  onClick={handleClick}
  role="button"
  tabIndex={0}
  aria-label="Navigate to product details"
>
  {/* content */}
</AppleCard>
```

## Performance Considerations

### Optimization Tips

1. **Limit 3D Tilt**: Only use on 1-2 cards per page (computationally expensive)
2. **Batch A/B Variants**: Use same variant across similar cards to reduce CSS
3. **Lazy Load**: For card grids, consider lazy loading off-screen cards
4. **Reduce Motion**: Component respects `prefers-reduced-motion` (via Framer Motion)

### Bundle Size

- **Component**: ~4KB (minified)
- **Framer Motion**: Already included in project
- **No additional dependencies**

## Use Cases

### E-commerce Product Cards
```tsx
<AppleCard variant="elevated" abVariant="B">
  <ProductImage />
  <CardHeader>
    <CardTitle>{product.name}</CardTitle>
    <CardDescription>{product.category}</CardDescription>
  </CardHeader>
  <CardContent>
    <Price amount={product.price} />
  </CardContent>
  <CardFooter>
    <AddToCartButton />
  </CardFooter>
</AppleCard>
```

### Feature Highlights
```tsx
<AppleCard variant="featured" glow tilt>
  <Icon />
  <CardHeader>
    <CardTitle>Premium Feature</CardTitle>
    <CardDescription>Exclusive benefit</CardDescription>
  </CardHeader>
</AppleCard>
```

### Navigation Cards
```tsx
<AppleCard
  variant="link"
  onClick={() => navigate('/services')}
  role="button"
  tabIndex={0}
>
  <CardHeader>
    <CardTitle>Our Services</CardTitle>
  </CardHeader>
</AppleCard>
```

### Testimonials
```tsx
<AppleCard variant="glass">
  <CardContent>
    <Quote />
  </CardContent>
  <CardFooter>
    <Avatar />
    <CustomerName />
  </CardFooter>
</AppleCard>
```

## Design Guidelines

### When to Use Each Variant

| Variant | Use Case | Visual Weight |
|---------|----------|---------------|
| Default | Standard content cards | Medium |
| Elevated | Important content, featured items | High |
| Glass | Overlays, modals, layered UI | Medium |
| Dark | Dark sections, contrast | High |
| Gradient | CTAs, promotions, highlights | Very High |
| Featured | Premium products, highlighted content | High |
| Minimal | Lists, secondary content | Low |
| Link | Navigation, clickable cards | Medium |

### Visual Hierarchy Best Practices

1. **Hero Section**: Use 1 featured/gradient card with tilt + glow
2. **Product Grid**: Use elevated variant with A/B testing
3. **Content Sections**: Use default variant
4. **Lists**: Use minimal variant
5. **Promotions**: Use gradient or featured variant

### Spacing Recommendations

- **Grid Gap**: 1.5rem (gap-6) for mobile, 2rem (gap-8) for desktop
- **Container Max Width**: 1200px for 3-column layouts
- **Margin**: mb-6 between sections

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: 3D transforms require modern browsers. Graceful degradation for older browsers.

## Troubleshooting

### Card not showing hover effects
- Ensure `hover={true}` (default)
- Check that parent doesn't have `pointer-events-none`

### 3D tilt not working
- Verify Framer Motion is installed: `npm list framer-motion`
- Check browser support for 3D transforms

### Gradient glow not visible
- Ensure `glow={true}` is set
- Check z-index stacking context
- Verify card has `position: relative` (default)

### Dark mode not working
- Ensure Tailwind dark mode is enabled in `tailwind.config.js`
- Verify dark mode provider is set up correctly

## Examples

See `AppleCardShowcase.tsx` for comprehensive examples of all variants and features.

## Credits

Adapted from mrigank-site AppleCard component with enhancements for:
- PG Closets design system integration
- Additional A/B test variants
- Enhanced accessibility
- Performance optimizations

## License

Part of the PG Closets component library. For internal use.
