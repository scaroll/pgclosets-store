# Mobile Components Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
npm install framer-motion lucide-react

# Import components
import {
  MobileBottomNav,
  MobileCheckout,
  MobileSearch,
  TouchButton,
  SwipeableCard
} from '@/components/mobile';
```

## 📱 Core Components

### MobileBottomNav

Sticky bottom navigation for mobile devices.

```tsx
<MobileBottomNav cartItemCount={3} />
```

**Props:**
- `cartItemCount?: number` - Number of items in cart (shows badge)
- `className?: string` - Additional CSS classes

**Features:**
- 5 primary actions (Home, Browse, Cart, Contact, Account)
- Active state indicators
- Badge support
- Safe area inset support (iPhone notch)
- 56px touch targets

---

### MobileCheckout

One-tap mobile checkout with popular payment methods.

```tsx
<MobileCheckout
  total={299.99}
  currency="CAD"
  onCheckout={async (method) => {
    // Process payment
  }}
/>
```

**Props:**
- `total: number` - Total amount to charge
- `currency?: string` - Currency code (default: 'CAD')
- `onCheckout: (method: string) => Promise<void>` - Checkout handler
- `className?: string` - Additional CSS classes

**Features:**
- Apple Pay integration
- Google Pay integration
- Shop Pay support
- Traditional card payment
- Haptic feedback
- Security indicators
- Progress indicators

---

### MobileSearch

Full-screen search with voice input.

```tsx
<MobileSearch
  onSearch={async (query) => {
    return await searchProducts(query);
  }}
  onClose={() => router.back()}
  recentSearches={['closet doors', 'pantry']}
  trendingSearches={['bypass doors', 'hardware']}
/>
```

**Props:**
- `onSearch: (query: string) => Promise<SearchResult[]>` - Search handler
- `onClose?: () => void` - Close handler
- `recentSearches?: string[]` - Recent search terms
- `trendingSearches?: string[]` - Trending search terms
- `className?: string` - Additional CSS classes

**Features:**
- Voice search (Web Speech API)
- Instant search results
- Recent & trending searches
- Debounced input (300ms)
- Clear button
- Touch-optimized keyboard

---

## 👆 Touch Components

### TouchButton

Touch-optimized button with haptic feedback.

```tsx
<TouchButton
  onClick={() => console.log('Clicked')}
  onLongPress={() => console.log('Long pressed')}
  variant="primary"
  size="lg"
  haptic={true}
>
  Add to Cart
</TouchButton>
```

**Props:**
- `onClick?: () => void` - Click handler
- `onLongPress?: () => void` - Long press handler (500ms)
- `variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'`
- `size?: 'sm' | 'md' | 'lg' | 'xl'`
- `haptic?: boolean` - Enable haptic feedback (default: true)
- `disabled?: boolean`
- `className?: string`

**Touch Targets:**
- Small: 40px height
- Medium: 48px height (default)
- Large: 56px height
- Extra Large: 64px height

---

### SwipeableCard

Swipeable card with directional gestures.

```tsx
<SwipeableCard
  onSwipeLeft={() => console.log('Swiped left')}
  onSwipeRight={() => console.log('Swiped right')}
  showIndicators={true}
>
  <ProductCard product={product} />
</SwipeableCard>
```

**Props:**
- `onSwipeLeft?: () => void` - Left swipe handler
- `onSwipeRight?: () => void` - Right swipe handler
- `onSwipeUp?: () => void` - Up swipe handler
- `onSwipeDown?: () => void` - Down swipe handler
- `disabled?: boolean`
- `showIndicators?: boolean` - Show swipe direction indicators
- `className?: string`

**Swipe Threshold:** 50px minimum distance

---

### PullToRefresh

Pull-to-refresh functionality for lists.

```tsx
<PullToRefresh
  onRefresh={async () => {
    await refreshData();
  }}
  threshold={100}
>
  <ProductList products={products} />
</PullToRefresh>
```

**Props:**
- `onRefresh: () => Promise<void>` - Refresh handler
- `threshold?: number` - Pull distance threshold (default: 100px)
- `className?: string`

**Features:**
- Visual pull indicator
- Loading spinner
- Automatic reset
- Smooth animations

---

### TouchSlider

Touch-optimized range slider.

```tsx
<TouchSlider
  value={price}
  onChange={setPrice}
  min={0}
  max={5000}
  step={50}
  showValue={true}
  formatValue={(v) => `$${v}`}
/>
```

**Props:**
- `value: number` - Current value
- `onChange: (value: number) => void` - Change handler
- `min?: number` - Minimum value (default: 0)
- `max?: number` - Maximum value (default: 100)
- `step?: number` - Step increment (default: 1)
- `showValue?: boolean` - Show value labels (default: true)
- `formatValue?: (value: number) => string` - Value formatter
- `disabled?: boolean`
- `className?: string`

**Touch Target:** 48px height track

---

### TouchTabBar

Touch-optimized tab navigation.

```tsx
<TouchTabBar
  items={[
    { id: 'all', label: 'All', icon: <Grid /> },
    { id: 'new', label: 'New', icon: <Star />, badge: 5 }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="pills"
/>
```

**Props:**
- `items: TouchTabItem[]` - Tab items
- `activeTab: string` - Currently active tab ID
- `onChange: (tabId: string) => void` - Tab change handler
- `variant?: 'pills' | 'underline' | 'rounded'`
- `className?: string`

**TouchTabItem:**
```typescript
{
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}
```

---

### BottomSheet

Modal drawer from bottom of screen.

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Filter Options"
  snapPoints={[0.3, 0.6, 0.9]}
  defaultSnap={0.6}
>
  <FilterContent />
