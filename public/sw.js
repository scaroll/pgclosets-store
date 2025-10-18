// Service Worker for PG Closets PWA
// Version 1.0.0

const CACHE_NAME = 'pgclosets-v1.0.0'
const OFFLINE_URL = '/offline'
const API_CACHE_NAME = 'pgclosets-api-v1.0.0'
const IMAGES_CACHE_NAME = 'pgclosets-images-v1.0.0'

// Files to cache immediately
const ESSENTIAL_CACHE = [
  '/',
  '/offline',
  '/products',
  '/contact',
  '/about',
  '/_next/static/css/app.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/business-info',
]

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...')

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME)
        console.log('📦 Caching essential files...')
        await cache.addAll(ESSENTIAL_CACHE)
        console.log('✅ Essential files cached successfully')

        // Force activation
        await self.skipWaiting()
      } catch (error) {
        console.error('❌ Failed to cache essential files:', error)
      }
    })()
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...')

  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys()
        const deletePromises = cacheNames
          .filter(name =>
            name.startsWith('pgclosets-') &&
            ![CACHE_NAME, API_CACHE_NAME, IMAGES_CACHE_NAME].includes(name)
          )
          .map(name => caches.delete(name))

        await Promise.all(deletePromises)
        console.log('🧹 Old caches cleaned up')

        // Take control of all clients
        await self.clients.claim()
        console.log('✅ Service Worker activated and controlling all clients')
      } catch (error) {
        console.error('❌ Activation failed:', error)
      }
    })()
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return

  event.respondWith(handleFetch(request))
})

async function handleFetch(request) {
  const url = new URL(request.url)

  try {
    // Strategy 1: Network First for API calls
    if (url.pathname.startsWith('/api/')) {
      return await networkFirstStrategy(request, API_CACHE_NAME)
    }

    // Strategy 2: Cache First for images
    if (isImageRequest(request)) {
      return await cacheFirstStrategy(request, IMAGES_CACHE_NAME)
    }

    // Strategy 3: Stale While Revalidate for static assets
    if (isStaticAsset(request)) {
      return await staleWhileRevalidateStrategy(request, CACHE_NAME)
    }

    // Strategy 4: Network First with fallback for pages
    return await networkFirstWithFallback(request)

  } catch (error) {
    console.error('❌ Fetch error:', error)
    return await getOfflineResponse(request)
  }
}

// Network First Strategy - for API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const response = await fetch(request)

    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      console.log('📱 Serving API response from cache:', request.url)
      return cachedResponse
    }

    throw error
  }
}

// Cache First Strategy - for images
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    console.log('🖼️ Serving image from cache:', request.url)
    return cachedResponse
  }

  try {
    const response = await fetch(request)

    if (response.ok) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.error('❌ Failed to fetch image:', request.url)
    throw error
  }
}

// Stale While Revalidate - for static assets
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  // Always try to update cache in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => {
    // Silently fail background updates
  })

  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('⚡ Serving from cache (updating in background):', request.url)
    return cachedResponse
  }

  // Wait for network if no cache
  return await fetchPromise
}

// Network First with Fallback - for pages
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request)

    if (response.ok) {
      // Cache successful page responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Try cache first
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      console.log('📄 Serving page from cache:', request.url)
      return cachedResponse
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await getOfflinePage()
    }

    throw error
  }
}

// Helper functions
function isImageRequest(request) {
  const url = new URL(request.url)
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname)
}

function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/_next/') ||
         /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname)
}

async function getOfflineResponse(request) {
  if (request.mode === 'navigate') {
    return await getOfflinePage()
  }

  // Return a basic offline response for other requests
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Please check your connection.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

async function getOfflinePage() {
  try {
    const cache = await caches.open(CACHE_NAME)
    const offlineResponse = await cache.match(OFFLINE_URL)

    if (offlineResponse) {
      return offlineResponse
    }
  } catch (error) {
    console.error('❌ Failed to get offline page:', error)
  }

  // Fallback offline HTML
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Offline - PG Closets</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #243c74 0%, #89bee6 100%);
          color: white;
          text-align: center;
        }
        .container {
          max-width: 500px;
          padding: 2rem;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 300;
        }
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        .features {
          margin-top: 2rem;
          text-align: left;
          opacity: 0.8;
        }
        .feature {
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>You're Currently Offline</h1>
        <p>
          Don't worry! You can still browse previously visited pages and
          explore our cached content while offline.
        </p>

        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>

        <div class="features">
          <div class="feature">✓ Browse cached products</div>
          <div class="feature">✓ View saved pages</div>
          <div class="feature">✓ Check business information</div>
        </div>
      </div>

      <script>
        // Auto-retry when online
        window.addEventListener('online', () => {
          window.location.reload()
        })

        // Update UI based on connection status
        function updateConnectionStatus() {
          if (navigator.onLine) {
            window.location.reload()
          }
        }

        setInterval(updateConnectionStatus, 5000)
      </script>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  })
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'quote-submission') {
    event.waitUntil(syncQuoteSubmissions())
  }

  if (event.tag === 'contact-submission') {
    event.waitUntil(syncContactSubmissions())
  }
})

async function syncQuoteSubmissions() {
  try {
    console.log('🔄 Syncing quote submissions...')

    // Get pending submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions('quotes')

    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data)
        })

        if (response.ok) {
          await removePendingSubmission('quotes', submission.id)
          console.log('✅ Quote submission synced:', submission.id)
        }
      } catch (error) {
        console.error('❌ Failed to sync quote submission:', error)
      }
    }
  } catch (error) {
    console.error('❌ Quote sync failed:', error)
  }
}

async function syncContactSubmissions() {
  try {
    console.log('🔄 Syncing contact submissions...')

    // Get pending submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions('contacts')

    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data)
        })

        if (response.ok) {
          await removePendingSubmission('contacts', submission.id)
          console.log('✅ Contact submission synced:', submission.id)
        }
      } catch (error) {
        console.error('❌ Failed to sync contact submission:', error)
      }
    }
  } catch (error) {
    console.error('❌ Contact sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: 'Thank you for your interest in PG Closets!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Products',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data = { ...options.data, ...data }
  }

  event.waitUntil(
    self.registration.showNotification('PG Closets', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Utility functions for IndexedDB (simplified)
async function getPendingSubmissions(type) {
  // In a real implementation, you'd use IndexedDB
  // This is a simplified placeholder
  return []
}

async function removePendingSubmission(type, id) {
  // In a real implementation, you'd remove from IndexedDB
  // This is a simplified placeholder
  console.log(`Removing ${type} submission ${id}`)
}

// Message handling from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      timestamp: new Date().toISOString()
    })
  }
})

console.log('🚀 PG Closets Service Worker loaded successfully!')