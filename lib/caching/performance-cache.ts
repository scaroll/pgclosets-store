/**
 * Performance Caching System for PG Closets Store
 *
 * Features:
 * - Multi-level caching (memory, localStorage, sessionStorage)
 * - Intelligent cache invalidation
 * - SWR integration for data fetching
 * - Image caching strategies
 * - API response caching
 */

// Cache configuration
interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum number of items
  strategy: 'lru' | 'fifo' | 'lfu' // Eviction strategy
}

// Cache entry interface
interface CacheEntry<T = any> {
  data: T
  timestamp: number
  expiresAt: number
  accessCount: number
  lastAccessed: number
}

// Default cache configurations
const DEFAULT_CACHE_CONFIGS: Record<string, CacheConfig> = {
  // API responses
  api: { ttl: 5 * 60 * 1000, maxSize: 100, strategy: 'lru' }, // 5 minutes
  products: { ttl: 15 * 60 * 1000, maxSize: 200, strategy: 'lru' }, // 15 minutes
  collections: { ttl: 30 * 60 * 1000, maxSize: 50, strategy: 'lru' }, // 30 minutes

  // Images
  images: { ttl: 60 * 60 * 1000, maxSize: 1000, strategy: 'lru' }, // 1 hour

  // User data
  userData: { ttl: 10 * 60 * 1000, maxSize: 20, strategy: 'lfu' }, // 10 minutes

  // Search results
  search: { ttl: 5 * 60 * 1000, maxSize: 50, strategy: 'lru' }, // 5 minutes

  // Analytics data
  analytics: { ttl: 60 * 1000, maxSize: 10, strategy: 'fifo' }, // 1 minute
}

/**
 * In-memory cache implementation with LRU eviction
 */
class MemoryCache {
  private cache = new Map<string, CacheEntry>()
  private accessOrder = new Map<string, number>()
  private config: CacheConfig

  constructor(config: CacheConfig) {
    this.config = config
  }

  set<T>(key: string, data: T, customTTL?: number): void {
    const ttl = customTTL || this.config.ttl
    const now = Date.now()

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 1,
      lastAccessed: now
    }

    // Remove expired entries
    this.removeExpired()

    // Evict if at capacity
    if (this.cache.size >= this.config.maxSize) {
      this.evict()
    }

    this.cache.set(key, entry)
    this.accessOrder.set(key, now)
  }

  get<T>(key: string): T | null {
    this.removeExpired()

    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.accessOrder.delete(key)
      return null
    }

    // Update access tracking
    entry.accessCount++
    entry.lastAccessed = Date.now()
    this.accessOrder.set(key, Date.now())

    return entry.data as T
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    this.accessOrder.delete(key)
    return deleted
  }

  clear(): void {
    this.cache.clear()
    this.accessOrder.clear()
  }

  private removeExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        this.accessOrder.delete(key)
      }
    }
  }

  private evict(): void {
    switch (this.config.strategy) {
      case 'lru':
        this.evictLRU()
        break
      case 'fifo':
        this.evictFIFO()
        break
      case 'lfu':
        this.evictLFU()
        break
    }
  }

  private evictLRU(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, time] of this.accessOrder.entries()) {
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.accessOrder.delete(oldestKey)
    }
  }

  private evictFIFO(): void {
    let oldestKey = ''
    let oldestTimestamp = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.accessOrder.delete(oldestKey)
    }
  }

  private evictLFU(): void {
    let leastUsedKey = ''
    let leastCount = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < leastCount) {
        leastCount = entry.accessCount
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey)
      this.accessOrder.delete(leastUsedKey)
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: this.calculateHitRate(),
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  private calculateHitRate(): number {
    // Simplified hit rate calculation
    let totalAccess = 0
    for (const entry of this.cache.values()) {
      totalAccess += entry.accessCount
    }
    return totalAccess > 0 ? (totalAccess - this.cache.size) / totalAccess : 0
  }

  private estimateMemoryUsage(): number {
    // Rough estimation in bytes
    let size = 0
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2 // String characters
      size += JSON.stringify(entry.data).length * 2
      size += 64 // Overhead for each entry
    }
    return size
  }
}

