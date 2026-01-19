# Image Optimization Implementation Guide

## Overview

This guide covers the complete image optimization system for PG Closets, including AVIF/WebP conversion, responsive variants, lazy loading, and CDN integration.

## Current State

- **Total Images**: 174 product images
- **Total Size**: 95 MB (unoptimized)
- **Formats**: JPG, PNG
- **Location**: `/public/images/`

## Optimization Strategy

### 1. Multi-Format Support

Images are converted to three formats with automatic browser selection:

1. **AVIF** (Primary) - Best compression, ~50% smaller than WebP
2. **WebP** (Secondary) - Wide browser support, ~30% smaller than JPEG
3. **JPEG** (Fallback) - Universal compatibility

### 2. Responsive Variants

Each image generates 5 size variants:

| Variant | Width | Suffix | Use Case |
|---------|-------|--------|----------|
| Thumbnail | 256px | `-thumb` | Product cards, thumbnails |
| Small | 640px | `-sm` | Mobile viewports |
| Medium | 1080px | `-md` | Tablet viewports |
| Large | 1920px | `-lg` | Desktop viewports |
| Original | Original | `` | High-res displays |

**Total files per image**: 15 variants (5 sizes × 3 formats)

### 3. Expected Performance Gains

- **File Size Reduction**: 60-80% average
- **Page Load Speed**: 30-50% faster
- **LCP Improvement**: 40-60% faster
- **Bandwidth Savings**: ~75 MB → ~20 MB

## Implementation Steps

### Step 1: Run Image Optimization

```bash
# Navigate to project root
cd /Users/spencercarroll/pgclosets-store-main

# Run optimization script
node scripts/optimize-images.js
```

This will:
- Process all 174 images in `/public/images/`
- Generate 2,610 optimized variants (174 × 15)
- Create organized output in `/public/optimized-images/`
- Generate `image-manifest.json` with all variants
- Produce optimization report

**Estimated Runtime**: 5-10 minutes
**Expected Output Size**: ~20 MB (vs 95 MB original)

### Step 2: Update Image References

#### Option A: Use OptimizedImage Component (Recommended)

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

// Replace this:
<Image src="/images/product.jpg" alt="Product" width={800} height={600} />

// With this:
<OptimizedImage
  src="/images/product.jpg"
  alt="Product"
  width={800}
  height={600}
  type="product"
  priority={false} // true for above-fold images
/>
```

#### Option B: Use Next.js Image with Utilities

```tsx
import Image from 'next/image';
import { getNextImageProps } from '@/lib/image-utils';

const imageProps = getNextImageProps('/images/product.jpg', 'Product', {
  width: 800,
  height: 600,
  priority: false,
  type: 'product'
});

<Image {...imageProps} />
```

#### Option C: Manual Picture Element

```tsx
import { getOptimizedImageSources } from '@/lib/image-utils';

const sources = getOptimizedImageSources('/images/product.jpg');

<picture>
  {sources.map((source, i) => (
    <source
      key={i}
      srcSet={source.srcSet}
      sizes={source.sizes}
      type={source.type}
    />
  ))}
  <img src={sources[sources.length - 1].src} alt="Product" />
</picture>
```

### Step 3: Implement Lazy Loading

Lazy loading is automatic with `OptimizedImage` component:

```tsx
// Above-the-fold (loads immediately)
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  priority={true}
  type="hero"
/>

// Below-the-fold (lazy loaded)
<OptimizedImage
  src="/images/product.jpg"
  alt="Product"
  priority={false}
  type="product"
/>
```

**Lazy Loading Configuration**:
- Images load 50px before entering viewport
- Blur placeholder shown while loading
- Smooth fade-in transition on load
- Intersection Observer API for optimal performance

### Step 4: Preload Critical Images

For above-the-fold hero images:

```tsx
import { preloadImage } from '@/lib/image-utils';

// In component or page
useEffect(() => {
  preloadImage('/images/hero.jpg', 'avif', 'large');
}, []);
```

Or add to page `<head>`:

```tsx
<link
  rel="preload"
  as="image"
  href="/optimized-images/hero-lg.avif"
  type="image/avif"
/>
```

## CDN Integration

### Vercel Blob Storage (Recommended)

Vercel Blob is already configured in your project.

#### 1. Upload Optimized Images

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Upload optimized images
vercel blob upload public/optimized-images/**/* --token YOUR_TOKEN
```

#### 2. Update Image Loader

Edit `next.config.mjs`:

```javascript
images: {
  loader: 'custom',
  loaderFile: './lib/image-loader.ts',
  // ... existing config
}
```

Create `/lib/image-loader.ts`:

```typescript
export default function cloudinaryLoader({ src, width, quality }) {
  // Use Vercel Blob URL
  const blobUrl = process.env.NEXT_PUBLIC_BLOB_URL;
  return `${blobUrl}/${src}?w=${width}&q=${quality || 85}`;
}
```

#### 3. Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_BLOB_URL=https://hebbkx1anhila5yf.public.blob.vercel-storage.com
BLOB_READ_WRITE_TOKEN=your_token_here
```

### Alternative: Cloudinary

```bash
# Upload to Cloudinary
npm install cloudinary

