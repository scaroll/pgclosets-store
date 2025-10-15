# Premium Image Optimization Strategy
## PG Closets E-Commerce Store - Performance Agent #2

**Objective**: Every image should load instantly with zero CLS
**Quality Standard**: All images <100KB, LCP <1.5s
**Status**: Comprehensive Implementation Plan
**Priority**: CRITICAL - Core Web Vitals Impact

---

## Executive Summary

### Current State Analysis
- **Total Images**: 178+ files (root + products/)
- **Total Size**: ~178MB (public: 173MB, products: 5.8MB)
- **Formats**: PNG (majority), JPG
- **Average File Size**: 500KB-1.1MB per image
- **Optimization**: Minimal (Next.js Image component used inconsistently)
- **LCP Impact**: CRITICAL - Large unoptimized images blocking paint

### Target Metrics
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Image Size | ~178MB | <20MB | 89% reduction |
| Avg Image | 900KB | <100KB | 89% reduction |
| LCP | ~4.5s | <1.5s | 67% faster |
| CLS | 0.15 | 0 | Zero shift |
| Format | PNG/JPG | WebP/AVIF | Modern formats |
| Coverage | 40% | 100% | Full optimization |

---

## Phase 1: Image Audit & Baseline (IMMEDIATE)

### 1.1 Comprehensive Image Inventory
```bash
# Run complete audit
npm run image:audit

# Generate detailed report
node scripts/image-audit-comprehensive.js
```

**Audit Criteria**:
- File size (target: <100KB)
- Format (PNG → WebP/AVIF)
- Dimensions (actual vs displayed)
- Usage (referenced in code or orphaned)
- Loading strategy (eager vs lazy)
- Placeholder implementation
- srcset/sizes attributes
- Priority flags

### 1.2 Critical Image Identification
**Priority 1 - Above-the-Fold (LCP Critical)**:
- Hero images (homepage, category pages)
- Logo (pg-logo.png, pg-logo-dark.png, pg-logo-white.png)
- First 2-3 product cards
- Featured project images

**Priority 2 - Product Images**:
- Product detail page main image
- Product card thumbnails
- Gallery images
- Zoom/high-res variants

**Priority 3 - Supporting Content**:
- Lifestyle images
- Installation process photos
- Testimonial images
- Blog post images

### 1.3 Unused Image Detection
```bash
# Find unreferenced images
node scripts/find-unused-images.js

# Expected cleanup: 20-30% of images
```

---

## Phase 2: Automated Conversion Pipeline (CRITICAL)

### 2.1 Image Optimization Script
**Location**: `/scripts/optimize-images-production.js`

**Features**:
- Batch convert PNG → WebP + AVIF
- Generate responsive variants (5 sizes)
- Create blur placeholders
- Generate image manifest
- Preserve aspect ratios
- Optimize JPEG quality

