'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ShimmerOverlayProps {
  className?: string
  duration?: number
  direction?: 'ltr' | 'rtl'
  color?: 'gray' | 'copper' | 'neutral'
}

/**
 * ShimmerOverlay - Elegant shimmer animation overlay
 *
 * Provides a sophisticated loading shimmer effect with customizable
 * colors, duration, and direction. Uses CSS gradients and animations
 * for smooth performance.
 *
 * Features:
 * - Smooth gradient animation (1.5s default)
 * - Multiple color variants (gray, copper, neutral)
 * - Bidirectional animation support
 * - Hardware-accelerated transforms
 * - WCAG compliant (hidden from screen readers)
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <div className="bg-gray-200" />
 *   <ShimmerOverlay />
 * </div>
 *
 * <div className="relative">
 *   <div className="bg-gray-200" />
 *   <ShimmerOverlay color="copper" duration={2000} />
 * </div>
 * ```
 */
export function ShimmerOverlay({
  className,
  duration = 1500,
  direction = 'ltr',
  color = 'gray'
}: ShimmerOverlayProps) {
  const colorVariants = {
    gray: 'from-transparent via-white/60 to-transparent',
    copper: 'from-transparent via-copper-200/40 to-transparent',
    neutral: 'from-transparent via-stone-100/50 to-transparent'
  }

  return (
    <div
      className={cn(
        "absolute inset-0 -translate-x-full",
        "bg-gradient-to-r",
        colorVariants[color],
        "animate-shimmer",
        className
      )}
      style={{
        animationDuration: `${duration}ms`,
        animationDirection: direction === 'rtl' ? 'reverse' : 'normal'
      }}
      aria-hidden="true"
    />
  )
}

/**
 * PulseShimmer - Pulsing shimmer effect for inline loading
 *
 * Gentle pulsing animation for small UI elements like badges,
 * chips, or inline text placeholders.
 *
 * @example
 * ```tsx
 * <span className="inline-block px-3 py-1 bg-gray-200 rounded-full">
 *   <PulseShimmer />
 * </span>
 * ```
 */
export function PulseShimmer({
  className,
  intensity = 'medium'
}: {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}) {
  const intensityClasses = {
    low: 'opacity-30',
    medium: 'opacity-50',
    high: 'opacity-70'
  }

  return (
    <div
      className={cn(
        "absolute inset-0 bg-white",
        "animate-pulse",
        intensityClasses[intensity],
        className
      )}
      style={{
        animationDuration: '2s'
      }}
      aria-hidden="true"
    />
  )
}

/**
 * WaveShimmer - Wave-style shimmer for larger content blocks
 *
 * Animated wave effect that travels across larger content areas.
 * Ideal for hero sections, full-width images, or major content blocks.
 *
 * @example
 * ```tsx
 * <div className="relative h-96 bg-gray-200">
 *   <WaveShimmer />
 * </div>
 * ```
 */
export function WaveShimmer({
  className,
  speed = 'normal'
}: {
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}) {
  const speedDurations = {
    slow: '3000ms',
    normal: '2000ms',
    fast: '1000ms'
  }

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
        style={{
          animation: `shimmer ${speedDurations[speed]} infinite ease-in-out`
        }}
      />
    </div>
  )
}

/**
 * GlowShimmer - Glowing pulse effect for premium elements
 *
 * Sophisticated glow effect with copper accent for luxury UI elements.
 * Best used sparingly for featured or premium content.
 *
 * @example
 * ```tsx
 * <div className="relative p-6 bg-charcoal-900 rounded-lg">
 *   <GlowShimmer />
 * </div>
 * ```
 */
export function GlowShimmer({
  className,
  color = 'copper'
}: {
  className?: string
  color?: 'copper' | 'gold' | 'bronze'
}) {
  const colorVariants = {
    copper: 'bg-copper-400/20 shadow-copper-400/40',
    gold: 'bg-gold-400/20 shadow-gold-400/40',
    bronze: 'bg-bronze-400/20 shadow-bronze-400/40'
  }

  return (
    <div
      className={cn(
        "absolute inset-0 rounded-inherit",
        "animate-pulse",
        colorVariants[color],
        "shadow-2xl blur-xl",
        className
      )}
      style={{
        animationDuration: '2.5s'
      }}
      aria-hidden="true"
    />
  )
}
