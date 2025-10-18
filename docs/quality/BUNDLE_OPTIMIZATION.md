# Bundle Optimization Guide

**PG Closets - Performance & Build Optimization**

## Table of Contents

- [Overview](#overview)
- [Bundle Size Targets](#bundle-size-targets)
- [Analysis Tools](#analysis-tools)
- [Optimization Strategies](#optimization-strategies)
- [Best Practices](#best-practices)
- [Monitoring](#monitoring)

## Overview

Bundle size directly impacts:
- **Load Time**: Smaller bundles = faster page loads
- **SEO**: Google uses page speed as ranking factor
- **User Experience**: Faster sites = better conversion
- **Mobile Performance**: Critical on slower networks

## Bundle Size Targets

### Overall Targets
- **Main Bundle**: < 200 KB (gzipped)
- **First Load JS**: < 250 KB (gzipped)
- **Total Page Weight**: < 1 MB
- **Initial Render Time**: < 2 seconds

### Per-Page Targets
- **Homepage**: < 150 KB (critical for first impression)
- **Product Pages**: < 200 KB
- **Checkout**: < 180 KB (fast checkout = better conversion)

## Analysis Tools

### 1. Next.js Built-in Analyzer

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
npm run analyze:bundle
# or
ANALYZE=true npm run build
```

This opens interactive treemap showing:
- Which packages take up most space
- Duplicated dependencies
- Unused code opportunities

### 2. Bundle Size Analysis Script

```bash
# Run custom analysis
npm run analyze-bundle

# This generates:
# - Bundle size report
# - Comparison with previous build
# - Warnings for large bundles
```

### 3. Lighthouse CI

```bash
# Run Lighthouse performance audit
npm install -g @lhci/cli
lhci autorun
```

## Optimization Strategies

### 1. Code Splitting

#### Automatic (Next.js)
Next.js automatically splits code by route:
```typescript
// Each page is automatically code-split
// app/products/page.tsx
export default function ProductsPage() {
  return <ProductsContent />;
}
```

#### Dynamic Imports
Lazy load heavy components:
```typescript
import dynamic from 'next/dynamic';

// ❌ Bad - loads immediately
import HeavyChart from '@/components/HeavyChart';

// ✅ Good - loads when needed
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false, // if component doesn't need SSR
});
```

#### Route-based Splitting
```typescript
// app/admin/page.tsx
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <LoadingSpinner />,
});
```

### 2. Tree Shaking

Import only what you need:

```typescript
// ❌ Bad - imports entire library
import _ from 'lodash';
import * as icons from 'lucide-react';

// ✅ Good - imports specific functions
import { debounce } from 'lodash-es';
import { Search, Menu, X } from 'lucide-react';
```

### 3. Dependency Optimization

#### Audit Dependencies
```bash
# Find duplicate dependencies
npm ls lodash

# Check dependency sizes
npm install -g cost-of-modules
cost-of-modules

# Alternative to heavy libraries
npm install date-fns instead of moment (97% smaller!)
```

#### Replace Heavy Dependencies

| Heavy Library | Lighter Alternative | Size Savings |
|--------------|---------------------|--------------|
| Moment.js (232 KB) | date-fns (12 KB) | 95% |
| Lodash (72 KB) | lodash-es (24 KB) | 67% |
| Axios (13 KB) | fetch API (0 KB) | 100% |

### 4. Image Optimization

```typescript
// ✅ Always use Next.js Image
import Image from 'next/image';

<Image
  src='/products/closet.jpg'
  alt='Luxury closet interior'
  width={800}
  height={600}
  loading='lazy' // Lazy load below fold
  quality={85} // Balance quality/size
  placeholder='blur' // Smooth loading
/>

// For external images
<Image
  src='https://cdn.example.com/image.jpg'
  alt='Product image'
  width={800}
  height={600}
  loader={customLoader}
/>
```

### 5. Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text
  variable: '--font-inter',
  // Only load weights you need
  weight: ['400', '500', '600', '700'],
});
```

### 6. CSS Optimization

```typescript
// ✅ Use Tailwind CSS (purges unused styles)
// ✅ Avoid large CSS-in-JS libraries
// ✅ Use CSS modules for component styles

// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Purges unused styles in production
};
```

### 7. Third-Party Scripts

```typescript
import Script from 'next/script';

// ✅ Load analytics after page interactive
<Script
  src='https://www.googletagmanager.com/gtag/js'
  strategy='afterInteractive'
/>

// ✅ Load non-critical scripts lazily
<Script
  src='https://chat.widget.com/script.js'
  strategy='lazyOnload'
/>
```

### 8. Remove Unused Code

```bash
# Find unused dependencies
npm install -g depcheck
depcheck

# Find unused exports
npm install -g ts-prune
ts-prune
```

## Best Practices

### DO ✅

- **Measure first**: Always measure before optimizing
- **Use dynamic imports**: For heavy, below-fold components
- **Optimize images**: Use Next.js Image component
- **Tree shake**: Import specific functions, not entire libraries
- **Monitor bundle size**: Set up automated alerts
- **Lazy load**: Defer non-critical resources
- **Use CDN**: For large, rarely changing assets
- **Enable compression**: Gzip/Brotli on server

### DON'T ❌

- Import entire libraries when you need one function
- Load all icons upfront
- Include unused dependencies
- Ignore bundle size warnings
- Skip image optimization
- Load heavy scripts on initial load
- Use `any` imports (prevents tree shaking)

## Optimization Checklist

### Before Each Release

- [ ] Run bundle analyzer
- [ ] Check for duplicate dependencies
- [ ] Verify no unused dependencies
- [ ] Test on slow 3G network
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify images are optimized
- [ ] Confirm bundle size targets met
- [ ] Test lazy loading works
- [ ] Verify code splitting is effective

### Monthly Review

- [ ] Audit all dependencies
- [ ] Look for lighter alternatives
- [ ] Review bundle size trends
- [ ] Update optimization strategies
- [ ] Share findings with team

## Monitoring

### Setup Automated Monitoring

```javascript
// next.config.js
module.exports = {
  webpack(config) {
    // Analyze bundle on each build
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze/client.html',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },
  
  // Set bundle size limits
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};
```

### CI/CD Integration

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run analyze-bundle
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Performance Budgets

```javascript
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "speed-index": ["error", { "maxNumericValue": 3000 }]
      }
    }
  }
}
```

## Quick Wins

### Immediate Optimizations (< 1 hour)

1. **Enable Gzip/Brotli compression** on server
2. **Add `loading="lazy"`** to below-fold images
3. **Use `next/image`** instead of `<img>`
4. **Import specific icons** instead of full icon pack
5. **Remove console.logs** from production

### Medium Effort (1-4 hours)

1. **Dynamic import heavy components**
2. **Replace heavy dependencies** with lighter alternatives
3. **Optimize font loading** strategy
4. **Implement route-based code splitting**
5. **Audit and remove unused dependencies**

### Long-term Optimizations (1+ days)

1. **Implement advanced caching strategy**
2. **Set up CDN** for static assets
3. **Optimize database queries**
4. **Implement service worker** for offline support
5. **Build component library** with tree-shakeable exports

## Resources

- [Next.js Performance](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
- [Bundle Phobia](https://bundlephobia.com/) - Check package sizes
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) - VS Code extension

---

**Bundle optimization is an ongoing process. Monitor, measure, and improve continuously.**

*Last updated: October 2024*
*Maintained by: PG Closets Development Team*