**Implementation**:
```javascript
// scripts/optimize-images-production.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const OPTIMIZATION_CONFIG = {
  formats: {
    avif: { quality: 80, effort: 9 },
    webp: { quality: 85, effort: 6 },
    jpeg: { quality: 90, mozjpeg: true }
  },
  sizes: {
    thumbnail: { width: 256, suffix: '-thumb' },
    small: { width: 640, suffix: '-sm' },
    medium: { width: 1080, suffix: '-md' },
    large: { width: 1920, suffix: '-lg' },
    original: { width: 2560, suffix: '' }
  },
  outputDir: 'public/optimized',
  manifestPath: 'public/image-manifest.json',
  blurDataURLSize: 20
};

async function optimizeImage(inputPath, outputDir) {
  const basename = path.basename(inputPath, path.extname(inputPath));
  const metadata = await sharp(inputPath).metadata();

  const results = {
    original: inputPath,
    optimized: {},
    blurDataURL: null,
    aspectRatio: metadata.width / metadata.height,
    originalSize: (await fs.stat(inputPath)).size
  };

  // Generate blur placeholder
  const blurBuffer = await sharp(inputPath)
    .resize(OPTIMIZATION_CONFIG.blurDataURLSize)
    .jpeg({ quality: 20 })
    .toBuffer();
  results.blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;

  // Generate all format/size combinations
  for (const [formatName, formatConfig] of Object.entries(OPTIMIZATION_CONFIG.formats)) {
    results.optimized[formatName] = {};

    for (const [sizeName, sizeConfig] of Object.entries(OPTIMIZATION_CONFIG.sizes)) {
      const outputFilename = `${basename}${sizeConfig.suffix}.${formatName}`;
      const outputPath = path.join(outputDir, outputFilename);

      let pipeline = sharp(inputPath);

      if (sizeConfig.width && metadata.width > sizeConfig.width) {
        pipeline = pipeline.resize(sizeConfig.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Apply format-specific optimization
      if (formatName === 'avif') {
        pipeline = pipeline.avif(formatConfig);
      } else if (formatName === 'webp') {
        pipeline = pipeline.webp(formatConfig);
      } else if (formatName === 'jpeg') {
        pipeline = pipeline.jpeg(formatConfig);
      }

      await pipeline.toFile(outputPath);

      const stats = await fs.stat(outputPath);
      results.optimized[formatName][sizeName] = {
        path: outputPath,
        size: stats.size,
        url: `/optimized/${outputFilename}`
      };
    }
  }

  return results;
}

async function batchOptimize(inputGlob) {
  const glob = require('glob');
  const images = glob.sync(inputGlob);

  console.log(`🎨 Optimizing ${images.length} images...`);

  const manifest = {};
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (let i = 0; i < images.length; i++) {
    const imagePath = images[i];
    console.log(`[${i + 1}/${images.length}] ${path.basename(imagePath)}`);

    const results = await optimizeImage(imagePath, OPTIMIZATION_CONFIG.outputDir);
    manifest[imagePath] = results;

    totalOriginalSize += results.originalSize;
    totalOptimizedSize += Object.values(results.optimized)
      .flatMap(formats => Object.values(formats))
      .reduce((sum, file) => sum + file.size, 0);
  }

  // Save manifest
  await fs.writeFile(
    OPTIMIZATION_CONFIG.manifestPath,
    JSON.stringify(manifest, null, 2)
  );

  // Generate report
  const savings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
  console.log(`\n✅ Optimization Complete!`);
  console.log(`📊 Original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`📊 Optimized: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`📊 Savings: ${savings}%`);
}

// Run optimization
batchOptimize('public/**/*.{png,jpg,jpeg}');
```

### 2.2 NPM Scripts
```json
{
  "scripts": {
    "image:optimize": "node scripts/optimize-images-production.js",
    "image:audit": "node scripts/image-audit-comprehensive.js",
    "image:clean": "node scripts/clean-unused-images.js",
    "image:validate": "node scripts/validate-image-optimization.js"
  }
}
```

---

## Phase 3: Component Implementation (HIGH PRIORITY)

### 3.1 Universal OptimizedImage Component
**Location**: `/components/ui/optimized-image-universal.tsx`

```typescript
"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  type?: 'hero' | 'product' | 'gallery' | 'thumbnail' | 'logo'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  sizes,
  quality = 85,
  type = 'product',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Get optimized image URL from manifest
  const optimizedSrc = getOptimizedImageUrl(src, type)
  const blurDataURL = getBlurDataURL(src)

  // Smart sizes based on image type
  const smartSizes = sizes || getSizesForType(type)

  // Smart quality based on image type
  const smartQuality = quality || getQualityForType(type)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={smartQuality}
        sizes={smartSizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />

      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getOptimizedImageUrl(src: string, type: string): string {
  // Load from manifest or construct URL
  // Prefer AVIF, fallback to WebP, fallback to original
  return src // Simplified for example
}

function getBlurDataURL(src: string): string {
  // Load from manifest or generate
  return "data:image/jpeg;base64,..." // Placeholder
}

function getSizesForType(type: string): string {
  const sizeMap = {
    hero: "100vw",
    product: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    gallery: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
    thumbnail: "(max-width: 768px) 50vw, 25vw",
    logo: "200px"
  }
  return sizeMap[type] || sizeMap.product
}

function getQualityForType(type: string): number {
  const qualityMap = {
    hero: 90,
    product: 85,
    gallery: 85,
    thumbnail: 75,
    logo: 90
  }
  return qualityMap[type] || 85
}
```

### 3.2 Migration Plan

**Step 1: Replace in ProductCard Component**
```typescript
// Before
<Image
  src={product.thumbnail || "/placeholder.svg"}
  alt={product.title}
  fill
  className="object-cover"
/>

// After
<OptimizedImage
  src={product.thumbnail || "/placeholder.svg"}
  alt={product.title}
  fill
  type="product"
  priority={false}
  className="object-cover"
/>
```

