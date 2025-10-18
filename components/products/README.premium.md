# Premium Product Display Component System

**Agents 16-20 Delivery**
Complete e-commerce product components with 3D effects, animations, and advanced filtering.

---

## 📦 Components Overview

### 1. **ProductCard** - Premium Product Card with 3D Tilt

Premium product card featuring:
- **3D tilt effect** on hover (parallax interaction)
- **Lazy loading images** with blur placeholder
- **Price formatting** with currency support
- **Stock indicators** with color coding
- **Star rating displays** with review count
- **Variant preview** chips
- **Wishlist integration** with heart icon
- **Quick view trigger** on hover
- **Discount badges** (New, Sale, Featured)

```tsx
import { ProductCard, type ProductCardData } from '@/components/products/ProductCard.premium'

const product: ProductCardData = {
  id: '1',
  name: 'Premium Closet Door',
  slug: 'premium-closet-door',
  price: 29999, // in cents
  compareAtPrice: 34999,
  images: ['/door1.jpg', '/door2.jpg'],
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  stockCount: 15,
  isNew: true,
  isSale: true
}

<ProductCard
  product={product}
  onQuickView={(id) => handleQuickView(id)}
  onWishlistToggle={(id) => handleWishlist(id)}
  isWishlisted={false}
/>
```

---

### 2. **ProductGallery** - Image Gallery with Zoom

Advanced image gallery featuring:
- **Main image display** with smooth transitions
- **Thumbnail navigation** with active indicator
- **Zoom functionality** with mouse tracking
- **Fullscreen lightbox** mode
- **Keyboard navigation** (arrow keys, escape)
- **Touch/swipe support** for mobile
- **Image counter** display
- **Lazy loading** with quality optimization

```tsx
import { ProductGallery, type GalleryImage } from '@/components/products/ProductGallery.premium'

const images: GalleryImage[] = [
  { url: '/door1.jpg', alt: 'Front view', thumbnail: '/door1-thumb.jpg' },
  { url: '/door2.jpg', alt: 'Side view', thumbnail: '/door2-thumb.jpg' },
  { url: '/door3.jpg', alt: 'Detail shot', thumbnail: '/door3-thumb.jpg' }
]

<ProductGallery
  images={images}
  productName="Premium Closet Door"
/>
```

---

### 3. **ProductQuickView** - Modal Quick View

Quick view modal featuring:
- **Modal overlay** with backdrop blur
- **Product gallery** integration
- **Variant selection** with visual feedback
- **Quantity selector** with stock limits
- **Add to cart** functionality
- **Wishlist integration**
- **Link to full product page**
- **Keyboard accessibility** (escape to close)
- **Focus trap** for accessibility

```tsx
import { ProductQuickView, type QuickViewProduct } from '@/components/products/ProductQuickView.premium'

const product: QuickViewProduct = {
  id: '1',
  name: 'Premium Door',
  slug: 'premium-door',
  description: 'High-quality sliding door with smooth glide system',
  price: 29999,
  images: [...],
  variants: [
    {
      type: 'Color',
      options: [
        { id: 'white', name: 'White', value: 'White', inStock: true },
        { id: 'black', name: 'Black', value: 'Black', inStock: true }
      ]
    }
  ],
  features: [
    'Premium quality materials',
    'Easy installation',
    '10-year warranty'
  ]
}

<ProductQuickView
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  product={product}
  onAddToCart={(id, variant, qty) => addToCart(id, variant, qty)}
  onWishlistToggle={(id) => toggleWishlist(id)}
  isWishlisted={false}
/>
```

---

### 4. **ProductFilter** - Advanced Filtering System

Multi-faceted filtering featuring:
- **Multi-select checkboxes** with counts
- **Price range slider** with dual handles
- **Collapsible filter groups**
- **Active filter chips** with remove
- **Clear all functionality**
- **Mobile drawer** mode
- **Filter count badges**
- **Smooth animations** on expand/collapse

