# Recently Viewed Products - Usage Guide

This feature allows tracking and displaying recently viewed products across your e-commerce site. It stores the last 10 viewed products in localStorage and provides multiple display components.

## Files Created

1. **Store**: `/home/user/pgclosets-store/lib/stores/recently-viewed-store.ts`
   - Zustand store with localStorage persistence
   - Tracks last 10 viewed products
   - Automatically manages product history

2. **Component**: `/home/user/pgclosets-store/components/products/recently-viewed.tsx`
   - Main display component with multiple variants
   - Compact sidebar component
   - Product tracking hook

## Quick Start

### 1. Track Product Views (Product Detail Page)

Add this to your product detail page to automatically track when users view a product:

```tsx
'use client'

import { useEffect } from 'react'
import { useTrackProductView } from '@/components/products'

export default function ProductPage({ product }) {
  const { trackView } = useTrackProductView()

  useEffect(() => {
    // Track product view
    const cleanup = trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0],
      category: product.category?.name,
    })

    return cleanup
  }, [product.id])

  return (
    <div>
      {/* Your product content */}
    </div>
  )
}
```

### 2. Display on Homepage

Add the recently viewed section to your homepage:

```tsx
import { RecentlyViewed } from '@/components/products'

export default function HomePage() {
  return (
    <div>
      {/* Other homepage content */}

      <RecentlyViewed
        title="Recently Viewed Products"
        maxItems={6}
        variant="grid"
        showClearButton={true}
      />
    </div>
  )
}
```

### 3. Display on Product Pages

Show recently viewed products at the bottom of product detail pages:

```tsx
import { RecentlyViewed } from '@/components/products'

export default function ProductDetailPage() {
  return (
    <div>
      {/* Product details */}

      <RecentlyViewed
        title="You Recently Viewed"
        maxItems={4}
        variant="horizontal"
        className="bg-gray-50"
      />
    </div>
  )
}
```

### 4. Compact Sidebar Version

Perfect for sidebars or small spaces:

```tsx
import { RecentlyViewedCompact } from '@/components/products'

export default function Sidebar() {
  return (
    <aside>
      {/* Other sidebar content */}

      <RecentlyViewedCompact maxItems={4} />
    </aside>
  )
}
```

## Component Props

### RecentlyViewed

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | - | Additional CSS classes |
| `title` | string | "Recently Viewed" | Section title |
| `maxItems` | number | 6 | Maximum number of products to display |
| `showClearButton` | boolean | true | Show/hide clear all button |
| `variant` | "horizontal" \| "grid" | "grid" | Display layout |

### RecentlyViewedCompact

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | - | Additional CSS classes |
| `maxItems` | number | 4 | Maximum number of products to display |

### useTrackProductView Hook

Returns:
- `trackView(product)`: Function to track a product view
  - Returns cleanup function for useEffect

## Store Methods

Direct access to the store (advanced usage):

```tsx
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store'

function MyComponent() {
  const { products, addProduct, removeProduct, clearAll } = useRecentlyViewedStore()

  // Add a product
  addProduct({
    id: '123',
    slug: 'product-slug',
    name: 'Product Name',
    price: 99.99,
    image: '/image.jpg',
  })

  // Remove a product
  removeProduct('123')

  // Clear all
  clearAll()

  // Access products
  console.log(products)
}
```

## Features

- **Automatic Deduplication**: If a product is viewed again, it moves to the top
- **Max 10 Products**: Automatically maintains only the last 10 viewed products
- **localStorage Persistence**: Products persist across sessions
- **SSR Safe**: Components handle hydration correctly
- **Responsive**: Works on all screen sizes
- **Animated**: Smooth animations using Framer Motion
- **Type-Safe**: Full TypeScript support

## Data Structure

Each recently viewed product stores:

```typescript
{
  id: string           // Product ID
  slug: string         // URL slug
  name: string         // Product name
  price: number        // Regular price
  salePrice?: number   // Optional sale price
  image: string        // Primary image URL
  category?: string    // Optional category name
  viewedAt: number     // Timestamp of view
}
```

## Styling

All components use Tailwind CSS and respect your design system:
- Primary colors for accents
- Responsive grid layouts
- Hover effects and animations
- Dark mode support (if configured)

## Performance

- Minimal bundle size (Zustand is lightweight)
- localStorage updates are debounced
- Components only render client-side
- No unnecessary re-renders

## Browser Compatibility

Works in all modern browsers that support:
- localStorage API
- ES6+
- React 18+

## Troubleshooting

### Products not showing up

Make sure you're:
1. Calling `trackView()` on product pages
2. The component is used in a client component (`'use client'`)
3. localStorage is enabled in the browser

### Hydration errors

The components are already SSR-safe and handle hydration. If you see errors, ensure you're not trying to access the store during SSR.

### Clear storage manually

```javascript
// In browser console
localStorage.removeItem('recently-viewed-storage')
```

## Examples

See the implementation examples in:
- `/home/user/pgclosets-store/app/products/[slug]/page.tsx` (if tracking is added)
- `/home/user/pgclosets-store/app/page.tsx` (if homepage display is added)
