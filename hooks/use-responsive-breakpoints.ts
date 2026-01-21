/**
 * Advanced Responsive Breakpoint System
 *
 * Comprehensive hook for managing responsive design across all device types
 * Includes device detection, viewport monitoring, and adaptive behavior
 */

'use client'

import { useCallback, useEffect, useState } from 'react'

// Breakpoint configuration
export const BREAKPOINTS = {
  xs: 320, // iPhone SE minimum
  xsm: 375, // iPhone SE/mini
  sm: 430, // iPhone 14 Pro/15
  sml: 480, // Large phones/Foldable
  md: 640, // Small tablets
  lmd: 736, // iPad Air portrait
  lg: 768, // iPad/Small tablets
  lgl: 834, // iPad Pro 11"
  xl: 960, // Large tablets/Small laptops
  lxl: 1024, // iPad Pro 12.9"/Small desktop
  '2xl': 1280, // Standard desktop
  '2xlx': 1366, // Laptop standard
  '3xl': 1440, // Large desktop
  '3xlx': 1536, // MacBook Pro
  '4xl': 1920, // Full HD
  '5xl': 2560, // 4K
} as const

// Device types
export type DeviceType = 'phone' | 'tablet' | 'desktop' | 'tv' | 'watch'
export type Orientation = 'portrait' | 'landscape'
export type PixelRatio = 'standard' | 'retina' | 'ultra-retina'

// Responsive state interface
export interface ResponsiveState {
  width: number
  height: number
  orientation: Orientation
  deviceType: DeviceType
  pixelRatio: PixelRatio
  isTouch: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isFoldable: boolean
  isLandscape: boolean
  isPortrait: boolean
  isRetina: boolean
  isUltraRetina: boolean
  prefersReducedMotion: boolean
  prefersDarkMode: boolean
  prefersReducedData: boolean
  breakpoint: keyof typeof BREAKPOINTS
  isAbove: (breakpoint: keyof typeof BREAKPOINTS) => boolean
  isBelow: (breakpoint: keyof typeof BREAKPOINTS) => boolean
  isBetween: (min: keyof typeof BREAKPOINTS, max: keyof typeof BREAKPOINTS) => boolean
}

export function useResponsiveBreakpoints(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => getInitialState())

  function getInitialState(): ResponsiveState {
    if (typeof window === 'undefined') {
      return getDefaultState()
    }

    return updateResponsiveState(window)
  }

  function getDefaultState(): ResponsiveState {
    return {
      width: 1024,
      height: 768,
      orientation: 'landscape',
      deviceType: 'desktop',
      pixelRatio: 'standard',
      isTouch: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isFoldable: false,
      isLandscape: true,
      isPortrait: false,
      isRetina: false,
      isUltraRetina: false,
      prefersReducedMotion: false,
      prefersDarkMode: false,
      prefersReducedData: false,
      breakpoint: '2xl',
      isAbove: () => false,
      isBelow: () => false,
      isBetween: () => false,
    }
  }

  function updateResponsiveState(window: Window): ResponsiveState {
    const width = window.innerWidth
    const height = window.innerHeight
    const orientation = width > height ? 'landscape' : 'portrait'
    const pixelRatio = window.devicePixelRatio || 1

    // Detect device type based on width and user agent
    const deviceType = detectDeviceType(width, height)
    const isTouch = detectTouchDevice()
    const isFoldable = detectFoldableDevice(width, height)

    // Determine current breakpoint
    const breakpoint = getCurrentBreakpoint(width)

    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches

    // Determine pixel ratio category
    let pixelRatioType: PixelRatio = 'standard'
    if (pixelRatio >= 3) {
      pixelRatioType = 'ultra-retina'
    } else if (pixelRatio >= 2) {
      pixelRatioType = 'retina'
    }

    // Helper functions
    const isAbove = (bp: keyof typeof BREAKPOINTS) => width >= BREAKPOINTS[bp]
    const isBelow = (bp: keyof typeof BREAKPOINTS) => width < BREAKPOINTS[bp]
    const isBetween = (min: keyof typeof BREAKPOINTS, max: keyof typeof BREAKPOINTS) =>
      width >= BREAKPOINTS[min] && width < BREAKPOINTS[max]

    return {
      width,
      height,
      orientation,
      deviceType,
      pixelRatio: pixelRatioType,
      isTouch,
      isMobile: deviceType === 'phone' || isFoldable,
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop' || deviceType === 'tv',
      isFoldable,
      isLandscape: orientation === 'landscape',
      isPortrait: orientation === 'portrait',
      isRetina: pixelRatioType === 'retina' || pixelRatioType === 'ultra-retina',
      isUltraRetina: pixelRatioType === 'ultra-retina',
      prefersReducedMotion,
      prefersDarkMode,
      prefersReducedData,
      breakpoint,
      isAbove,
      isBelow,
      isBetween,
    }
  }

  // Handle window resize with debouncing
  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setState(updateResponsiveState(window))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function detectDeviceType(width: number, _height: number): DeviceType {
    const userAgent = navigator.userAgent.toLowerCase()

    // TV detection
    if (userAgent.includes('tv') || userAgent.includes('roku') || userAgent.includes('firetv')) {
      return 'tv'
    }

    // Watch detection
    if (userAgent.includes('watch') || width < 320) {
      return 'watch'
    }

    // Tablet detection
    if (
      userAgent.includes('ipad') ||
      userAgent.includes('tablet') ||
      userAgent.includes('kindle') ||
      userAgent.includes('silk') ||
      userAgent.includes('playbook') ||
      (width >= 768 && width <= 1024)
    ) {
      return 'tablet'
    }

    // Phone detection (default for mobile devices)
    if (
      userAgent.includes('mobile') ||
      userAgent.includes('android') ||
      userAgent.includes('iphone') ||
      width < 768
    ) {
      return 'phone'
    }

    // Desktop (default)
    return 'desktop'
  }

  function detectTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      (navigator.maxTouchPoints ?? 0) > 0 ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((navigator as any).msMaxTouchPoints ?? 0) > 0
    )
  }

  function detectFoldableDevice(width: number, height: number): boolean {
    // Detect foldable devices based on aspect ratio and size
    const aspectRatio = Math.max(width, height) / Math.min(width, height)

    // Common foldable screen sizes and aspect ratios
    return (
      (width >= 380 && width <= 480 && height >= 650) || // Foldable phones
      aspectRatio >= 2.5 || // Unusual aspect ratios
      // Check for foldable-specific user agents
      navigator.userAgent.toLowerCase().includes('fold')
    )
  }

  function getCurrentBreakpoint(width: number): keyof typeof BREAKPOINTS {
    const breakpoints = Object.entries(BREAKPOINTS).sort(([, a], [, b]) => b - a)

    for (const [name, size] of breakpoints) {
      if (width >= size) {
        return name as keyof typeof BREAKPOINTS
      }
    }

    return 'xs'
  }

  // Handle orientation change
  const handleOrientationChange = useCallback(() => {
    // Small delay to get accurate dimensions
    setTimeout(handleResize, 100)
  }, [handleResize])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Set up event listeners
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(document.documentElement)

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleResize)

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const dataQuery = window.matchMedia('(prefers-reduced-data: reduce)')

    const handlePreferenceChange = () => handleResize()

    motionQuery.addEventListener('change', handlePreferenceChange)
    darkModeQuery.addEventListener('change', handlePreferenceChange)
    dataQuery.addEventListener('change', handlePreferenceChange)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleResize)
      motionQuery.removeEventListener('change', handlePreferenceChange)
      darkModeQuery.removeEventListener('change', handlePreferenceChange)
      dataQuery.removeEventListener('change', handlePreferenceChange)
    }
  }, [handleResize, handleOrientationChange])

  return state
}

