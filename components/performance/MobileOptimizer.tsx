/**
 * Mobile Performance Optimization Component
 *
 * Comprehensive mobile performance optimization including:
 * - Lazy loading for mobile networks
 * - Critical resource prioritization
 * - Image optimization
 * - Battery optimization
 * - Data saving mode support
 */

"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useResponsiveBreakpoints } from '@/hooks/use-responsive-breakpoints'

interface MobileOptimizerProps {
  children: React.ReactNode
  enableBatteryOptimization?: boolean
  enableDataSaver?: boolean
  enableLazyLoading?: boolean
  criticalResources?: string[]
}

export function MobileOptimizer({
  children,
  enableBatteryOptimization = true,
  enableDataSaver = true,
  enableLazyLoading = true,
  criticalResources = []
}: MobileOptimizerProps) {
  const { isMobile, prefersReducedData, connection } = useResponsiveBreakpoints()
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isCharging, setIsCharging] = useState(false)
  const [networkQuality, setNetworkQuality] = useState<'slow' | 'fast' | 'unknown'>('unknown')

  // Monitor battery status
  useEffect(() => {
    if (!enableBatteryOptimization || !isMobile) return

    const monitorBattery = async () => {
      try {
        // @ts-ignore - Battery API is experimental
        const battery = await navigator.getBattery?.()

        if (battery) {
          setBatteryLevel(battery.level * 100)
          setIsCharging(battery.charging)

          const updateBatteryInfo = () => {
            setBatteryLevel(battery.level * 100)
            setIsCharging(battery.charging)
          }

          battery.addEventListener('levelchange', updateBatteryInfo)
          battery.addEventListener('chargingchange', updateBatteryInfo)

          return () => {
            battery.removeEventListener('levelchange', updateBatteryInfo)
            battery.removeEventListener('chargingchange', updateBatteryInfo)
          }
        }
      } catch (error) {
        console.log('Battery API not available')
      }
    }

    const cleanup = monitorBattery()
    return cleanup
  }, [enableBatteryOptimization, isMobile])

  // Monitor network quality
  useEffect(() => {
    const updateNetworkQuality = () => {
      if (!connection) return

      const { effectiveType, downlink } = connection

      if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.1) {
        setNetworkQuality('slow')
      } else if (effectiveType === '3g' || effectiveType === '4g' || downlink > 1) {
        setNetworkQuality('fast')
      } else {
        setNetworkQuality('unknown')
      }
    }

    updateNetworkQuality()

    if (connection) {
      connection.addEventListener('change', updateNetworkQuality)
      return () => connection.removeEventListener('change', updateNetworkQuality)
    }
  }, [connection])

  // Determine optimization level
  const optimizationLevel = useMemo(() => {
    if (!isMobile) return 'none'

    const isDataSaverActive = enableDataSaver && prefersReducedData
    const isLowBattery = enableBatteryOptimization && batteryLevel !== null && batteryLevel < 20 && !isCharging
    const isSlowNetwork = networkQuality === 'slow'

    if (isDataSaverActive || isLowBattery || isSlowNetwork) {
      return 'maximum'
    } else if (batteryLevel !== null && batteryLevel < 50 && !isCharging) {
      return 'high'
    } else {
      return 'normal'
    }
  }, [isMobile, enableDataSaver, prefersReducedData, enableBatteryOptimization, batteryLevel, isCharging, networkQuality])

  // Performance optimizations based on level
  const performanceConfig = useMemo(() => {
    switch (optimizationLevel) {
      case 'maximum':
        return {
          imageQuality: 60,
          enableAnimations: false,
          enableParallax: false,
          enableVideos: false,
          enableAutoPlay: false,
          prefetchResources: false,
          enableHoverEffects: false,
          enableTransitions: false,
          lazyLoadThreshold: 200,
          reduceJavaScript: true
        }
      case 'high':
        return {
          imageQuality: 75,
          enableAnimations: true,
          enableParallax: false,
          enableVideos: false,
          enableAutoPlay: false,
          prefetchResources: false,
          enableHoverEffects: true,
          enableTransitions: true,
          lazyLoadThreshold: 400,
          reduceJavaScript: false
        }
      case 'normal':
      default:
        return {
          imageQuality: 85,
          enableAnimations: true,
          enableParallax: true,
          enableVideos: true,
          enableAutoPlay: false,
          prefetchResources: true,
          enableHoverEffects: true,
          enableTransitions: true,
          lazyLoadThreshold: 600,
          reduceJavaScript: false
        }
    }
  }, [optimizationLevel])

  // Apply optimizations to document
  useEffect(() => {
    if (!isMobile) return

    // Reduce motion if animations disabled
    if (!performanceConfig.enableAnimations) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      document.documentElement.classList.add('reduce-motion')
    }

    // Disable hover effects on touch devices
    if (!performanceConfig.enableHoverEffects) {
      document.documentElement.classList.add('no-hover')
    }

    // Add optimization classes to body
    document.body.classList.add(`mobile-optimized-${optimizationLevel}`)
    document.body.classList.add('touch-optimized')

    return () => {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.classList.remove('reduce-motion', 'no-hover')
      document.body.classList.remove(`mobile-optimized-${optimizationLevel}`, 'touch-optimized')
    }
  }, [isMobile, performanceConfig, optimizationLevel])

  // Preload critical resources
  useEffect(() => {
    if (!enableLazyLoading || criticalResources.length === 0) return

    const preloadResource = (href: string, as: string) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    }

    criticalResources.forEach(resource => {
      // Determine resource type based on extension
      const extension = resource.split('.').pop()?.toLowerCase()
      const as = extension === 'css' ? 'style' :
                 extension === 'js' ? 'script' :
                 ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(extension || '') ? 'image' :
                 'document'

      preloadResource(resource, as)
    })
  }, [enableLazyLoading, criticalResources])

  // Context for child components
  const contextValue = useMemo(() => ({
    ...performanceConfig,
    optimizationLevel,
    isMobile,
    batteryLevel,
    isCharging,
    networkQuality
  }), [performanceConfig, optimizationLevel, isMobile, batteryLevel, isCharging, networkQuality])

  return (
    <MobilePerformanceContext.Provider value={contextValue}>
      {children}
    </MobilePerformanceContext.Provider>
  )
}

