# Product Comparison Component

A comprehensive product comparison component for comparing 2-3 products side by side, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Side-by-Side Comparison**: Compare 2-3 products simultaneously
- **Comprehensive Data Display**:
  - Product images with badges
  - Pricing (including sale prices)
  - Star ratings and review counts
  - Stock availability
  - Key features
  - Detailed specifications
- **Interactive UI**:
  - Add/remove products from comparison
  - Smooth animations with Framer Motion
  - Responsive design
  - Quick actions (Add to Cart, View Details)
- **Two Variants**:
  - `ProductComparison`: Full desktop table view
  - `ProductComparisonCompact`: Mobile-friendly swipeable view
- **Accessibility**: Keyboard navigation and ARIA labels

## File Location

```
/home/user/pgclosets-store/components/products/product-comparison.tsx
```

## Components

### 1. ProductComparison

The main comparison component that displays products in a table format.

#### Props

```typescript
interface ProductComparisonProps {
  initialProducts?: Product[]      // Products to compare initially
  maxProducts?: 2 | 3               // Maximum number of products (default: 3)
  className?: string                // Additional CSS classes
  onProductSelect?: (products: Product[]) => void  // Callback when products change
}
```

#### Usage

```tsx
import { ProductComparison } from "@/components/products"

export default function ComparePage() {
  const products = [product1, product2, product3]

  return (
    <ProductComparison
      initialProducts={products}
      maxProducts={3}
      onProductSelect={(selectedProducts) => {
        console.log("Products updated:", selectedProducts)
      }}
    />
  )
}
```

### 2. ProductComparisonCompact

A mobile-optimized version that shows one product at a time with navigation.

#### Props

```typescript
interface ProductComparisonCompactProps {
  initialProducts?: Product[]
  className?: string
}
```

#### Usage

```tsx
import { ProductComparisonCompact } from "@/components/products"

export default function MobileComparePage() {
  const products = [product1, product2]

  return (
    <ProductComparisonCompact
      initialProducts={products}
    />
  )
}
```

## Comparison Features

### 1. Product Overview
- Product images with hover effects
- Product names (linked to detail pages)
- Category badges
- Featured/New badges
- Remove product buttons

### 2. Quick Actions
- Add to Cart button
- Quick View button
- View Details link

### 3. Comparison Metrics

#### Pricing
- Regular price
- Sale price (if applicable)
- Discount percentage badge

#### Ratings
- 5-star visual rating
- Numerical rating (X.X / 5.0)
- Review count

#### Availability
- In Stock / Out of Stock status
- Visual indicators

#### Product Attributes
- Featured status
- New arrival status

#### Key Features
- Up to 5 main features shown
- Checkmark indicators
- "More features" counter

#### Specifications
- All product specifications
- Key-value pairs
- Clean, scannable layout

## Responsive Design

The component is fully responsive and works on all screen sizes:

### Desktop (lg and up)
- Full table layout
- All products visible simultaneously
- Horizontal scrolling if needed

### Tablet (md)
- Condensed table layout
- Smaller product cards
- Maintained functionality

### Mobile (sm and below)
- Use `ProductComparisonCompact` for better UX
- One product at a time
- Swipeable navigation
- Thumbnail selector

### Recommended Responsive Implementation

```tsx
export function ResponsiveComparison({ products }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <ProductComparison initialProducts={products} maxProducts={3} />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <ProductComparisonCompact initialProducts={products.slice(0, 2)} />
      </div>
    </>
  )
}
```

## Styling

The component uses:
- **Tailwind CSS** for styling
- **shadcn/ui** components (Button, Badge)
- **Framer Motion** for animations
- **Lucide React** for icons

### Customization

You can customize the appearance using the `className` prop:

```tsx
<ProductComparison
  className="my-custom-class"
  initialProducts={products}
/>
```

Or by modifying the component's Tailwind classes directly.

## Data Structure

The component expects products to follow the `Product` type from `/types/product.ts`:

```typescript
interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  price: number           // in cents
  salePrice?: number      // in cents
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, string | number>
  rating: number
  reviewCount: number
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  // ... additional fields
}
```

