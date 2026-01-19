# PG Closets Apple-Inspired Rebuild Plan

## Executive Summary

Transform pgclosets.com from a feature-rich e-commerce site into an Apple-inspired luxury brand experience. The rebuild prioritizes radical simplicity, cinematic product presentation, and scroll-driven storytelling.

---

## 1. Component Hierarchy

### Layout Components
```
RootLayout
├── Header (transparent → solid on scroll)
│   ├── Logo
│   └── Navigation (Collection, Process, Atelier, Contact)
├── ViewTransitionProvider
├── PageContent
└── Footer
    ├── ContactInfo
    ├── MinimalLinks
    └── Copyright
```

### Section Components
```
sections/
├── Hero                 # Full-viewport, single product
├── Philosophy           # Centered text, breathing room
├── ProductReveal        # Scroll-triggered animation
├── ProcessSection       # Horizontal scroll (4 panels)
├── Testimonial          # Single quote, large
├── ContactCTA           # Email input only
└── SectionWrapper       # Consistent padding + fade-in
```

### UI Primitives
```
ui/
├── Button              # Primary, secondary, text variants
├── Input               # Floating label style
├── Card                # Product card with hover
├── Image               # Next/image wrapper with transitions
├── ScrollIndicator     # Animated down arrow
├── TextReveal          # Word-by-word animation
└── MagneticElement     # Cursor interaction
```

### Page Components
```
pages/
├── HomePage            # Scroll journey experience
├── CollectionPage      # 4-6 product grid
├── ProductPage         # Full-screen hero + specs
├── AtelierPage         # Workshop story
├── ContactPage         # Minimal form
└── NotFoundPage        # On-brand 404
```

---

## 2. Animation Strategy

### Motion Library: Motion 12.27+
Import pattern: `import { motion } from "motion/react"`

### Core Animation Variants
```typescript
// lib/animations.ts

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

export const slideInFromLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}
```

### Scroll-Triggered Animations
- Use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`
- Stagger children with `transition={{ staggerChildren: 0.1 }}`
- Parallax ratio: 0.1-0.2 for subtle depth

### View Transitions (React 19.2)
- Enable in root layout for page navigation
- Named transitions for product images: `view-transition-name: product-{slug}`
- Smooth crossfade between routes

### Forbidden Animations
- No particle effects
- No auto-playing video
- No carousel/slider animations
- No bouncing or excessive easing
- No animations longer than 1 second

---

## 3. Data Structure

### Product Type
```typescript
// types/product.ts

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string           // Short poetic description
  price: number
  craftHours: number        // e.g., "47 hours of handcraft"
  images: {
    hero: string            // Full-screen image
    gallery: string[]       // Detail shots
    lifestyle?: string      // Room context
  }
  specs: {
    dimensions: string
    materials: string[]
    finishes: string[]
    weight: string
  }
  story: string             // Long-form description
  featured: boolean
}
```

### Products Data
```typescript
// lib/products.ts

export const products: Product[] = [
  {
    id: "continental",
    slug: "continental",
    name: "Continental",
    tagline: "Where simplicity meets sophistication",
    price: 459,
    craftHours: 32,
    images: {
      hero: "/images/continental-hero.jpg",
      gallery: [
        "/images/continental-detail-1.jpg",
        "/images/continental-detail-2.jpg"
      ]
    },
    specs: {
      dimensions: "80\" x 24\" standard",
      materials: ["Solid maple", "Brushed steel"],
      finishes: ["Natural", "Espresso", "White"],
      weight: "45 lbs"
    },
    story: "The Continental represents...",
    featured: true
  },
  {
    id: "provincial",
    slug: "provincial",
    name: "Provincial",
    tagline: "Classic lines, timeless craft",
    price: 549,
    craftHours: 38,
    // ...
  },
  {
    id: "gatsby",
    slug: "gatsby",
    name: "Gatsby",
    tagline: "Art deco reimagined",
    price: 799,
    craftHours: 47,
    // ...
  },
  {
    id: "euro",
    slug: "euro",
    name: "Euro",
    tagline: "Pure contemporary form",
    price: 899,
    craftHours: 52,
    // ...
  }
]
```

### Site Configuration
```typescript
// lib/config.ts

export const siteConfig = {
  name: "PG Closets",
  tagline: "Doors that disappear. Until you need them.",
  phone: "(613) 701-6393",
  email: "info@pgclosets.com",
  address: "456 Sparks Street, Ottawa, ON K1P 5E9",
  established: 2009,
  social: {
    instagram: "https://instagram.com/pgclosets"
  }
}
```

---

## 4. SEO Requirements

### Metadata Strategy
```typescript
// app/layout.tsx

