# Product Grid Component Hierarchy

## Visual Structure

```
Page (app/products/page.tsx)
│
└── ProductGridExample (or ProductGridResponsive)
    │
    ├── Loading State
    │   └── ProductCardSkeleton (x12)
    │       ├── Skeleton Image
    │       ├── Skeleton Title
    │       ├── Skeleton Price
    │       └── Skeleton Buttons
    │
    └── Grid Container (motion.div)
        │
        ├── Product Cards (mapped)
        │   │
        │   └── motion.div (3D hover wrapper)
        │       │
        │       ├── ProductCard
        │       │   ├── Image (Next.js Image)
        │       │   ├── Badges (BadgeChip)
        │       │   ├── Title
        │       │   ├── Description
        │       │   ├── Price
        │       │   ├── Buttons (CTALogoButton)
        │       │   └── Trust Signals
        │       │
        │       └── Quick View Overlay
        │           └── Quick View Button
        │
        ├── Loading Trigger (ref)
        │   └── Animated Dots
        │
        └── QuickViewModal
            ├── Backdrop
            └── Modal Container
                ├── Close Button
                ├── Image Gallery
                │   ├── Main Image
                │   ├── Navigation Arrows
                │   └── Thumbnails
                └── Product Details
                    ├── Title
                    ├── Price
                    ├── Description
                    ├── Variant Selection
                    ├── Stock Status
                    ├── Action Buttons
                    └── Trust Signals
```

## Component Flow

### 1. Initial Load
```
User visits page
    ↓
Page component renders
    ↓
ProductGridExample fetches products
    ↓
Shows ProductCardSkeleton (x12) while loading
    ↓
Data arrives
    ↓
Renders ProductGridResponsive with products
```

### 2. Grid Rendering
```
ProductGridResponsive receives products
    ↓
Shows first 12 products (if lazy loading enabled)
    ↓
Wraps each in motion.div with 3D hover
    ↓
Renders ProductCard for each product
    ↓
Adds Quick View overlay
    ↓
Sets up Intersection Observer on load trigger
```

### 3. Lazy Loading Flow
```
User scrolls down
    ↓
Intersection Observer detects scroll near bottom (100px margin)
    ↓
Loads next batch of 12 products
    ↓
Staggered animation reveals new products
    ↓
Process repeats until all products loaded
```

### 4. Quick View Flow
```
User clicks product card
    ↓
handleQuickView(product) called
    ↓
Sets selectedProduct state
    ↓
Opens QuickViewModal
    ↓
Modal animates in
    ↓
Body scroll locked
    ↓
User interacts with modal
    ↓
User clicks backdrop/close/escape
    ↓
Modal animates out
    ↓
Body scroll restored
```

## Data Flow

### Props Drilling
```
ProductGridExample
│ products: Product[]
│ onQuoteRequest: (product: Product) => void
│
└── ProductGridResponsive
    │ products: Product[]
    │ onQuoteRequest: (product: Product) => void
    │ enableLazyLoading: boolean
    │ enableQuickView: boolean
    │
    ├── ProductCard
    │   │ product: Product
    │   │ onQuoteRequest: (product: Product) => void
    │   │ imageLoadingPriority: "eager" | "lazy"
    │   │ className: string
    │   │
    │   └── CTALogoButton
    │       │ onClick: () => onQuoteRequest(product)
    │       │ variant: "primary" | "secondary"
    │       │ trackingContext: string
    │
    └── QuickViewModal
        │ product: Product
        │ isOpen: boolean
        │ onClose: () => void
        │ onQuoteRequest: (product: Product) => void
        │
        └── CTALogoButton
            │ onClick: () => onQuoteRequest(product)
            │ variant: "primary" | "secondary"
            │ trackingContext: string
```

## State Management

### ProductGridResponsive State
```typescript
const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
const observerRef = useRef<IntersectionObserver | null>(null);
const loadMoreRef = useRef<HTMLDivElement>(null);
```

### QuickViewModal State
```typescript
const [selectedImageIndex, setSelectedImageIndex] = useState(0);
const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
```

### ProductGridExample State
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

## Event Flow

### Hover Events
```
User hovers over card
    ↓
motion.div whileHover animation triggers
    ↓
Card scales to 1.02
Card rotates 2deg on Y-axis
Card rotates -2deg on X-axis
Card lifts 50px on Z-axis
    ↓
Quick View overlay fades in
    ↓
User moves mouse away
    ↓
Card returns to normal state
Quick View overlay fades out
```

### Click Events
```
User clicks card
    ↓
handleQuickView(product) called
    ↓
setSelectedProduct(product)
setIsQuickViewOpen(true)
    ↓
QuickViewModal renders
    ↓
AnimatePresence triggers enter animation
    ↓
Modal content appears
Body scroll disabled
```

