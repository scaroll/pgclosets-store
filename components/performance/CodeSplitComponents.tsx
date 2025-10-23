/**
 * Dynamic Component Imports for Performance Optimization
 *
 * This file exports dynamically imported versions of heavy components
 * to improve initial bundle size and loading performance.
 */

import dynamic from 'next/dynamic'
import { Suspense, React } from 'react'

// Loading components for different contexts
const createLoadingSpinner = (height: string = 'h-48') => (
  <div className={`flex items-center justify-center ${height}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const createLoadingSkeleton = (variant: 'card' | 'hero' | 'gallery' = 'card') => {
  const variants = {
    card: 'h-64 w-full',
    hero: 'h-96 w-full',
    gallery: 'h-80 w-full'
  }

  return (
    <div className={`${variants[variant]} bg-gray-200 animate-pulse rounded-lg`}>
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading...
      </div>
    </div>
  )
}

// Heavy Components - Dynamically Imported

// 1. Product Configurator (Heaviest component)
export const DynamicProductConfigurator = dynamic(
  () => import('@/components/configurator/ProductConfigurator').then(mod => ({
    default: mod.ProductConfigurator
  })),
  {
    loading: () => createLoadingSkeleton('hero'),
    ssr: false // Disable SSR for configurator to prevent hydration issues
  }
)

// 2. 3D Door Visualizer
export const DynamicDoorVisualizer = dynamic(
  () => import('@/components/visualizer/renin-door-visualizer').then(mod => ({
    default: mod.ReninDoorVisualizer
  })),
  {
    loading: () => createLoadingSkeleton('gallery'),
    ssr: false
  }
)

// 3. Advanced Search with Filters
export const DynamicAdvancedSearch = dynamic(
  () => import('@/components/products/AdvancedSearch').then(mod => ({
    default: mod.AdvancedSearch
  })),
  {
    loading: () => (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }
)

// 4. Customer Reviews Carousel
export const DynamicReviewsCarousel = dynamic(
  () => import('@/components/ui/testimonials-carousel').then(mod => ({
    default: mod.TestimonialsCarousel
  })),
  {
    loading: () => (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6 mx-auto"></div>
        </div>
      </div>
    )
  }
)

// 5. Interactive Gallery
export const DynamicInteractiveGallery = dynamic(
  () => import('@/components/gallery/renin-product-gallery').then(mod => ({
    default: mod.ReninProductGallery
  })),
  {
    loading: () => createLoadingSkeleton('gallery'),
    ssr: false
  }
)

// 6. Quote Calculator
export const DynamicQuoteCalculator = dynamic(
  () => import('@/components/quote/InstantQuoteCalculator').then(mod => ({
    default: mod.InstantQuoteCalculator
  })),
  {
    loading: () => (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }
)

// 7. Admin Dashboard (Only load for admin users)
export const DynamicAdminDashboard = dynamic(
  () => import('@/components/admin/PerformanceDashboard').then(mod => ({
    default: mod.PerformanceDashboard
  })),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    ),
    ssr: false
  }
)

// 8. Analytics Dashboard
export const DynamicAnalyticsDashboard = dynamic(
  () => import('@/components/analytics/performance-analytics').then(mod => ({
    default: mod.PerformanceAnalytics
  })),
  {
    loading: () => (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }
)

// 9. Chat Assistant
export const DynamicChatAssistant = dynamic(
  () => import('@/components/ai/ChatAssistant').then(mod => ({
    default: mod.ChatAssistant
  })),
  {
    loading: () => (
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
)

// 10. Virtual Room Designer
export const DynamicVirtualDesigner = dynamic(
  () => import('@/components/designer/VirtualRoomDesigner').then(mod => ({
    default: mod.VirtualRoomDesigner
  })),
  {
    loading: () => createLoadingSkeleton('hero'),
    ssr: false
  }
)

// Wrapper Components with Suspense Boundaries

export function LazyProductConfigurator(props: any) {
  return (
    <Suspense fallback={createLoadingSkeleton('hero')}>
      <DynamicProductConfigurator {...props} />
    </Suspense>
  )
}

export function LazyDoorVisualizer(props: any) {
  return (
    <Suspense fallback={createLoadingSkeleton('gallery')}>
      <DynamicDoorVisualizer {...props} />
    </Suspense>
  )
}

export function LazyAdvancedSearch(props: any) {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    }>
      <DynamicAdvancedSearch {...props} />
    </Suspense>
  )
}

export function LazyReviewsCarousel(props: any) {
  return (
    <Suspense fallback={
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6 mx-auto"></div>
        </div>
      </div>
    }>
      <DynamicReviewsCarousel {...props} />
    </Suspense>
  )
}

export function LazyInteractiveGallery(props: any) {
  return (
    <Suspense fallback={createLoadingSkeleton('gallery')}>
      <DynamicInteractiveGallery {...props} />
    </Suspense>
  )
}

export function LazyQuoteCalculator(props: any) {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    }>
      <DynamicQuoteCalculator {...props} />
    </Suspense>
  )
}

export function LazyAdminDashboard(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    }>
      <DynamicAdminDashboard {...props} />
    </Suspense>
  )
}

export function LazyAnalyticsDashboard(props: any) {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    }>
      <DynamicAnalyticsDashboard {...props} />
    </Suspense>
  )
}

export function LazyChatAssistant(props: any) {
  return (
    <Suspense fallback={
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <DynamicChatAssistant {...props} />
    </Suspense>
  )
}

export function LazyVirtualDesigner(props: any) {
  return (
    <Suspense fallback={createLoadingSkeleton('hero')}>
      <DynamicVirtualDesigner {...props} />
    </Suspense>
  )
}

// Preload function for critical dynamic components
export function preloadCriticalComponents() {
  // Preload components that are likely to be used soon
  if (typeof window !== 'undefined') {
    // Add a small delay to not block initial render
    setTimeout(() => {
      import('@/components/products/AdvancedSearch')
      import('@/components/ui/testimonials-carousel')
    }, 2000)
  }
}

// Intersection Observer based loading for components
export function useLazyComponent(
  componentLoader: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ReactNode
) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !Component) {
          setIsLoading(true)
          try {
            const module = await componentLoader()
            setComponent(() => module.default)
          } catch (error) {
            console.error('Failed to load component:', error)
          } finally {
            setIsLoading(false)
          }
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [componentLoader, Component])

  const LazyComponentWrapper = React.useCallback((props: any) => {
    if (Component) {
      return <Component {...props} />
    }

    return (
      <div ref={elementRef}>
        {isLoading ? (fallback || createLoadingSpinner()) : createLoadingSpinner()}
      </div>
    )
  }, [Component, isLoading, fallback])

  return LazyComponentWrapper
}