```tsx
import { ProductFilter, type FilterGroup, type ActiveFilters } from '@/components/products/ProductFilter.premium'

const filterGroups: FilterGroup[] = [
  {
    id: 'categories',
    label: 'Category',
    type: 'checkbox',
    options: [
      { value: 'sliding', label: 'Sliding Doors', count: 24 },
      { value: 'bifold', label: 'Bi-Fold Doors', count: 18 }
    ]
  },
  {
    id: 'colors',
    label: 'Color',
    type: 'checkbox',
    options: [
      { value: 'white', label: 'White', count: 32 },
      { value: 'black', label: 'Black', count: 28 }
    ]
  }
]

const [filters, setFilters] = useState<ActiveFilters>({})

<ProductFilter
  filterGroups={filterGroups}
  priceRange={{ min: 0, max: 100000, step: 1000 }}
  activeFilters={filters}
  onChange={setFilters}
  onClear={() => setFilters({})}
  isMobile={false} // Set to true for mobile drawer
/>
```

---

### 5. **ProductSort** - Sorting Dropdown

Premium sort dropdown featuring:
- **Smooth dropdown animation**
- **Keyboard navigation** (arrow keys)
- **Active sort indicator** with checkmark
- **Click outside to close**
- **Customizable sort options**
- **Apple-inspired design**

```tsx
import { ProductSort, type SortOption } from '@/components/products/ProductSort.premium'

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' }
]

const [sortBy, setSortBy] = useState('featured')

<ProductSort
  options={sortOptions}
  value={sortBy}
  onChange={setSortBy}
  label="Sort by"
/>
```

---

## 🎨 Design Features

### Apple Design Language
- **SF Pro typography** system
- **Apple color palette** with dark mode
- **Precise spacing** (4px base grid)
- **Subtle shadows** (apple-sm, apple-md, apple-lg)
- **Smooth animations** using Framer Motion
- **Apple physics** spring animations
- **Glass morphism** effects

### Responsive Design
- **Mobile-first** approach
- **Breakpoints**: 430px, 744px, 1068px, 1440px
- **Touch-optimized** (44px minimum targets)
- **Responsive images** with Next.js Image
- **Mobile drawer** for filters

### Accessibility (WCAG 2.1 AA)
- **Keyboard navigation** throughout
- **Focus indicators** visible
- **ARIA labels** and roles
- **Screen reader** support
- **Color contrast** AAA compliance
- **Focus trap** in modals
- **Semantic HTML** structure

---

## 🚀 Performance Optimizations

### Image Optimization
- **Lazy loading** with Intersection Observer
- **Blur placeholder** for smooth loading
- **Responsive sizes** for different viewports
- **Next.js Image** component optimization
- **WebP format** with fallbacks
- **Quality settings** per use case (60-100)

### Code Efficiency
- **React.memo** for expensive renders
- **useMemo** for computed values
- **useCallback** for event handlers
- **Framer Motion** optimized animations
- **CSS-in-JS** with Tailwind
- **Tree-shaking** friendly exports

### Bundle Size
- **Code splitting** per component
- **Dynamic imports** for heavy components
- **No external dependencies** beyond core
- **Optimized animations** with GPU acceleration

---

## 📱 Mobile Responsiveness

### Mobile Features
- **Touch gestures** (swipe, pinch-to-zoom)
- **Drawer navigation** for filters
- **Optimized tap targets** (44px min)
- **Mobile-specific UI** adaptations
- **Reduced motion** support
- **Viewport-optimized** images

### Breakpoint Behavior
```css
/* Mobile: 430px */
- Single column grid
- Drawer filters
- Simplified navigation

/* Tablet: 744px */
- Two column grid
- Sidebar filters (optional)
- Enhanced interactions

/* Desktop: 1068px */
- Three column grid
- Persistent sidebar
- Full feature set

/* Large: 1440px */
- Four column grid (optional)
- Maximum content width
- Premium spacing
```

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] Product card displays all information correctly
- [ ] Image gallery navigation works (prev/next)
- [ ] Zoom functionality operates smoothly
- [ ] Quick view modal opens/closes properly
- [ ] Filters apply and clear correctly
- [ ] Sort options change product order
- [ ] Wishlist toggle persists state
- [ ] Add to cart with correct data

### Accessibility Testing
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible and clear
- [ ] Screen reader announces changes
- [ ] ARIA labels present and correct
- [ ] Color contrast meets AAA standards
- [ ] Focus trap works in modals
- [ ] All interactive elements reachable

### Performance Testing
- [ ] Images lazy load correctly
- [ ] Animations smooth at 60fps
- [ ] No layout shift (CLS < 0.1)
- [ ] Fast interaction (FID < 100ms)
- [ ] Quick load time (LCP < 2.5s)
- [ ] Bundle size optimized
- [ ] Mobile performance acceptable

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Safari (WebKit)
- [ ] Firefox (Gecko)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🎯 Usage Examples

