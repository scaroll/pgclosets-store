/**
 * Media Optimization Utilities for PG Closets Store
 * Provides image optimization, responsive sizing, and performance enhancements
 */

export interface ImageOptimizationConfig {
  formats: ('webp' | 'avif' | 'jpg' | 'png')[]
  qualities: {
    thumbnail: number
    medium: number
    large: number
    xl: number
  }
  sizes: {
    thumbnail: { width: number; height: number }
    medium: { width: number; height: number }
    large: { width: number; height: number }
    xl: { width: number; height: number }
  }
  lazy: boolean
  progressive: boolean
}

export interface ResponsiveImageSet {
  src: string
  srcSet: string
  sizes: string
  placeholder: string
  aspectRatio: number
}

export interface MediaMetrics {
  loadTime: number
  fileSize: number
  format: string
  dimensions: { width: number; height: number }
  compressionRatio: number
  cacheHit: boolean
}

// Default optimization configuration
export const DEFAULT_IMAGE_CONFIG: ImageOptimizationConfig = {
  formats: ['webp', 'avif', 'jpg'],
  qualities: {
    thumbnail: 70,
    medium: 80,
    large: 85,
    xl: 90
  },
  sizes: {
    thumbnail: { width: 300, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 },
    xl: { width: 1920, height: 1440 }
  },
  lazy: true,
  progressive: true
}

/**
 * Generate responsive image sources with multiple formats and sizes
 */
export function generateResponsiveImageSet(
  baseUrl: string,
  config: ImageOptimizationConfig = DEFAULT_IMAGE_CONFIG
): ResponsiveImageSet {
  const aspectRatio = config.sizes.large.width / config.sizes.large.height

  // Generate srcSet for different densities and sizes
  const srcSetEntries: string[] = []

  Object.entries(config.sizes).forEach(([sizeName, dimensions]) => {
    const quality = config.qualities[sizeName as keyof typeof config.qualities]

    // Generate for each format
    config.formats.forEach(format => {
      const url = buildOptimizedUrl(baseUrl, {
        width: dimensions.width,
        height: dimensions.height,
        quality,
        format
      })
      srcSetEntries.push(`${url} ${dimensions.width}w`)
    })
  })

  // Generate sizes attribute for responsive behavior
  const sizes = [
    '(max-width: 640px) 100vw',
    '(max-width: 768px) 50vw',
    '(max-width: 1024px) 33vw',
    '(max-width: 1280px) 25vw',
    '20vw'
  ].join(', ')

  // Generate low-quality placeholder
  const placeholder = buildOptimizedUrl(baseUrl, {
    width: 20,
    height: Math.round(20 / aspectRatio),
    quality: 20,
    format: 'jpg',
    blur: 10
  })

  return {
    src: buildOptimizedUrl(baseUrl, {
      width: config.sizes.large.width,
      height: config.sizes.large.height,
      quality: config.qualities.large,
      format: config.formats[0]
    }),
    srcSet: srcSetEntries.join(', '),
    sizes,
    placeholder,
    aspectRatio
  }
}

/**
 * Build optimized image URL with Vercel Image Optimization or custom CDN
 */
export function buildOptimizedUrl(
  baseUrl: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
    blur?: number
  }
): string {
  // Use Vercel Image Optimization for dynamic optimization
  const params = new URLSearchParams()

  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.quality) params.set('q', options.quality.toString())
  if (options.format) params.set('f', options.format)
  if (options.blur) params.set('blur', options.blur.toString())

  // Use Next.js Image API for optimization
  return `/_next/image?url=${encodeURIComponent(baseUrl)}&${params.toString()}`
}

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(imageUrls: string[]): void {
  if (typeof window === 'undefined') return

  imageUrls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

/**
 * Lazy load images with intersection observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null
  private loadedImages = new Set<string>()

  constructor(private options: {
    rootMargin?: string
    threshold?: number
    onLoad?: (img: HTMLImageElement) => void
    onError?: (img: HTMLImageElement) => void
  } = {}) {
    if (typeof window !== 'undefined') {
      this.initializeObserver()
    }
  }

  private initializeObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            this.observer?.unobserve(img)
          }
        })
      },
      {
        rootMargin: this.options.rootMargin || '50px',
        threshold: this.options.threshold || 0.1
      }
    )
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src
    if (!src || this.loadedImages.has(src)) return

    const startTime = performance.now()

    img.onload = () => {
      const loadTime = performance.now() - startTime
      this.loadedImages.add(src)

      // Track performance metrics
      this.trackImageMetrics(img, loadTime)

      // Fade in animation
      img.style.opacity = '1'
      img.style.transition = 'opacity 0.3s ease-in-out'

      this.options.onLoad?.(img)
    }

    img.onerror = () => {
      this.options.onError?.(img)
    }

    img.src = src
  }

  private trackImageMetrics(img: HTMLImageElement, loadTime: number): void {
    // Send metrics to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'image_load', {
        event_category: 'Performance',
        event_label: img.src,
        value: Math.round(loadTime)
      })
    }
  }

  observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img)
    } else {
      // Fallback for when observer is not available
      this.loadImage(img)
    }
  }

  disconnect(): void {
    this.observer?.disconnect()
  }
}

/**
 * Optimize images for Web Core Vitals
 */
export class WebVitalsOptimizer {
  private lcp: number | null = null
  private cls: number | null = null
  private fid: number | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals()
    }
  }

  private initializeWebVitals(): void {
    // Measure Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      this.lcp = lastEntry.startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Measure Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.cls = clsValue
    }).observe({ entryTypes: ['layout-shift'] })

    // Measure First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        this.fid = entry.processingStart - entry.startTime
      }
    }).observe({ entryTypes: ['first-input'] })
  }

  getMetrics(): { lcp: number | null; cls: number | null; fid: number | null } {
    return { lcp: this.lcp, cls: this.cls, fid: this.fid }
  }

  optimizeForLCP(): void {
    // Preload above-the-fold images
    const heroImages = document.querySelectorAll<HTMLImageElement>('[data-priority="high"]')
    heroImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src
      }
    })
  }
}

