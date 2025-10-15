# Progressive Web App (PWA) Implementation

**Agent #15 - Mobile Experience & PWA Specialist**

Complete guide for PG Closets PWA features, installation, and offline functionality.

---

## Overview

The PG Closets PWA provides app-like functionality with web accessibility, including offline support, push notifications, and home screen installation.

### PWA Benefits

- **Offline Access**: Browse products and cached content without connection
- **Fast Loading**: Aggressive caching for instant page loads
- **Home Screen Icon**: Add to home screen like a native app
- **Push Notifications**: Order updates and promotional messages
- **Background Sync**: Forms submitted even when offline
- **App-Like Experience**: Full-screen mode, smooth animations

---

## Service Worker Architecture

### File Location

`/public/sw.js`

### Caching Strategy

#### 1. Static Assets Cache

**Strategy**: Cache-First + Background Update

```javascript
// Files cached immediately on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// 30-day cache duration
```

**Use Case**: HTML, CSS, JavaScript, fonts

#### 2. Image Cache

**Strategy**: Cache-First with Network Fallback

```javascript
// Adaptive caching based on network speed
const IMAGE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
```

**Use Case**: Product images, logos, thumbnails

#### 3. API Cache

**Strategy**: Network-First with Cache Fallback

```javascript
// Short-lived cache for API responses
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

**Use Case**: Product data, business info, categories

#### 4. Dynamic Pages Cache

**Strategy**: Network-First with Offline Page Fallback

```javascript
// Page cache for offline browsing
const DYNAMIC_CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day
```

**Use Case**: Product pages, collection pages, info pages

---

## Installation

### Service Worker Registration

Location: `/app/layout.tsx`

```typescript
'use client';

useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}, []);
```

### Web App Manifest

Location: `/app/manifest.ts`

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PG Closets - Custom Closets & Storage Solutions Ottawa',
    short_name: 'PG Closets',
    description: 'Official Renin dealer providing custom closet doors...',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#1e293b',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Products',
        url: '/products',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Contact Us',
        url: '/contact',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}
```

---

## Install Prompt Component

### Smart Install Promotion

```typescript
import { PWAInstallPrompt } from '@/components/mobile/PWAInstallPrompt';

function App() {
  return (
    <>
      {/* Your app content */}

      <PWAInstallPrompt
        // Show after 3 page views
        minPageViews={3}

        // Show after 5 minutes on site
        minTimeOnSite={5}

        // Don't show again for 7 days if dismissed
        dismissCooldown={7}

        // Callbacks
        onInstall={() => {
          console.log('App installed!');
          // Track analytics
        }}
        onDismiss={() => {
          console.log('Install prompt dismissed');
        }}
      />
    </>
  );
}
```

### Platform-Specific Behavior

#### iOS (Safari)

- Shows instructions to add to home screen
- Guides through: Share → Add to Home Screen → Add
- Blue instruction card with step-by-step guide

#### Android (Chrome/Edge/Samsung)

- Uses native `beforeinstallprompt` event
- One-click install button
- Gradient banner with app icon

---

## Offline Functionality

### Offline Page

Location: `/app/offline/page.tsx`

```typescript
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center text-white p-8">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
        <p className="text-lg mb-6">
          Don't worry! You can still browse cached content.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold"
        >
          Try Again
        </button>

        <div className="mt-6 text-sm opacity-80">
          <p>✓ Browse cached products</p>
          <p>✓ View saved pages</p>
          <p>✓ Check business information</p>
        </div>
      </div>
    </div>
  );
}
```

### Background Sync

#### Form Submission Sync

```javascript
// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'quote-submission') {
    event.waitUntil(syncQuoteSubmissions());
  }
});

async function syncQuoteSubmissions() {
  const pendingSubmissions = await getPendingSubmissions('quotes');

  for (const submission of pendingSubmissions) {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission.data),
      });

      if (response.ok) {
        await removePendingSubmission('quotes', submission.id);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

#### Client-Side Usage

```typescript
async function submitQuote(data: QuoteData) {
  try {
    // Try immediate submission
    await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // Queue for background sync
    await queueForSync('quote-submission', data);

    // Register sync event
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('quote-submission');
    }
  }
}
```

---

## Push Notifications

### Setup

#### 1. Request Permission

```typescript
async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
}
```

#### 2. Subscribe to Push

```typescript
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Send subscription to server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  });
}
```

### Service Worker Handler

```javascript
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'view', title: 'View', icon: '/icon-view.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icon-dismiss.png' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'PG Closets', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window or open new one
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
```

---

## Testing

### Manual Testing Checklist

#### iOS Testing

- [ ] Install via Safari
- [ ] Home screen icon appears correctly
- [ ] Splash screen shows on launch
- [ ] Runs in standalone mode
- [ ] Status bar themed correctly
- [ ] Safe area insets respected
- [ ] Offline page shows when offline
- [ ] Background sync works (when returning online)

#### Android Testing

- [ ] Install prompt appears
- [ ] Installation successful
- [ ] Home screen icon appears
- [ ] App runs in standalone mode
- [ ] Theme color applied
- [ ] Offline functionality works
- [ ] Push notifications work
- [ ] Background sync works

### Automated Testing

```bash
# PWA Lighthouse audit
npx lighthouse https://pgclosets.ca --preset=desktop --view

# Check service worker
npm run test:sw

# Test offline functionality
npm run test:offline
```

### PWA Checklist Tool

```bash
# Install PWA builder CLI
npm install -g @pwabuilder/cli

# Run PWA validation
pwa-check https://pgclosets.ca
```

---

## Performance Optimization

### Cache Purging Strategy

```javascript
// In service worker activate event
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => !currentCaches.includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
```

### Cache Size Limits

- **Static Cache**: ~10MB
- **Image Cache**: ~50MB (automatically purged LRU)
- **API Cache**: ~5MB
- **Dynamic Cache**: ~20MB

### Network-First Timeout

```javascript
async function networkFirstWithTimeout(request, timeout = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    // Fallback to cache
    return await caches.match(request);
  }
}
```

---

## Debugging

### Service Worker Debugging

```javascript
// Check service worker status
navigator.serviceWorker.getRegistration().then((reg) => {
  console.log('Service Worker registered:', reg);
  console.log('Active:', reg.active);
  console.log('Installing:', reg.installing);
  console.log('Waiting:', reg.waiting);
});

// Check cache contents
caches.keys().then((names) => {
  names.forEach((name) => {
    caches.open(name).then((cache) => {
      cache.keys().then((keys) => {
        console.log(`Cache ${name}:`, keys.length, 'items');
      });
    });
  });
});
```

### Chrome DevTools

1. Open **Application** tab
2. Navigate to **Service Workers**
3. Check **Update on reload** for development
4. Use **Unregister** to clear service worker
5. View **Cache Storage** to inspect cached files

---

## Deployment

### Build Process

```bash
# Build for production
npm run build

# Validate service worker
npm run validate:sw

# Test offline functionality
npm run test:offline

# Deploy
vercel --prod
```

### Post-Deployment Verification

- [ ] Service worker registers successfully
- [ ] Manifest loads correctly
- [ ] Install prompt appears (after eligibility criteria met)
- [ ] Icons display correctly
- [ ] Offline page accessible
- [ ] Cache updates automatically

---

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox)

---

**Last Updated**: 2025-10-14
**Agent**: #15 - Mobile Experience & PWA Specialist
**Version**: 1.0.0
