'use client'

"use client"

import type { ComponentType } from "react";
import { Suspense, lazy } from "react"
import { cn } from "@/lib/utils"

// Generic lazy loading wrapper with error boundary
interface LazyWrapperProps {
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function LazyWrapper({
  fallback = <LazyLoadingSkeleton />,
  errorFallback = <LazyErrorFallback />,
  className,
  children
}: LazyWrapperProps) {
  return (
    <div className={cn("lazy-wrapper", className)}>
      <Suspense fallback={fallback}>
        <LazyErrorBoundary fallback={errorFallback}>
          {children}
        </LazyErrorBoundary>
      </Suspense>
    </div>
  )
}

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component failed to load:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Default loading skeleton
export function LazyLoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)}>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>
  )
}

// Default error fallback
export function LazyErrorFallback({ className }: { className?: string }) {
  return (
    <div className={cn("text-center p-4 text-gray-500", className)}>
      <div className="text-sm">Failed to load component</div>
      <button
        onClick={() => window.location.reload()}
        className="text-blue-500 text-xs underline mt-2"
      >
        Retry
      </button>
    </div>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode,
  errorFallback?: React.ReactNode
) {
  return function LazyComponent(props: P) {
    return (
      <LazyWrapper fallback={fallback} errorFallback={errorFallback}>
        <Component {...props} />
      </LazyWrapper>
    )
  }
}

// Intersection Observer based lazy loading for heavy components
export function LazyOnVisible({
  children,
  fallback = <LazyLoadingSkeleton />,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || (triggerOnce && hasBeenVisible)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasBeenVisible(true)
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasBeenVisible])

  return (
    <div ref={ref} className={className}>
      {isVisible || hasBeenVisible ? children : fallback}
    </div>
  )
}

// Lazy load components for common heavy elements
export const LazyChart = lazy(() =>
  import('recharts').then(module => ({ default: module.LineChart }))
)

export const LazyMap = lazy(() =>
  import('react-leaflet').then(module => ({ default: module.MapContainer }))
)

export const LazyVideoPlayer = lazy(() =>
  import('react-player').then(module => ({ default: module.default }))
)

// Product-specific lazy components
export const LazyProductGallery = lazy(() =>
  import('../MediaGallery').then(module => ({ default: module.default }))
)

export const LazyProductReviews = lazy(() =>
  import('../store/product-reviews').then(module => ({ default: module.default }))
)

export const LazyRelatedProducts = lazy(() =>
  import('../store/related-products').then(module => ({ default: module.default }))
)

// Shopping cart lazy components
export const LazyCartDrawer = lazy(() =>
  import('../cart/CartDrawer').then(module => ({ default: module.default }))
)

export const LazyCheckoutForm = lazy(() =>
  import('../checkout/checkout-client').then(module => ({ default: module.default }))
)

// Analytics and tracking lazy components
export const LazyAnalytics = lazy(() =>
  import('../analytics/analytics-provider').then(module => ({ default: module.default }))
)

export const LazyConversionTracking = lazy(() =>
  import('../analytics/conversion-funnel').then(module => ({ default: module.default }))
)

// Admin panel lazy components
export const LazyAdminDashboard = lazy(() =>
  import('../admin/AdminLayout').then(module => ({ default: module.default }))
)

// Contact form lazy loading
export const LazyContactForm = lazy(() =>
  import('../contact/ContactForm').then(module => ({ default: module.default }))
)

// SEO and content lazy loading
export const LazyStructuredData = lazy(() =>
  import('../seo/structured-data').then(module => ({ default: module.default }))
)

// Performance optimization utilities
export function preloadComponent(componentImport: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Preload on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        componentImport()
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        componentImport()
      }, 100)
    }
  }
}

// Batch component preloading
export function preloadComponents(componentImports: (() => Promise<any>)[]) {
  if (typeof window !== 'undefined') {
    componentImports.forEach((componentImport, index) => {
      setTimeout(() => {
        preloadComponent(componentImport)
      }, index * 50) // Stagger the preloading
    })
  }
}

// Route-based component preloading
export function useRoutePreloading() {
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      if (target.tagName === 'A' && target.href) {
        const pathname = new URL(target.href).pathname

        // Preload components based on route
        switch (pathname) {
          case '/products':
            preloadComponent(() => import('../store/product-grid'))
            break
          case '/cart':
            preloadComponent(() => import('../cart/cart-page-client'))
            break
          case '/checkout':
            preloadComponent(() => import('../checkout/checkout-client'))
            break
          case '/contact':
            preloadComponent(() => import('../contact/ContactForm'))
            break
        }
      }
    }

    document.addEventListener('mouseenter', handleMouseEnter, true)
    return () => document.removeEventListener('mouseenter', handleMouseEnter, true)
  }, [])
}