# 🏗️ COMPLETE WEBSITE REBUILD: PG CLOSETS OTTAWA
## Master Prompt for Claude Sonnet 3.5 - Once UI Ground-Up Reconstruction

---

## 🎯 EXECUTIVE SUMMARY

**Mission**: Rebuild the entire PG Closets website from absolute zero using Once UI v1.4.32, Next.js 14.2.5, and modern web standards. Extract ONLY business content and data - rebuild ALL architecture, components, layouts, and functionality fresh.

**Why Rebuild**: Current site has 110+ pages, 593 component files, mixed legacy code, OnceUI compatibility issues with Next.js 15, and technical debt. Start clean with modern foundation.

**Outcome**: Production-ready, conversion-optimized e-commerce website for premium closet doors in Ottawa using Once UI design system throughout.

---

## 📊 CURRENT SITE ANALYSIS

### Site Complexity
```yaml
Total Pages: 110+
Components: 593 TypeScript/React files
Lines of Code: 50,000+
Product Database: 305,871 lines JSON (Renin products)
Service Areas: Ottawa + 10 neighborhoods
Business Type: E-commerce + Service-based
Primary Revenue: Custom closet door installation
```

### Core Business Data (PRESERVE THIS)
```typescript
// From lib/business-info.ts - THIS IS YOUR BIBLE
const BUSINESS_INFO = {
  name: 'PG Closets',
  tagline: 'Elevated Taste Without Pretense',
  phone: '(613) 701-6393',
  email: 'info@pgclosets.com',

  serviceArea: {
    primaryCity: 'Ottawa',
    radius: 30, // km
    neighborhoods: [
      'Kanata', 'Orleans', 'Barrhaven', 'Nepean',
      'Gloucester', 'Vanier', 'Rockcliffe', 'Westboro',
      'The Glebe', 'Old Ottawa South'
    ]
  },

  metrics: {
    yearsInBusiness: 8,
    projectsCompleted: '500+',
    rating: 5.0,
    ratingCount: 127,
    warrantyYears: 'Lifetime'
  },

  partnerships: {
    primary: 'Renin',
    status: 'Official Authorized Dealer'
  },

  service: {
    freeConsultation: true,
    leadTime: '2-3 weeks',
    warranty: {
      materials: 'Lifetime',
      installation: '5 years',
      satisfaction: '30 days'
    }
  }
}
```

### Product Categories (FROM EXISTING SITE)
1. **Renin Barn Doors** - Rustic modern sliding doors
2. **Renin Bifold Doors** - Space-saving folding doors
3. **Renin Bypass Doors** - Traditional sliding closet doors
4. **Renin Pivot Doors** - Contemporary rotating doors
5. **Renin Room Dividers** - Open-concept space separators
6. **Hardware & Accessories** - Tracks, handles, mirrors
7. **Closet Systems** - Complete storage solutions

---

## 🏗️ TECHNOLOGY STACK (NON-NEGOTIABLE)

```yaml
Core Framework:
  Next.js: 14.2.5  # NOT 15.x - stability critical
  React: 18.3.1
  TypeScript: 5.x
  Node: 18.x or 20.x LTS

Design System:
  Once UI: 1.4.32  # Official version - test compatibility first
  Tailwind CSS: 3.4.x  # For custom utilities

Styling:
  - Once UI components (primary)
  - Tailwind utilities (secondary)
  - Custom CSS modules (minimal)
  - No styled-components, no emotion

State Management:
  React Context: Global state (cart, auth, etc.)
  React Query: Server state management
  Zustand: Optional for complex state

Forms:
  React Hook Form: All forms
  Zod: Schema validation

Data & APIs:
  Next.js API Routes: Backend logic
  Resend: Email delivery
  Vercel Blob: Image storage

Analytics:
  Google Analytics 4
  Vercel Analytics
  Custom event tracking

Performance:
  Next.js Image Optimization
  Code Splitting automatic
  Route prefetching
  Lazy loading

Deployment:
  Vercel: Primary platform
  GitHub: Version control
  Vercel Postgres: Optional database
```

---

## 🎨 ONCE UI DESIGN SYSTEM - IMPLEMENTATION GUIDE

### Once UI Configuration

```typescript
// once.config.ts - Your Design Foundation
import type { OnceUIConfig } from '@once-ui-system/core'

export const config: OnceUIConfig = {
  // Brand Identity
  brand: {
    name: 'PG Closets',
    logo: '/images/pg-logo.svg',
    colors: {
      primary: '#0D9488',      // Teal - Premium, trustworthy
      secondary: '#64748B',    // Slate - Professional
      accent: '#F59E0B',       // Amber - Warmth, call-to-action
      success: '#10B981',      // Emerald - Confirmation
      warning: '#F59E0B',      // Amber - Alerts
      error: '#EF4444',        // Red - Errors
      info: '#3B82F6'          // Blue - Information
    }
  },

  // Typography System
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace'
    },
    scale: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    }
  },

  // Spacing System (8px grid)
  spacing: {
    unit: 8,
    scale: {
      '0': '0',
      '1': '0.5rem',   // 8px
      '2': '1rem',     // 16px
      '3': '1.5rem',   // 24px
      '4': '2rem',     // 32px
      '5': '2.5rem',   // 40px
      '6': '3rem',     // 48px
      '8': '4rem',     // 64px
      '10': '5rem',    // 80px
      '12': '6rem',    // 96px
      '16': '8rem'     // 128px
    }
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  },

  // Animation
  transitions: {
    duration: {
      fast: '150ms',
      base: '250ms',
      slow: '350ms'
    },
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  // Responsive Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
}

export default config
```

