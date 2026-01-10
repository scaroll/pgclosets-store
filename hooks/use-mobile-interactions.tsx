/**
 * Mobile Touch Interaction System
 *
 * Comprehensive touch gesture library for mobile and tablet interactions
 * Supports swipe, pull-to-refresh, long press, pinch, and haptic feedback
 */

"use client"

import { useState, useRef, useCallback, useEffect } from 'react'

// Extend Navigator interface for vibrate
declare global {
  interface Navigator {
    vibrate?: (pattern: number | number[]) => boolean
    msMaxTouchPoints?: number
  }
}

// Touch gesture types
export type TouchGestureType =
  | 'swipe-left'
  | 'swipe-right'
  | 'swipe-up'
  | 'swipe-down'
  | 'pull-to-refresh'
  | 'long-press'
  | 'pinch-zoom'
  | 'double-tap'

// Touch configuration
interface TouchConfig {
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  pullThreshold?: number
  pinchThreshold?: number
  hapticFeedback?: boolean
}

export interface TouchGesture {
  type: TouchGestureType
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  velocity?: number
  scale?: number
  timestamp: number
}

// Hook for touch interactions
export function useTouchInteraction(
  onGesture: (gesture: TouchGesture) => void,
  config: TouchConfig = {}
) {
  const {
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pullThreshold = 80,
    pinchThreshold = 20,
    hapticFeedback = true
  } = config

  const [isActive, setIsActive] = useState(false)
  const startPoint = useRef({ x: 0, y: 0 })
  const currentPoint = useRef({ x: 0, y: 0 })
  const startTime = useRef(0)
  const lastTapTime = useRef(0)
  const longPressTimer = useRef<NodeJS.Timeout>()
  const initialDistance = useRef(0)

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || !window.navigator) return

    if ('vibrate' in window.navigator) {
      const pattern = {
        light: [10],
        medium: [20],
        heavy: [40]
      }
      window.navigator.vibrate(pattern[type])
    }
  }, [hapticFeedback])

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return

    const touch = e.touches[0]
    startPoint.current = { x: touch.clientX, y: touch.clientY }
    currentPoint.current = { x: touch.clientX, y: touch.clientY }
    startTime.current = Date.now()
    setIsActive(true)

    // Long press detection
    longPressTimer.current = setTimeout(() => {
      if (isActive) {
        triggerHaptic('medium')
        onGesture({
          type: 'long-press',
          timestamp: Date.now()
        })
      }
    }, longPressDelay)

    // Double tap detection
    const now = Date.now()
    if (now - lastTapTime.current < doubleTapDelay) {
      triggerHaptic('light')
      onGesture({
        type: 'double-tap',
        timestamp: now
      })
    }
    lastTapTime.current = now
  }, [onGesture, longPressDelay, doubleTapDelay, triggerHaptic, isActive])

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return

    const touch = e.touches[0]
    currentPoint.current = { x: touch.clientX, y: touch.clientY }

    // Clear long press if moved
    if (longPressTimer.current) {
      const distance = Math.hypot(
        currentPoint.current.x - startPoint.current.x,
        currentPoint.current.y - startPoint.current.y
      )
      if (distance > 10) {
        clearTimeout(longPressTimer.current)
      }
    }

    // Handle pinch zoom
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )

      if (initialDistance.current === 0) {
        initialDistance.current = distance
      } else {
        const scale = distance / initialDistance.current
        if (Math.abs(1 - scale) > pinchThreshold / 100) {
          onGesture({
            type: 'pinch-zoom',
            scale,
            timestamp: Date.now()
          })
        }
      }
    }
  }, [onGesture, pinchThreshold])

  // Handle touch end
  const handleTouchEnd = useCallback((_e: TouchEvent) => {
    if (!isActive) return

    const endTime = Date.now()
    const duration = endTime - startTime.current
    const deltaX = currentPoint.current.x - startPoint.current.x
    const deltaY = currentPoint.current.y - startPoint.current.y
    const distance = Math.hypot(deltaX, deltaY)
    const velocity = distance / duration

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Swipe detection
    if (distance > swipeThreshold && duration < 500) {
      let direction: 'up' | 'down' | 'left' | 'right' | undefined
      let gestureType: TouchGestureType | undefined

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          direction = 'right'
          gestureType = 'swipe-right'
        } else {
          direction = 'left'
          gestureType = 'swipe-left'
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          direction = 'down'
          gestureType = 'swipe-down'

          // Pull to refresh detection
          if (startPoint.current.y < 50 && deltaY > pullThreshold) {
            gestureType = 'pull-to-refresh'
          }
        } else {
          direction = 'up'
          gestureType = 'swipe-up'
        }
      }

      if (gestureType && direction) {
        triggerHaptic('light')
        onGesture({
          type: gestureType,
          direction,
          distance,
          velocity,
          timestamp: endTime
        })
      }
    }

    // Reset state
    setIsActive(false)
    initialDistance.current = 0
  }, [isActive, onGesture, swipeThreshold, pullThreshold, triggerHaptic])

  // Setup touch event listeners
  useEffect(() => {
    const element = document.documentElement

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isActive,
    triggerHaptic
  }
}

