# Premium Product Components - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Import Components
```tsx
import {
  ProductCard,
  ProductFilter,
  ProductSort,
  ProductQuickView,
  type ProductCardData,
  type FilterGroup,
  type SortOption
} from '@/components/products'
```

### Step 2: Prepare Your Data
```tsx
// Product data
const product: ProductCardData = {
  id: '1',
  name: 'Premium Closet Door',
  slug: 'premium-closet-door',
  price: 29999, // in cents ($299.99)
  compareAtPrice: 34999, // optional
  images: ['/door1.jpg', '/door2.jpg'],
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  stockCount: 15
}

// Filter configuration
const filterGroups: FilterGroup[] = [
  {
    id: 'categories',
    label: 'Category',
    type: 'checkbox',
    options: [
      { value: 'sliding', label: 'Sliding Doors', count: 24 },
      { value: 'bifold', label: 'Bi-Fold Doors', count: 18 }
    ]
  }
]

// Sort options
const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' }
]
```

### Step 3: Render Components
```tsx
export default function ProductPage() {
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('featured')
  const [quickViewId, setQuickViewId] = useState(null)

  return (
    <div className="container mx-auto p-4">
      {/* Toolbar */}
      <div className="flex justify-between mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          product={product}
          onQuickView={setQuickViewId}
        />
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

## 📁 File Locations

All components are in `/components/products/`:
- `ProductCard.premium.tsx` - Product card with 3D tilt
- `ProductGallery.premium.tsx` - Image gallery with zoom
- `ProductQuickView.premium.tsx` - Modal quick view
- `ProductFilter.premium.tsx` - Advanced filters
- `ProductSort.premium.tsx` - Sort dropdown
- `index.premium.ts` - Barrel exports

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` to customize:
```ts
colors: {
  'apple-blue-600': '#0066cc', // Primary color
  'apple-gray-900': '#1d1d1f', // Text color
  // ... more colors
}
```

### Animation Speed
Adjust in `@/lib/animations.ts`:
```ts
DURATION.apple = 0.4 // Change to 0.3 for faster
```

## 📱 Mobile Support

Components automatically adapt to mobile:
- ProductCard: Single column grid
- ProductFilter: Drawer mode (set `isMobile={true}`)
- ProductGallery: Touch-optimized navigation
- ProductQuickView: Full-screen on mobile

## ♿ Accessibility

All components are WCAG 2.1 AA compliant:
- Keyboard navigation (Tab, Arrow keys, Escape)
- Focus indicators (2px blue ring)
- ARIA labels and roles
- Screen reader support
- 44px minimum touch targets

## 🎯 Common Use Cases

### 1. Basic Product Listing
See `ProductSystem.example.tsx` for complete code.

### 2. Product Detail Page
```tsx
import { ProductGallery } from '@/components/products'

<ProductGallery
  images={product.images.map(url => ({ url, alt: product.name }))}
  productName={product.name}
/>
```

### 3. Standalone Filter Sidebar
```tsx
<aside className="w-64">
  <ProductFilter
    filterGroups={filterGroups}
    priceRange={{ min: 0, max: 100000 }}
    activeFilters={filters}
    onChange={setFilters}
    onClear={clearFilters}
  />
</aside>
```

## 🔧 Troubleshooting

### Images Not Loading
- Ensure images are in `/public` directory
- Use absolute paths: `/products/door.jpg`
- Check Next.js Image domains in `next.config.js`

### 3D Tilt Not Working
- Verify Framer Motion is installed: `npm list framer-motion`
- Check if `perspective` CSS is supported in browser

### TypeScript Errors
- Ensure `@types/node` is installed
- Run `npm run type-check` to see all errors
- Check that all imports are from `@/components/products`

## 📚 Next Steps

1. **Read Full Documentation**: `README.premium.md`
2. **See Examples**: `ProductSystem.example.tsx`
3. **Customize Components**: Edit `.premium.tsx` files
4. **Add Analytics**: Track events in handlers
5. **Integrate Cart**: Connect to your cart system

## 💡 Pro Tips

1. **Price in Cents**: Always store prices in cents to avoid decimal issues
2. **Lazy Images**: Use `loading="lazy"` for better performance
3. **Responsive Sizes**: Provide `sizes` prop to Next.js Image
4. **Dark Mode**: Test both light and dark modes
5. **Accessibility**: Always test with keyboard navigation

---

**Need Help?**
- Check `README.premium.md` for detailed docs
- Review examples in `ProductSystem.example.tsx`
- Inspect component props with TypeScript IntelliSense

**Built with Apple Design System DNA** ✨
