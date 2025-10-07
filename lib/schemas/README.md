# SEO Schema Documentation

Complete structured data implementation for PG Closets v2.

## Overview

This directory contains all JSON-LD schema generators for enhanced search engine visibility and rich results in Google Search.

## Schema Types

### 1. Local Business Schema (`local-business.ts`)

**Purpose**: Helps PG Closets appear in local search results and Google Maps.

**Usage**:
```typescript
import { generateLocalBusinessSchema, generateLocalBusinessScriptTag } from '@/lib/schemas'

// In your layout or page component
export default function RootLayout() {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateLocalBusinessScriptTag() }}
        />
      </head>
      {/* ... */}
    </html>
  )
}
```

**Fields Included**:
- Business name, description, contact info
- Address and geographic coordinates
- Opening hours
- Service areas (Ottawa, Kanata, Barrhaven, etc.)
- Services offered
- Price range

### 2. Product Schema (`product.ts`)

**Purpose**: Product pages appear with rich snippets (price, availability, ratings).

**Usage**:
```typescript
import { generateProductSchema, generateProductScriptTag } from '@/lib/schemas'

// On product detail pages
const productData = {
  name: 'Modern Bypass Closet Door',
  description: 'Contemporary bypass door with aluminum frame',
  image: '/products/bypass-door.jpg',
  sku: 'BP-001',
  brand: 'Renin',
  category: 'bypass',
  price: 499.99,
  availability: 'InStock',
  url: 'https://www.pgclosets.com/products/bypass/modern-bypass-door',
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: generateProductScriptTag(productData) }}
/>
```

**Product Collection Schema**:
```typescript
// For category pages
import { generateProductCollectionScriptTag } from '@/lib/schemas'

const products = [/* array of products */]
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: generateProductCollectionScriptTag('bypass', products)
  }}
/>
```

### 3. FAQ Schema (`faq.ts`)

**Purpose**: FAQ pages can appear with expandable answers in search results.

**Usage**:
```typescript
import { generateFAQScriptTag, defaultFAQs } from '@/lib/schemas'

// On FAQ page
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: generateFAQScriptTag(defaultFAQs) }}
/>
```

**Custom FAQs**:
```typescript
const customFAQs = [
  {
    question: 'What types of closet doors do you offer?',
    answer: 'We offer bypass, bifold, barn, pivot, swing doors, and room dividers.',
  },
]

generateFAQScriptTag(customFAQs)
```

### 4. Breadcrumb Schema (`breadcrumb.ts`)

**Purpose**: Shows navigation breadcrumbs in search results.

**Usage**:
```typescript
import {
  generateBreadcrumbScriptTag,
  generateProductBreadcrumbs
} from '@/lib/schemas'

// For product pages
const breadcrumbs = generateProductBreadcrumbs(
  'bypass',
  'Modern Bypass Door',
  'modern-bypass-door'
)

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: generateBreadcrumbScriptTag(breadcrumbs) }}
/>
```

**Auto-generation from URL**:
```typescript
import { generateBreadcrumbsFromPath } from '@/lib/schemas'

// Automatically generate from pathname
const breadcrumbs = generateBreadcrumbsFromPath('/products/bypass')
```

### 5. Website Schema (`website.ts`)

**Purpose**: Enables site search box in Google Search results.

**Usage**:
```typescript
import { generateWebSiteScriptTag, generateOrganizationScriptTag } from '@/lib/schemas'

// In root layout
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: generateWebSiteScriptTag() }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: generateOrganizationScriptTag() }}
/>
```

## Complete Implementation Example

```typescript
// app/layout.tsx
import { generateLocalBusinessScriptTag, generateWebSiteScriptTag } from '@/lib/schemas'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateLocalBusinessScriptTag() }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateWebSiteScriptTag() }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```typescript
// app/products/[category]/[slug]/page.tsx
import { generateProductScriptTag, generateBreadcrumbScriptTag } from '@/lib/schemas'

export default function ProductPage({ params }) {
  const product = getProduct(params.slug)
  const breadcrumbs = generateProductBreadcrumbs(
    params.category,
    product.name,
    params.slug
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateProductScriptTag(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBreadcrumbScriptTag(breadcrumbs) }}
      />
      {/* Page content */}
    </>
  )
}
```

## Validation

### Google Rich Results Test
Test your structured data:
https://search.google.com/test/rich-results

### Schema.org Validator
Validate JSON-LD syntax:
https://validator.schema.org/

### Testing Checklist
- [ ] LocalBusiness schema on homepage
- [ ] Product schema on all PDPs
- [ ] FAQPage schema on FAQ page
- [ ] BreadcrumbList on all pages
- [ ] WebSite schema in root layout
- [ ] All schemas pass Google Rich Results Test
- [ ] All URLs use canonical https://www.pgclosets.com

## Best Practices

1. **Always use canonical URLs**: Every URL must start with `https://www.pgclosets.com`
2. **Keep descriptions accurate**: Match schema descriptions to visible page content
3. **Update business info**: All business details pull from `lib/business-config.ts`
4. **Test before deploy**: Validate all schemas with Google's testing tool
5. **Monitor Search Console**: Track rich result performance in Google Search Console

## Common Issues

### Schema not appearing in search results
- Can take 2-4 weeks for Google to index new schemas
- Check Google Search Console for errors
- Ensure valid JSON-LD syntax
- Verify pages are indexed

### Invalid URL errors
- All URLs must use canonical domain: `https://www.pgclosets.com`
- No trailing slashes except for root
- No query parameters in canonical URLs

### Missing required fields
- Product schema requires: name, image, offers
- LocalBusiness requires: name, address, telephone
- FAQPage requires: question and acceptedAnswer

## Schema Priority by Page Type

| Page Type | Required Schemas | Optional Schemas |
|-----------|-----------------|------------------|
| Homepage | LocalBusiness, WebSite | Organization |
| Products Hub | BreadcrumbList | - |
| Category | BreadcrumbList, CollectionPage | - |
| Product Detail | Product, BreadcrumbList | Review, Offer |
| FAQ | FAQPage, BreadcrumbList | - |
| Contact | LocalBusiness, BreadcrumbList | - |
| Location | LocalBusiness, BreadcrumbList | - |

## Maintenance

- Update `lib/business-config.ts` when business info changes
- Review schemas quarterly for accuracy
- Monitor Google Search Console for schema errors
- Add new FAQ items as customer questions emerge
- Update product schemas when inventory changes
