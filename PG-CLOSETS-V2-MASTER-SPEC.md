# PG Closets v2 — Complete Production Specification

## 1. ASSUMPTIONS & DECISIONS

### Technical Stack
- **Framework**: Next.js 14.2+ (App Router, React Server Components)
- **Language**: TypeScript 5.9+ (strict mode)
- **Styling**: Tailwind CSS 3.4+ with CSS custom properties
- **UI Library**: shadcn/ui + Radix UI primitives
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod validation
- **Analytics**: GA4 with GTM data layer
- **Hosting**: Vercel (Edge Network, automatic HTTPS)
- **CMS**: File-based (JSON/CSV) for initial launch, headless CMS-ready architecture

### Business Logic Decisions
1. **Lead-First Model**: No cart/checkout. All CTAs drive to quote/measure forms.
2. **Catalog Display**: Filterable product browser, detailed PDPs, but purchasing happens offline after consultation.
3. **Pricing**: Display "From $X CAD" with variants. Installation pricing shown as add-on.
4. **Service Areas**: Ottawa metro (7 defined areas), prominently displayed.
5. **Brand Positioning**: Premium quality, practical pricing. "Elevated taste without pretense."

### Content Strategy
1. **Voice**: Professional but approachable. Ottawa-local references. Benefit-driven.
2. **SEO**: Local SEO priority (Ottawa + neighborhoods). Product-focused pages with strong on-page optimization.
3. **Compliance**: All claims verifiable. No fake reviews. Real NAP (using provided address).
4. **Canadian English**: colour, metre, honour, etc. CAD currency throughout.

### Design System Decisions
1. **Colors**: Use existing tokens (#1B4A9C primary, #9BC4E2 secondary, #4A5F8A accent)
2. **Typography**: System font stack (no webfonts to avoid render blocking)
3. **Spacing**: 8px grid system
4. **Mobile-First**: All components designed mobile-first, enhanced for desktop
5. **Accessibility**: WCAG 2.2 AA minimum (4.5:1 contrast, keyboard nav, semantic HTML)

### Performance Targets
- **LCP**: ≤ 2.2s (mobile), ≤ 1.5s (desktop)
- **CLS**: ≤ 0.10
- **INP**: ≤ 200ms
- **FCP**: ≤ 1.5s
- **Bundle Size**: Initial JS ≤ 150KB gzipped

### Canonical URL Strategy
- **Primary**: https://www.pgclosets.com (www enforced)
- **Redirects**: http→https, non-www→www, .ca→.com (path preserved)
- **Canonical Tags**: All pages set explicit canonical

---

## 2. SITE MAP & REDIRECT STRATEGY

### Site Structure

```
/                                    (Home)
├── /products                        (Products Hub)
│   ├── /bypass                      (Bypass Closet Doors)
│   ├── /bifold                      (Bifold Closet Doors)
│   ├── /pivot                       (Pivot Doors)
│   ├── /swing                       (Swing Doors)
│   ├── /barn-sliding                (Barn/Sliding Doors)
│   ├── /room-dividers               (Room Dividers)
│   └── /{category}/{slug}           (Product Detail Page)
├── /services
│   └── /installation                (Installation Service)
├── /about                           (About Us)
├── /faq                             (FAQ)
├── /reviews                         (Customer Reviews)
├── /contact                         (Contact)
├── /locations                       (Service Areas Hub)
│   ├── /ottawa                      (Ottawa)
│   ├── /kanata                      (Kanata)
│   ├── /barrhaven                   (Barrhaven)
│   ├── /nepean                      (Nepean)
│   ├── /orleans                     (Orleans)
│   ├── /stittsville                 (Stittsville)
│   └── /gloucester                  (Gloucester)
└── /legal
    ├── /privacy                     (Privacy Policy)
    └── /terms                       (Terms of Service)
```

### Redirect Map

| Source | Destination | Type | Preserve Path |
|--------|-------------|------|---------------|
| http://pgclosets.com/* | https://www.pgclosets.com/* | 301 | Yes |
| http://www.pgclosets.com/* | https://www.pgclosets.com/* | 301 | Yes |
| https://pgclosets.com/* | https://www.pgclosets.com/* | 301 | Yes |
| http://pgclosets.ca/* | https://www.pgclosets.com/* | 301 | Yes |
| https://pgclosets.ca/* | https://www.pgclosets.com/* | 301 | Yes |
| https://www.pgclosets.ca/* | https://www.pgclosets.com/* | 301 | Yes |
| /product/* | /products/* | 301 | - |
| /service/* | /services/* | 301 | - |

---

## 3. DATA MODELS (TypeScript)

```typescript
// types/product.ts

export type DoorType =
  | 'bypass'
  | 'bifold'
  | 'pivot'
  | 'swing'
  | 'barn-sliding'
  | 'room-dividers';

export type StyleType =
  | '1-lite'
  | '2-lite'
  | '3-lite'
  | '5-lite'
  | 'panel-raised'
  | 'panel-flat'
  | 'louvered'
  | 'mirror'
  | 'frosted';

export type FrameMaterial = 'aluminum' | 'steel' | 'wood';

export type FinishType =
  | 'bright-white'
  | 'off-white'
  | 'matte-black'
  | 'brushed-nickel'
  | 'oak'
  | 'walnut'
  | 'mirror'
  | 'frosted'
  | 'clear'
  | 'acrylic';

export type GlazingType = 'clear' | 'frosted' | 'tinted' | 'mirror' | 'none';

export type AvailabilityStatus = 'InStock' | 'PreOrder' | 'OutOfStock';

export interface ProductDimensions {
  widthInches: number;
  heightInches: number;
  depthInches?: number;
}

export interface ProductVariant {
  sku: string;
  size: ProductDimensions;
  priceCAD: number;
  availability: AvailabilityStatus;
  leadTimeDays: number;
  installAddonCAD: number;
  options: {
    softClose?: boolean;
    trackSystem?: string;
    hardware?: string;
  };
}

export interface ProductMedia {
  url: string;
  alt: string;
  role: 'hero' | 'gallery' | 'detail' | 'lifestyle';
  width: number;
  height: number;
}

export interface ProductAttributes {
  type: DoorType;
  style: StyleType;
  frame: FrameMaterial;
  finish: FinishType;
  glazing: GlazingType;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  attributes: ProductAttributes;
  media: ProductMedia[];
  variants: ProductVariant[];
  badges: string[];
  compliance: string[];
  relatedProductIds: string[];
  seo: ProductSEO;
  createdAt: string;
  updatedAt: string;
}

// types/location.ts

export interface ServiceArea {
  name: string;
  neighborhoods: string[];
}

export interface LocationData {
  slug: string;
  city: string;
  province: string;
  serviceAreas: ServiceArea[];
  landmarks: string[];
  averageInstallTime: string;
  popularCategories: DoorType[];
  seo: {
    title: string;
    description: string;
  };
}

// types/review.ts

export interface Review {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  location: string;
  date: string;
  productId?: string;
  verified: boolean;
}

// types/lead.ts

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  serviceType: 'measure' | 'quote' | 'general';
  productInterest?: string;
  message?: string;
  preferredContact: 'email' | 'phone';
  consent: boolean;
}
```

---

*Continued in next section...*