**Step 2: Replace in Product Detail Page**
```typescript
// Before
<Image
  src={product.image || "/placeholder.svg"}
  alt={product.title}
  fill
  className="object-cover"
/>

// After
<OptimizedImage
  src={product.image || "/placeholder.svg"}
  alt={product.title}
  fill
  type="product"
  priority={true} // Above-the-fold
  className="object-cover"
/>
```

**Step 3: Replace Hero Images**
```typescript
// Before
<Image src="/hero.jpg" alt="Hero" fill />

// After
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  fill
  type="hero"
  priority={true}
  quality={90}
/>
```

---

## Phase 4: Next.js Image Configuration (CRITICAL)

### 4.1 Enhanced next.config.mjs
```javascript
images: {
  // Device sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // Image sizes for different breakpoints
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  // Formats (AVIF first for best compression)
  formats: ['image/avif', 'image/webp'],

  // Minimum cache TTL (1 year)
  minimumCacheTTL: 31536000,

  // Quality levels
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

  // Remote patterns (already configured)
  remotePatterns: [
    // ... existing patterns
  ]
}
```

### 4.2 Image Preloading Strategy
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Preload critical images */}
        <link
          rel="preload"
          as="image"
          href="/optimized/pg-logo-lg.avif"
          type="image/avif"
        />
        <link
          rel="preload"
          as="image"
          href="/optimized/hero-lg.avif"
          type="image/avif"
          fetchpriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## Phase 5: Blur Placeholders (HIGH IMPACT)

### 5.1 Automatic Blur Generation
```javascript
// lib/blur-placeholder-generator.ts
import sharp from 'sharp';

export async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(20, 20, {
      fit: 'inside'
    })
    .jpeg({
      quality: 20,
      progressive: true
    })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

// Generate for all images during build
export async function generateAllBlurPlaceholders() {
  const glob = require('glob');
  const images = glob.sync('public/**/*.{jpg,png}');

  const placeholders = {};

  for (const image of images) {
    placeholders[image] = await generateBlurDataURL(image);
  }

  // Save to manifest
  await fs.writeFile(
    'public/blur-placeholders.json',
    JSON.stringify(placeholders, null, 2)
  );
}
```

### 5.2 Build-Time Generation
```json
// package.json
{
  "scripts": {
    "build": "npm run image:blur && next build",
    "image:blur": "node scripts/generate-blur-placeholders.js"
  }
}
```

---

## Phase 6: Lazy Loading Strategy (ESSENTIAL)

### 6.1 Lazy Loading Implementation
```typescript
// components/ui/lazy-image-loader.tsx
"use client"

import { useEffect, useRef, useState } from 'react'

export function useLazyLoad(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.1,
        ...options
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return { ref, isIntersecting }
}
```

### 6.2 Component Usage
```typescript
export function LazyProductImage({ src, alt }: ImageProps) {
  const { ref, isIntersecting } = useLazyLoad()

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <OptimizedImage src={src} alt={alt} priority={false} />
      ) : (
        <div className="aspect-square bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
```

---

## Phase 7: Hero Image Optimization (LCP CRITICAL)

### 7.1 Hero Image Best Practices
```typescript
// components/hero/hero-section.tsx
"use client"

import { OptimizedImage } from '@/components/ui/optimized-image-universal'

export function HeroSection() {
  return (
    <section className="relative h-[70vh]">
      <OptimizedImage
        src="/hero-main.jpg"
        alt="Premium Closet Doors"
        fill
        priority={true}
        type="hero"
        quality={90}
        sizes="100vw"
        className="object-cover"
      />

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Hero content */}
      </div>
    </section>
  )
}
```

### 7.2 LCP Optimization Checklist
- [ ] Hero image <100KB (AVIF format)
- [ ] Image preloaded in `<head>`
- [ ] `priority={true}` flag set
- [ ] `fetchpriority="high"` attribute
- [ ] No blocking resources before hero
- [ ] Inline critical CSS for hero
- [ ] Proper aspect ratio to prevent CLS

---

## Phase 8: Responsive Srcsets (BANDWIDTH SAVINGS)