### Once UI Component Inventory

```typescript
// Complete list of Once UI components you'll use

// Layout Components
import {
  Container,      // Max-width wrapper with responsive padding
  Grid,          // CSS Grid layout system
  Flex,          // Flexbox layout system
  Stack,         // Vertical stacking with gap
  Cluster,       // Horizontal clustering
  Section,       // Semantic section with spacing
  Sidebar,       // Sidebar layout pattern
  Switcher,      // Responsive layout switcher
  Frame,         // Aspect ratio wrapper
  Center,        // Center content
  Spacer         // Flexible spacing
} from '@once-ui-system/core/layout'

// Typography Components
import {
  Heading,       // h1-h6 with variants
  Text,          // Paragraph and inline text
  Link,          // Styled anchor tags
  Label,         // Form labels
  Code,          // Inline code
  Blockquote     // Quote blocks
} from '@once-ui-system/core/typography'

// Form Components
import {
  Input,         // Text input fields
  Textarea,      // Multi-line input
  Select,        // Dropdown select
  Checkbox,      // Checkboxes
  Radio,         // Radio buttons
  Switch,        // Toggle switches
  Slider,        // Range sliders
  FileUpload,    // File upload
  Form,          // Form wrapper
  FormField      // Field wrapper with label/error
} from '@once-ui-system/core/forms'

// Interactive Components
import {
  Button,        // Primary UI buttons
  IconButton,    // Icon-only buttons
  ToggleGroup,   // Toggle button groups
  Menu,          // Dropdown menus
  Dialog,        // Modal dialogs
  Popover,       // Floating popover
  Tooltip,       // Hover tooltips
  Tabs,          // Tab navigation
  Accordion,     // Collapsible sections
  Drawer,        // Side drawer panel
  Sheet          // Bottom sheet mobile
} from '@once-ui-system/core/interactive'

// Feedback Components
import {
  Toast,         // Toast notifications
  Alert,         // Alert messages
  Badge,         // Status badges
  Chip,          // Tag chips
  Avatar,        // User avatars
  Skeleton,      // Loading skeletons
  Spinner,       // Loading spinner
  Progress,      // Progress bars
  Empty          // Empty states
} from '@once-ui-system/core/feedback'

// Data Display
import {
  Card,          // Content cards
  Table,         // Data tables
  List,          // Styled lists
  DataList,      // Key-value pairs
  Stat,          // Statistic display
  Timeline,      // Event timeline
  Carousel,      // Image carousel
  Gallery        // Image gallery
} from '@once-ui-system/core/display'

// Navigation
import {
  Navbar,        // Top navigation
  Breadcrumb,    // Breadcrumb nav
  Pagination,    // Page navigation
  Steps,         // Step indicator
  Sidebar as NavSidebar  // Side navigation
} from '@once-ui-system/core/navigation'

// Icons (from Once UI icon library)
import {
  Icon,
  IconName       // Type for icon names
} from '@once-ui-system/core/icons'
```

---

## 🏛️ SITE ARCHITECTURE - PAGE STRUCTURE

### Critical Pages (Build First)

```typescript
// Priority 1: MVP Core
/                              // Homepage with hero, featured products
/products                      // Product catalog with filters
/products/[category]           // Category pages (barn-doors, bifold, etc.)
/products/[category]/[product] // Individual product details
/quote                         // Interactive quote calculator
/contact                       // Contact form
/about                         // Company information

// Priority 2: Conversion Funnel
/book-measure                  // Schedule measurement appointment
/consultation                  // Free consultation booking
/services                      // Services overview
/services/installation         // Installation details
/services/warranty             // Warranty information
/cart                          // Shopping cart
/checkout                      // Checkout process

// Priority 3: SEO & Local
/ottawa                        // Ottawa landing page
/[neighborhood]                // Area-specific pages (kanata, orleans, etc.)
/gallery                       // Project showcase
/faq                           // Frequently asked questions
/blog                          // Content marketing (optional)

// Priority 4: Legal & Support
/privacy-policy
/terms-of-service
/return-policy
/shipping-policy

// Admin (Optional Phase 2)
/admin/products                // Product management
/admin/orders                  // Order tracking
/admin/performance             // Analytics dashboard
```

### File Structure