# Use Cloudinary loader in next.config.mjs
images: {
  loader: 'cloudinary',
  path: 'https://res.cloudinary.com/your-cloud-name/image/upload/',
}
```

### Alternative: AWS S3 + CloudFront

1. Upload to S3 bucket
2. Configure CloudFront distribution
3. Update image loader to point to CloudFront URL
4. Set proper cache headers (1 year for images)

## Migration Checklist

### Phase 1: Preparation
- [x] Install dependencies (sharp already installed)
- [x] Create optimization scripts
- [x] Create utility functions
- [ ] Run optimization on test subset (10 images)
- [ ] Verify output quality and file sizes
- [ ] Test on different devices/browsers

### Phase 2: Full Optimization
- [ ] Run full optimization (all 174 images)
- [ ] Verify all variants generated correctly
- [ ] Check image-manifest.json accuracy
- [ ] Review optimization report
- [ ] Backup original images

### Phase 3: Code Updates
- [ ] Update image imports in components
- [ ] Replace all `<Image>` with `<OptimizedImage>`
- [ ] Add proper `priority` flags for above-fold images
- [ ] Implement lazy loading for galleries
- [ ] Add blur placeholders

### Phase 4: Testing
- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on mobile devices (iOS, Android)
- [ ] Verify AVIF/WebP fallbacks work
- [ ] Check Lighthouse scores (before/after)
- [ ] Validate Core Web Vitals improvements
- [ ] Test slow 3G connection

### Phase 5: CDN Deployment
- [ ] Choose CDN provider (Vercel Blob recommended)
- [ ] Upload optimized images to CDN
- [ ] Update image loader configuration
- [ ] Set cache headers (1 year for immutable assets)
- [ ] Test CDN delivery
- [ ] Monitor bandwidth usage

### Phase 6: Cleanup
- [ ] Remove old unoptimized images (after verification)
- [ ] Update build scripts
- [ ] Document new image workflow
- [ ] Train team on new image process

## Performance Monitoring

### Lighthouse Metrics (Target)

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Performance | 70 | 95+ | 90+ |
| LCP | 4.5s | 1.8s | <2.5s |
| FCP | 2.1s | 1.0s | <1.8s |
| CLS | 0.15 | 0.05 | <0.1 |
| Total Size | 95 MB | 20 MB | <25 MB |

### Core Web Vitals Monitoring

Add to pages:

```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Optimization Configuration

### Customize Settings

Edit `scripts/optimize-images.js`:

```javascript
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/optimized-images'),

  // Adjust quality (higher = better quality, larger file)
  avifQuality: 80,  // Range: 1-100
  webpQuality: 85,  // Range: 1-100
  jpegQuality: 90,  // Range: 1-100

  // Customize sizes
  sizes: {
    thumbnail: { width: 256, quality: 80 },
    small: { width: 640, quality: 85 },
    medium: { width: 1080, quality: 85 },
    large: { width: 1920, quality: 90 },
    original: { width: null, quality: 90 },
  },
};
```

## Troubleshooting

### Images Not Loading

1. Check browser console for errors
2. Verify file paths in image-manifest.json
3. Ensure AVIF/WebP support (use fallbacks)
4. Check Next.js image optimization settings

### Quality Issues

1. Increase quality settings in CONFIG
2. Use 'original' size for high-res displays
3. Check source image quality
4. Compare AVIF vs WebP vs JPEG

### Performance Not Improving

1. Verify lazy loading is working
2. Check images are actually optimized (inspect Network tab)
3. Ensure CDN cache headers are set
4. Profile with Lighthouse
5. Check for render-blocking resources

### Build Errors

1. Ensure Sharp is installed correctly: `npm install sharp`
2. Clear Next.js cache: `rm -rf .next`
3. Rebuild: `npm run build`
4. Check Node version (requires Node 18+)

## Best Practices

### Do's
✅ Use AVIF format for maximum compression
✅ Lazy load all below-fold images
✅ Set explicit width/height to prevent CLS
✅ Use blur placeholders for better UX
✅ Preload critical above-fold images
✅ Serve responsive variants based on viewport
✅ Use CDN for global delivery
✅ Monitor Core Web Vitals
✅ Set long cache headers (1 year)
✅ Compress before uploading to CDN

### Don'ts
❌ Don't use unoptimized images in production
❌ Don't load original high-res images on mobile
❌ Don't skip lazy loading for galleries
❌ Don't forget alt text (accessibility)
❌ Don't use loading="eager" for all images
❌ Don't ignore CLS (layout shift)
❌ Don't serve same size to all devices
❌ Don't forget to test on slow connections
❌ Don't skip browser compatibility testing
❌ Don't hard-code image dimensions in JSX

## Future Enhancements

### Progressive Web App (PWA)
- Cache optimized images in service worker
- Offline image fallbacks
- Background sync for image uploads

### Dynamic Image Generation
- AI-powered image cropping
- Automatic focal point detection
- Smart art direction for different viewports

### Advanced Optimization
- Perceptual quality metrics (SSIM, DSSIM)
- Dynamic quality adjustment based on image content
- ML-based compression optimization

### Performance Features
- HTTP/3 and QUIC protocol
- Brotli compression for image metadata
- Client hints for automatic format selection
- Priority hints for critical images

## Support & Resources

### Documentation
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [AVIF Format Guide](https://avif.io/)
- [WebP Format Guide](https://developers.google.com/speed/webp)

### Tools
- [Squoosh](https://squoosh.app/) - Compare compression
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [WebPageTest](https://www.webpagetest.org/) - Real-world testing
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Network profiling

### Team Contacts
- **Developer**: [Your Name]
- **DevOps**: [DevOps Contact]
- **Design**: [Design Contact]

---

**Last Updated**: 2025-10-04
**Version**: 1.0.0
**Status**: Ready for implementation
