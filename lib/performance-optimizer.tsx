// Performance Optimization Utilities
// Bundle size optimization, lazy loading, caching, and performance monitoring
// TEMPORARILY DISABLED FOR SERVER-SIDE COMPATIBILITY

// import dynamic from 'next/dynamic'
// import { memo } from 'react'

// Bundle Analysis Configuration
export interface BundleAnalysis {
  size: number
  gzippedSize: number
  modules: Array<{
    name: string
    size: number
    percentage: number
  }>
  recommendations: string[]
  score: number
}

// Performance Budget Configuration
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals thresholds
  LCP: 2.5, // seconds
  FID: 0.1, // seconds
  CLS: 0.1, // score
  TTFB: 0.6, // seconds
  FCP: 1.8, // seconds

  // Bundle size budgets
  mainBundle: 250, // KB
  vendorBundle: 500, // KB
  cssBundle: 50, // KB
  imageOptimization: 100, // KB per image
  totalPageSize: 1000, // KB

  // Performance scores
  lighthouseScore: 90,
  webVitalsScore: 75
}

// Dynamic imports for code splitting
export const DynamicComponents = {
  // Admin components (heavy)
  AdminDashboard: dynamic(() => import('../components/admin/AdminDashboard'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" />,
    ssr: false
  }),

  AdminLayout: dynamic(() => import('../components/admin/AdminLayout'), {
    loading: () => <div className="animate-pulse h-screen bg-gray-100" />,
    ssr: false
  }),

  // Analytics components (heavy)
  PerformanceDashboard: dynamic(() => import('../components/performance/performance-dashboard'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" />,
    ssr: false
  }),

  BusinessMetricsTracker: dynamic(() => import('../components/analytics/business-metrics-tracker'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" />,
    ssr: false
  }),

  ErrorTracker: dynamic(() => import('../components/monitoring/comprehensive-error-tracker'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" />,
    ssr: false
  }),

  // Product components (medium)
  ProductGallery: dynamic(() => import('../components/product/ProductGallery'), {
    loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />
  }),

  ProductConfigurator: dynamic(() => import('../components/product/ProductConfigurator'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" />
  }),

  // Interactive components
  ChatWidget: dynamic(() => import('../components/chat/ChatWidget'), {
    loading: () => <div className="animate-pulse w-16 h-16 bg-blue-200 rounded-full fixed bottom-4 right-4" />,
    ssr: false
  }),

  VirtualConsultation: dynamic(() => import('../components/consultation/VirtualConsultation'), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" />,
    ssr: false
  }),

  // Map components (heavy external dependency)
  InteractiveMap: dynamic(() => import('../components/location/InteractiveMap'), {
    loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />,
    ssr: false
  }),

  // Social media components
  SocialFeed: dynamic(() => import('../components/social/SocialFeed'), {
    loading: () => <div className="animate-pulse h-48 bg-gray-200 rounded" />,
    ssr: false
  })
}

// Performance optimization hooks
export function usePerformanceOptimization() {
  const preloadComponent = (componentName: keyof typeof DynamicComponents) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      // This would preload the chunk for the component
      document.head.appendChild(link)
    }
  }

  const preloadOnHover = (selector: string, componentName: keyof typeof DynamicComponents) => {
    if (typeof window !== 'undefined') {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        element.addEventListener('mouseenter', () => preloadComponent(componentName), { once: true })
      })
    }
  }

  const preloadOnViewport = (selector: string, componentName: keyof typeof DynamicComponents) => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadComponent(componentName)
            observer.unobserve(entry.target)
          }
        })
      }, { rootMargin: '100px' })

      const elements = document.querySelectorAll(selector)
      elements.forEach(element => observer.observe(element))
    }
  }

  return {
    preloadComponent,
    preloadOnHover,
    preloadOnViewport
  }
}

// Image optimization utilities
export const ImageOptimization = {
  // Generate responsive image sizes
  generateSrcSet: (src: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1920]) => {
    if (!src) return ''

    return sizes
      .map(size => `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75 ${size}w`)
      .join(', ')
  },

  // Generate sizes attribute for responsive images
  generateSizes: (breakpoints: Array<{ media: string; size: string }>) => {
    return breakpoints
      .map(bp => `${bp.media} ${bp.size}`)
      .join(', ')
  },

  // Lazy loading configuration
  lazyLoadConfig: {
    loading: 'lazy' as const,
    placeholder: 'blur',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AKrQAA' // 1x1 transparent pixel
  },

  // Image format optimization
  getOptimalFormat: (userAgent: string): 'webp' | 'avif' | 'jpeg' => {
    if (userAgent.includes('Chrome') && userAgent.includes('Avif')) return 'avif'
    if (userAgent.includes('Chrome') || userAgent.includes('Firefox') || userAgent.includes('Edge')) return 'webp'
    return 'jpeg'
  }
}

