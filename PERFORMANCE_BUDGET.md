# Performance Budget — PG Closets v2

## Overview

This document defines the performance budgets and monitoring strategy for PG Closets v2. All metrics are based on the requirements outlined in `PG-CLOSETS-V2-MASTER-SPEC.md`.

## Core Web Vitals Targets

### Desktop Performance

| Metric | Target | Maximum | Current Status |
|--------|--------|---------|----------------|
| **LCP** (Largest Contentful Paint) | ≤ 1.5s | 2.2s | ⚠️ Monitor |
| **CLS** (Cumulative Layout Shift) | ≤ 0.05 | 0.10 | ⚠️ Monitor |
| **INP** (Interaction to Next Paint) | ≤ 100ms | 200ms | ⚠️ Monitor |
| **FCP** (First Contentful Paint) | ≤ 1.2s | 1.5s | ⚠️ Monitor |

### Mobile Performance

| Metric | Target | Maximum | Current Status |
|--------|--------|---------|----------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.2s | 3.0s | ⚠️ Monitor |
| **CLS** (Cumulative Layout Shift) | ≤ 0.05 | 0.10 | ⚠️ Monitor |
| **INP** (Interaction to Next Paint) | ≤ 150ms | 200ms | ⚠️ Monitor |
| **FCP** (First Contentful Paint) | ≤ 1.5s | 2.0s | ⚠️ Monitor |

## Bundle Size Budgets

### JavaScript Bundles

| Bundle Type | Target | Maximum | Notes |
|-------------|--------|---------|-------|
| **Initial JS** | ≤ 100KB | 150KB gzipped | First page load |
| **Total JS** | ≤ 300KB | 400KB gzipped | All chunks combined |
| **Main Chunk** | ≤ 80KB | 120KB gzipped | Core application code |
| **Vendor Chunk** | ≤ 100KB | 150KB gzipped | Third-party libraries |
| **Per Route** | ≤ 30KB | 50KB gzipped | Route-specific code |

### CSS Bundles

| Bundle Type | Target | Maximum | Notes |
|-------------|--------|---------|-------|
| **Critical CSS** | ≤ 14KB | 20KB inline | Above-the-fold styles |
| **Total CSS** | ≤ 50KB | 75KB gzipped | All stylesheets |

### Image Assets

| Image Type | Format | Size Limit | Notes |
|------------|--------|------------|-------|
| **Hero Images** | WebP + AVIF | ≤ 150KB | Use Next.js Image with quality=85 |
| **Product Images** | WebP + AVIF | ≤ 100KB | Use Next.js Image with quality=80 |
| **Thumbnails** | WebP + AVIF | ≤ 30KB | Use Next.js Image with quality=75 |
| **Icons** | SVG | ≤ 5KB | Inline when possible |

## Performance Optimization Guidelines

### Image Optimization

1. **Use Next.js Image Component**
   ```tsx
   import Image from 'next/image'

   <Image
     src="/products/bypass-door.jpg"
     alt="Bypass closet door"
     width={800}
     height={600}
     quality={85}
     loading="lazy"
     placeholder="blur"
   />
   ```

2. **Responsive Images**
   ```tsx
   <Image
     src="/hero.jpg"
     alt="Custom closet solutions"
     fill
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
     priority // Only for above-the-fold images
   />
   ```

3. **Image Format Priority**
   - AVIF (smallest, modern browsers)
   - WebP (smaller, wide support)
   - JPEG/PNG (fallback)

4. **Image Sizing Guidelines**
   - Hero: 1920x1080 max
   - Product detail: 1200x900 max
   - Product thumbnail: 400x400 max
   - Gallery: 800x600 max

### Code Splitting Strategies

1. **Route-based Splitting**
   ```tsx
   // Automatic with Next.js App Router
   // Each page in app/ directory is automatically code-split
   ```

2. **Component-based Splitting**
   ```tsx
   import dynamic from 'next/dynamic'

   const ConfiguratorModal = dynamic(
     () => import('@/components/product/ConfiguratorModal'),
     {
       loading: () => <p>Loading...</p>,
       ssr: false, // Disable SSR for client-only components
     }
   )
   ```

3. **Library Splitting**
   ```tsx
   // Only import what you need
   import { format } from 'date-fns/format' // ✅ Good
   import * as dateFns from 'date-fns' // ❌ Bad
   ```

### Rendering Strategies

1. **Server Components (Default)**
   - Use for static content
   - Product listings
   - SEO-critical pages

2. **Client Components**
   - Interactive forms
   - Product configurators
   - User interactions
   ```tsx
   'use client'

   export function ProductConfigurator() {
     // Interactive component
   }
   ```

