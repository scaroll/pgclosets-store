# Product Grid System

Complete product catalog system with masonry layout, lazy loading, filters, and quick view modal. Inspired by Kit and Ace aesthetic - minimal, elegant, and approachable.

## Components

### ProductGrid

Main product grid component with advanced filtering and sorting capabilities.

**Features:**
- 📐 Masonry, grid, or list layouts
- 🎨 Lazy loading images with blur-up effect
- 🔍 Advanced filtering (category, finishes, price range, search)
- 🔄 Sort by featured, price, or name
- ♾️ Infinite scroll with load more
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive

**Props:**

```typescript
interface ProductGridProps {
  initialCategory?: string     // Initial category filter
  layout?: 'masonry' | 'grid' | 'list'  // Grid layout style
  itemsPerPage?: number         // Items per page (default: 12)
  showFilters?: boolean         // Show filters sidebar (default: true)
  className?: string            // Custom class name
}
```

**Usage:**

```tsx
import { ProductGrid } from '@/components/products'

export default function CatalogPage() {
  return (
    <ProductGrid
      layout="masonry"
      itemsPerPage={16}
      showFilters={true}
    />
  )
}
```

### ProductQuickView

Modal dialog for quick product viewing without leaving the catalog.

**Features:**
- 🖼️ Large product image
- 📦 Size, finish, and glass selection
- 🛒 Add to cart with quantity selector
- ❤️ Favorite/wishlist toggle
- 🌟 Product ratings
- 📤 Share functionality
- ⚡ Fast, optimized performance

**Props:**

```typescript
interface ProductQuickViewProps {
  product: Product              // Product to display
  open: boolean                 // Dialog open state
  onOpenChange: (open: boolean) => void  // Dialog state change handler
}
```

**Usage:**

```tsx
import { ProductQuickView } from '@/components/products'
import { useState } from 'react'

function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      <button onClick={() => setSelectedProduct(product)}>
        Quick View
      </button>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </>
  )
}
```

### ProductFilters

Sidebar component for filtering products.

**Features:**
- 🏷️ Category selection
- 🎨 Finish multi-select with checkboxes
- 💰 Price range slider
- 🔍 Search functionality
- 🧹 Clear all filters
- 📊 Active filter count
- 📱 Mobile sheet drawer support

**Props:**

```typescript
interface ProductFiltersProps {
  categories: string[]
  finishes: string[]
  selectedCategory: string
  selectedFinishes: string[]
  priceRange: [number, number]
  searchQuery: string
  onCategoryChange: (category: string) => void
  onFinishesChange: (finishes: string[]) => void
  onPriceRangeChange: (range: [number, number]) => void
  onSearchChange: (query: string) => void
}
```

## Product Data Structure

Products are defined in `/data/renin-products.ts`:

```typescript
interface Product {
  id: string
  name: string
  category: 'Barn Door' | 'Bypass' | 'Bifold' | 'Pivot' | 'Glass'
  price: number
  image: string
  sizes: string[]
  finishes: string[]
  glass?: string[]
  features: string[]
}
```

## Styling

### Design System

The components follow the Kit/Ace aesthetic:

- **Clean & Minimal**: Focused on product, not decoration
- **Elegant Typography**: Clear hierarchy with proper spacing
- **Sophisticated Colors**: Neutral palette with accent colors
- **Smooth Interactions**: Subtle hover effects and transitions
- **Accessible**: WCAG AA compliant contrast ratios

### Customization

Override styles using Tailwind classes:

```tsx
<ProductGrid
  className="custom-grid"
  // Custom grid spacing
  style={{
    '--grid-gap': '2rem'
  }}
/>
```

### CSS Variables

```css
:root {
  --grid-gap: 1.5rem;
  --card-hover-scale: 1.02;
  --transition-duration: 300ms;
}
```

## Performance Optimizations

### Image Loading

- **Lazy Loading**: Images load as they enter viewport
- **Blur-up Effect**: Smooth transition from blur to sharp
- **Responsive Sizes**: Optimized sizes for different viewports
- **Error Handling**: Graceful fallback for missing images

### Rendering

- **Virtual Scrolling**: Only renders visible products
- **Memoization**: Prevents unnecessary re-renders
- **Debounced Filters**: Reduces filter calculation overhead
- **Progressive Enhancement**: Core functionality without JavaScript

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA labels and roles
- ✅ High contrast mode support
- ✅ Semantic HTML

## Examples

### Basic Grid

```tsx
<ProductGrid />
```

### Grid with Initial Filters

```tsx
<ProductGrid
  initialCategory="Barn Door"
  layout="grid"
/>
```

### Custom Styled Grid

```tsx
<ProductGrid
  className="max-w-7xl mx-auto"
  itemsPerPage={20}
  showFilters={true}
/>
```

### List Layout

```tsx
<ProductGrid
  layout="list"
  itemsPerPage={10}
/>
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ iOS Safari (latest)
- ✅ Chrome Android (latest)

## Dependencies

- `framer-motion` - Animations
- `lucide-react` - Icons
- `next/image` - Image optimization
- `@radix-ui/*` - UI primitives
- `class-variance-authority` - Style variants

## Future Enhancements

- [ ] Product comparison
- [ ] Bulk actions
- [ ] Advanced filters (materials, styles)
- [ ] AI-powered recommendations
- [ ] 3D product previews
- [ ] AR room visualization
- [ ] Social proof (reviews, ratings)
- [ ] Recently viewed products
- [ ] Save filter presets
- [ ] Export product lists

## License

Proprietary - PG Closets