// CSS optimization utilities
export const CSSOptimization = {
  // Critical CSS extraction (would integrate with build process)
  criticalCSSPaths: [
    '/',
    '/products',
    '/contact',
    '/about'
  ],

  // Preload critical fonts
  preloadFonts: () => {
    if (typeof window !== 'undefined') {
      const fonts = [
        '/fonts/inter-var.woff2'
      ]

      fonts.forEach(font => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
        link.href = font
        document.head.appendChild(link)
      })
    }
  },

  // Inline critical CSS
  inlineCriticalCSS: () => {
    const criticalCSS = `
      /* Critical CSS - Above the fold styles */
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      .bg-gray-200 { background-color: var(--color-border-default); }
      .rounded { border-radius: 0.25rem; }
      .h-96 { height: 24rem; }
    `

    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = criticalCSS
      document.head.appendChild(style)
    }
  }
}

// JavaScript optimization utilities
export const JSOptimization = {
  // Preload critical scripts
  preloadCriticalScripts: () => {
    if (typeof window !== 'undefined') {
      const scripts = [
        'https://www.googletagmanager.com/gtag/js',
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/main.js'
      ]

      scripts.forEach(script => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'script'
        link.href = script
        document.head.appendChild(link)
      })
    }
  },

  // Service worker for caching
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
        return registration
      } catch (error) {
        console.log('Service Worker registration failed:', error)
      }
    }
  },

  // Prefetch next likely page
  prefetchPage: (href: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }
  }
}

// Resource hints utilities
export const ResourceHints = {
  // DNS prefetch for external domains
  dnsPrefetch: (domains: string[]) => {
    if (typeof window !== 'undefined') {
      domains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = `//${domain}`
        document.head.appendChild(link)
      })
    }
  },

  // Preconnect to critical origins
  preconnect: (origins: string[]) => {
    if (typeof window !== 'undefined') {
      origins.forEach(origin => {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = origin
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })
    }
  },

  // Critical resource hints for PG Closets
  setupCriticalHints: () => {
    // DNS prefetch
    ResourceHints.dnsPrefetch([
      'www.googletagmanager.com',
      'www.google-analytics.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'vercel.com',
      'vitals.vercel-insights.com'
    ])

    // Preconnect to critical origins
    ResourceHints.preconnect([
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com'
    ])
  }
}

