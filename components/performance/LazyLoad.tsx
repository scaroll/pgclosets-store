"use client"

import * as React from "react"

interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
  fallback?: React.ReactNode
}

/**
 * LazyLoad component using Intersection Observer API
 * Renders children only when they're about to enter viewport
 * Improves initial page load performance
 */
export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = "200px",
  className,
  fallback = null
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}