```
pgclosets-rebuild/
├── .next/                     # Next.js build output
├── public/
│   ├── images/
│   │   ├── products/          # Product images
│   │   ├── hero/              # Hero backgrounds
│   │   ├── gallery/           # Installation photos
│   │   └── logos/             # Brand assets
│   ├── icons/                 # Favicons, app icons
│   └── manifest.json          # PWA manifest
│
├── src/
│   ├── app/                   # Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout with OnceUI providers
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles + OnceUI imports
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx       # Product listing
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx   # Category page
│   │   │   │   └── [product]/
│   │   │   │       └── page.tsx  # Product detail
│   │   │   └── loading.tsx    # Loading state
│   │   │
│   │   ├── quote/
│   │   │   └── page.tsx       # Quote calculator
│   │   │
│   │   ├── api/               # API routes
│   │   │   ├── quote/
│   │   │   │   └── route.ts   # Quote submission
│   │   │   ├── contact/
│   │   │   │   └── route.ts   # Contact form
│   │   │   └── products/
│   │   │       └── route.ts   # Product API
│   │   │
│   │   └── [area]/            # Dynamic area pages
│   │       └── page.tsx
│   │
│   ├── components/            # React components (ALL Once UI based)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── TrustSignals.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductSpecs.tsx
│   │   │   └── AddToCart.tsx
│   │   │
│   │   ├── quote/
│   │   │   ├── QuoteWizard.tsx
│   │   │   ├── QuoteSteps.tsx
│   │   │   ├── QuoteForm.tsx
│   │   │   └── QuoteEstimate.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   └── NewsletterForm.tsx
│   │   │
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── SEOHead.tsx
│   │   │   └── BreadcrumbNav.tsx
│   │   │
│   │   └── shared/
│   │       ├── TrustBadges.tsx
│   │       ├── ServiceAreaMap.tsx
│   │       ├── ReviewStars.tsx
│   │       └── SocialProof.tsx
│   │
│   ├── lib/                   # Core utilities & data
│   │   ├── config/
│   │   │   ├── once-ui.config.ts    # Once UI theme
│   │   │   ├── site.config.ts       # Site settings
│   │   │   └── seo.config.ts        # SEO defaults
│   │   │
│   │   ├── data/
│   │   │   ├── business-info.ts     # PRESERVE FROM OLD SITE
│   │   │   ├── products.ts          # Product catalog
│   │   │   ├── categories.ts        # Product categories
│   │   │   └── service-areas.ts     # Ottawa neighborhoods
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useQuote.ts
│   │   │   └── useMediaQuery.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── format.ts            # Formatting helpers
│   │   │   ├── validation.ts        # Zod schemas
│   │   │   ├── analytics.ts         # Tracking
│   │   │   └── seo.ts              # SEO helpers
│   │   │
│   │   └── context/
│   │       ├── CartContext.tsx
│   │       ├── AuthContext.tsx
│   │       └── ToastContext.tsx
│   │
│   ├── styles/
│   │   ├── globals.css              # Base + Once UI imports
│   │   ├── theme.css                # CSS variables
│   │   └── utilities.css            # Custom Tailwind
│   │
│   └── types/
│       ├── product.ts
│       ├── cart.ts
│       ├── quote.ts
│       └── index.ts
│
├── once.config.ts             # Once UI configuration
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind + Once UI integration
├── tsconfig.json              # TypeScript config
├── package.json
└── README.md
```

---

## 🎨 DESIGN SYSTEM IMPLEMENTATION

### Once UI Theme Application

```typescript
// src/app/layout.tsx - Root Layout
import { OnceUIProvider } from '@once-ui-system/core'
import onceConfig from '../../once.config'
import './globals.css'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <OnceUIProvider config={onceConfig}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </OnceUIProvider>
      </body>
    </html>
  )
}
```

```css
/* src/app/globals.css */
/* Import Once UI Core Styles */
@import '@once-ui-system/core/css/index.css';

/* Tailwind Base */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables from Once UI Config */
:root {
  --color-primary: theme('colors.teal.600');
  --color-secondary: theme('colors.slate.600');
  --color-accent: theme('colors.amber.500');

  --font-sans: theme('fontFamily.sans');
  --font-display: theme('fontFamily.sans');

  --radius-base: 0.5rem;
  --shadow-md: theme('boxShadow.md');
}

/* Global Overrides (Minimal) */
body {
  font-family: var(--font-sans);
  color: theme('colors.gray.900');
  background: theme('colors.white');
}
```

### Component Examples with Once UI

#### Homepage Hero Component