// Performance monitoring utilities
export const PerformanceMonitoring = {
  // Track bundle sizes
  trackBundleSize: (): BundleAnalysis => {
    if (typeof window === 'undefined') {
      return {
        size: 0,
        gzippedSize: 0,
        modules: [],
        recommendations: [],
        score: 0
      }
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType('resource')

    let totalSize = 0
    let totalGzippedSize = 0
    const modules: BundleAnalysis['modules'] = []

    resources.forEach(resource => {
      if (resource.name.includes('/_next/static/')) {
        const size = resource.transferSize || 0
        const decodedSize = resource.decodedBodySize || 0

        totalSize += decodedSize
        totalGzippedSize += size

        modules.push({
          name: resource.name.split('/').pop() || '',
          size: decodedSize,
          percentage: 0 // Will be calculated below
        })
      }
    })

    // Calculate percentages
    modules.forEach(module => {
      module.percentage = (module.size / totalSize) * 100
    })

    // Generate recommendations
    const recommendations: string[] = []
    if (totalGzippedSize > PERFORMANCE_BUDGETS.mainBundle * 1024) {
      recommendations.push('Main bundle exceeds budget. Consider code splitting.')
    }
    if (modules.some(m => m.percentage > 30)) {
      recommendations.push('Large modules detected. Consider lazy loading.')
    }

    // Calculate score (0-100)
    const sizeScore = Math.max(0, 100 - (totalGzippedSize / (PERFORMANCE_BUDGETS.mainBundle * 1024)) * 100)
    const moduleScore = modules.length > 0 ? Math.max(0, 100 - Math.max(...modules.map(m => m.percentage))) : 100
    const score = Math.round((sizeScore + moduleScore) / 2)

    return {
      size: totalSize,
      gzippedSize: totalGzippedSize,
      modules: modules.sort((a, b) => b.size - a.size),
      recommendations,
      score
    }
  },

  // Track Core Web Vitals
  trackCoreWebVitals: () => {
    const vitals = {
      LCP: 0,
      FID: 0,
      CLS: 0,
      TTFB: 0,
      FCP: 0
    }

    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcp = entries[entries.length - 1]
      if (lcp) {
        vitals.LCP = lcp.startTime / 1000
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    // FID
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming
        if (fidEntry.processingStart) {
          vitals.FID = (fidEntry.processingStart - fidEntry.startTime) / 1000
        }
      })
    }).observe({ type: 'first-input', buffered: true })

    // CLS
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const clsEntry = entry as LayoutShift
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      })
      vitals.CLS = clsValue
    }).observe({ type: 'layout-shift', buffered: true })

    // TTFB and FCP
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navEntry) {
      vitals.TTFB = (navEntry.responseStart - navEntry.requestStart) / 1000

      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        vitals.FCP = fcpEntry.startTime / 1000
      }
    }

    return vitals
  },

  // Performance score calculation
  calculatePerformanceScore: () => {
    const vitals = PerformanceMonitoring.trackCoreWebVitals()
    const bundleAnalysis = PerformanceMonitoring.trackBundleSize()

    // Score each metric (0-100)
    const lcpScore = vitals.LCP <= PERFORMANCE_BUDGETS.LCP ? 100 : Math.max(0, 100 - ((vitals.LCP - PERFORMANCE_BUDGETS.LCP) / PERFORMANCE_BUDGETS.LCP) * 100)
    const fidScore = vitals.FID <= PERFORMANCE_BUDGETS.FID ? 100 : Math.max(0, 100 - ((vitals.FID - PERFORMANCE_BUDGETS.FID) / PERFORMANCE_BUDGETS.FID) * 100)
    const clsScore = vitals.CLS <= PERFORMANCE_BUDGETS.CLS ? 100 : Math.max(0, 100 - ((vitals.CLS - PERFORMANCE_BUDGETS.CLS) / PERFORMANCE_BUDGETS.CLS) * 100)
    const ttfbScore = vitals.TTFB <= PERFORMANCE_BUDGETS.TTFB ? 100 : Math.max(0, 100 - ((vitals.TTFB - PERFORMANCE_BUDGETS.TTFB) / PERFORMANCE_BUDGETS.TTFB) * 100)
    const fcpScore = vitals.FCP <= PERFORMANCE_BUDGETS.FCP ? 100 : Math.max(0, 100 - ((vitals.FCP - PERFORMANCE_BUDGETS.FCP) / PERFORMANCE_BUDGETS.FCP) * 100)

    // Weighted average (LCP and CLS are most important)
    const webVitalsScore = (lcpScore * 0.3 + fidScore * 0.2 + clsScore * 0.3 + ttfbScore * 0.1 + fcpScore * 0.1)
    const bundleScore = bundleAnalysis.score

    return {
      overall: Math.round((webVitalsScore * 0.7 + bundleScore * 0.3)),
      webVitals: Math.round(webVitalsScore),
      bundle: bundleScore,
      details: {
        LCP: Math.round(lcpScore),
        FID: Math.round(fidScore),
        CLS: Math.round(clsScore),
        TTFB: Math.round(ttfbScore),
        FCP: Math.round(fcpScore)
      }
    }
  }
}

// Caching strategies (client-side only)
export const CachingStrategies = {
  // Service Worker cache strategies (client-side only)
  cacheFirst: (cacheName: string, urls: string[]) => {
    // Cache-first strategy for static assets - disabled for server-side compatibility
    return null
  },

  // Network-first strategy for dynamic content (client-side only)
  networkFirst: (cacheName: string, urls: string[]) => {
    // Network-first strategy for dynamic content - disabled for server-side compatibility
    return null
  },

  // Browser caching headers
  setBrowserCache: () => {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year for static assets
      'ETag': generateETag(),
      'Last-Modified': new Date().toUTCString()
    }
  }
}

// Utility functions
function generateETag(): string {
  return `"${Date.now()}-${Math.random().toString(36).substr(2, 9)}"`
}

// High-order component for performance optimization
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    preload?: boolean
    trackPerformance?: boolean
    memoryOptimization?: boolean
  } = {}
) {
  const OptimizedComponent = memo((props: P) => {
    return <Component {...props} />
  })

  OptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`

  return OptimizedComponent
}

// Performance optimization initialization
export function initializePerformanceOptimizations() {
  if (typeof window !== 'undefined') {
    // Setup critical resource hints
    ResourceHints.setupCriticalHints()

    // Preload critical fonts
    CSSOptimization.preloadFonts()

    // Register service worker
    JSOptimization.registerServiceWorker()

    // Track performance metrics
    setTimeout(() => {
      const score = PerformanceMonitoring.calculatePerformanceScore()
      console.log('Performance Score:', score)

      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'performance_score', {
          event_category: 'Performance',
          event_label: 'Overall Score',
          value: score.overall
        })
      }
    }, 5000) // Wait 5 seconds for initial load to complete
  }
}

export default {
  DynamicComponents,
  PERFORMANCE_BUDGETS,
  ImageOptimization,
  CSSOptimization,
  JSOptimization,
  ResourceHints,
  PerformanceMonitoring,
  CachingStrategies,
  withPerformanceOptimization,
  initializePerformanceOptimizations,
  usePerformanceOptimization
}