3. **Static Generation (ISR)**
   ```tsx
   // app/products/[slug]/page.tsx
   export const revalidate = 3600 // Revalidate every hour
   ```

### Font Optimization

1. **Use System Font Stack**
   ```css
   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
   ```

2. **If Custom Fonts Required**
   ```tsx
   import { Inter } from 'next/font/google'

   const inter = Inter({
     subsets: ['latin'],
     display: 'swap',
     variable: '--font-inter',
   })
   ```

### Third-Party Scripts

1. **Defer Non-Critical Scripts**
   ```tsx
   import Script from 'next/script'

   <Script
     src="https://example.com/script.js"
     strategy="afterInteractive" // or "lazyOnload"
   />
   ```

2. **Self-Host When Possible**
   - Analytics scripts
   - Tracking pixels
   - Font files

## Monitoring Strategy

### Automated Monitoring

1. **Lighthouse CI (Pre-deployment)**
   ```bash
   npm run perf:lighthouse
   ```
   - Runs on every PR
   - Blocks merge if budgets exceeded
   - Configuration in `lighthouserc.js`

2. **Real User Monitoring (Production)**
   - Web Vitals tracked via GTM
   - Reported to GA4
   - Alerts for poor metrics

3. **Bundle Analysis (Development)**
   ```bash
   npm run analyze
   ```
   - Visualize bundle composition
   - Identify large dependencies
   - Track bundle size trends

### Performance Alerts

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|------------------|-------------------|---------|
| LCP | > 2.0s | > 2.5s | Investigate images/fonts |
| CLS | > 0.1 | > 0.15 | Check layout shifts |
| INP | > 200ms | > 300ms | Optimize JS execution |
| Bundle Size | > 400KB | > 500KB | Review dependencies |

### Monitoring Tools

1. **Development**
   - Next.js built-in analyzer
   - Lighthouse Chrome DevTools
   - React DevTools Profiler

2. **CI/CD**
   - Lighthouse CI
   - Bundle size tracking
   - Performance regression tests

3. **Production**
   - Google Analytics 4
   - Web Vitals API
   - Vercel Analytics
   - Custom performance monitoring

## Optimization Checklist

### Pre-Launch

- [ ] All images optimized and properly sized
- [ ] Critical CSS inlined (≤ 14KB)
- [ ] JavaScript bundles under budget
- [ ] Fonts optimized or using system fonts
- [ ] Third-party scripts deferred
- [ ] Route-based code splitting verified
- [ ] LCP elements prioritized
- [ ] No layout shifts in critical content
- [ ] Form interactions under 200ms
- [ ] Lighthouse score ≥ 90

### Post-Launch

- [ ] Real User Monitoring active
- [ ] Performance alerts configured
- [ ] Weekly performance reviews scheduled
- [ ] Budget tracking dashboard created
- [ ] Performance regression tests in CI
- [ ] Team trained on performance best practices

## Performance Testing Process

### Local Testing

```bash
# Build production version
npm run build

# Start production server
npm run start

# Run Lighthouse
npm run perf:lighthouse

# Analyze bundle
npm run analyze
```

### CI/CD Testing

```yaml
# GitHub Actions example
- name: Performance Tests
  run: |
    npm run build
    npm run perf:lighthouse
    npm run analyze-bundle
```

### Manual Testing

1. **Chrome DevTools**
   - Network tab (Disable cache)
   - Performance tab (Record page load)
   - Lighthouse tab (Run audit)

2. **WebPageTest**
   - Test from multiple locations
   - Compare with competitors
   - Track performance over time

3. **Real Device Testing**
   - Test on actual mobile devices
   - Use throttled network (3G/4G)
   - Verify on low-end devices

## Regression Prevention

### Automated Checks

1. **Pre-commit Hooks**
   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
       "*.css": ["stylelint --fix", "prettier --write"]
     }
   }
   ```

2. **Bundle Size Limits**
   ```js
   // next.config.js
   module.exports = {
     webpack: (config, { isServer }) => {
       if (!isServer) {
         config.performance = {
           maxAssetSize: 150000, // 150KB
           maxEntrypointSize: 150000,
         }
       }
       return config
     }
   }
   ```

3. **Performance Budgets in CI**
   - Lighthouse CI fails build if budgets exceeded
   - Bundle size warnings in PR comments
   - Automatic performance regression detection

## Resources

### Documentation

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Team Contacts

- **Performance Lead**: [Name]
- **DevOps**: [Name]
- **QA Lead**: [Name]

## Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-06 | 1.0.0 | Initial performance budget | Claude |

---

**Note**: This is a living document. Update as performance requirements evolve and new optimizations are discovered.