```typescript
// src/components/home/Hero.tsx
import { Container, Flex, Heading, Text, Button, Stack } from '@once-ui-system/core'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/elegant-closet-doors.jpg"
          alt="Premium closet doors by PG Closets Ottawa"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>

      {/* Content */}
      <Container size="xl" className="relative z-10">
        <Flex direction="column" gap="6" maxWidth="2xl">
          {/* Trust Badge */}
          <Stack gap="2">
            <Badge variant="primary" size="lg">
              <Flex gap="2" alignItems="center">
                <Icon name="shield-check" size="sm" />
                <Text size="sm" weight="semibold">Official Renin Dealer</Text>
              </Flex>
            </Badge>
          </Stack>

          {/* Headline */}
          <Heading
            variant="display"
            size="4xl"
            className="text-white"
          >
            Elevated Taste Without Pretense
          </Heading>

          {/* Subheadline */}
          <Text size="xl" className="text-white/90" maxWidth="xl">
            Transform your Ottawa home with premium Renin closet doors.
            Professional installation, lifetime warranty, 2-week delivery.
          </Text>

          {/* Trust Signals */}
          <Flex gap="6" className="text-white/80 text-sm">
            <Flex gap="2" alignItems="center">
              <Icon name="check-circle" size="sm" />
              <Text>500+ Ottawa Homes</Text>
            </Flex>
            <Flex gap="2" alignItems="center">
              <Icon name="star" size="sm" />
              <Text>5.0 Rating (127 Reviews)</Text>
            </Flex>
            <Flex gap="2" alignItems="center">
              <Icon name="shield" size="sm" />
              <Text>Lifetime Warranty</Text>
            </Flex>
          </Flex>

          {/* CTAs */}
          <Flex gap="4" className="mt-4">
            <Button
              variant="primary"
              size="lg"
              href="/quote"
              className="shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Flex gap="2" alignItems="center">
                <Text>Get Instant Quote</Text>
                <Icon name="arrow-right" size="sm" />
              </Flex>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              href="/consultation"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Flex gap="2" alignItems="center">
                <Icon name="calendar" size="sm" />
                <Text>Book Free Consultation</Text>
              </Flex>
            </Button>
          </Flex>

          {/* Secondary Info */}
          <Text size="sm" className="text-white/60 mt-2">
            Free measurement within 30km • Price match guarantee • 2-3 week delivery
          </Text>
        </Flex>
      </Container>
    </section>
  )
}
```

#### Product Card Component

```typescript
// src/components/products/ProductCard.tsx
import { Card, Stack, Flex, Heading, Text, Button, Badge } from '@once-ui-system/core'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      variant="elevated"
      hover="lift"
      className="overflow-hidden group"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0] || '/images/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.featured && (
            <Badge variant="primary">Featured</Badge>
          )}
          {product.inStock ? (
            <Badge variant="success">In Stock</Badge>
          ) : (
            <Badge variant="secondary">Made to Order</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <Stack gap="3" className="p-4">
        {/* Category */}
        <Text size="sm" variant="secondary" className="uppercase tracking-wider">
          {product.category}
        </Text>

        {/* Title */}
        <Heading variant="h3" size="lg" className="line-clamp-2">
          {product.name}
        </Heading>

        {/* Description */}
        <Text size="sm" variant="secondary" className="line-clamp-3">
          {product.description}
        </Text>

        {/* Features */}
        <Flex gap="2" wrap="wrap">
          {product.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="neutral" size="sm">
              {feature}
            </Badge>
          ))}
        </Flex>

        {/* Price & CTA */}
        <Flex justifyContent="between" alignItems="center" className="mt-auto pt-4">
          <Stack gap="1">
            <Text size="xs" variant="secondary">Starting at</Text>
            <Heading variant="h4" size="xl" className="text-primary">
              ${product.price.toLocaleString()}
            </Heading>
          </Stack>

          <Flex gap="2">
            <Button
              variant="primary"
              size="md"
              as={Link}
              href={`/products/${product.category}/${product.slug}`}
            >
              View Details
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  )
}
```

#### Quote Wizard Component

```typescript
// src/components/quote/QuoteWizard.tsx
'use client'

import { useState } from 'react'
import {
  Card,
  Stack,
  Steps,
  Button,
  Flex,
  Heading,
  Text,
  Progress
} from '@once-ui-system/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema } from '@/lib/utils/validation'

export function QuoteWizard() {
  const [step, setStep] = useState(0)
  const [estimate, setEstimate] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(quoteSchema)
  })

  const steps = [
    { label: 'Door Type', icon: 'home' },
    { label: 'Dimensions', icon: 'ruler' },
    { label: 'Style', icon: 'palette' },
    { label: 'Installation', icon: 'tools' },
    { label: 'Contact', icon: 'user' }
  ]

  const onSubmit = async (data: any) => {
    // Calculate estimate
    const calculatedEstimate = calculateQuote(data)
    setEstimate(calculatedEstimate)

    // Submit to API
    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      // Show success toast
      toast.success('Quote request submitted!')
    }
  }

  return (
    <Container size="lg" className="py-12">
      <Card variant="elevated" className="p-8">
        {/* Progress Header */}
        <Stack gap="6">
          <Flex direction="column" gap="2" alignItems="center">
            <Heading variant="h2" size="2xl" align="center">
              Get Your Instant Quote
            </Heading>
            <Text align="center" variant="secondary">
              Answer a few questions to receive a detailed estimate
            </Text>
          </Flex>

          {/* Progress Bar */}
          <Progress
            value={(step / (steps.length - 1)) * 100}
            variant="primary"
            size="lg"
          />

          {/* Steps Indicator */}
          <Steps current={step} items={steps} />

          {/* Step Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="6">
              {step === 0 && <DoorTypeStep register={register} errors={errors} />}
              {step === 1 && <DimensionsStep register={register} errors={errors} />}
              {step === 2 && <StyleStep register={register} errors={errors} />}
              {step === 3 && <InstallationStep register={register} errors={errors} />}
              {step === 4 && <ContactStep register={register} errors={errors} />}

              {/* Navigation */}
              <Flex justifyContent="between">
                <Button
                  variant="secondary"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                >
                  <Icon name="arrow-left" size="sm" />
                  Previous
                </Button>

                {step < steps.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                    <Icon name="arrow-right" size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" variant="primary" size="lg">
                    Get My Quote
                  </Button>
                )}
              </Flex>
            </Stack>
          </form>

          {/* Live Estimate */}
          {estimate && (
            <Card variant="primary" className="p-6">
              <Flex direction="column" alignItems="center" gap="2">
                <Text size="sm" variant="secondary">Estimated Investment</Text>
                <Heading variant="display" size="4xl" className="text-primary">
                  ${estimate.toLocaleString()}
                </Heading>
                <Text size="sm">Professional installation included</Text>
              </Flex>
            </Card>
          )}
        </Stack>
      </Card>
    </Container>
  )
}
```

