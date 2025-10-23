// Service Worker for Advanced Caching and Performance Optimization
const CACHE_NAME = 'pg-closets-v1'
const STATIC_CACHE_NAME = 'pg-closets-static-v1'
const IMAGE_CACHE_NAME = 'pg-closets-images-v1'
const API_CACHE_NAME = 'pg-closets-api-v1'

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  static: 7 * 24 * 60 * 60,  // 7 days
  images: 30 * 24 * 60 * 60, // 30 days
  api: 5 * 60,               // 5 minutes
  html: 24 * 60 * 60         // 24 hours
}

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/products',
  '/closet-doors-ottawa',
  '/bifold-doors-ottawa',
  '/custom-closets-ottawa',
  '/wardrobe-doors-ottawa',
  '/book',
  '/manifest.webmanifest',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('SW: Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('SW: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('SW: Static assets cached successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME &&
                cacheName !== IMAGE_CACHE_NAME &&
                cacheName !== API_CACHE_NAME) {
              console.log('SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('SW: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Handle different request types
  if (url.origin === self.location.origin) {
    // Handle same-origin requests
    if (url.pathname.startsWith('/images/') ||
        url.pathname.startsWith('/_next/image')) {
      // Image requests - cache first with network fallback
      event.respondWith(handleImageRequest(request))
    } else if (url.pathname.startsWith('/api/')) {
      // API requests - network first with cache fallback
      event.respondWith(handleApiRequest(request))
    } else {
      // HTML and static assets - cache first with network fallback
      event.respondWith(handleStaticRequest(request))
    }
  } else {
    // Handle external requests (fonts, analytics, etc.)
    if (url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
      // Font requests - cache first
      event.respondWith(handleFontRequest(request))
    } else {
      // Other external requests - network only
      event.respondWith(fetch(request))
    }
  }
})

// Cache-first strategy for images
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
    }

    return networkResponse
  } catch (error) {
    console.warn('SW: Network request failed, returning cached image:', error)
    return cachedResponse || new Response('Image not available', { status: 404 })
  }
}

// Network-first strategy for API requests
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME)

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
    }

    return networkResponse
  } catch (error) {
    console.warn('SW: Network request failed, returning cached API response:', error)
    const cachedResponse = await cache.match(request)
    return cachedResponse || new Response('API not available', { status: 503 })
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
    }

    return networkResponse
  } catch (error) {
    console.warn('SW: Network request failed, returning cached static asset:', error)
    return cachedResponse || new Response('Offline - Content not available', { status: 503 })
  }
}

// Cache-first strategy for fonts
async function handleFontRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
    }

    return networkResponse
  } catch (error) {
    console.warn('SW: Font request failed:', error)
    return cachedResponse || new Response('Font not available', { status: 404 })
  }
}

console.log('SW: Service Worker loaded successfully')