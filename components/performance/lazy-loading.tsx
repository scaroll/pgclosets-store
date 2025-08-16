'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface LazyWrapperProps {
  children: ReactNode
  className?: string
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  once?: boolean
}

export function LazyWrapper({
  children,
  className = '',
  fallback = <div className="animate-pulse bg-slate-200 rounded" />,
  rootMargin = '50px',
  threshold = 0.1,
  once = true
}: LazyWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  const { isIntersecting } = useIntersectionObserver({
    target: targetRef,
    rootMargin,
    threshold,
    once
  })

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setIsLoaded(true)
    }
  }, [isIntersecting, isLoaded])

  return (
    <div ref={targetRef} className={className}>
      {isLoaded ? children : fallback}
    </div>
  )
}

// Lazy component loader with dynamic imports
interface LazyComponentProps {
  componentName: string
  componentPath: string
  props?: Record<string, any>
  fallback?: ReactNode
}

export function LazyComponent({
  componentName,
  componentPath,
  props = {},
  fallback = <div className="animate-pulse bg-slate-200 h-64 rounded" />
}: LazyComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  const { isIntersecting } = useIntersectionObserver({
    target: targetRef,
    rootMargin: '100px',
    threshold: 0.1,
    once: true
  })

  useEffect(() => {
    if (isIntersecting && !Component && !isLoading) {
      setIsLoading(true)
      
      import(componentPath)
        .then((module) => {
          const LoadedComponent = module[componentName] || module.default
          setComponent(() => LoadedComponent)
          setError(null)
        })
        .catch((err) => {
          console.error(`Failed to load component ${componentName}:`, err)
          setError(`Failed to load ${componentName}`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isIntersecting, Component, isLoading, componentName, componentPath])

  return (
    <div ref={targetRef}>
      {error ? (
        <div className="text-red-500 p-4">
          {error}
        </div>
      ) : Component ? (
        <Component {...props} />
      ) : (
        fallback
      )}
    </div>
  )
}

// Lazy section with skeleton loading
interface LazySectionProps {
  children: ReactNode
  skeletonHeight?: string
  className?: string
}

export function LazySection({
  children,
  skeletonHeight = 'h-64',
  className = ''
}: LazySectionProps) {
  const skeleton = (
    <div className={`animate-pulse bg-slate-200 rounded ${skeletonHeight}`}>
      <div className="p-4 space-y-4">
        <div className="h-4 bg-slate-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-300 rounded"></div>
          <div className="h-4 bg-slate-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )

  return (
    <LazyWrapper
      className={className}
      fallback={skeleton}
      rootMargin="100px"
      threshold={0.1}
    >
      {children}
    </LazyWrapper>
  )
}

// Product grid lazy loading
interface LazyProductGridProps {
  products: any[]
  renderProduct: (product: any, index: number) => ReactNode
  itemsPerPage?: number
  className?: string
}

export function LazyProductGrid({
  products,
  renderProduct,
  itemsPerPage = 12,
  className = ''
}: LazyProductGridProps) {
  const [visibleItems, setVisibleItems] = useState(itemsPerPage)
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { isIntersecting } = useIntersectionObserver({
    target: loadMoreRef,
    rootMargin: '200px',
    threshold: 0.1
  })

  useEffect(() => {
    if (isIntersecting && visibleItems < products.length && !isLoading) {
      setIsLoading(true)
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + itemsPerPage, products.length))
        setIsLoading(false)
      }, 300)
    }
  }, [isIntersecting, visibleItems, products.length, isLoading, itemsPerPage])

  const visibleProducts = products.slice(0, visibleItems)
  const hasMore = visibleItems < products.length

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product, index) => (
          <LazyWrapper key={product.id || index}>
            {renderProduct(product, index)}
          </LazyWrapper>
        ))}
      </div>
      
      {hasMore && (
        <div ref={loadMoreRef} className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: Math.min(itemsPerPage, products.length - visibleItems) }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-slate-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse mx-auto"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}