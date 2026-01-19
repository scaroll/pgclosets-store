# SEO Implementation Guide - PG Closets v2

Complete guide for implementing SEO infrastructure across all pages.

## Table of Contents

1. [Metadata Implementation](#metadata-implementation)
2. [Schema Markup](#schema-markup)
3. [Sitemap Configuration](#sitemap-configuration)
4. [Page-by-Page Implementation](#page-by-page-implementation)
5. [Testing & Validation](#testing--validation)
6. [Performance Checklist](#performance-checklist)

---

## Metadata Implementation

### Core Metadata Functions

All metadata helpers are in `lib/metadata.ts`. Import and use them in your page components:

```typescript
import { generateHomeMetadata, generateProductMetadata } from '@/lib/metadata'

// In page.tsx or layout.tsx
export const metadata = generateHomeMetadata()
```

### Available Metadata Generators

| Function | Use Case | Example |
|----------|----------|---------|
| `generateHomeMetadata()` | Homepage | `export const metadata = generateHomeMetadata()` |
| `generateProductsHubMetadata()` | /products | Products listing page |
| `generateCategoryMetadata(category)` | /products/bypass | Category pages |
| `generateProductMetadata(product)` | /products/bypass/modern-door | Product detail pages |
| `generateLocationMetadata(location)` | /locations/ottawa | Location pages |
| `generateFAQMetadata()` | /faq | FAQ page |
| `generateContactMetadata()` | /contact | Contact page |
| `generateInstallationMetadata()` | /services/installation | Installation service |

### Meta Tag Requirements

**Title Tags** (55-60 characters):
- Homepage: "Custom Closet Doors & Storage Solutions Ottawa | PG Closets"
- Category: "[Category] Closet Doors Ottawa | PG Closets"
- Product: "[Product Name] | Custom Closet Doors Ottawa"

**Meta Descriptions** (140-160 characters):
- Include primary keyword
- Include location (Ottawa)
- Include value proposition (professional installation, 2-week delivery)
- Include call-to-action when possible

**Canonical URLs**:
- Always use `https://www.pgclosets.com`
- No trailing slashes (except root)
- No query parameters

---

## Schema Markup

### Schema Implementation by Page Type

#### 1. Root Layout (app/layout.tsx)

```typescript
import {
  generateLocalBusinessScriptTag,
  generateWebSiteScriptTag
} from '@/lib/schemas'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateLocalBusinessScriptTag()
          }}
          suppressHydrationWarning
        />

        {/* Website Schema with Search Action */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateWebSiteScriptTag()
          }}
          suppressHydrationWarning
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### 2. Product Detail Page

```typescript
import {
  generateProductScriptTag,
  generateBreadcrumbScriptTag,
  generateProductBreadcrumbs
} from '@/lib/schemas'

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)

  const productSchema = {
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    sku: product.sku,
    category: params.category,
    price: product.price,
    availability: product.inStock ? 'InStock' : 'OutOfStock',
    url: `https://www.pgclosets.com/products/${params.category}/${params.slug}`,
  }

  const breadcrumbs = generateProductBreadcrumbs(
    params.category,
    product.name,
    params.slug
  )

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateProductScriptTag(productSchema)
        }}
        suppressHydrationWarning
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbScriptTag(breadcrumbs)
        }}
        suppressHydrationWarning
      />

      {/* Page content */}
    </>
  )
}
```

#### 3. FAQ Page

```typescript
import { generateFAQScriptTag, defaultFAQs } from '@/lib/schemas'
import { generateFAQMetadata } from '@/lib/metadata'

export const metadata = generateFAQMetadata()

export default function FAQPage() {
  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateFAQScriptTag(defaultFAQs)
        }}
        suppressHydrationWarning
      />

      {/* FAQ content */}
    </>
  )
}
```

#### 4. Category Page

```typescript
import {
  generateProductCollectionScriptTag,
  generateBreadcrumbScriptTag,
  generateBreadcrumbsFromPath
} from '@/lib/schemas'