/**
 * Image format detection and fallback
 */
export class FormatDetector {
  private static supportCache = new Map<string, boolean>()

  static async supportsFormat(format: string): Promise<boolean> {
    if (typeof window === 'undefined') return false

    if (this.supportCache.has(format)) {
      return this.supportCache.get(format)!
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    try {
      const dataUrl = canvas.toDataURL(`image/${format}`)
      const supported = dataUrl.indexOf(`data:image/${format}`) === 0
      this.supportCache.set(format, supported)
      return supported
    } catch {
      this.supportCache.set(format, false)
      return false
    }
  }

  static async getBestFormat(formats: string[]): Promise<string> {
    for (const format of formats) {
      if (await this.supportsFormat(format)) {
        return format
      }
    }
    return 'jpg' // Fallback
  }
}

/**
 * Advanced image caching with service worker
 */
export class ImageCache {
  private static instance: ImageCache
  private cache: Cache | null = null

  static getInstance(): ImageCache {
    if (!this.instance) {
      this.instance = new ImageCache()
    }
    return this.instance
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) return

    try {
      this.cache = await caches.open('pg-closets-images-v1')
    } catch (error) {
      console.warn('Failed to initialize image cache:', error)
    }
  }

  async get(url: string): Promise<Response | null> {
    if (!this.cache) return null

    try {
      return await this.cache.match(url)
    } catch {
      return null
    }
  }

  async set(url: string, response: Response): Promise<void> {
    if (!this.cache) return

    try {
      await this.cache.put(url, response.clone())
    } catch (error) {
      console.warn('Failed to cache image:', error)
    }
  }

  async preloadImages(urls: string[]): Promise<void> {
    if (!this.cache) return

    const promises = urls.map(async (url) => {
      try {
        const response = await fetch(url)
        if (response.ok) {
          await this.set(url, response)
        }
      } catch (error) {
        console.warn(`Failed to preload image: ${url}`, error)
      }
    })

    await Promise.allSettled(promises)
  }
}

/**
 * Performance monitoring and analytics
 */
export class MediaPerformanceTracker {
  private metrics: MediaMetrics[] = []

  trackImageLoad(
    src: string,
    loadTime: number,
    fileSize: number,
    format: string,
    dimensions: { width: number; height: number },
    cacheHit: boolean = false
  ): void {
    const metric: MediaMetrics = {
      loadTime,
      fileSize,
      format,
      dimensions,
      compressionRatio: this.calculateCompressionRatio(dimensions, fileSize),
      cacheHit
    }

    this.metrics.push(metric)

    // Send to analytics
    this.sendToAnalytics('image_performance', {
      load_time: loadTime,
      file_size: fileSize,
      format,
      width: dimensions.width,
      height: dimensions.height,
      compression_ratio: metric.compressionRatio,
      cache_hit: cacheHit
    })
  }

  private calculateCompressionRatio(
    dimensions: { width: number; height: number },
    fileSize: number
  ): number {
    const uncompressedSize = dimensions.width * dimensions.height * 3 // 3 bytes per pixel (RGB)
    return uncompressedSize / fileSize
  }

  private sendToAnalytics(event: string, data: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        custom_map: data,
        event_category: 'Media Performance'
      })
    }
  }

  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0
    const total = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0)
    return total / this.metrics.length
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0
    const cacheHits = this.metrics.filter(metric => metric.cacheHit).length
    return cacheHits / this.metrics.length
  }

  getBandwidthSavings(): number {
    const totalFileSize = this.metrics.reduce((sum, metric) => sum + metric.fileSize, 0)
    const totalUncompressed = this.metrics.reduce((sum, metric) => {
      const uncompressed = metric.dimensions.width * metric.dimensions.height * 3
      return sum + uncompressed
    }, 0)

    return totalUncompressed > 0 ? (totalUncompressed - totalFileSize) / totalUncompressed : 0
  }
}

// Export singleton instances
export const lazyLoader = new LazyImageLoader()
export const webVitalsOptimizer = new WebVitalsOptimizer()
export const imageCache = ImageCache.getInstance()
export const performanceTracker = new MediaPerformanceTracker()

// Initialize cache on import
if (typeof window !== 'undefined') {
  imageCache.initialize()
}