/**
 * Persistent cache using localStorage/sessionStorage
 */
class PersistentCache {
  private storage: Storage
  private prefix: string
  private config: CacheConfig

  constructor(storage: Storage, prefix: string, config: CacheConfig) {
    this.storage = storage
    this.prefix = prefix
    this.config = config
  }

  set<T>(key: string, data: T, customTTL?: number): void {
    try {
      const ttl = customTTL || this.config.ttl
      const now = Date.now()

      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt: now + ttl,
        accessCount: 1,
        lastAccessed: now
      }

      const storageKey = `${this.prefix}:${key}`
      this.storage.setItem(storageKey, JSON.stringify(entry))
    } catch (error) {
      console.warn('Failed to set persistent cache:', error)
      // Could be quota exceeded, try to clear old entries
      this.clearExpired()
    }
  }

  get<T>(key: string): T | null {
    try {
      const storageKey = `${this.prefix}:${key}`
      const item = this.storage.getItem(storageKey)

      if (!item) return null

      const entry: CacheEntry<T> = JSON.parse(item)

      if (Date.now() > entry.expiresAt) {
        this.storage.removeItem(storageKey)
        return null
      }

      // Update access tracking
      entry.accessCount++
      entry.lastAccessed = Date.now()
      this.storage.setItem(storageKey, JSON.stringify(entry))

      return entry.data
    } catch (error) {
      console.warn('Failed to get from persistent cache:', error)
      return null
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    const storageKey = `${this.prefix}:${key}`
    this.storage.removeItem(storageKey)
    return true
  }

  clear(): void {
    const keys = Object.keys(this.storage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix + ':')) {
        this.storage.removeItem(key)
      }
    })
  }

  private clearExpired(): void {
    const keys = Object.keys(this.storage)
    const now = Date.now()

    keys.forEach(key => {
      if (key.startsWith(this.prefix + ':')) {
        try {
          const item = this.storage.getItem(key)
          if (item) {
            const entry = JSON.parse(item)
            if (now > entry.expiresAt) {
              this.storage.removeItem(key)
            }
          }
        } catch {
          // Invalid entry, remove it
          this.storage.removeItem(key)
        }
      }
    })
  }
}

/**
 * Multi-level cache manager
 */
class CacheManager {
  private memoryCaches = new Map<string, MemoryCache>()
  private persistentCaches = new Map<string, PersistentCache>()

  constructor() {
    // Initialize default caches
    Object.entries(DEFAULT_CACHE_CONFIGS).forEach(([name, config]) => {
      this.memoryCaches.set(name, new MemoryCache(config))

      // Use localStorage for some caches
      if (['products', 'collections', 'userData'].includes(name)) {
        this.persistentCaches.set(
          name,
          new PersistentCache(localStorage, `pg_cache_${name}`, config)
        )
      }
    })
  }

  // Get a specific cache
  getCache(name: string): MemoryCache | null {
    return this.memoryCaches.get(name) || null
  }

  // Set data in cache
  set<T>(cacheName: string, key: string, data: T, customTTL?: number): void {
    const memoryCache = this.memoryCaches.get(cacheName)
    if (memoryCache) {
      memoryCache.set(key, data, customTTL)
    }

    const persistentCache = this.persistentCaches.get(cacheName)
    if (persistentCache) {
      persistentCache.set(key, data, customTTL)
    }
  }

  // Get data from cache
  get<T>(cacheName: string, key: string): T | null {
    // Try memory cache first
    const memoryCache = this.memoryCaches.get(cacheName)
    if (memoryCache) {
      const result = memoryCache.get<T>(key)
      if (result !== null) return result
    }

    // Try persistent cache
    const persistentCache = this.persistentCaches.get(cacheName)
    if (persistentCache) {
      const result = persistentCache.get<T>(key)
      if (result !== null) {
        // Store in memory cache for faster access
        const memCache = this.memoryCaches.get(cacheName)
        if (memCache) {
          memCache.set(key, result)
        }
        return result
      }
    }

    return null
  }

