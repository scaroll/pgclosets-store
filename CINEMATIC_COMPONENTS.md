# Cinematic Experience Components

Apple-quality visual storytelling components for PG Closets Store.

## 🎬 Component Overview

### 1. AppleHero (`components/home/AppleHero.tsx`)
**Fullscreen hero with parallax scrolling**

**Features:**
- 100vh fullscreen layout
- Smooth parallax effects on scroll
- Video or image background support
- Gradient overlays for text readability
- SF Pro Display-inspired typography
- Floating CTAs with Apple blue styling
- Animated scroll indicator

**Usage:**
```tsx
import { AppleHero } from "@/components/home/AppleHero"

<AppleHero
  videoUrl="/videos/hero.mp4"
  posterImage="/images/hero-poster.jpg"
  headline="Transform Your Space"
  subheadline="Premium closet solutions"
  ctaText="Learn more"
  ctaLink="/products"
  secondaryCtaText="Get a quote"
  secondaryCtaLink="/quote"
/>
```

**Key Props:**
- `videoUrl` (optional): MP4 video URL
- `posterImage`: Fallback/poster image
- `headline`: Main heading (large, bold)
- `subheadline` (optional): Supporting text
- `ctaText`, `ctaLink`: Primary CTA
- `secondaryCtaText`, `secondaryCtaLink` (optional): Secondary CTA

---

### 2. AppleShowcase (`components/product/AppleShowcase.tsx`)
**Horizontal scroll product gallery**

**Features:**
- Smooth snap scrolling between products
- High-resolution product images
- Scale animations on scroll into view
- Minimal product info (name, price, tagline)
- "New" badges for new products
- Apple blue CTAs ("Learn more" + "Buy")
- Gradient fade indicator on scroll edge

**Usage:**
```tsx
import { AppleShowcase } from "@/components/product/AppleShowcase"

<AppleShowcase
  title="Our Collections"
  subtitle="Premium doors engineered for modern living"
  products={[
    {
      id: "1",
      name: "Barn Door Collection",
      price: "$899",
      image: "/images/products/barn-door.jpg",
      slug: "barn-door-collection",
      tagline: "Rustic elegance",
      newProduct: true,
    },
    // ... more products
  ]}
/>
```

**Product Interface:**
```ts
interface ShowcaseProduct {
  id: string
  name: string
  price: string
  image: string
  slug: string
  tagline?: string
  newProduct?: boolean
}
```

---

### 3. FeatureHighlight (`components/features/FeatureHighlight.tsx`)
**Alternating left/right image-text layouts**

**Features:**
- Alternating layouts (image left/right)
- Scroll-triggered fade-in animations
- Large feature images (800px+)
- Subtle shadows and rounded corners
- Minimal text with bold headlines
- Apple blue CTAs
- Parallax scrolling effects

**Usage:**
```tsx
import { FeatureHighlight } from "@/components/features/FeatureHighlight"

<FeatureHighlight
  features={[
    {
      id: "1",
      headline: "Expertly Crafted",
      description: "Each door is precision-engineered...",
      image: "/images/features/craftsmanship.jpg",
      ctaText: "Learn about our process",
      ctaLink: "/about/craftsmanship",
      secondaryCtaText: "View materials",
      secondaryCtaLink: "/materials",
    },
    // ... more features
  ]}
/>
```

**Feature Interface:**
```ts
interface Feature {
  id: string
  headline: string
  description: string
  image: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}
```

---

### 4. VideoHero (`components/media/VideoHero.tsx`)
**Autoplay video backgrounds with controls**

**Features:**
- Autoplay, muted, loop support
- WebM + MP4 fallbacks
- Poster images for loading states
- Gradient overlays (customizable)
- Optional video controls (play/pause, mute)
- Content overlay support
- Responsive and accessible

**Usage:**
```tsx
import { VideoHero } from "@/components/media/VideoHero"

<VideoHero
  videoSources={{
    mp4: "/videos/showroom.mp4",
    webm: "/videos/showroom.webm",
  }}
  posterImage="/images/showroom-poster.jpg"
  alt="Our Ottawa showroom"
  autoplay
  loop
  muted
  controls
  overlay
  overlayOpacity={0.4}
  className="h-screen"
>
  <div className="text-center text-white">
    <h2>Visit Our Showroom</h2>
    <p>See and touch our products in person</p>
  </div>
</VideoHero>
```

**Props:**
- `videoSources`: Object with `mp4` (required) and `webm` (optional)
- `posterImage`: Loading state image
- `autoplay`, `loop`, `muted`: Video attributes
- `controls`: Show play/pause and mute buttons
- `overlay`: Enable gradient overlay
- `overlayOpacity`: 0-1 opacity value
- `children`: Content to overlay on video

