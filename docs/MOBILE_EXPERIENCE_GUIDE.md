# PG Closets Mobile Experience Guide

**Agent #15 - Mobile Experience & PWA Specialist**

Complete mobile-first strategy and implementation guide for premium luxury e-commerce.

---

## Table of Contents

1. [Overview](#overview)
2. [Mobile-First Philosophy](#mobile-first-philosophy)
3. [Touch Gesture System](#touch-gesture-system)
4. [PWA Implementation](#pwa-implementation)
5. [Performance Optimization](#performance-optimization)
6. [Component Library](#component-library)
7. [Testing Strategy](#testing-strategy)
8. [Analytics & Metrics](#analytics--metrics)

---

## Overview

PG Closets mobile experience is designed to exceed native app quality while maintaining web accessibility. With >70% of traffic on mobile, every interaction is optimized for touch devices.

### Success Metrics

- **Target**: <2s average page load on mobile
- **Target**: >60% mobile conversion rate
- **Target**: >20% PWA install rate
- **Target**: <25% mobile bounce rate
- **Target**: >4.5/5 mobile user satisfaction

### Device Support

- **iOS**: 14+ (iPhone 6s and newer)
- **Android**: 8.0+ (95% of devices)
- **Tablets**: iPad, Android tablets
- **Foldables**: Galaxy Fold, Surface Duo
- **Screen Sizes**: 320px to 1024px+

---

## Mobile-First Philosophy

### Core Principles

1. **Thumb-Friendly Design**
   - All interactive elements within thumb reach
   - Minimum touch target: 44×44px (iOS), 48×48px (Android)
   - Primary actions in bottom third of screen

2. **One-Handed Operation**
   - Critical functions accessible with single hand
   - Navigation optimized for thumb zones
   - Swipe gestures for common actions

3. **Performance First**
   - <3s load time on 3G
   - Aggressive code splitting
   - Network-aware image loading

4. **Offline-First**
   - Core features work without connection
   - Graceful degradation
   - Background sync for form submissions

5. **Progressive Enhancement**
   - Works without JavaScript
   - Enhanced with modern features
   - Backwards compatible

---

## Touch Gesture System

### Implementation

```typescript
import { useGestures, HapticFeedback } from '@/lib/mobile/gestures';

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useGestures(
    ref,
    {
      onSwipe: (direction, distance, velocity) => {
        console.log(`Swiped ${direction}`);
        HapticFeedback.trigger('light');
      },
      onPinch: (scale, direction) => {
        console.log(`Pinched ${direction}`);
      },
      onLongPress: (point) => {
        console.log('Long press at', point);
        HapticFeedback.trigger('medium');
      },
      onDoubleTap: (point) => {
        console.log('Double tap at', point);
      },
      onPan: (delta, point) => {
        // Handle pan gesture
      },
    },
    {
      swipeThreshold: 50,
      swipeVelocity: 0.3,
      enableHaptics: true,
    }
  );

  return <div ref={ref}>Swipeable content</div>;
}
```

### Supported Gestures

- **Swipe**: Left, right, up, down (configurable threshold)
- **Pinch**: Zoom in/out (scale detection)
- **Long Press**: Context menus (500ms default)
- **Double Tap**: Quick actions (300ms window)
- **Pan**: Draggable elements (10px threshold)

### Haptic Feedback

```typescript
// Light feedback (10ms)
HapticFeedback.trigger('light');

// Medium feedback (20ms)
HapticFeedback.trigger('medium');

// Heavy feedback (30ms)
HapticFeedback.trigger('heavy');

// Success pattern
HapticFeedback.trigger('success'); // [10, 50, 10]

// Warning pattern
HapticFeedback.trigger('warning'); // [10, 30, 10, 30, 10]

// Error pattern
HapticFeedback.trigger('error'); // [30, 50, 30]
```

---

## PWA Implementation

### Service Worker

Location: `/public/sw.js`

**Features:**
- Offline-first caching strategy
- Background sync for forms
- Push notifications
- Cache versioning
- Network-first for API calls
- Cache-first for images

**Cache Strategies:**

1. **Static Assets** (Cache-First + Background Update)
   - HTML, CSS, JS files
   - 30-day cache duration

2. **Images** (Cache-First)
   - 7-day cache duration
   - Adaptive quality based on network

3. **API Calls** (Network-First)
   - 5-minute cache fallback
   - Stale data indicator

4. **Dynamic Pages** (Network-First with Cache Fallback)
   - 1-day cache duration

### Web App Manifest

Location: `/app/manifest.ts`

```typescript
{
  name: "PG Closets - Custom Closets & Storage Solutions Ottawa",
  short_name: "PG Closets",
  display: "standalone",
  orientation: "portrait-primary",
  theme_color: "#1e293b",
  background_color: "#f8fafc",
  icons: [
    { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
  ],
  shortcuts: [
    { name: "Browse Products", url: "/products" },
    { name: "Contact Us", url: "/contact" },
    { name: "Request Work", url: "/request-work" }
  ]
}
```

### Install Prompt

```typescript
import { PWAInstallPrompt } from '@/components/mobile/PWAInstallPrompt';

function App() {
  return (
    <PWAInstallPrompt
      minPageViews={3}
      minTimeOnSite={5}
      dismissCooldown={7}
      onInstall={() => {
        console.log('PWA installed!');
      }}
    />
  );
}
```

---

## Performance Optimization

### Network-Aware Loading

```typescript
import { useNetworkInfo, buildOptimizedImageUrl } from '@/lib/mobile/network';

function ProductImage({ src }: { src: string }) {
  const { networkInfo, imageQuality } = useNetworkInfo();

  const optimizedSrc = buildOptimizedImageUrl(src, {
    quality: imageQuality.quality,
    format: imageQuality.format,
    maxWidth: imageQuality.maxWidth,
  });

  return (
    <img
      src={optimizedSrc}
      alt="Product"
      loading={imageQuality.lazy ? 'lazy' : 'eager'}
    />
  );
}
```

### Image Quality by Network

| Network | Quality | Format | Max Width | Lazy Load |
|---------|---------|--------|-----------|-----------|
| 5G/4G   | 85%     | Auto   | 1920px    | No        |
| 3G      | 70%     | WebP   | 1024px    | Yes       |
| 2G      | 60%     | WebP   | 800px     | Yes       |
| Data Saver | 50%  | WebP   | 640px     | Yes       |

### Code Splitting

```typescript
// Route-based splitting
const MobileCheckout = dynamic(() => import('@/components/mobile/MobileCheckout'), {
  loading: () => <LoadingSpinner />,
});

// Component-level splitting
const MobileGallery = lazy(() => import('@/components/mobile/MobileGallery'));
```

### Performance Targets

- **First Contentful Paint (FCP)**: <1.8s on 3G
- **Largest Contentful Paint (LCP)**: <2.5s on 4G
- **Time to Interactive (TTI)**: <3.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Input Delay (FID)**: <100ms
- **Bundle Size**: <200KB main mobile chunk

---

## Component Library

### 1. MobileGallery

Swipeable image gallery with pinch-to-zoom.

```typescript
import { MobileGallery, GalleryTrigger } from '@/components/mobile/MobileGallery';

const images = [
  { src: '/image1.jpg', alt: 'Product 1' },
  { src: '/image2.jpg', alt: 'Product 2' },
];

<GalleryTrigger images={images} triggerIndex={0}>
  <img src={images[0].src} alt={images[0].alt} />
</GalleryTrigger>
```

**Features:**
- Swipe navigation
- Pinch-to-zoom (1x-4x)
- Double-tap to zoom
- Thumbnail strip
- Gesture hints

### 2. BottomSheet

iOS-style bottom sheet for actions and filters.

```typescript
import { BottomSheet } from '@/components/mobile/BottomSheet';

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Filter Options"
  snapPoints={[0.5, 0.9]}
  showHandle={true}
>
  {/* Sheet content */}
</BottomSheet>
```

**Features:**
- Multiple snap points
- Swipe to dismiss
- Backdrop dismiss
- Keyboard accessible
- Safe area support

### 3. PullToRefresh

Native-like pull-to-refresh functionality.

```typescript
import { PullToRefresh } from '@/components/mobile/PullToRefresh';

<PullToRefresh
  onRefresh={async () => {
    await fetchNewData();
  }}
  pullThreshold={80}
>
  {/* Content */}
</PullToRefresh>
```

**Features:**
- Smooth animations
- Haptic feedback
- Threshold indicator
- Loading state

### 4. SwipeableCards

Tinder-style card interface for product discovery.

```typescript
import { SwipeableCards } from '@/components/mobile/SwipeableCards';

<SwipeableCards
  cards={products.map(p => ({
    id: p.id,
    content: <ProductCard product={p} />
  }))}
  onSwipeRight={(card) => saveProduct(card.id)}
  onSwipeLeft={(card) => skipProduct(card.id)}
/>
```

**Features:**
- Swipe left/right/up
- Programmatic controls
- Progress indicator
- Card stack animation

### 5. MobileProductCard

Touch-optimized product card.

```typescript
import { MobileProductCard } from '@/components/mobile/MobileProductCard';

<MobileProductCard
  product={product}
  priority={index < 3}
/>
```

**Features:**
- Large touch targets (52px)
- Swipe actions
- Quick add to cart
- Optimized images

---

## Testing Strategy

### Device Testing Matrix

| Device | Screen Size | OS Version | Priority |
|--------|-------------|------------|----------|
| iPhone 14 Pro | 393×852 | iOS 17 | Critical |
| iPhone SE | 375×667 | iOS 16 | High |
| Samsung Galaxy S23 | 360×800 | Android 13 | Critical |
| iPad Pro | 1024×1366 | iPadOS 17 | Medium |
| Galaxy Fold | 280×653 (folded) | Android 12 | Low |

### Manual Testing Checklist

- [ ] All touch targets ≥44px
- [ ] Swipe gestures work smoothly
- [ ] Pinch-to-zoom functional
- [ ] Forms work with mobile keyboards
- [ ] Safe area insets respected
- [ ] PWA installable (iOS + Android)
- [ ] Offline mode works
- [ ] Push notifications work
- [ ] Haptic feedback appropriate
- [ ] Animations smooth (60fps)

### Automated Testing

```bash
# Run mobile E2E tests
npm run test:mobile

# Test on real devices (BrowserStack)
npm run test:browserstack

# Lighthouse mobile audit
npm run lighthouse:mobile
```

### Performance Testing

```bash
# Mobile performance validation
npm run validate:performance -- --mobile

# Network throttling test (3G)
npm run test:3g

# Low-end device emulation
npm run test:low-end-device
```

---

## Analytics & Metrics

### Mobile-Specific Tracking

```typescript
import { useMobileAnalytics } from '@/lib/mobile/analytics';

function ProductPage() {
  const analytics = useMobileAnalytics();

  useEffect(() => {
    analytics.trackEvent('product_view', {
      productId: product.id,
      viewType: 'mobile',
    });
  }, [product.id]);

  const handleAddToCart = () => {
    analytics.trackConversion('add_to_cart', product.price);
  };

  return (/* ... */);
}
```

### Tracked Metrics

1. **Touch Heatmap**
   - Where users tap most
   - Dead zones identification
   - A/B test button placement

2. **Scroll Depth**
   - How far users scroll
   - Time to reach depth
   - Content engagement

3. **Gesture Events**
   - Swipe frequency/direction
   - Pinch-to-zoom usage
   - Long-press interactions

4. **Mobile Conversions**
   - Device type breakdown
   - PWA vs browser conversion
   - Network speed impact

5. **Performance Metrics**
   - Load time by network
   - Time to interactive
   - Bundle size impact

### Dashboard Queries

```sql
-- Mobile conversion rate by device
SELECT
  device_type,
  COUNT(*) as sessions,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) as conversion_rate
FROM mobile_sessions
GROUP BY device_type;

-- PWA vs browser performance
SELECT
  is_standalone,
  AVG(session_duration) as avg_session,
  AVG(pages_per_session) as avg_pages,
  AVG(conversion_value) as avg_value
FROM mobile_sessions
GROUP BY is_standalone;
```

---

## Best Practices

### DO

✅ Use large touch targets (≥44px)
✅ Implement haptic feedback
✅ Optimize for thumb reach
✅ Test on real devices
✅ Support offline mode
✅ Use network-aware loading
✅ Implement pull-to-refresh
✅ Add PWA install prompt
✅ Track mobile-specific metrics
✅ Optimize for one-handed use

### DON'T

❌ Use hover-dependent interactions
❌ Require pinch-to-zoom to read text
❌ Ignore safe area insets
❌ Load full-size images on mobile
❌ Use tiny touch targets
❌ Forget keyboard types (tel, email)
❌ Block scrolling unnecessarily
❌ Ignore network conditions
❌ Skip haptic feedback
❌ Forget about landscape mode

---

## Troubleshooting

### Common Issues

**Issue**: Touch targets too small
**Solution**: Use `min-w-[44px] min-h-[44px]` class

**Issue**: Gestures not working
**Solution**: Check `touch-action: none` CSS property

**Issue**: Images too large on mobile
**Solution**: Implement network-aware loading

**Issue**: PWA not installable
**Solution**: Check manifest and service worker registration

**Issue**: Scroll performance poor
**Solution**: Use `will-change: transform` sparingly

**Issue**: Safe area not respected
**Solution**: Use `safe-area-inset-*` CSS variables

---

## Resources

- [PWA Implementation Guide](/docs/PWA_IMPLEMENTATION.md)
- [Touch Gestures Reference](/docs/TOUCH_GESTURES.md)
- [Mobile Performance Guide](/docs/MOBILE_PERFORMANCE.md)
- [Testing Checklist](/docs/MOBILE_TESTING_CHECKLIST.md)

---

**Last Updated**: 2025-10-14
**Agent**: #15 - Mobile Experience & PWA Specialist
**Version**: 1.0.0
