# Product Grid System - Agent 8

## Overview

Responsive product grid system built with Apple design principles, Mrigank grid patterns, and advanced performance optimizations.

## Components

### 1. ProductGridResponsive
**File:** `/components/products/ProductGridResponsive.tsx`

Main grid component with:
- 2-column mobile, 3-column tablet, 4-column desktop layout
- Lazy loading with intersection observer
- 3D tilt hover effects
- Quick view modal integration
- Optimized image loading

### 2. QuickViewModal
**File:** `/components/products/QuickViewModal.tsx`

Quick view modal with:
- Image gallery with keyboard navigation
- Variant selection
- Stock status display
- Trust signals and badges
- Smooth animations

### 3. ProductCard
**File:** `/components/products/ProductCard.tsx`

Individual product card (already exists)

## Responsive Breakpoints

Following Apple Design System:

```typescript
// Mobile (default)
grid-cols-2        // 2 columns
gap-4              // 16px gap

// Tablet (md: 744px)
md:grid-cols-3     // 3 columns
md:gap-6           // 24px gap

// Desktop (xl: 1440px)
xl:grid-cols-4     // 4 columns
gap-6              // 24px gap (maintained)
```

## Usage

### Basic Implementation

```tsx
import { ProductGridResponsive } from "@/components/products/ProductGridResponsive";
import type { Product } from "@/types/commerce";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleQuoteRequest = (product: Product) => {
    console.log("Quote requested for:", product.title);
    // Add to quote basket, open quote form, etc.
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-24">
      <h1 className="text-apple-80 font-light mb-12 text-apple-gray-900">
        Our Products
      </h1>

      <ProductGridResponsive
        products={products}
        onQuoteRequest={handleQuoteRequest}
        enableLazyLoading={true}
        enableQuickView={true}
      />
    </div>
  );
}
```

### With Filtering

```tsx
import { ProductGridResponsive } from "@/components/products/ProductGridResponsive";
import { useState, useMemo } from "react";

function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (category === "all") return allProducts;
    return allProducts.filter(p => p.collection?.handle === category);
  }, [allProducts, category]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-24">
      {/* Category Filter */}
      <div className="flex gap-4 mb-12">
        <button onClick={() => setCategory("all")}>All</button>
        <button onClick={() => setCategory("doors")}>Doors</button>
        <button onClick={() => setCategory("hardware")}>Hardware</button>
      </div>

      <ProductGridResponsive
        products={filteredProducts}
        onQuoteRequest={handleQuoteRequest}
      />
    </div>
  );
}
```

### With Search

```tsx
import { ProductGridResponsive } from "@/components/products/ProductGridResponsive";
import { useState, useMemo } from "react";

function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery) return allProducts;

    const query = searchQuery.toLowerCase();
    return allProducts.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }, [allProducts, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-24">
      {/* Search Bar */}
      <input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-12 px-4 py-3 border rounded-lg w-full max-w-md"
      />

      <p className="text-apple-gray-600 mb-6">
        {searchResults.length} products found
      </p>

      <ProductGridResponsive
        products={searchResults}
        onQuoteRequest={handleQuoteRequest}
      />
    </div>
  );
}
```

## Features

### 1. Lazy Loading
- Loads 12 products initially
- Intersection observer triggers loading 100px before scroll reaches bottom
- Smooth loading animation
- Automatic batch loading

### 2. 3D Tilt Effects
```tsx
whileHover={{
  scale: 1.02,
  rotateY: 2,
  rotateX: -2,
  z: 50,
}}
```

### 3. Quick View Modal
- Click any card to open quick view
- Image gallery with arrow navigation
- Keyboard support (Arrow keys, Escape)
- Variant selection
- Stock status
- Direct quote request

### 4. Image Optimization
```tsx
// First 6 products load eagerly
imageLoadingPriority={index < 6 ? "eager" : "lazy"}

// Next.js Image component with optimized sizes
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
```

### 5. Animations
- Staggered entrance (50ms delay per card)
- Smooth spring physics
- GPU-accelerated transforms
- AnimatePresence for exit animations

## Accessibility

### Keyboard Navigation
- Tab through products
- Enter to open quick view
- Arrow keys to navigate images
- Escape to close modal

### Screen Readers
- ARIA labels on interactive elements
- Alt text on all images
- Semantic HTML structure