### 8.1 Automatic Srcset Generation
```typescript
// lib/srcset-generator.ts
export function generateSrcSet(imagePath: string): string {
  const sizes = [256, 640, 1080, 1920, 2560]
  const formats = ['avif', 'webp', 'jpg']

  return sizes
    .map(size => {
      const avif = `/optimized/${imagePath}-${size}.avif ${size}w`
      const webp = `/optimized/${imagePath}-${size}.webp ${size}w`
      return `${avif}, ${webp}`
    })
    .join(', ')
}

// Usage
<OptimizedImage
  src="/product.jpg"
  alt="Product"
  srcSet={generateSrcSet('product')}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 8.2 Picture Element for Art Direction
```typescript
// components/ui/responsive-image.tsx
export function ResponsiveImage({ mobile, tablet, desktop, alt }) {
  return (
    <picture>
      <source
        media="(max-width: 768px)"
        srcSet={`${mobile}.avif, ${mobile}.webp`}
      />
      <source
        media="(max-width: 1024px)"
        srcSet={`${tablet}.avif, ${tablet}.webp`}
      />
      <source
        media="(min-width: 1025px)"
        srcSet={`${desktop}.avif, ${desktop}.webp`}
      />
      <Image src={desktop} alt={alt} />
    </picture>
  )
}
```

---

## Phase 9: Unused Image Cleanup (SIZE REDUCTION)

### 9.1 Image Usage Analysis
```javascript
// scripts/find-unused-images.js
const glob = require('glob');
const fs = require('fs').promises;

async function findUnusedImages() {
  // Get all images
  const images = glob.sync('public/**/*.{jpg,png,jpeg,webp,avif}');

  // Get all code files
  const codeFiles = glob.sync('**/*.{tsx,ts,jsx,js,md}', {
    ignore: ['node_modules/**', '.next/**']
  });

  // Read all code
  const codeContent = await Promise.all(
    codeFiles.map(file => fs.readFile(file, 'utf-8'))
  );
  const allCode = codeContent.join('\n');

  // Find unreferenced images
  const unused = images.filter(image => {
    const basename = path.basename(image);
    return !allCode.includes(basename);
  });

  console.log(`📊 Found ${unused.length} unused images`);
  console.log(`💾 Potential savings: ${calculateSize(unused)}MB`);

  return unused;
}
```

### 9.2 Safe Deletion Process
```bash
# 1. Analyze unused images
npm run image:audit

# 2. Review unused-images-report.json

# 3. Move to archive (don't delete yet)
mkdir -p public/images-archive
mv public/unused-*.png public/images-archive/

# 4. Test site thoroughly