---

## 📦 DATA EXTRACTION & MIGRATION

### Business Data Migration

```typescript
// src/lib/data/business-info.ts
// COPY EXACTLY FROM EXISTING SITE: lib/business-info.ts

export const BUSINESS_INFO = {
  // Copy the entire BUSINESS_INFO object from existing site
  // This is your source of truth
}

// All helper functions
export {
  getPhoneDisplay,
  getPhoneHref,
  getEmail,
  getSocialLink,
  getServiceAreaText,
  getWarrantyText,
  getSocialProofText,
  getBusinessSchema
}
```

### Product Database Migration

```typescript
// src/lib/data/products.ts
// Extract from: lib/renin-products-database.json

import productsData from './renin-products-database.json'

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory?: string
  price: number
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  featured?: boolean
  sku?: string
}

export const products: Product[] = productsData.map(product => ({
  // Transform old format to new simplified format
  // Keep only essential fields
}))

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured).slice(0, 6)
}
```

### Content Extraction Checklist

- [ ] Business contact information (phone, email, hours)
- [ ] Service area data (Ottawa neighborhoods)
- [ ] Product catalog (Renin database)
- [ ] Product categories and descriptions
- [ ] Service offerings and pricing
- [ ] Trust signals and metrics (500+ installs, ratings)
- [ ] Warranty terms
- [ ] FAQ content
- [ ] About us content
- [ ] SEO metadata and keywords
- [ ] Gallery/project images
- [ ] Customer testimonials (if any)

---

## 🎯 CONVERSION OPTIMIZATION FEATURES

### Interactive Quote Calculator

```typescript
// Smart pricing algorithm
function calculateQuote(data: QuoteFormData): number {
  const basePrices = {
    'barn-doors': 800,
    'bifold-doors': 600,
    'bypass-doors': 700,
    'pivot-doors': 900
  }

  let total = basePrices[data.doorType] || 0

  // Size modifiers
  const sqFt = (data.width * data.height) / 144 // Convert to sq ft
  total += sqFt * 25 // $25 per sq ft

  // Style premium
  if (data.style === 'custom') total *= 1.3
  if (data.finish === 'premium') total *= 1.2

  // Installation
  if (data.includeInstallation) total += 400

  // Hardware upgrades
  if (data.hardwareUpgrade) total += 200

  // Quantity discount
  if (data.quantity > 1) {
    total *= data.quantity
    total *= 0.9 // 10% multi-door discount
  }

  return Math.round(total)
}
```

### Trust Building Elements

```typescript
// src/components/shared/TrustBadges.tsx
export function TrustBadges() {
  const badges = [
    {
      icon: 'shield-check',
      title: 'Official Renin Dealer',
      description: 'Authorized products & warranty'
    },
    {
      icon: 'star',
      title: '5.0 Rating',
      description: '127 verified reviews'
    },
    {
      icon: 'award',
      title: '500+ Installations',
      description: 'Ottawa & surrounding areas'
    },
    {
      icon: 'clock',
      title: '2-3 Week Delivery',
      description: 'Fast turnaround guaranteed'
    },
    {
      icon: 'shield',
      title: 'Lifetime Warranty',
      description: 'Materials & workmanship'
    },
    {
      icon: 'dollar-sign',
      title: 'Price Match',
      description: 'Best value guaranteed'
    }
  ]

  return (
    <Grid columns={{ default: 1, sm: 2, lg: 3 }} gap="4">
      {badges.map((badge, index) => (
        <Card key={index} variant="subtle" className="p-4">
          <Flex gap="3" alignItems="start">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name={badge.icon} size="lg" className="text-primary" />
            </div>
            <Stack gap="1">
              <Heading variant="h4" size="sm">{badge.title}</Heading>
              <Text size="sm" variant="secondary">{badge.description}</Text>
            </Stack>
          </Flex>
        </Card>
      ))}
    </Grid>
  )
}
```

### Service Area Targeting