// Hook for responsive values (conditional based on breakpoint)
export function useResponsiveValue<T>(values: Partial<Record<keyof typeof BREAKPOINTS, T>>): T {
  const { breakpoint } = useResponsiveBreakpoints()

  // Find the largest breakpoint that has a value
  const breakpointNames = Object.keys(BREAKPOINTS) as (keyof typeof BREAKPOINTS)[]
  const currentIndex = breakpointNames.indexOf(breakpoint)

  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointNames[i]
    if (values[bp] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return values[bp]!
    }
  }

  // Fallback to first available value or throw error
  const firstValue = values[breakpointNames[0]]
  if (firstValue !== undefined) {
    return firstValue
  }

  throw new Error('No responsive value provided for any breakpoint')
}

// Hook for responsive styles
export function useResponsiveStyles() {
  const responsive = useResponsiveBreakpoints()

  const getSpacing = useCallback(
    (scale: number) => {
      const baseSize = 4 // 4px base
      const multiplier = responsive.isMobile ? 0.75 : responsive.isTablet ? 0.875 : 1
      return `${baseSize * scale * multiplier}px`
    },
    [responsive]
  )

  const getFontSize = useCallback(
    (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl') => {
      const sizes = {
        xs: responsive.isMobile ? 0.75 : 0.875,
        sm: responsive.isMobile ? 0.875 : 1,
        base: responsive.isMobile ? 1 : 1.125,
        lg: responsive.isMobile ? 1.125 : 1.25,
        xl: responsive.isMobile ? 1.25 : 1.5,
        '2xl': responsive.isMobile ? 1.5 : 2,
        '3xl': responsive.isMobile ? 1.875 : 2.25,
        '4xl': responsive.isMobile ? 2.25 : 3,
        '5xl': responsive.isMobile ? 3 : 4,
      }
      return `${sizes[size]}rem`
    },
    [responsive]
  )

  const getContainerWidth = useCallback(() => {
    if (responsive.isMobile) return '100%'
    if (responsive.isTablet) return '90%'
    return '1200px'
  }, [responsive])

  const getGridCols = useCallback(
    (mobile: number, tablet?: number, desktop?: number) => {
      if (responsive.isDesktop && desktop) return desktop
      if (responsive.isTablet && tablet) return tablet
      return mobile
    },
    [responsive]
  )

  return {
    ...responsive,
    getSpacing,
    getFontSize,
    getContainerWidth,
    getGridCols,
  }
}

// Viewport hook for safe areas and notches
export function useViewport() {
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSafeAreas = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
      })
    }

    updateSafeAreas()
    window.addEventListener('resize', updateSafeAreas)
    window.addEventListener('orientationchange', updateSafeAreas)

    return () => {
      window.removeEventListener('resize', updateSafeAreas)
      window.removeEventListener('orientationchange', updateSafeAreas)
    }
  }, [])

  return {
    safeAreaInsets,
    hasNotch: safeAreaInsets.top > 20,
    hasSideNotch: safeAreaInsets.left > 0 || safeAreaInsets.right > 0,
    hasHomeIndicator: safeAreaInsets.bottom > 0,
  }
}