## Examples

See `/components/products/product-comparison-example.tsx` for comprehensive usage examples:

1. **Basic Comparison**: Standard 3-product comparison
2. **Two Products**: Limited to 2 products
3. **Compact View**: Mobile-friendly version
4. **Responsive**: Desktop/mobile adaptive
5. **Product List Integration**: Select from list to compare

## Integration Points

### 1. Product Selection

To allow users to select products to compare:

```tsx
"use client"

import { useState } from "react"
import { ProductComparison } from "@/components/products"

export default function CompareWithSelection() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const handleAddToComparison = (product: Product) => {
    if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  return (
    <>
      {/* Product Grid with "Add to Compare" buttons */}
      <div className="grid grid-cols-3 gap-4">
        {allProducts.map(product => (
          <div key={product.id}>
            {/* Product Card */}
            <button onClick={() => handleAddToComparison(product)}>
              Add to Compare
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {selectedProducts.length > 0 && (
        <ProductComparison
          initialProducts={selectedProducts}
          onProductSelect={setSelectedProducts}
        />
      )}
    </>
  )
}
```

### 2. URL State Management

For shareable comparison URLs:

```tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ProductComparison } from "@/components/products"

export default function CompareWithURL() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productIds = searchParams.get("products")?.split(",") || []

  // Fetch products based on IDs
  const products = fetchProductsByIds(productIds)

  const handleProductsChange = (products: Product[]) => {
    const ids = products.map(p => p.id).join(",")
    router.push(`/compare?products=${ids}`)
  }

  return (
    <ProductComparison
      initialProducts={products}
      onProductSelect={handleProductsChange}
    />
  )
}
```

### 3. Analytics Tracking

```tsx
<ProductComparison
  initialProducts={products}
  onProductSelect={(products) => {
    // Track comparison view
    analytics.track("Products Compared", {
      product_ids: products.map(p => p.id),
      product_names: products.map(p => p.name),
      count: products.length,
    })
  }}
/>
```

## Animations

The component uses Framer Motion for smooth animations:

- **Product cards**: Fade in/scale on mount
- **Product removal**: Fade out/scale on exit
- **Mobile swipe**: Slide transitions between products
- **Hover effects**: Image zoom on hover

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper use of semantic elements
- **Color Contrast**: WCAG AA compliant colors

## Performance

- **Image Optimization**: Uses Next.js Image component
- **Lazy Loading**: Images load on demand
- **Memoization**: Prevents unnecessary re-renders
- **Code Splitting**: Component can be lazy loaded

### Lazy Loading Example

```tsx
import dynamic from "next/dynamic"

const ProductComparison = dynamic(
  () => import("@/components/products").then(mod => mod.ProductComparison),
  { loading: () => <div>Loading comparison...</div> }
)
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Dependencies

- `next`: ^14.0.0
- `react`: ^18.0.0
- `framer-motion`: ^10.0.0
- `lucide-react`: ^0.263.0
- `tailwindcss`: ^3.0.0
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.0.0
- `tailwind-merge`: ^2.0.0

## Future Enhancements

Potential improvements for future versions:

1. **Print View**: Optimized layout for printing comparisons
2. **Export to PDF**: Download comparison as PDF
3. **Share Functionality**: Share comparison via link/social media
4. **Comparison History**: Save previous comparisons
5. **Advanced Filters**: Filter comparison rows
6. **Custom Rows**: User-defined comparison metrics
7. **Drag & Drop**: Reorder products via drag and drop
8. **Variants Support**: Compare specific product variants

## Troubleshooting

### Products not appearing
- Ensure products follow the `Product` type structure
- Check that all required fields are present
- Verify image URLs are accessible

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that shadcn/ui components are installed
- Verify all CSS classes are included in your build

### Animation issues
- Ensure Framer Motion is installed
- Check for conflicting CSS transitions
- Verify AnimatePresence wrapper if needed

## Support

For issues or questions:
1. Check the example file: `product-comparison-example.tsx`
2. Review the type definitions in `/types/product.ts`
3. Ensure all dependencies are installed

## License

Part of the PG Closets Store project.