// Pull-to-refresh component
export function PullToRefresh({ onRefresh, children }: {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleGesture = useCallback(async (gesture: TouchGesture) => {
    if (gesture.type === 'pull-to-refresh' && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else if (gesture.type === 'swipe-down' && gesture.direction === 'down') {
      if (gesture.distance !== undefined && gesture.distance > 50) {
        setIsPulling(true)
        setPullDistance(Math.min(gesture.distance - 50, 100))
      }
    }
  }, [onRefresh, isRefreshing])

  useTouchInteraction(handleGesture, {
    pullThreshold: 80,
    hapticFeedback: true
  })

  useEffect(() => {
    if (!isPulling) {
      setPullDistance(0)
    }
  }, [isPulling])

  return (
    <div className="relative">
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center bg-white border-b border-gray-200 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance - 100 : 0}px)`,
          height: pullDistance > 0 ? `${Math.max(pullDistance, 60)}px` : '0px'
        }}
      >
        <div className="flex items-center gap-2 text-gray-600">
          {isRefreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-sm">Pull to refresh</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={isPulling ? 'transition-transform duration-300' : ''}>
        {children}
      </div>
    </div>
  )
}

// Swipeable card component
export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction
}: {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
}) {
  const [translateX, setTranslateX] = useState(0)

  const handleGesture = useCallback((gesture: TouchGesture) => {
    if (gesture.type === 'swipe-left' && onSwipeLeft) {
      onSwipeLeft()
      setTranslateX(-100)
      setTimeout(() => setTranslateX(0), 300)
    } else if (gesture.type === 'swipe-right' && onSwipeRight) {
      onSwipeRight()
      setTranslateX(100)
      setTimeout(() => setTranslateX(0), 300)
    }
  }, [onSwipeLeft, onSwipeRight])

  useTouchInteraction(handleGesture)

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left action */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center text-white z-10">
        {leftAction}
      </div>

      {/* Right action */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-green-500 flex items-center justify-center text-white z-10">
        {rightAction}
      </div>

      {/* Card content */}
      <div
        className="bg-white shadow-md transition-transform duration-300 cursor-grab"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {children}
      </div>
    </div>
  )
}

// Mobile-optimized tap area component
export function TapArea({
  children,
  onTap,
  haptic = true,
  className = '',
  size = 'default'
}: {
  children: React.ReactNode
  onTap: () => void
  haptic?: boolean
  className?: string
  size?: 'small' | 'default' | 'large'
}) {
  const sizeClasses = {
    small: 'min-h-[44px] min-w-[44px]',
    default: 'min-h-[48px] min-w-[48px]',
    large: 'min-h-[56px] min-w-[56px]'
  }

  const [isActive, setIsActive] = useState(false)

  const handleGesture = useCallback((gesture: TouchGesture) => {
    if (gesture.type === 'double-tap' || gesture.type === 'long-press') {
      if (haptic) {
        if ('vibrate' in window.navigator) {
          window.navigator.vibrate(10)
        }
      }
      onTap()
    }
  }, [onTap, haptic])

  useTouchInteraction(handleGesture)

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
        ${isActive ? 'scale-95' : ''}
        transition-transform duration-150 cursor-pointer select-none
        active:scale-95
      `}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onTap()
        }
      }}
      onClick={() => {
        if (haptic && 'vibrate' in window.navigator) {
          window.navigator.vibrate(5)
        }
        onTap()
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  )
}