export const metadata: Metadata = {
  title: {
    default: "PG Closets | Crafted to Close",
    template: "%s | PG Closets"
  },
  description: "Custom closet doors handcrafted in Ottawa since 2009.",
  keywords: ["closet doors", "custom doors", "Ottawa", "luxury"],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://pgclosets.com",
    siteName: "PG Closets",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image"
  },
  robots: {
    index: true,
    follow: true
  }
}
```

### JSON-LD Structured Data

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PG Closets",
  "url": "https://pgclosets.com",
  "logo": "https://pgclosets.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "456 Sparks Street",
    "addressLocality": "Ottawa",
    "addressRegion": "ON",
    "postalCode": "K1P 5E9",
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-613-701-6393",
    "contactType": "sales"
  }
}
```

#### Product Schema (per product page)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Continental Door",
  "description": "Handcrafted closet door...",
  "image": "https://pgclosets.com/images/continental.jpg",
  "brand": {
    "@type": "Brand",
    "name": "PG Closets"
  },
  "offers": {
    "@type": "Offer",
    "price": "459",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock"
  }
}
```

### Technical SEO Files

#### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://pgclosets.com/sitemap.xml
```

#### sitemap.xml (generated)
- Homepage
- /collection
- /product/continental
- /product/provincial
- /product/gatsby
- /product/euro
- /atelier
- /contact

---

## 5. Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Priority hero image, font preload |
| INP | < 200ms | Minimal client JS, RSC |
| CLS | < 0.1 | Reserved image dimensions |
| FCP | < 1.8s | Self-hosted fonts, minimal CSS |
| TTI | < 3.5s | Code splitting, lazy loading |

### Image Optimization
- Format: AVIF primary, WebP fallback
- Hero images: priority loading
- Below-fold: lazy loading
- Sizes: 640, 750, 828, 1080, 1200, 1920

### Font Strategy
- Self-host Inter (subset: latin)
- Preload critical weights: 300, 400, 500
- Display: swap

---

## 6. Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Initialize Next.js 16.1 project
- [ ] Configure Tailwind 4.1 with @theme
- [ ] Set up Motion 12.27+
- [ ] Create root layout with ViewTransition
- [ ] Configure TypeScript strict mode

### Phase 2: Components (Day 2)
- [ ] Header component
- [ ] Footer component
- [ ] Button variants
- [ ] SectionWrapper
- [ ] ProductCard
- [ ] Animation utilities

### Phase 3: Pages (Days 3-4)
- [ ] Homepage scroll experience
- [ ] Collection grid
- [ ] Product detail
- [ ] Atelier page
- [ ] Contact page
- [ ] 404 page

### Phase 4: Polish (Day 5)
- [ ] View Transitions testing
- [ ] JSON-LD implementation
- [ ] sitemap.xml generation
- [ ] Lighthouse optimization
- [ ] Mobile responsiveness
- [ ] Final QA

---

## 7. Copy Guidelines

### Voice
- First person plural ("We believe...")
- Present tense
- Short sentences. Fragments allowed.
- No exclamation points
- No superlatives

### Key Messages

| Current | Rewritten |
|---------|-----------|
| "Ottawa's Premier Atelier" | "Since 2009" |
| "500+ Luxury Installations" | "Thousands of doors. One at a time." |
| "Bespoke Closet Doors" | "Doors that disappear. Until you need them." |
| "Request Private Consultation" | "Begin" |
| "Award-Winning Design" | (Remove - show, don't tell) |

### Page Headlines
- **Hero**: "Crafted to Close"
- **Philosophy**: "We don't make closet doors. We make the moment before you dress."
- **Process**: "47 hours of quiet attention"
- **Atelier**: "15 years of silent excellence"
- **Contact**: "Begin a conversation"

---

## 8. Verification Checklist

### Before Launch
- [ ] All pages render without errors
- [ ] View Transitions work between all routes
- [ ] Mobile responsive at 375px, 768px, 1024px, 1440px
- [ ] Lighthouse 95+ all categories
- [ ] JSON-LD validates at schema.org validator
- [ ] sitemap.xml accessible
- [ ] robots.txt configured
- [ ] No console errors
- [ ] Images optimized (WebP/AVIF)
- [ ] Fonts self-hosted and subset
- [ ] Forms submit correctly
- [ ] Contact info accurate
- [ ] No broken links

### Design Verification
- [ ] No carousels or sliders
- [ ] No hamburger menu on desktop
- [ ] No floating chat widgets
- [ ] No pop-ups
- [ ] No auto-playing video
- [ ] No exclamation points in copy
- [ ] Section padding 120px+
- [ ] Single accent color only
- [ ] Typography hierarchy correct

---

## Approval Required

This plan outlines the complete rebuild strategy. Please review and confirm:

1. Component hierarchy and structure
2. Animation approach
3. Data structure for products
4. SEO implementation
5. Performance targets
6. Timeline and phases
7. Copy guidelines

**Ready to proceed to Phase 2: Foundation?**
