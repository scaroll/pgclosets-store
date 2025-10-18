# DIVISION 14: QUICK START GUIDE

## 🚀 Get Started in 5 Minutes

### Step 1: Validate Performance (30 seconds)

```bash
npm run validate:performance
```

Expected output:
```
✅ Bundle Size: PASSED
✅ Image Optimization: PASSED
✅ Code Splitting: PASSED
✅ Caching Strategy: PASSED
✅ Performance Monitoring: PASSED

Overall Score: 5/5 (100%)
```

### Step 2: Use Image Optimization (2 minutes)

```typescript
import { imageOptimizer, getNextImageProps } from '@/lib/image-optimizer';

// In a component
const imageProps = getNextImageProps(
  '/products/door.jpg',
  'Luxury bypass door',
  {
    priority: true,  // For above-the-fold images
    width: 1920,
    height: 1080,
  }
);

<Image {...imageProps} />
```

### Step 3: Implement Caching (1 minute)

```typescript
import { cacheManager, generateCacheKey } from '@/lib/cache-strategy';

// Cache API responses
const products = await cacheManager.getOrCompute(
  generateCacheKey('products', { category: 'doors' }),
  async () => {
    return await fetchProducts();
  },
  { ttl: 3600 } // 1 hour
);

// Check cache metrics
const metrics = cacheManager.getMetrics();
console.log(`Cache hit rate: ${(metrics.hitRate * 100).toFixed(2)}%`);
```

### Step 4: Add Code Splitting (1 minute)

```typescript
import { createDynamicComponent } from '@/lib/code-splitting-utils';

// For heavy components
const HeavyConfigurator = createDynamicComponent(
  () => import('@/components/ProductConfigurator'),
  {
    loading: () => <LoadingSkeleton />,
  }
);

// Use in your component
<HeavyConfigurator {...props} />
```

### Step 5: Monitor Performance (30 seconds)

```typescript
// Add to root layout
import { PerformanceMonitor } from '@/components/analytics/performance-monitor';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
```

---

## 📊 Available Scripts

```bash
# Validate all performance optimizations
npm run validate:performance

# Analyze bundle size
npm run analyze-bundle

# Optimize images
npm run optimize:images

# Run all performance tests
npm run perf:all
```

---

## 🎯 Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| **LCP** | < 1.5s | Use `priority` prop on hero images |
| **FID** | < 50ms | Implement code splitting for heavy components |
| **CLS** | < 0.1 | Always specify image dimensions |
| **TTI** | < 2.5s | Enable caching + code splitting |

---

## 💡 Common Use Cases

### Optimize a Product Page

```typescript
import Image from 'next/image';
import { createDynamicComponent } from '@/lib/code-splitting-utils';
import { cacheManager } from '@/lib/cache-strategy';

// Dynamic imports for heavy components
const ProductConfigurator = createDynamicComponent(
  () => import('@/components/ProductConfigurator')
);

const Reviews = createDynamicComponent(
  () => import('@/components/Reviews')
);

export default async function ProductPage({ params }) {
  // Cache product data
  const product = await cacheManager.getOrCompute(
    `product:${params.id}`,
    () => fetchProduct(params.id),
    { ttl: 3600 }
  );

  return (
    <div>
      {/* Hero image with priority */}
      <Image
        src={product.image}
        alt={product.title}
        width={1920}
        height={1080}
        priority
      />

      {/* Lazy load configurator */}
      <ProductConfigurator product={product} />

      {/* Lazy load reviews */}
      <Reviews productId={product.id} />
    </div>
  );
}
```

### Optimize Images

```bash
# Test optimization (doesn't modify files)
npm run optimize:images:test

# Run full optimization
npm run optimize:images
```

### Check Performance

```bash
# Run validation
npm run validate:performance

# View detailed metrics
npm run analyze-bundle
```

---

## 🔧 Configuration

### Image Optimization

Edit `/lib/image-optimizer.ts`:

```typescript
export const LUXURY_IMAGE_CONFIG = {
  qualities: {
    thumbnail: 75,
    small: 80,
    medium: 85,
    large: 90,
    xl: 92,
  },
  // ... other settings
};
```

### Caching

Edit `/lib/cache-strategy.ts`:

```typescript
export const LUXURY_CACHE_CONFIG = {
  memory: {
    maxSize: 50, // MB
    ttl: 300,    // seconds
  },
  redis: {
    ttl: 3600,   // seconds
  },
  // ... other settings
};
```

---

## 📚 Learn More

- **Full Documentation:** [DIVISION_14_PERFORMANCE.md](./DIVISION_14_PERFORMANCE.md)
- **Executive Summary:** [DIVISION_14_SUMMARY.md](./DIVISION_14_SUMMARY.md)
- **Image Optimizer:** [/lib/image-optimizer.ts](./lib/image-optimizer.ts)
- **Cache Strategy:** [/lib/cache-strategy.ts](./lib/cache-strategy.ts)
- **Code Splitting:** [/lib/code-splitting-utils.ts](./lib/code-splitting-utils.ts)

---

## ❓ Troubleshooting

### Issue: Validation fails

```bash
# Re-run with detailed output
DEBUG=* npm run validate:performance
```

### Issue: Images not optimizing

```bash
# Check image format support
npm run optimize:images:test
```

### Issue: Cache not working

```typescript
// Clear cache and try again
import { cacheManager } from '@/lib/cache-strategy';
await cacheManager.clear();
```

---

## 🎉 You're Ready!

All systems are optimized and ready for production. Monitor your Core Web Vitals and enjoy luxury-grade performance!

**Questions?** See [DIVISION_14_PERFORMANCE.md](./DIVISION_14_PERFORMANCE.md) for detailed documentation.