</BottomSheet>
```

**Props:**
- `isOpen: boolean` - Open state
- `onClose: () => void` - Close handler
- `title?: string` - Sheet title
- `snapPoints?: number[]` - Height snap points (% of screen)
- `defaultSnap?: number` - Default snap index
- `className?: string`

**Features:**
- Drag to resize
- Snap to predefined heights
- Swipe down to dismiss
- Backdrop overlay
- Handle indicator

---

## 🛠️ Utility Hooks

### useViewport

Track viewport dimensions and breakpoints.

```tsx
import { useViewport } from '@/hooks/use-viewport';

function MyComponent() {
  const { width, height, isMobile, isTablet, isDesktop } = useViewport();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

**Returns:**
- `width: number` - Viewport width
- `height: number` - Viewport height
- `isMobile: boolean` - < 768px
- `isTablet: boolean` - 768px - 1024px
- `isDesktop: boolean` - > 1024px

---

## 📦 Offline Sync

### Queue Form Submission

```typescript
import { queueFormSubmission } from '@/lib/mobile/offline-sync';

async function handleSubmit(data: any) {
  try {
    if (!navigator.onLine) {
      // Queue for offline sync
      await queueFormSubmission('QUOTES', data);
      showNotification('Form will be submitted when online');
    } else {
      // Submit immediately
      await submitForm(data);
    }
  } catch (error) {
    console.error('Submission failed:', error);
  }
}
```

**Types:**
- `'QUOTES'` - Quote requests
- `'CONTACTS'` - Contact forms
- `'CART'` - Cart updates
- `'FAVORITES'` - Favorite changes

---

## 🎨 Styling

### Touch Target Standards

```css
/* Minimum touch target size (WCAG 2.1 AA) */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Optimal touch target size */
.touch-target-optimal {
  min-height: 48px;
  min-width: 48px;
  padding: 14px;
}

/* Large touch target */
.touch-target-large {
  min-height: 56px;
  min-width: 56px;
  padding: 16px;
}
```

### Safe Area Insets

```css
/* Support for iPhone notch/home indicator */
@supports (padding: max(0px)) {
  .safe-area-inset {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-top: max(16px, env(safe-area-inset-top));
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}
```

### Mobile-First Breakpoints

```css
/* Mobile (default) */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## ⚡ Performance Tips

### 1. Lazy Loading

```tsx
import dynamic from 'next/dynamic';

const MobileSearch = dynamic(() => import('@/components/mobile/MobileSearch'), {
  loading: () => <SearchSkeleton />,
  ssr: false
});
```

### 2. Image Optimization

```tsx
<Image
  src="/products/door.jpg"
  alt="Closet Door"
  width={400}
  height={400}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 3. Touch Optimization

```css
/* Disable tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}

/* Smooth scrolling */
.scrollable {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

### 4. Font Size (Prevent iOS Zoom)

```css
input, textarea, select {
  font-size: 16px; /* Prevents iOS zoom on focus */
}
```

---

## 🧪 Testing

### Mobile Viewport Testing

```typescript
// Test on multiple viewports
const viewports = [
  { width: 375, height: 667, name: 'iPhone SE' },
  { width: 390, height: 844, name: 'iPhone 14' },
  { width: 393, height: 851, name: 'Samsung S23' },
  { width: 768, height: 1024, name: 'iPad' }
];

viewports.forEach(viewport => {
  test(`renders correctly on ${viewport.name}`, () => {
    cy.viewport(viewport.width, viewport.height);
    cy.visit('/');
    // ... tests
  });
});
```

### Touch Testing

```typescript
// Test touch interactions
cy.get('.touch-button')
  .trigger('touchstart')
  .trigger('touchend');

// Test swipe gestures
cy.get('.swipeable-card')
  .trigger('touchstart', { x: 200, y: 100 })
  .trigger('touchmove', { x: 50, y: 100 })
  .trigger('touchend');
```

---

## 📱 PWA Testing

### Test Service Worker

```javascript
// Check if service worker is registered
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker ready:', registration);
  });
}

// Check offline capability
window.addEventListener('offline', () => {
  console.log('App is offline');
});

window.addEventListener('online', () => {
  console.log('App is online');
});
```

### Test Offline Sync

```typescript
// Queue a submission
await queueFormSubmission('QUOTES', formData);

// Check pending count
const pending = await getPendingSubmissionCount();
console.log(`${pending} submissions pending`);

// Force sync
if (navigator.onLine) {
  const manager = await getOfflineSyncManager();
  await manager.syncPendingSubmissions();
}
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Voice Search Not Working**
   - Check browser support: `'webkitSpeechRecognition' in window`
   - Request microphone permission
   - Use HTTPS (required for Web Speech API)

2. **Service Worker Not Registering**
   - Check HTTPS (required)
   - Verify sw.js in public folder
   - Check browser console for errors

3. **Touch Targets Too Small**
   - Use developer tools to measure
   - Apply `.touch-target` class
   - Test on real devices

4. **PWA Not Installing**
   - Check manifest.json validity
   - Verify all required icons exist
   - Test with Lighthouse PWA audit

5. **Offline Sync Not Working**
   - Check IndexedDB support
   - Verify online event listeners
   - Check browser console for errors

---

## 📚 Additional Resources

- [Full Documentation](/DIVISION_13_MOBILE_OPTIMIZATION.md)
- [Touch Gesture Guidelines](/styles/mobile-touch.css)
- [Performance Optimization](/styles/mobile-performance.css)
- [Service Worker](/public/sw.js)
- [PWA Manifest](/public/manifest.json)

---

**Last Updated:** 2025-10-05
**Version:** 1.0.0