### Reduced Motion
Respects `prefers-reduced-motion` system setting via Tailwind CSS.

## Performance Optimizations

### 1. Intersection Observer
```tsx
observerRef.current = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  },
  { threshold: 0.1, rootMargin: "100px" }
);
```

### 2. Batch Loading
- 12 products per batch
- Prevents overwhelming the DOM
- Smooth user experience

### 3. Image Optimization
- WebP format via Next.js
- Responsive sizes
- Lazy loading
- Priority loading for above-fold

### 4. GPU Acceleration
- Transform-based animations
- 3D perspective container
- Hardware acceleration

### 5. Code Splitting
- Dynamic imports for modals
- Lazy component loading
- Reduced initial bundle size

## Styling System

### Apple Design Tokens

```css
/* Colors */
text-apple-gray-900    /* Near black titles */
bg-apple-gray-100      /* Subtle backgrounds */
border-apple-gray-300  /* Light borders */

/* Typography */
text-apple-48          /* 48px headlines */
text-apple-17          /* 17px body text */
font-sf-display        /* Display font */
font-sf-text           /* Body font */

/* Spacing */
gap-4                  /* 16px (mobile) */
gap-6                  /* 24px (desktop) */
px-6                   /* 24px horizontal padding */
py-24                  /* 96px section padding */

/* Shadows */
shadow-apple-md        /* Medium shadow */
shadow-floating        /* Elevated shadow */

/* Border Radius */
rounded-xl             /* 12px */
rounded-apple          /* 10px */
```

### Grid Layout

```css
/* Mobile (default) */
grid grid-cols-2 gap-4

/* Tablet (md: 744px) */
md:grid-cols-3 md:gap-6

/* Desktop (xl: 1440px) */
xl:grid-cols-4
```

## Props

### ProductGridResponsive

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| products | Product[] | required | Array of products to display |
| onQuoteRequest | (product: Product) => void | required | Quote request handler |
| className | string | "" | Additional CSS classes |
| enableLazyLoading | boolean | true | Enable lazy loading |
| enableQuickView | boolean | true | Enable quick view modal |

### QuickViewModal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| product | Product | required | Product to display |
| isOpen | boolean | required | Modal open state |
| onClose | () => void | required | Close handler |
| onQuoteRequest | (product: Product) => void | required | Quote request handler |

## File Structure

```
components/products/
├── ProductGridResponsive.tsx    # Main grid component
├── ProductCard.tsx              # Individual card
├── QuickViewModal.tsx           # Quick view modal
├── ProductCardSkeleton.tsx      # Loading skeleton
└── PRODUCT-GRID-README.md       # This file
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Android Chrome 90+

## Testing Checklist

- [ ] Grid displays correctly on mobile (2 columns)
- [ ] Grid displays correctly on tablet (3 columns)
- [ ] Grid displays correctly on desktop (4 columns)
- [ ] Lazy loading triggers smoothly
- [ ] Quick view opens on card click
- [ ] Quick view closes on backdrop click
- [ ] Quick view closes on Escape key
- [ ] Image gallery navigates with arrow keys
- [ ] Variant selection updates price
- [ ] Quote request triggers correctly
- [ ] Hover effects work smoothly
- [ ] Animations respect reduced motion
- [ ] Images load with proper priorities
- [ ] Screen reader announces content

## Performance Metrics

Target metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Future Enhancements

1. **Infinite Scroll**
   - Replace manual "Load More" with automatic infinite scroll

2. **Virtual Scrolling**
   - For very large product catalogs (1000+ items)

3. **Advanced Filtering**
   - Price range
   - Multiple categories
   - Custom attributes

4. **Sort Options**
   - Price: Low to High / High to Low
   - Name: A-Z / Z-A
   - Newest / Bestsellers

5. **Compare Products**
   - Select multiple products to compare
   - Side-by-side comparison view

6. **Wishlist Integration**
   - Heart icon on cards
   - Save to wishlist

7. **Recently Viewed**
   - Track viewed products
   - Display in sidebar

## Credits

- **Design System**: Apple Design Language
- **Grid Patterns**: Mrigank (Aceternity UI)
- **Animations**: Framer Motion
- **Images**: Next.js Image Optimization
- **Agent**: Agent 8 - Product Grid System