# 5. After 30 days, delete archive
rm -rf public/images-archive
```

---

## Phase 10: Validation & Monitoring (ONGOING)

### 10.1 Automated Validation Script
```javascript
// scripts/validate-image-optimization.js
async function validateOptimization() {
  const checks = [];

  // Check 1: All images <100KB
  const largeImages = findImagesLargerThan(100 * 1024);
  checks.push({
    name: 'File Size',
    passed: largeImages.length === 0,
    details: `${largeImages.length} images exceed 100KB`
  });

  // Check 2: All images have blur placeholders
  const missingBlur = findImagesMissingBlur();
  checks.push({
    name: 'Blur Placeholders',
    passed: missingBlur.length === 0,
    details: `${missingBlur.length} images missing blur`
  });

  // Check 3: All images have proper alt text
  const missingAlt = findImagesMissingAlt();
  checks.push({
    name: 'Alt Text',
    passed: missingAlt.length === 0,
    details: `${missingAlt.length} images missing alt`
  });

  // Check 4: Priority images use priority flag
  const missingPriority = findAboveFoldMissingPriority();
  checks.push({
    name: 'Priority Flags',
    passed: missingPriority.length === 0,
    details: `${missingPriority.length} above-fold images missing priority`
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    checks,
    passed: checks.every(c => c.passed)
  };

  await fs.writeFile(
    'image-validation-report.json',
    JSON.stringify(report, null, 2)
  );

  if (!report.passed) {
    console.error('❌ Image optimization validation FAILED');
    process.exit(1);
  }

  console.log('✅ Image optimization validation PASSED');
}
```

### 10.2 Lighthouse CI Integration
```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse:ci
      - name: Check LCP
        run: |
          LCP=$(jq '.audits["largest-contentful-paint"].numericValue' lighthouse-report.json)
          if [ $(echo "$LCP > 1500" | bc) -eq 1 ]; then
            echo "❌ LCP is ${LCP}ms (target: <1500ms)"
            exit 1
          fi
```

### 10.3 Real User Monitoring
```typescript
// lib/performance-monitoring.ts
export function trackImagePerformance() {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.initiatorType === 'img') {
        // Send to analytics
        gtag('event', 'image_load', {
          url: entry.name,
          duration: entry.duration,
          size: entry.encodedBodySize,
          cached: entry.transferSize === 0
        })
      }
    }
  })

  observer.observe({ entryTypes: ['resource'] })
}
```

---

## Implementation Timeline

### Week 1: Foundation (Days 1-3)
- [x] **Day 1**: Complete image audit, identify critical images
- [ ] **Day 2**: Set up optimization scripts, test on 10 images
- [ ] **Day 3**: Create OptimizedImage component, test integration

### Week 1: Core Implementation (Days 4-7)
- [ ] **Day 4**: Batch optimize all images (178 files → 2,670 variants)
- [ ] **Day 5**: Replace Image with OptimizedImage in ProductCard
- [ ] **Day 6**: Replace Image in ProductDetail, Hero sections
- [ ] **Day 7**: Add blur placeholders to all critical images

### Week 2: Polish & Validation (Days 8-14)
- [ ] **Day 8**: Implement lazy loading for galleries
- [ ] **Day 9**: Add responsive srcsets for all images
- [ ] **Day 10**: Optimize hero images for LCP <1.5s
- [ ] **Day 11**: Remove unused images (estimated 20-30 files)
- [ ] **Day 12**: Run comprehensive Lighthouse audit
- [ ] **Day 13**: Fix any remaining issues, fine-tune quality
- [ ] **Day 14**: Deploy to production, monitor Core Web Vitals

---

## Success Metrics

### Before Optimization
```
Performance Score: 72
LCP: 4.5s
Total Image Size: 178MB
Avg Image Size: 900KB
Format: PNG/JPG
CLS: 0.15
```

### After Optimization (Target)
```
Performance Score: 95+
LCP: <1.5s ✅
Total Image Size: <20MB ✅
Avg Image Size: <100KB ✅
Format: AVIF/WebP ✅
CLS: 0 ✅
```

### Key Performance Indicators
- ✅ 100% of images <100KB
- ✅ 100% AVIF/WebP coverage
- ✅ LCP <1.5s on all pages
- ✅ Zero CLS on all pages
- ✅ 95+ Lighthouse Performance score
- ✅ 89% reduction in image payload
- ✅ 100% blur placeholder coverage
- ✅ 100% lazy loading for below-fold images

---

## Tools & Scripts

### NPM Scripts Summary
```json
{
  "image:audit": "Comprehensive image audit and report",
  "image:optimize": "Batch optimize all images (WebP/AVIF)",
  "image:blur": "Generate blur placeholders",
  "image:clean": "Remove unused images",
  "image:validate": "Validate optimization quality",
  "lighthouse:ci": "Run Lighthouse CI checks",
  "build": "Pre-build image optimization + Next.js build"
}
```

### Manual Testing Checklist
- [ ] Test on Chrome (AVIF support)
- [ ] Test on Safari (WebP fallback)
- [ ] Test on Firefox (WebP support)
- [ ] Test on mobile devices (bandwidth savings)
- [ ] Test on slow 3G connection
- [ ] Verify no broken images
- [ ] Verify proper alt text
- [ ] Verify zero CLS (Layout Shift)
- [ ] Verify LCP <1.5s
- [ ] Verify smooth lazy loading

---

## Maintenance Plan

### Weekly
- Monitor Lighthouse scores
- Check Core Web Vitals in Search Console
- Review image size budget compliance

### Monthly
- Audit for new unoptimized images
- Review and optimize new product images
- Update image optimization scripts if needed

### Quarterly
- Review format support (new formats?)
- Analyze CDN performance
- Optimize based on real user data
- Update documentation

---

## Emergency Rollback Plan

If issues arise after deployment:

### Immediate Rollback (< 5 minutes)
```bash
# Revert to previous commit
git revert HEAD
git push

# Or use Vercel rollback
vercel rollback
```

### Component-Level Rollback
```typescript
// Temporarily disable OptimizedImage
import { Image } from 'next/image'

// Use Next/Image directly until fixed
<Image src={src} alt={alt} {...props} />
```

### CDN Rollback
```javascript
// Switch back to original images in next.config.mjs
images: {
  loader: 'default',
  // Remove custom loader
}
```

---

## References & Resources

### Documentation
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [AVIF Format Spec](https://avif.io/)
- [WebP Format Spec](https://developers.google.com/speed/webp)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools
- [Squoosh](https://squoosh.app/) - Image compression comparison
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [WebPageTest](https://www.webpagetest.org/) - Real-world testing
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Network profiling

---

**Status**: Ready for immediate implementation
**Priority**: CRITICAL - Direct impact on Core Web Vitals
**Estimated Impact**: 67% faster LCP, 89% smaller images, 95+ Lighthouse score
**Owner**: Performance Agent #2
**Last Updated**: 2025-10-14