### Keyboard Events
```
User presses key while modal open
    ↓
handleKeyDown listener activated
    ↓
If Escape: onClose()
If ArrowLeft: handlePreviousImage()
If ArrowRight: handleNextImage()
```

## Animation Timeline

### Grid Mount
```
0ms:     Container opacity 0
0ms:     Cards opacity 0, y: 20px, rotateX: -5deg
↓
50ms:    First card starts animating
100ms:   Second card starts animating (stagger: 50ms)
150ms:   Third card starts animating
...
300ms:   Container opacity 1
500ms:   All cards opacity 1, y: 0, rotateX: 0
```

### Modal Open
```
0ms:     Backdrop opacity 0
         Modal opacity 0, scale 0.95, y: 20px
↓
150ms:   Backdrop opacity 1
300ms:   Modal opacity 1, scale 1, y: 0
```

### Modal Close
```
0ms:     User clicks close/backdrop/escape
         Modal starts exit animation
↓
150ms:   Modal opacity 0, scale 0.95, y: 20px
300ms:   Backdrop opacity 0
         Modal removed from DOM
         Body scroll restored
```

## Intersection Observer Setup

```
                                    Viewport
                                    ┌────────────────────┐
                                    │                    │
                                    │  Visible Products  │
                                    │                    │
                                    │                    │
                                    ├────────────────────┤
                                    │                    │
                                    │  100px Margin      │ ← rootMargin
                                    │                    │
                                    ├────────────────────┤
                                    │  Load Trigger Ref  │ ← observerRef watches this
                                    └────────────────────┘
                                          ↓
                                    Trigger detected
                                          ↓
                                    Load next 12 products
```

## Responsive Behavior

```
Mobile (< 744px)
┌──────────┬──────────┐
│ Product  │ Product  │  2 columns
├──────────┼──────────┤  gap: 16px
│ Product  │ Product  │
└──────────┴──────────┘

Tablet (744px - 1439px)
┌────────┬────────┬────────┐
│ Product│ Product│ Product│  3 columns
├────────┼────────┼────────┤  gap: 24px
│ Product│ Product│ Product│
└────────┴────────┴────────┘

Desktop (≥ 1440px)
┌──────┬──────┬──────┬──────┐
│Product│Product│Product│Product│  4 columns
├──────┼──────┼──────┼──────┤  gap: 24px
│Product│Product│Product│Product│
└──────┴──────┴──────┴──────┘
```

## File Dependencies

```
ProductGridResponsive.tsx
├── imports
│   ├── react (useState, useEffect, useRef, useCallback)
│   ├── framer-motion (motion, AnimatePresence)
│   ├── ./ProductCard
│   ├── @/types/commerce (Product)
│   └── ./QuickViewModal
│
ProductCard.tsx
├── imports
│   ├── next/image
│   ├── @/types/commerce (Product)
│   ├── @/lib/utils (formatPrice)
│   ├── @/components/ui/card
│   ├── @/components/ui/badge
│   ├── @/components/ui/badge-chip
│   └── @/components/conversion/LogoConversionOptimizer
│
QuickViewModal.tsx
├── imports
│   ├── react (useState, useEffect)
│   ├── framer-motion (motion, AnimatePresence)
│   ├── next/image
│   ├── @/types/commerce (Product)
│   ├── @/lib/utils (formatPrice)
│   ├── lucide-react (icons)
│   ├── @/components/ui/badge
│   ├── @/components/ui/badge-chip
│   └── @/components/conversion/LogoConversionOptimizer
```

## CSS Classes

### Grid Layout
```css
grid                    /* Display grid */
gap-4                   /* 16px gap (mobile) */
md:gap-6               /* 24px gap (tablet+) */
grid-cols-2            /* 2 columns (mobile) */
md:grid-cols-3         /* 3 columns (tablet) */
xl:grid-cols-4         /* 4 columns (desktop) */
```

### Card Wrapper
```css
group                  /* Enable group-hover */
relative              /* Position context */
```

### 3D Transform
```css
style={{
  perspective: "1000px",         /* Parent container */
  transformStyle: "preserve-3d"  /* Child elements */
}}
```

### Quick View Overlay
```css
absolute inset-0                           /* Cover card */
bg-black/60 backdrop-blur-sm              /* Dark blur */
opacity-0 group-hover:opacity-100         /* Show on hover */
transition-opacity duration-300           /* Smooth fade */
pointer-events-none                        /* Don't block clicks */
z-10                                      /* Above card */
```

---

This hierarchy provides a complete visual map of how all components work together to create the product grid system.