export default async function CategoryPage({ params }) {
  const products = await getProductsByCategory(params.category)

  const productSchemas = products.map(p => ({
    name: p.name,
    description: p.description,
    image: p.imageUrl,
    category: params.category,
    price: p.price,
    url: `https://www.pgclosets.com/products/${params.category}/${p.slug}`,
  }))

  const breadcrumbs = generateBreadcrumbsFromPath(`/products/${params.category}`)

  return (
    <>
      {/* Collection Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateProductCollectionScriptTag(params.category, productSchemas)
        }}
        suppressHydrationWarning
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbScriptTag(breadcrumbs)
        }}
        suppressHydrationWarning
      />

      {/* Category content */}
    </>
  )
}
```

---

## Sitemap Configuration

### Main Sitemap (app/sitemap.ts)

The sitemap is automatically generated. Current implementation includes:

- ✅ Homepage (priority 1.0)
- ✅ Products hub (priority 0.9)
- ✅ Category pages (priority 0.8)
- ✅ Service pages (priority 0.8)
- ✅ Location pages (priority 0.8-0.9)
- ✅ Core pages (priority 0.7)
- ✅ Legal pages (priority 0.3)

### Sitemap Validation

```typescript
import { validateSitemap } from '@/app/sitemap-v2'

// In your build process or tests
const sitemap = await generateSitemap()
const isValid = validateSitemap(sitemap)

if (!isValid) {
  throw new Error('Sitemap validation failed')
}
```

### Accessing Sitemaps

- Main sitemap: `https://www.pgclosets.com/sitemap.xml`
- Automatic generation on build
- Submitted to Google Search Console

---

## Page-by-Page Implementation

### Homepage (/)

**Metadata**: `generateHomeMetadata()`

**Schemas**:
- LocalBusiness ✅
- WebSite ✅

**Keywords**:
- closet doors Ottawa
- custom closet doors
- Renin closet doors
- closet installation Ottawa

**Content Requirements**:
- H1: "Custom Closet Doors & Storage Solutions in Ottawa"
- Service areas prominently displayed
- Clear CTAs for quotes/consultation
- Trust signals (warranty, delivery time)

---

### Products Hub (/products)

**Metadata**: `generateProductsHubMetadata()`

**Schemas**:
- BreadcrumbList

**Keywords**:
- closet doors
- bypass doors
- bifold doors
- barn doors

**Content Requirements**:
- H1: "Premium Closet Doors"
- Category grid with images
- Filter by type/style
- Brief descriptions per category

---

### Category Pages (/products/[category])

**Metadata**: `generateCategoryMetadata(category)`

**Schemas**:
- BreadcrumbList ✅
- CollectionPage ✅

**Example**: /products/bypass

**Keywords**:
- bypass closet doors Ottawa
- bypass door installation
- sliding closet doors

**Content Requirements**:
- H1: "[Category] Closet Doors Ottawa"
- Product grid
- Category description (100-150 words)
- Benefits list
- Installation information

---

### Product Detail Pages (/products/[category]/[slug])

**Metadata**: `generateProductMetadata(product)`

**Schemas**:
- Product ✅
- BreadcrumbList ✅

**Example**: /products/bypass/modern-aluminum-bypass-door

**Keywords**:
- Product name
- Category
- Brand (Renin)
- Materials
- Ottawa

**Content Requirements**:
- H1: Product name
- High-quality product images
- Detailed description
- Specifications table
- Pricing information
- Installation details
- Related products

---

### Location Pages (/locations/[city])

**Metadata**: `generateLocationMetadata(location)`

**Schemas**:
- LocalBusiness ✅
- BreadcrumbList ✅

**Example**: /locations/ottawa

**Keywords**:
- closet doors [city]
- [city] closet installation
- custom closets [city]

**Content Requirements**:
- H1: "[City] Custom Closet Doors"
- Service area map
- Local landmarks/neighborhoods
- Popular products in area
- Local testimonials
- Contact information

---

### FAQ Page (/faq)

**Metadata**: `generateFAQMetadata()`