### Complete Product Listing Page

```tsx
'use client'

import { useState } from 'react'
import {
  ProductCard,
  ProductFilter,
  ProductSort,
  ProductQuickView,
  type ProductCardData,
  type ActiveFilters
} from '@/components/products'

export default function ProductsPage() {
  const [filters, setFilters] = useState<ActiveFilters>({})
  const [sortBy, setSortBy] = useState('featured')
  const [quickViewId, setQuickViewId] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <ProductFilter
          filterGroups={filterGroups}
          activeFilters={filters}
          onChange={setFilters}
          onClear={() => setFilters({})}
          isMobile
        />
        <ProductSort
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewId}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewId && (
        <ProductQuickView
          isOpen={!!quickViewId}
          onClose={() => setQuickViewId(null)}
          product={getProductById(quickViewId)}
        />
      )}
    </div>
  )
}
```

---

## 🔧 Customization

### Theming
All components use Tailwind utility classes and can be customized via:
- `tailwind.config.ts` - Colors, spacing, typography
- Component `className` prop - Override styles
- CSS custom properties - Dark mode colors

### Event Handlers
```tsx
// Custom event handlers
onQuickView={(id) => {
  // Track analytics
  trackEvent('product_quick_view', { product_id: id })
  // Open modal
  setQuickViewId(id)
}}

onAddToCart={(id, variant, qty) => {
  // Add to cart
  addToCart({ productId: id, variantId: variant, quantity: qty })
  // Show toast
  showToast('Added to cart!')
  // Track conversion
  trackConversion('add_to_cart', { value: product.price * qty })
}}
```

---

## 📊 Analytics Integration

### Event Tracking
```tsx
import { trackEvent } from '@/lib/analytics'

// Product view
trackEvent('product_view', {
  product_id: product.id,
  product_name: product.name,
  price: product.price / 100,
  category: product.category
})

// Quick view
trackEvent('product_quick_view', {
  product_id: product.id,
  from: 'product_card'
})

// Add to cart
trackEvent('add_to_cart', {
  product_id: product.id,
  variant_id: variantId,
  quantity: quantity,
  value: (product.price / 100) * quantity
})

// Wishlist toggle
trackEvent('wishlist_toggle', {
  product_id: product.id,
  action: isWishlisted ? 'add' : 'remove'
})
```

---

## 🛠️ Dependencies

### Required
- `next` >= 15.0.0
- `react` >= 18.0.0
- `framer-motion` >= 11.0.0
- `lucide-react` >= 0.400.0
- `tailwindcss` >= 3.4.0

### Peer Dependencies
- `@/lib/utils` - cn() utility function
- `@/lib/animations` - EASING constants
- `@/components/ui/AppleButton` - Button component

---

## 📄 File Structure

```
components/products/
├── ProductCard.premium.tsx        # Premium product card with 3D tilt
├── ProductGallery.premium.tsx     # Image gallery with zoom
├── ProductQuickView.premium.tsx   # Quick view modal
├── ProductFilter.premium.tsx      # Advanced filtering system
├── ProductSort.premium.tsx        # Sorting dropdown
├── ProductSystem.example.tsx      # Complete usage examples
├── index.premium.ts               # Barrel exports
└── README.premium.md              # This file
```

---

## 🎉 Features Summary

✅ **Premium 3D Effects** - Tilt, parallax, depth
✅ **Lazy Loading** - Optimized image performance
✅ **Price Formatting** - Multi-currency support
✅ **Stock Indicators** - Real-time availability
✅ **Rating System** - Star ratings + review count
✅ **Variant Selection** - Multiple product options
✅ **Wishlist Integration** - Save for later
✅ **Quick View Modal** - Fast product preview
✅ **Advanced Filtering** - Multi-faceted search
✅ **Smart Sorting** - Customizable order
✅ **Responsive Design** - Mobile to desktop
✅ **Accessibility** - WCAG 2.1 AA compliant
✅ **Dark Mode** - Full theme support
✅ **Animations** - Smooth, performant
✅ **TypeScript** - Full type safety

---

## 📞 Support

For issues, questions, or feature requests:
- Check examples in `ProductSystem.example.tsx`
- Review type definitions in component files
- Test with provided mock data
- Refer to accessibility guidelines

---

**Built with Apple Design System DNA**
Premium • Minimalist • Timeless