  // Clear a specific cache
  clearCache(cacheName: string): void {
    const memoryCache = this.memoryCaches.get(cacheName)
    if (memoryCache) {
      memoryCache.clear()
    }

    const persistentCache = this.persistentCaches.get(cacheName)
    if (persistentCache) {
      persistentCache.clear()
    }
  }

  // Clear all caches
  clearAll(): void {
    this.memoryCaches.forEach(cache => cache.clear())
    this.persistentCaches.forEach(cache => cache.clear())
  }

  // Get statistics for all caches
  getAllStats() {
    const stats: Record<string, any> = {}

    this.memoryCaches.forEach((cache, name) => {
      stats[name] = cache.getStats()
    })

    return stats
  }
}

// Global cache manager instance
const cacheManager = new CacheManager()

// Export cache manager
export { cacheManager }

// Convenience functions for common cache operations
export const cache = {
  // Product caching
  setProduct: (key: string, product: any, ttl?: number) =>
    cacheManager.set('products', key, product, ttl),

  getProduct: (key: string) =>
    cacheManager.get('products', key),

  // API response caching
  setAPIResponse: (endpoint: string, data: any, ttl?: number) =>
    cacheManager.set('api', endpoint, data, ttl),

  getAPIResponse: (endpoint: string) =>
    cacheManager.get('api', endpoint),

  // Image caching
  setImage: (src: string, imageData: any, ttl?: number) =>
    cacheManager.set('images', src, imageData, ttl),

  getImage: (src: string) =>
    cacheManager.get('images', src),

  // Search caching
  setSearch: (query: string, results: any, ttl?: number) =>
    cacheManager.set('search', query, results, ttl),

  getSearch: (query: string) =>
    cacheManager.get('search', query),

  // User data caching
  setUserData: (key: string, data: any, ttl?: number) =>
    cacheManager.set('userData', key, data, ttl),

  getUserData: (key: string) =>
    cacheManager.get('userData', key),

  // Utility functions
  clear: (cacheName?: string) =>
    cacheName ? cacheManager.clearCache(cacheName) : cacheManager.clearAll(),

  getStats: () => cacheManager.getAllStats()
}

/**
 * SWR configuration with caching integration
 */
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0, // Disable auto-refresh for better performance
  dedupingInterval: 5000,
  focusThrottleInterval: 5000,
  loadingTimeout: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  fallbackData: {},
  // Custom cache integration
  cache: new Map(),
  // Custom fetcher with caching
  fetcher: async (url: string) => {
    // Try cache first
    const cached = cache.getAPIResponse(url)
    if (cached) {
      return cached
    }

    // Fetch and cache
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    const data = await response.json()
    cache.setAPIResponse(url, data)
    return data
  }
}

/**
 * Image optimization cache
 */
export class ImageCache {
  private cache = new Map<string, HTMLImageElement>()

  async loadImage(src: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(src)) {
      return this.cache.get(src)!
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.cache.set(src, img)
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
  }

  preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(sources.map(src => this.loadImage(src)))
  }

  clear(): void {
    this.cache.clear()
  }
}

// Global image cache instance
export const imageCache = new ImageCache()

/**
 * Performance monitoring for cache
 */
export function setupCachePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Log cache statistics every 30 seconds in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const stats = cache.getStats()
      console.log('🗄️ Cache Stats:', stats)
    }, 30000)
  }

  // Monitor memory usage
  if ('memory' in performance) {
    setInterval(() => {
      const memory = (performance as any).memory
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit

      // Clear caches if memory usage is high (>80%)
      if (usage > 0.8) {
        console.warn('High memory usage detected, clearing caches')
        cache.clear('images')
        cache.clear('search')
      }
    }, 60000) // Check every minute
  }
}