```typescript
// src/components/shared/ServiceAreaMap.tsx
export function ServiceAreaMap() {
  const areas = [
    { name: 'Ottawa', slug: 'ottawa', projects: 180 },
    { name: 'Kanata', slug: 'kanata', projects: 95 },
    { name: 'Orleans', slug: 'orleans', projects: 78 },
    { name: 'Barrhaven', slug: 'barrhaven', projects: 67 },
    { name: 'Nepean', slug: 'nepean', projects: 54 }
  ]

  return (
    <Section>
      <Container size="lg">
        <Stack gap="8">
          <Flex direction="column" gap="2" alignItems="center">
            <Heading variant="h2" size="2xl" align="center">
              Proudly Serving Ottawa & Surrounding Areas
            </Heading>
            <Text align="center" variant="secondary" maxWidth="2xl">
              Free consultation and measurement within 30km. We've completed 500+ installations across the Ottawa region.
            </Text>
          </Flex>

          <Grid columns={{ default: 1, sm: 2, md: 3, lg: 5 }} gap="4">
            {areas.map((area) => (
              <Card
                key={area.slug}
                variant="interactive"
                as={Link}
                href={`/${area.slug}`}
                className="p-6 hover:border-primary transition-colors"
              >
                <Stack gap="2" alignItems="center">
                  <Icon name="map-pin" size="xl" className="text-primary" />
                  <Heading variant="h3" size="lg">{area.name}</Heading>
                  <Badge variant="neutral">{area.projects} Projects</Badge>
                </Stack>
              </Card>
            ))}
          </Grid>

          <Text align="center" size="sm" variant="secondary">
            Also serving Gloucester, Vanier, Westboro, The Glebe, and all areas within 30km of downtown Ottawa
          </Text>
        </Stack>
      </Container>
    </Section>
  )
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Next.js 14 Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modern image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/avif', 'image/webp'],
    domains: [
      'pgclosets.com',
      'renin.com',
      'images.unsplash.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com'
    ],
    minimumCacheTTL: 31536000 // 1 year
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features (STABLE only)
  experimental: {
    optimizePackageImports: [
      '@once-ui-system/core',
      'lucide-react'
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // No experimental flags that could cause issues
  // Keep it stable and production-ready
}

module.exports = nextConfig
```

### Loading States & Suspense

```typescript
// src/app/products/loading.tsx
import { Skeleton, Grid, Container } from '@once-ui-system/core'

export default function ProductsLoading() {
  return (
    <Container size="xl" className="py-12">
      <Grid columns={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap="6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton height="300px" width="100%" />
            <Skeleton height="20px" width="70%" />
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="90%" />
          </div>
        ))}
      </Grid>
    </Container>
  )
}
```

### Image Optimization