**Schemas**:
- FAQPage ✅
- BreadcrumbList ✅

**Content Requirements**:
- H1: "Frequently Asked Questions"
- Organized categories
- 10+ Q&A pairs
- Expand/collapse functionality
- Jump links to categories

---

### Contact Page (/contact)

**Metadata**: `generateContactMetadata()`

**Schemas**:
- LocalBusiness ✅
- BreadcrumbList ✅

**Content Requirements**:
- H1: "Contact Us"
- Contact form
- Phone number (clickable)
- Email address
- Business hours
- Address with map
- Service areas

---

## Testing & Validation

### Pre-Launch Checklist

- [ ] All pages have unique title tags
- [ ] All meta descriptions 140-160 characters
- [ ] All URLs use canonical https://www.pgclosets.com
- [ ] All schemas validated with Google Rich Results Test
- [ ] Sitemap.xml accessible and valid
- [ ] Robots.txt properly configured
- [ ] No duplicate content issues
- [ ] All images have alt text
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Internal linking structure optimized

### Google Tools Setup

1. **Google Search Console**
   - Add property: https://www.pgclosets.com
   - Submit sitemap
   - Monitor coverage and errors
   - Track search performance

2. **Google Business Profile**
   - Verify business listing
   - Add photos
   - Respond to reviews
   - Post updates

3. **Google Analytics 4**
   - Install tracking code
   - Set up conversion tracking
   - Monitor traffic sources
   - Track form submissions

### Rich Results Testing

Test each page type:

```bash
# Product page
https://search.google.com/test/rich-results?url=https://www.pgclosets.com/products/bypass/modern-door

# FAQ page
https://search.google.com/test/rich-results?url=https://www.pgclosets.com/faq

# Homepage
https://search.google.com/test/rich-results?url=https://www.pgclosets.com
```

### Schema Validation

```bash
# Validate with schema.org
https://validator.schema.org/#url=https://www.pgclosets.com
```

---

## Performance Checklist

### Technical SEO

- [x] HTTPS enabled (canonical)
- [x] www subdomain enforced
- [x] Proper redirects (non-www → www, http → https)
- [ ] Page speed optimization (LCP < 2.5s)
- [ ] Mobile-friendly design
- [ ] Structured data implemented
- [ ] XML sitemap submitted
- [ ] Robots.txt configured

### On-Page SEO

- [ ] Unique title tags (all pages)
- [ ] Compelling meta descriptions (all pages)
- [ ] Header hierarchy (H1-H6)
- [ ] Alt text on all images
- [ ] Internal linking strategy
- [ ] Keyword optimization
- [ ] Content quality and uniqueness

### Local SEO

- [x] LocalBusiness schema
- [ ] NAP consistency (Name, Address, Phone)
- [ ] Google Business Profile optimized
- [ ] Service area pages created
- [ ] Local keywords targeted
- [ ] Customer reviews solicited
- [ ] Local citations built

### Content SEO

- [ ] Location-specific content (Ottawa focus)
- [ ] Product category descriptions
- [ ] FAQ content comprehensive
- [ ] Blog/resources section
- [ ] Regular content updates
- [ ] Multimedia content (images, videos)

---

## Monitoring & Maintenance

### Weekly Tasks
- Check Google Search Console for errors
- Monitor search rankings for primary keywords
- Review site performance metrics

### Monthly Tasks
- Update product information
- Add new FAQ items
- Review and update location pages
- Analyze top-performing pages
- Identify and fix broken links

### Quarterly Tasks
- Comprehensive SEO audit
- Update business information
- Review and update schema markup
- Competitor analysis
- Backlink analysis

---

## Support & Resources

### Documentation
- `/lib/metadata.ts` - Metadata generators
- `/lib/schemas/` - Schema markup generators
- `/lib/schemas/README.md` - Schema documentation
- `/app/sitemap.ts` - Sitemap configuration

### External Resources
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Contact
For SEO implementation questions, refer to the master spec:
`/PG-CLOSETS-V2-MASTER-SPEC.md`
