# SEO Implementation Documentation

This directory contains comprehensive SEO utilities and JSON-LD schema generators for the PG Closets website.

## Overview

The SEO implementation includes:

1. **Root Metadata** - Enhanced metadata in `/app/layout.tsx`
2. **JSON-LD Schemas** - Structured data generators in `/lib/seo/schemas.ts`
3. **SEO Components** - Ready-to-use components in `/components/seo/`
4. **Sitemap** - Comprehensive sitemap at `/sitemap.ts`
5. **Robots.txt** - Search engine crawler rules at `/robots.ts`

## Schema Generators

### Available Schema Functions

#### `getOrganizationSchema()`
Organization-level structured data for the business.

**Usage:**
```tsx
import { getOrganizationSchema, renderSchema } from '@/lib/seo/schemas'

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(getOrganizationSchema())}
      />
      {/* Page content */}
    </>
  )
}
```

#### `getLocalBusinessSchema()`
Enhanced local SEO schema for Ottawa market presence.

**Usage:**
```tsx
import { getLocalBusinessSchema, renderSchema } from '@/lib/seo/schemas'

// Ideal for contact pages and location pages
```

#### `getProductSchema(product)`
Product-specific structured data.

**Parameters:**
```typescript
{
  id: string
  name: string
  description: string
  price?: number
  currency?: string
  brand?: string
  image?: string
  category?: string
  sku?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  rating?: {
    value: number
    count: number
  }
}
```

**Usage:**
```tsx
import { getProductSchema, renderSchema } from '@/lib/seo/schemas'

const product = {
  id: 'barn-door-01',
  name: 'Premium Barn Door',
  description: 'Beautiful sliding barn door',
  price: 599.99,
  currency: 'CAD',
  brand: 'Renin',
  image: '/products/barn-door.jpg',
  availability: 'InStock',
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={renderSchema(getProductSchema(product))}
/>
```

#### `getBreadcrumbSchema(items)`
Breadcrumb navigation structured data.

**Parameters:**
```typescript
items: Array<{ name: string; url: string }>
```

#### `getFAQSchema(faqs)`
FAQ page structured data for rich snippets.

**Parameters:**
```typescript
faqs: Array<{ question: string; answer: string }>
```

#### `getReviewSchema(reviews)`
Product or business review structured data.

**Parameters:**
```typescript
reviews: Array<{
  author: string
  rating: number
  reviewBody: string
  datePublished: string
  productName?: string
}>
```

#### `getWebPageSchema(page)`
General webpage structured data.

**Parameters:**
```typescript
{
  url: string
  name: string
  description: string
  datePublished?: string
  dateModified?: string
}
```

#### `getServiceSchema(service)`
Service offering structured data.

**Parameters:**
```typescript
{
  name: string
  description: string
  url: string
  serviceType?: string
  areaServed?: string[]
}
```

## SEO Components

Pre-built components with integrated JSON-LD schemas.

### Breadcrumbs

Visual breadcrumb navigation with automatic schema generation.

**Usage:**
```tsx
import { Breadcrumbs } from '@/components/seo'

export default function ProductPage() {
  const breadcrumbs = [
    { name: 'Products', url: '/products' },
    { name: 'Barn Doors', url: '/products/barn-doors' },
    { name: 'Premium Barn Door', url: '/products/barn-door-01' },
  ]

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      {/* Page content */}
    </div>
  )
}
```

**Auto-generate from pathname:**
```tsx
import { generateBreadcrumbs } from '@/components/seo'

const breadcrumbs = generateBreadcrumbs('/products/barn-doors/premium')
// Returns: [
//   { name: 'Products', url: '/products' },
//   { name: 'Barn Doors', url: '/products/barn-doors' },
//   { name: 'Premium', url: '/products/barn-doors/premium' }
// ]
```

### ProductSchema

Dedicated product schema component.

**Usage:**
```tsx
import { ProductSchema } from '@/components/seo'

export default function ProductPage({ product }) {
  return (
    <>
      <ProductSchema product={product} />
      {/* Product content */}
    </>
  )
}
```

**For product listing pages:**
```tsx
import { ProductListSchema } from '@/components/seo'

export default function ProductsPage({ products }) {
  return (
    <>
      <ProductListSchema products={products} />
      {/* Products grid */}
    </>
  )
}
```

### OrganizationSchema

Company/organization schema component.

**Usage:**
```tsx
import { OrganizationSchema } from '@/components/seo'

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      {/* About content */}
    </>
  )
}
```

### LocalBusinessSchema

Local business schema for location-specific pages.

**Usage:**
```tsx
import { LocalBusinessSchema } from '@/components/seo'

export default function ContactPage() {
  return (
    <>
      <LocalBusinessSchema />
      {/* Contact content */}
    </>
  )
}
```

### FAQSchema

FAQ structured data component.

**Usage:**
```tsx
import { FAQSchema } from '@/components/seo'

export default function FAQPage() {
  const faqs = [
    {
      question: 'Do you offer installation services?',
      answer: 'Yes, we provide professional installation services across Ottawa.',
    },
    {
      question: 'What is your warranty?',
      answer: 'We offer a lifetime warranty on all Renin products.',
    },
  ]

  return (
    <>
      <FAQSchema faqs={faqs} />
      {/* FAQ content */}
    </>
  )
}
```

### WebPageSchema

General webpage schema component.

**Usage:**
```tsx
import { WebPageSchema } from '@/components/seo'

export default function BlogPost() {
  return (
    <>
      <WebPageSchema
        page={{
          url: '/blog/closet-organization-tips',
          name: 'Closet Organization Tips',
          description: 'Expert tips for organizing your closet',
          datePublished: '2024-01-15',
          dateModified: '2024-02-01',
        }}
      />
      {/* Blog content */}
    </>
  )
}
```

## Best Practices

### 1. Schema Placement

Place JSON-LD scripts in the `<head>` or top of page content for optimal crawling.

### 2. Combine Schemas

Multiple schemas can be used on the same page:

```tsx
export default function ProductPage({ product }) {
  return (
    <>
      <OrganizationSchema />
      <ProductSchema product={product} />
      <Breadcrumbs items={breadcrumbs} />
      {/* Page content */}
    </>
  )
}
```

### 3. Dynamic Data

Always use real, dynamic data from your database or CMS:

```tsx
const product = await getProduct(params.id)

return <ProductSchema product={{
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  // ... other product data
}} />
```

### 4. Testing

Use Google's Rich Results Test to validate schemas:
- https://search.google.com/test/rich-results

### 5. Page-Specific Metadata

Override root metadata for specific pages:

```tsx
// app/products/[id]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)

  return {
    title: `${product.name} | PG Closets`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}
```

## SEO Checklist

- [ ] Root metadata configured in `/app/layout.tsx`
- [ ] Page-specific metadata for all routes
- [ ] Organization schema on homepage
- [ ] Local business schema on contact page
- [ ] Product schemas on product pages
- [ ] Breadcrumbs on all non-homepage pages
- [ ] FAQ schema on FAQ page
- [ ] Sitemap generated and accessible
- [ ] Robots.txt configured
- [ ] Open Graph images created (1200x630px)
- [ ] Google Search Console verified
- [ ] Test with Google Rich Results Test

## Additional Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