```typescript
// src/components/shared/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'
import { Skeleton } from '@once-ui-system/core'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <Skeleton
          width={width ? `${width}px` : '100%'}
          height={height ? `${height}px` : '100%'}
          className="absolute inset-0"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        onLoadingComplete={() => setIsLoading(false)}
        quality={90}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

---

## 🔍 SEO IMPLEMENTATION

### Metadata Generation

```typescript
// src/app/layout.tsx - Root metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pgclosets.com'),
  title: {
    default: 'PG Closets Ottawa | Premium Renin Closet Doors & Installation',
    template: '%s | PG Closets Ottawa'
  },
  description: 'Ottawa\'s premier Renin dealer. Custom closet doors, professional installation, lifetime warranty. 500+ installations. Free consultation. 2-3 week delivery.',
  keywords: [
    'closet doors Ottawa',
    'Renin dealer Ottawa',
    'sliding doors Ottawa',
    'barn doors Ottawa',
    'custom closet doors',
    'closet installation Ottawa'
  ],
  authors: [{ name: 'PG Closets' }],
  creator: 'PG Closets',
  publisher: 'PG Closets',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://www.pgclosets.com',
    siteName: 'PG Closets Ottawa',
    title: 'PG Closets | Premium Closet Doors Ottawa',
    description: 'Transform your space with premium Renin closet doors. Professional installation, lifetime warranty, 500+ satisfied Ottawa customers.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Closets Ottawa - Premium Closet Doors'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Closets Ottawa',
    description: 'Premium Renin closet doors with professional installation',
    images: ['/images/twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://www.pgclosets.com'
  }
}
```

```typescript
// src/app/products/[category]/[product]/page.tsx - Product metadata
import { generateProductMetadata } from '@/lib/utils/seo'

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.product)

  return {
    title: `${product.name} | ${product.category}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
      type: 'product',
      product: {
        price: {
          amount: product.price,
          currency: 'CAD'
        }
      }
    }
  }
}
```

### Structured Data

```typescript
// src/lib/utils/seo.ts
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Renin'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CAD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'PG Closets'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '127'
    }
  }
}
```

---

## 📱 RESPONSIVE DESIGN

### Mobile-First Approach

```typescript
// Use Once UI's responsive props everywhere
<Grid
  columns={{
    default: 1,    // Mobile
    sm: 2,         // Tablet
    lg: 3,         // Desktop
    xl: 4          // Large desktop
  }}
  gap={{
    default: '4',
    lg: '6'
  }}
>
  {/* Content */}
</Grid>

<Heading
  size={{
    default: 'xl',   // Mobile
    sm: '2xl',       // Tablet
    lg: '4xl'        // Desktop
  }}
  align={{
    default: 'center',
    lg: 'left'
  }}
>
  Responsive Heading
</Heading>
```

### Mobile Navigation

```typescript
// src/components/layout/MobileMenu.tsx
'use client'

import { useState } from 'react'
import { Drawer, Stack, Button, Flex, Heading } from '@once-ui-system/core'
import Link from 'next/link'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="md"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" size="lg" />
      </Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        side="left"
        size="sm"
      >
        <Stack gap="4" className="p-6">
          <Flex justifyContent="between" alignItems="center">
            <Heading variant="h3" size="lg">Menu</Heading>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <Icon name="x" />
            </Button>
          </Flex>

          <Stack gap="2">
            {links.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="lg"
                as={Link}
                href={link.href}
                className="justify-start text-left w-full"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <div className="pt-6 border-t">
            <Stack gap="3">
              <Button variant="primary" size="lg" href="/quote" className="w-full">
                Get Quote
              </Button>
              <Button variant="secondary" size="lg" href="/book-measure" className="w-full">
                Book Measure
              </Button>
            </Stack>
          </div>
        </Stack>
      </Drawer>
    </>
  )
}
```

---

## 🧪 TESTING & QUALITY

### Form Validation with Zod

```typescript
// src/lib/utils/validation.ts
import { z } from 'zod'

export const quoteSchema = z.object({
  doorType: z.enum(['barn-doors', 'bifold-doors', 'bypass-doors', 'pivot-doors']),
  width: z.number().min(24).max(120),
  height: z.number().min(60).max(120),
  quantity: z.number().min(1).max(10),
  style: z.string(),
  finish: z.string(),
  includeInstallation: z.boolean(),
  includeHardware: z.boolean(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/),
  preferredContactMethod: z.enum(['email', 'phone', 'text']),
  message: z.string().optional()
})

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10).max(1000)
})
```

### Error Handling

```typescript
// src/components/ui/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Container, Stack, Heading, Text, Button } from '@once-ui-system/core'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="md" className="py-20">
          <Stack gap="6" alignItems="center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="alert-triangle" size="xl" className="text-red-600" />
            </div>
            <Stack gap="2" alignItems="center">
              <Heading variant="h2" size="2xl" align="center">
                Something went wrong
              </Heading>
              <Text align="center" variant="secondary">
                We're sorry, but something unexpected happened. Please try again.
              </Text>
            </Stack>
            <Button
              variant="primary"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </Button>
          </Stack>
        </Container>
      )
    }

    return this.props.children
  }
}
```

---

## 📧 EMAIL INTEGRATION

### Contact Form API

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/utils/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    const validatedData = contactSchema.parse(body)

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'PG Closets <noreply@pgclosets.com>',
      to: ['info@pgclosets.com'],
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

---

## 🚀 DEPLOYMENT

### Environment Variables

```bash
# .env.local (DO NOT COMMIT)
NEXT_PUBLIC_SITE_URL=https://www.pgclosets.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

RESEND_API_KEY=re_xxxxx
VERCEL_BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx

# Optional
DATABASE_URL=postgres://xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SITE_URL": "@site-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        }
      ]
    }
  ]
}
```

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Next.js build successful locally
- [ ] No TypeScript errors
- [ ] Lighthouse score > 90
- [ ] All images optimized
- [ ] Meta tags validated
- [ ] Structured data validated
- [ ] Forms tested and working
- [ ] Email delivery configured
- [ ] Analytics tracking verified
- [ ] 404 and error pages work
- [ ] Mobile responsive on all pages
- [ ] Cross-browser tested
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Security headers configured

---

## 📝 DEVELOPMENT WORKFLOW

### Phase 1: Foundation (Week 1)
```
Day 1-2: Project setup
  - Initialize Next.js 14.2.5
  - Install Once UI 1.4.32
  - Configure Tailwind
  - Setup TypeScript
  - Create folder structure

Day 3-4: Data migration
  - Extract business-info.ts
  - Migrate product database
  - Setup categories
  - Configure service areas

Day 5-7: Core layout
  - Build Header with Once UI
  - Build Footer
  - Create mobile navigation
  - Implement responsive grid
  - Setup global styles
```

### Phase 2: Key Pages (Week 2)
```
Day 8-9: Homepage
  - Hero section with Once UI
  - Featured products grid
  - Trust signals
  - Service area map
  - CTA sections

Day 10-12: Products
  - Product listing page
  - Product detail page
  - Category pages
  - Product card components
  - Image galleries

Day 13-14: Quote System
  - Multi-step wizard
  - Quote calculator
  - Form validation
  - Email integration
```

### Phase 3: Conversion (Week 3)
```
Day 15-16: Forms
  - Contact form
  - Booking form
  - Newsletter signup
  - Email integration

Day 17-18: Service Pages
  - Services overview
  - Installation page
  - Warranty page
  - Process pages

Day 19-21: SEO & Local
  - Area pages (Ottawa, Kanata, etc.)
  - Gallery with projects
  - About us
  - FAQ
  - Blog setup
```

### Phase 4: Polish & Deploy (Week 4)
```
Day 22-23: Optimization
  - Performance audit
  - Image optimization
  - Code splitting
  - Lazy loading

Day 24-25: Testing
  - Mobile testing
  - Cross-browser testing
  - Form testing
  - Email testing
  - Accessibility audit

Day 26-27: SEO
  - Meta tags
  - Structured data
  - Sitemap
  - Robots.txt
  - Analytics

Day 28: Deploy
  - Vercel deployment
  - DNS configuration
  - Final testing
  - Launch
```

---

## 🎯 SUCCESS CRITERIA

### Technical Requirements
- ✅ Next.js 14.2.5 (NO version 15)
- ✅ Once UI 1.4.32 fully integrated
- ✅ TypeScript strict mode
- ✅ Zero build errors
- ✅ Zero console errors
- ✅ Mobile responsive (100%)
- ✅ Lighthouse Performance > 90
- ✅ Lighthouse Accessibility > 95
- ✅ Lighthouse SEO > 95

### Business Requirements
- ✅ All business data migrated
- ✅ All product categories functional
- ✅ Quote calculator working
- ✅ Contact forms working
- ✅ Email delivery configured
- ✅ Service area pages created
- ✅ Trust signals prominent
- ✅ CTA buttons on every page
- ✅ Mobile-friendly forms
- ✅ Fast page loads (<3s)

### Conversion Features
- ✅ Interactive quote wizard
- ✅ One-click consultation booking
- ✅ Prominent phone/email
- ✅ Trust badges everywhere
- ✅ Customer testimonials
- ✅ Project gallery
- ✅ Service area targeting
- ✅ Multiple CTAs per page
- ✅ Live chat widget (optional)
- ✅ Exit intent popup (optional)

---

## 🚨 CRITICAL RULES

### DO THIS
1. ✅ Start COMPLETELY fresh - new project directory
2. ✅ Use Next.js 14.2.5 (npm create next-app@14.2.5)
3. ✅ Install Once UI 1.4.32 first thing
4. ✅ Test Once UI compatibility immediately
5. ✅ Build mobile-first with Once UI responsive props
6. ✅ Extract only DATA from old site
7. ✅ Build ALL components new with Once UI
8. ✅ Keep code clean and maintainable
9. ✅ Test every page on mobile
10. ✅ Optimize images aggressively

### DON'T DO THIS
1. ❌ Don't use Next.js 15.x
2. ❌ Don't copy old components
3. ❌ Don't use styled-components or emotion
4. ❌ Don't skip TypeScript types
5. ❌ Don't ignore mobile breakpoints
6. ❌ Don't use experimental Next.js flags
7. ❌ Don't skip image optimization
8. ❌ Don't hardcode content (use data files)
9. ❌ Don't forget error boundaries
10. ❌ Don't deploy without testing

---

## 📚 RESOURCES & REFERENCES

### Documentation
- Once UI Docs: https://once-ui.com/docs
- Next.js 14 Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com
- Zod Validation: https://zod.dev

### Existing Site Data Locations
```
Current Site Structure:
/lib/business-info.ts           → Your business data bible
/lib/renin-products-database.json → Full product catalog (305KB)
/lib/renin-products.ts          → Product types and helpers
/lib/content/*                  → Various content files
/app/**/page.tsx                → 110+ pages (analyze for content)
/components/*                   → 593 files (DON'T copy - rebuild)
```

### Design Inspiration
- Renin Official Site: https://renin.com
- Premium Door Companies for UX patterns
- Apple.com for clean, conversion-focused design
- Modern e-commerce sites using Once UI

---

## 🎬 GETTING STARTED

### Step 1: Initialize Project
```bash
# Create new Next.js 14.2.5 project
npx create-next-app@14.2.5 pgclosets-rebuild --typescript --tailwind --app

cd pgclosets-rebuild

# Install Once UI
npm install @once-ui-system/core@1.4.32

# Install dependencies
npm install react-hook-form @hookform/resolvers zod resend

# Install dev dependencies
npm install -D @types/node @types/react
```

### Step 2: Configure Once UI
```bash
# Create configuration files
touch once.config.ts
touch src/app/globals.css

# Copy configuration from this prompt
```

### Step 3: Data Migration
```bash
# Create data directories
mkdir -p src/lib/data
mkdir -p src/lib/config
mkdir -p src/lib/utils

# Copy business data from old site
# Copy product database
# Setup categories and service areas
```

### Step 4: Build Foundation
```bash
# Create layout components
mkdir -p src/components/layout
mkdir -p src/components/home
mkdir -p src/components/products

# Build Header, Footer, Navigation with Once UI
```

### Step 5: Implement Pages
```bash
# Start with homepage
# Then product pages
# Then quote system
# Then service pages
```

---

## 🎯 FINAL DELIVERABLE

A production-ready, modern e-commerce website that:

1. **Converts Visitors to Leads**
   - Interactive quote calculator
   - Prominent CTAs everywhere
   - Trust signals on every page
   - Easy contact methods
   - Mobile-optimized forms

2. **Performs Exceptionally**
   - Lighthouse scores > 90
   - Fast page loads
   - Smooth animations
   - Zero errors

3. **Scales Easily**
   - Clean codebase
   - Type-safe TypeScript
   - Reusable components
   - Well-documented
   - Easy to maintain

4. **Ranks Well**
   - Proper SEO
   - Structured data
   - Local optimization
   - Fast Core Web Vitals
   - Accessible

---

## ✨ REMEMBER

This is not a migration - it's a complete rebuild. You're creating a modern, professional website from scratch using industry-best practices with Once UI design system.

Start fresh. Build clean. Ship fast.

**Good luck! 🚀**