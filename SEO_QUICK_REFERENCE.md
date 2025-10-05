# SEO Quick Reference Guide

## 🚀 Quick Start

### Verify Implementation
```bash
# Build the site
npm run build

# Test in development
npm run dev
```

### Test Your SEO
1. **Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Validator**: https://validator.schema.org/
3. **Mobile Test**: https://search.google.com/test/mobile-friendly

---

## 📋 Common Tasks

### Add Product Metadata
```typescript
// In your product page
import { generateProductMetadata } from '@/lib/seo/metadata'

export const metadata = generateProductMetadata({
  name: 'Barn Door Model X',
  description: 'Beautiful rustic barn door...',
  id: 'barn-door-x',
  category: 'Barn Doors',
  price: 399,
  image: '/images/barn-door-x.jpg'
})
```

### Add Product Schema
```tsx
// In your product page component
import ProductSchema from '@/components/seo/ProductSchema'

export default function ProductPage({ product }) {
  return (
    <>
      <ProductSchema product={product} includeFAQ={true} />
      {/* Your page content */}
    </>
  )
}
```

### Add Breadcrumbs
```tsx
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

const breadcrumbs = [
  { name: 'Products', url: '/products' },
  { name: 'Barn Doors', url: '/products/barn-doors' }
]

<BreadcrumbSchema items={breadcrumbs} />
```

### Add FAQs
```tsx
import FAQSchema from '@/components/seo/FAQSchema'

const faqs = [
  {
    question: 'What is the warranty?',
    answer: 'Lifetime warranty on all Renin products.'
  }
]

<FAQSchema faqs={faqs} id="my-page-faq" />
```

---

## 🗂️ File Locations

### SEO Utilities
- **Metadata**: `/lib/seo/metadata.ts`
- **Product Schema**: `/lib/seo/product-schema.ts`
- **Service Schema**: `/lib/seo/service-schema.ts`
- **Business Schema**: `/lib/seo/local-business-schema.ts`

### Components
- **Product Schema**: `/components/seo/ProductSchema.tsx`
- **Breadcrumbs**: `/components/seo/BreadcrumbSchema.tsx`
- **FAQ Schema**: `/components/seo/FAQSchema.tsx`

### Configuration
- **Sitemap**: `/app/sitemap.ts`
- **Robots**: `/app/robots.ts`
- **Manifest**: `/app/manifest.ts`
- **Root Layout**: `/app/layout.tsx`
- **Business Config**: `/lib/business-config.ts`

### Images
- **Open Graph**: `/app/opengraph-image.tsx`
- **Twitter Card**: `/app/twitter-image.tsx`

---

## 🎯 Key URLs

### Generated Files
- Sitemap: `https://www.pgclosets.com/sitemap.xml`
- Robots: `https://www.pgclosets.com/robots.txt`
- Manifest: `https://www.pgclosets.com/manifest.json`
- OG Image: `https://www.pgclosets.com/opengraph-image`
- Twitter Image: `https://www.pgclosets.com/twitter-image`

### Submit To
- **Google Search Console**: Add sitemap URL
- **Bing Webmaster Tools**: Add sitemap URL
- **Google My Business**: Verify business details match schema

---

## ✅ Pre-Launch Checklist

### Required
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify structured data with Rich Results Test
- [ ] Test mobile-friendliness
- [ ] Set up Google Analytics
- [ ] Create/verify Google My Business listing

### Recommended
- [ ] Add Google site verification meta tag
- [ ] Set up Google Analytics goals
- [ ] Create social media profiles
- [ ] Request backlinks from Renin.com
- [ ] Add customer review widgets
- [ ] Create initial blog content

---

## 🔍 Monitoring

### Weekly
1. Check Google Search Console for errors
2. Review keyword rankings
3. Monitor organic traffic in Analytics

### Monthly
1. Analyze top-performing pages
2. Review conversion rates from organic
3. Update underperforming content
4. Add new blog post

### Quarterly
1. Full SEO audit
2. Competitor analysis
3. Update meta descriptions
4. Refresh old content

---

## 🏷️ Target Keywords

### Primary (Ottawa Local)
- custom closets ottawa
- closet doors ottawa
- renin dealer ottawa
- barn doors ottawa
- closet installation ottawa

### Secondary (Service Areas)
- custom closets kanata
- closet doors barrhaven
- barn doors orleans
- closet installation nepean

### Product-Specific
- renin barn doors
- renin bifold doors
- renin bypass doors
- custom closet systems
- closet door hardware

### Long-Tail
- custom closet installation ottawa
- professional closet door installer
- renin authorized dealer ontario
- barn door installation service
- custom storage solutions ottawa

---

## 📊 SEO Metrics to Track

### Google Search Console
- Total clicks
- Total impressions
- Average CTR
- Average position
- Top queries
- Top pages

### Google Analytics
- Organic traffic
- Bounce rate
- Pages per session
- Average session duration
- Goal completions
- Conversion rate

### Google My Business
- Search views
- Map views
- Website clicks
- Direction requests
- Phone calls
- Review count and rating

---

## 🆘 Troubleshooting

### Rich Results Not Showing
1. Validate schema with testing tools
2. Check for JSON-LD syntax errors
3. Ensure all required fields present
4. Wait 2-4 weeks for Google to index

### Pages Not Indexed
1. Check robots.txt isn't blocking
2. Verify sitemap includes the page
3. Check for noindex meta tags
4. Submit URL for indexing in Search Console

### Low Rankings
1. Review keyword targeting
2. Check content quality and length
3. Analyze competitor content
4. Build quality backlinks
5. Improve page load speed

### Duplicate Content
1. Ensure canonical tags are correct
2. Check for URL parameter issues
3. Review internal linking structure
4. Consolidate similar pages

---

## 💡 Pro Tips

1. **Update Regularly**: Keep business hours, prices, and availability current
2. **Monitor Competitors**: Track their keywords and rankings
3. **Quality > Quantity**: Focus on helpful, detailed content
4. **Local Focus**: Emphasize Ottawa and service area content
5. **User Intent**: Match content to what users are searching for
6. **Mobile First**: Most searches are mobile - optimize accordingly
7. **Reviews Matter**: Encourage and respond to customer reviews
8. **Fresh Content**: Add new blog posts or updates monthly
9. **Track Everything**: Use analytics to guide decisions
10. **Be Patient**: SEO takes 3-6 months to show significant results

---

## 🔗 Important Links

### Testing
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema Validator](https://validator.schema.org/)

### Management
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [Google My Business](https://business.google.com/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### Documentation
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/)
- [Google SEO Guide](https://developers.google.com/search/docs)

---

## 📞 Quick Help

**Question**: How do I add a new product?
**Answer**: Use `generateProductMetadata()` for meta tags and `<ProductSchema>` component for structured data.

**Question**: How do I update business hours?
**Answer**: Edit `/lib/business-config.ts` - it updates everywhere automatically.

**Question**: Where is the sitemap?
**Answer**: Auto-generated at `/app/sitemap.ts`, accessible at `/sitemap.xml`

**Question**: How do I test structured data?
**Answer**: Use Google's Rich Results Test tool with your page URL.

**Question**: Do I need to update the sitemap manually?
**Answer**: No, it auto-generates from your pages and product data.

---

**Last Updated**: October 4, 2025
**Quick Support**: See `/SEO_IMPLEMENTATION.md` for detailed guides
