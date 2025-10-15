# Performance Optimization - Quick Reference

**Quick start guide for implementing Apple-level performance optimizations**

---

## 🚀 Quick Start (5 Minutes)

### 1. Run Image Optimization
```bash
npm run image:optimize
```
⏱️ Takes 10-15 minutes for 174 images
📊 Reduces 95MB → ~20MB (79% savings)

### 2. Import Polish Styles
Add to `/app/layout.tsx`:
```tsx
import '../styles/apple-polish.css'
```

### 3. Use Optimized Images
```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage'

<OptimizedImage
  src="/images/hero.png"
  alt="Description"
  width={1920}
  height={1080}
  priority={true}  // for above-fold images
/>
```

### 4. Add Loading States
```tsx
import { Suspense } from 'react'
import { ProductGallerySkeleton } from '@/components/ui/loading-states'

<Suspense fallback={<ProductGallerySkeleton />}>
  <ProductGallery />
</Suspense>
```

### 5. Test Performance
```bash
npm run build
npm run start
npx lighthouse http://localhost:3000 --view
```

---

## 📦 Available Components

### OptimizedImage Variants
```tsx
import {
  OptimizedImage,              // Standard optimized image
  OptimizedBackgroundImage,    // For hero sections
  OptimizedProductImage,       // For product cards
  LazyOptimizedImage          // With intersection observer
} from '@/components/ui/OptimizedImage'
```

### Loading States
```tsx
import {
  Skeleton,                   // Base skeleton
  ProductCardSkeleton,        // Product cards
  ProductGallerySkeleton,     // Image galleries
  FormSkeleton,               // Forms
  QuoteWizardSkeleton,        // Multi-step forms
  TestimonialsSkeleton,       // Testimonials
  BlogPostSkeleton,           // Blog posts
  TableSkeleton,              // Data tables
  DashboardSkeleton,          // Admin dashboard
  Spinner,                    // Loading spinner
  LoadingOverlay,             // Full-screen overlay
  PageSkeleton               // Full page
} from '@/components/ui/loading-states'
```

---

## 🎯 Performance Targets

| Metric | Target | Command to Check |
|--------|--------|------------------|
| LCP | <2.5s | `Lighthouse` |
| INP | <100ms | `Lighthouse` |
| CLS | <0.1 | `Lighthouse` |
| Bundle | <250KB | `npm run analyze-bundle` |
| Images | <20MB | `npm run image:validate` |

---

## 📊 Monitoring

### Access Dashboard
```
https://pgclosets.com/admin/performance
```

### Check Metrics
```bash
npm run build
npm run start
npx lighthouse http://localhost:3000 --output=html
```

---

## ⚡ Common Patterns

### Hero Image
```tsx
<OptimizedBackgroundImage
  src="/images/hero.png"
  alt="Hero background"
  priority={true}
  overlay={true}
  overlayOpacity={0.3}
>
  <HeroContent />
</OptimizedBackgroundImage>
```

### Product Card
```tsx
<OptimizedProductImage
  src="/images/product.png"
  alt="Product"
  aspectRatio="1/1"
  priority={false}
/>
```

### Below-Fold Content
```tsx
<LazyOptimizedImage
  src="/images/content.png"
  alt="Content"
  width={800}
  height={600}
/>
```

### Heavy Component
```tsx
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  {
    loading: () => <ComponentSkeleton />,
    ssr: false
  }
)
```

---

## 🔧 NPM Scripts

```bash
# Image Optimization
npm run image:optimize     # Optimize all images
npm run image:validate     # Validate optimization
npm run image:audit        # Audit image usage

# Performance Testing
npm run build              # Build for production
npm run analyze-bundle     # Analyze bundle size
npm run validate:performance  # Run performance checks

# Quality Checks
npm run type-check         # TypeScript validation
npm run lint               # ESLint check
npm run quality            # All quality checks
```

---

## 📁 Key Files

**Components:**
- `/components/ui/OptimizedImage.tsx` - Image optimization
- `/components/ui/loading-states.tsx` - Loading skeletons
- `/app/admin/performance/page.tsx` - Performance dashboard

**Styles:**
- `/styles/apple-polish.css` - UI polish and animations

**Scripts:**
- `/scripts/optimize-images-production.js` - Image optimization

**Config:**
- `/lighthouserc.json` - Lighthouse CI config
- `/next.config.js` - Next.js configuration

**Documentation:**
- `/docs/apple-design/PERFORMANCE_OPTIMIZATION_IMPLEMENTATION.md`
- `/docs/apple-design/DEPLOYMENT_CHECKLIST.md`
- `/docs/apple-design/APPLE_PERFORMANCE_SUMMARY.md`

---

## 🐛 Troubleshooting

### Images Not Loading
1. Check manifest: `/public/image-manifest.json`
2. Verify optimized folder: `/public/optimized`
3. Clear Next.js cache: `rm -rf .next`

### Performance Dashboard Not Working
1. Check GA4 integration in layout.tsx
2. Verify environment variables
3. Test in production mode

### Bundle Too Large
1. Run: `npm run analyze-bundle`
2. Identify large dependencies
3. Add dynamic imports for heavy components

### Lighthouse Score Low
1. Check Core Web Vitals in dashboard
2. Verify image optimization
3. Test on production build
4. Check network conditions

---

## ✅ Deployment Checklist

- [ ] Run `npm run image:optimize`
- [ ] Import `/styles/apple-polish.css`
- [ ] Replace images with OptimizedImage
- [ ] Add Suspense boundaries
- [ ] Run `npm run quality`
- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Test on mobile device
- [ ] Verify accessibility
- [ ] Deploy to staging
- [ ] Final production check

---

## 📞 Need Help?

**Documentation:**
- See `PERFORMANCE_OPTIMIZATION_IMPLEMENTATION.md` for detailed guide
- See `DEPLOYMENT_CHECKLIST.md` for pre-launch verification
- See `APPLE_PERFORMANCE_SUMMARY.md` for complete overview

**Resources:**
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Last Updated:** October 15, 2025
**Version:** 1.0