// Context for sharing performance settings
const MobilePerformanceContext = React.createContext<{
  imageQuality: number
  enableAnimations: boolean
  enableParallax: boolean
  enableVideos: boolean
  enableAutoPlay: boolean
  prefetchResources: boolean
  enableHoverEffects: boolean
  enableTransitions: boolean
  lazyLoadThreshold: number
  reduceJavaScript: boolean
  optimizationLevel: string
  isMobile: boolean
  batteryLevel: number | null
  isCharging: boolean
  networkQuality: 'slow' | 'fast' | 'unknown'
}>({
  imageQuality: 85,
  enableAnimations: true,
  enableParallax: true,
  enableVideos: true,
  enableAutoPlay: false,
  prefetchResources: true,
  enableHoverEffects: true,
  enableTransitions: true,
  lazyLoadThreshold: 600,
  reduceJavaScript: false,
  optimizationLevel: 'normal',
  isMobile: false,
  batteryLevel: null,
  isCharging: false,
  networkQuality: 'unknown'
})

// Hook for accessing mobile performance context
export function useMobilePerformance() {
  const context = React.useContext(MobilePerformanceContext)
  if (!context) {
    throw new Error('useMobilePerformance must be used within MobileOptimizer')
  }
  return context
}

// Mobile-optimized image component
export function MobileOptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  [key: string]: any
}) {
  const { imageQuality, lazyLoadThreshold, optimizationLevel } = useMobilePerformance()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: `${lazyLoadThreshold}px` }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [priority, lazyLoadThreshold])

  // Generate optimized image URL
  const optimizedSrc = useMemo(() => {
    if (optimizationLevel === 'maximum' || optimizationLevel === 'high') {
      // Add quality parameter or use CDN optimization
      const separator = src.includes('?') ? '&' : '?'
      return `${src}${separator}q=${imageQuality}&auto=format`
    }
    return src
  }, [src, imageQuality, optimizationLevel])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setError(true)
  }, [])

  // Placeholder while loading
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={cn(
          "bg-gray-200 animate-pulse",
          className
        )}
        style={{ aspectRatio: width && height ? `${width}/${height}` : '16/9' }}
      />
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "bg-gray-100 flex items-center justify-center text-gray-400",
          className
        )}
        style={{ aspectRatio: width && height ? `${width}/${height}` : '16/9' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Optimized image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          !isLoaded && "opacity-0"
        )}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...props}
      />
    </div>
  )
}

// Mobile-optimized button with reduced interactions
export function MobileOptimizedButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  className,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  className?: string
  [key: string]: any
}) {
  const { enableAnimations, enableHoverEffects, enableHapticFeedback } = useMobilePerformance()

  const handleClick = useCallback(() => {
    if (disabled) return

    // Haptic feedback if available
    if (enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    onClick?.()
  }, [disabled, onClick, enableHapticFeedback])

  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-black",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
  }

  const sizeClasses = {
    small: "px-3 py-2 text-sm min-h-[44px]",
    medium: "px-4 py-2.5 text-base min-h-[48px]",
    large: "px-6 py-3 text-lg min-h-[52px]"
  }

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    !enableAnimations && "transition-none",
    !enableHoverEffects && "hover:scale-100",
    disabled && "opacity-50 cursor-not-allowed",
    className
  )

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

// Performance monitoring component
export function MobilePerformanceMonitor() {
  const { optimizationLevel, batteryLevel, networkQuality } = useMobilePerformance()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs space-y-1">
      <div>Optimization: {optimizationLevel}</div>
      <div>Battery: {batteryLevel !== null ? `${Math.round(batteryLevel)}%` : 'Unknown'}</div>
      <div>Network: {networkQuality}</div>
    </div>
  )
}