---

### 5. AppleLayout (`app/products/[slug]/AppleLayout.tsx`)
**Product detail page layout**

**Features:**
- Sticky product images while scrolling
- Image zoom on hover
- Color and size selectors
- Quantity selector
- Technical specifications table
- "Add to bag" floating bar (mobile)
- Thumbnail navigation
- Apple-style buttons and interactions

**Usage:**
```tsx
import { AppleLayout } from "@/app/products/[slug]/AppleLayout"

<AppleLayout
  product={{
    name: "Premium Barn Door",
    price: "$899",
    tagline: "Rustic elegance",
    images: [
      { url: "/images/product-1.jpg", alt: "Front view" },
      { url: "/images/product-2.jpg", alt: "Side view" },
    ],
    colors: [
      { name: "Natural Oak", value: "#d4a574" },
      { name: "Espresso", value: "#3e2723" },
    ],
    sizes: [
      { name: '72"', value: "72", available: true },
      { name: '80"', value: "80", available: true },
    ],
    specifications: [
      { label: "Material", value: "Premium hardwood" },
      { label: "Finish", value: "Hand-applied stain" },
    ],
    description: "Handcrafted barn door...",
    features: [
      "Lifetime warranty",
      "Professional installation included",
      "Custom sizing available",
    ],
  }}
/>
```

---

## 🎨 Supporting Components

### ImageZoom (`components/media/ImageZoom.tsx`)
Hover-to-zoom image component for product details.

```tsx
import { ImageZoom } from "@/components/media/ImageZoom"

<ImageZoom
  src="/images/product.jpg"
  alt="Product detail"
  zoomLevel={2}
  className="aspect-square rounded-lg"
/>
```

### AppleButton (`components/ui/AppleButton.tsx`)
Apple-styled button component with variants.

```tsx
import { AppleButton } from "@/components/ui/AppleButton"

<AppleButton variant="primary" size="lg">
  Learn more
</AppleButton>

<AppleButton variant="secondary">
  Buy
</AppleButton>

<AppleButton variant="ghost">
  Cancel
</AppleButton>
```

### ProductCard (`components/product/ProductCard.tsx`)
Reusable product card for grids and lists.

```tsx
import { ProductCard } from "@/components/product/ProductCard"

<ProductCard
  name="Barn Door Collection"
  price="$899"
  image="/images/product.jpg"
  slug="barn-door-collection"
  tagline="Rustic elegance"
  newProduct
/>
```

---

## 🚀 Implementation Examples

### Full Homepage Implementation
See `components/examples/AppleHeroExample.tsx` for a complete example combining all components.

### Product Detail Page
The AppleLayout component is designed to be used in Next.js dynamic routes:

**File: `app/products/[slug]/page.tsx`**
```tsx
import { AppleLayout } from "./AppleLayout"
import { getProductBySlug } from "@/lib/products"

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug)

  return <AppleLayout product={product} />
}
```

---

## 🎯 Design Principles

All components follow Apple's design language:

1. **Typography**: Large, bold headlines with SF Pro Display aesthetic
2. **Spacing**: Generous whitespace and breathing room
3. **Color**: Apple blue (#0071e3) for CTAs and accents
4. **Motion**: Smooth, physics-based animations
5. **Images**: High-resolution, professionally shot
6. **Simplicity**: Minimal UI, content-first approach
7. **Accessibility**: WCAG AA compliant, keyboard navigable

---

## 📱 Responsive Design

All components are fully responsive:
- **Mobile**: Stack layouts, touch-friendly controls
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Full parallax and hover effects

---

## ⚡ Performance

- Video lazy loading and format detection
- Image optimization with Next.js Image
- Smooth 60fps animations with Framer Motion
- Minimal bundle size with tree-shaking
- Progressive enhancement approach

---

## 🎬 Demo Screenshots

Component demonstrations can be viewed at:
- `/` - AppleHero on homepage
- `/products` - AppleShowcase gallery
- `/about` - FeatureHighlight sections
- `/products/[slug]` - AppleLayout product detail

---

## 📚 Dependencies

Required packages (already installed):
- `framer-motion` - Smooth animations
- `next/image` - Image optimization
- `lucide-react` - Icons
- `class-variance-authority` - Button variants
- `tailwindcss` - Styling

---

## 🔧 Customization

All components accept className props and can be customized with:
1. Tailwind utility classes
2. Custom CSS modules
3. Theme variables in `tailwind.config.ts`

Example:
```tsx
<AppleHero
  className="bg-gradient-to-b from-neutral-900 to-black"
  // ... other props
/>
```

---

**Created by**: Cinematic Experience Team (Agents 11-20)
**Date**: 2025-10-15
**Status**: ✅ Complete and ready for production
