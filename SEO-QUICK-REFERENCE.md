# SEO Quick Reference Card

Fast reference for implementing SEO on any page.

---

## 🚀 Quick Implementation

### 1. Add Metadata (Every Page)

```typescript
// app/[page]/page.tsx
import { generateHomeMetadata } from '@/lib/metadata'

export const metadata = generateHomeMetadata()
```

### 2. Add Schema (Page-Specific)

```typescript
import { generateLocalBusinessScriptTag } from '@/lib/schemas'

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateLocalBusinessScriptTag() }}
        suppressHydrationWarning
      />
      {/* Content */}
    </>
  )
}
```

---

## 📋 Metadata Functions

| Function | Use On |
|----------|--------|
| `generateHomeMetadata()` | / |
| `generateProductsHubMetadata()` | /products |
| `generateCategoryMetadata('bypass')` | /products/bypass |
| `generateProductMetadata(product)` | /products/bypass/door-name |
| `generateLocationMetadata('Ottawa')` | /locations/ottawa |
| `generateFAQMetadata()` | /faq |
| `generateContactMetadata()` | /contact |
| `generateInstallationMetadata()` | /services/installation |

---

## 🏷️ Schema Functions

| Schema | Function | Use On |
|--------|----------|--------|
| LocalBusiness | `generateLocalBusinessScriptTag()` | Homepage, Locations, Contact |
| WebSite | `generateWebSiteScriptTag()` | Root Layout |
| Product | `generateProductScriptTag(product)` | Product Pages |
| Collection | `generateProductCollectionScriptTag(cat, products)` | Category Pages |
| FAQ | `generateFAQScriptTag(faqs)` | FAQ Page |
| Breadcrumb | `generateBreadcrumbScriptTag(breadcrumbs)` | All Pages |

---

## ✅ Page Implementation Checklist

### Homepage (/)
```typescript
import { generateHomeMetadata } from '@/lib/metadata'
import { generateLocalBusinessScriptTag, generateWebSiteScriptTag } from '@/lib/schemas'

export const metadata = generateHomeMetadata()

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateLocalBusinessScriptTag() }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateWebSiteScriptTag() }} suppressHydrationWarning />
      <h1>Custom Closet Doors & Storage Solutions in Ottawa</h1>
      {/* Content */}
    </>
  )
}
```

### Product Page (/products/[category]/[slug])
```typescript
import { generateProductMetadata } from '@/lib/metadata'
import { generateProductScriptTag, generateBreadcrumbScriptTag, generateProductBreadcrumbs } from '@/lib/schemas'

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug)
  return generateProductMetadata(product)
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)
  const breadcrumbs = generateProductBreadcrumbs(params.category, product.name, params.slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateProductScriptTag(product) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateBreadcrumbScriptTag(breadcrumbs) }} suppressHydrationWarning />
      <h1>{product.name}</h1>
      {/* Content */}
    </>
  )
}
```

### FAQ Page (/faq)
```typescript
import { generateFAQMetadata } from '@/lib/metadata'
import { generateFAQScriptTag, defaultFAQs } from '@/lib/schemas'

export const metadata = generateFAQMetadata()

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateFAQScriptTag(defaultFAQs) }} suppressHydrationWarning />
      <h1>Frequently Asked Questions</h1>
      {/* FAQ content */}
    </>
  )
}
```

---

## 🎯 Critical Rules

1. **Canonical URLs**: Always `https://www.pgclosets.com` (no trailing slash)
2. **Meta Descriptions**: 140-160 characters
3. **Title Tags**: 55-60 characters
4. **H1**: One per page, include location keyword
5. **Alt Text**: Every image needs descriptive alt text
6. **Schema**: Use `suppressHydrationWarning` on script tags

---

## 🧪 Testing

### Before Deployment
```bash
npx ts-node scripts/validate-seo.ts
```

### After Deployment
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Check your page URL
3. Verify all schemas are valid

### Sitemap
- Access: https://www.pgclosets.com/sitemap.xml
- Submit to Google Search Console

---

## 📱 Priority Keywords

### Primary (Homepage)
- closet doors Ottawa
- custom closet doors
- Renin closet doors
- closet installation Ottawa

### Category-Specific
- bypass closet doors Ottawa
- bifold doors Ottawa
- barn doors Ottawa
- pivot doors Ottawa

### Local
- closet doors [neighborhood]
- [neighborhood] closet installation

---

## 🔗 Quick Links

- Full Guide: `/docs/SEO-IMPLEMENTATION-GUIDE.md`
- Schema Docs: `/lib/schemas/README.md`
- Summary: `/SEO-INFRASTRUCTURE-SUMMARY.md`
- Master Spec: `/PG-CLOSETS-V2-MASTER-SPEC.md`

---

## 💡 Common Patterns

### Dynamic Metadata
```typescript
export async function generateMetadata({ params }) {
  const data = await getData(params.id)
  return generateProductMetadata(data)
}
```

### Multiple Schemas
```typescript
<>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaA }} suppressHydrationWarning />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaB }} suppressHydrationWarning />
</>
```

### Custom Breadcrumbs
```typescript
const breadcrumbs = [
  { name: 'Home', url: 'https://www.pgclosets.com' },
  { name: 'Products', url: 'https://www.pgclosets.com/products' },
  { name: 'Bypass Doors', url: 'https://www.pgclosets.com/products/bypass' },
]
```

---

**Last Updated**: October 2025
**Status**: Production Ready ✅
