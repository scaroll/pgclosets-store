'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PremiumSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'copper' | 'subtle' | 'luxury'
  className?: string
  label?: string
}

/**
 * PremiumSpinner - Elegant circular loading indicator
 *
 * Sophisticated spinner with copper accent and smooth animation.
 * Features multiple size and style variants for different contexts.
 *
 * Performance optimized with transform3d and will-change.
 *
 * @example
 * ```tsx
 * <PremiumSpinner size="md" variant="copper" />
 * <PremiumSpinner size="lg" variant="luxury" label="Loading products..." />
 * ```
 */
export function PremiumSpinner({
  size = 'md',
  variant = 'primary',
  className,
  label = 'Loading...'
}: PremiumSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-[3px]'
  }

  const variantClasses = {
    primary: 'border-gray-200 border-t-charcoal-900',
    copper: 'border-cream-100 border-t-copper-500',
    subtle: 'border-gray-100 border-t-gray-400',
    luxury: 'border-stone-200 border-t-rose-gold-500'
  }

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className={cn("inline-flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

/**
 * PremiumSpinnerWithText - Spinner with descriptive text
 *
 * Combines spinner with contextual loading message.
 * Ideal for full-page loading states or major content blocks.
 *
 * @example
 * ```tsx
 * <PremiumSpinnerWithText
 *   text="Loading your closet designs..."
 *   subtext="This may take a few moments"
 * />
 * ```
 */
export function PremiumSpinnerWithText({
  text,
  subtext,
  size = 'lg',
  variant = 'copper',
  className
}: {
  text: string
  subtext?: string
  size?: 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'copper' | 'luxury'
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12",
        className
      )}
      role="status"
      aria-label={text}
    >
      <PremiumSpinner size={size} variant={variant} label={text} />

      <div className="text-center space-y-1">
        <p className="text-base font-medium text-charcoal-900 tracking-wide">
          {text}
        </p>
        {subtext && (
          <p className="text-sm text-gray-600 font-light">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * OrbitSpinner - Orbiting dots animation
 *
 * Premium loading indicator with orbiting dots.
 * Creates an elegant, high-end loading experience.
 *
 * @example
 * ```tsx
 * <OrbitSpinner />
 * <OrbitSpinner size="lg" color="copper" />
 * ```
 */
export function OrbitSpinner({
  size = 'md',
  color = 'copper',
  className
}: {
  size?: 'sm' | 'md' | 'lg'
  color?: 'copper' | 'gold' | 'charcoal'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const dotSizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  }

  const colorClasses = {
    copper: 'bg-copper-500',
    gold: 'bg-gold-500',
    charcoal: 'bg-charcoal-900'
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative inline-flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {/* Orbiting dots */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full",
            dotSizeClasses[size],
            colorClasses[color]
          )}
          style={{
            animation: `orbit 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            animationDelay: `${i * 0.2}s`,
            transformOrigin: 'center',
            left: '50%',
            top: '50%',
            marginLeft: `-${parseInt(dotSizeClasses[size].split('w-')[1]) / 2}`,
            marginTop: `-${parseInt(dotSizeClasses[size].split('h-')[1]) / 2}`
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading, please wait</span>

      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(${size === 'lg' ? '24px' : size === 'md' ? '20px' : '16px'}) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) translateX(${size === 'lg' ? '24px' : size === 'md' ? '20px' : '16px'}) rotate(-180deg);
            opacity: 0.3;
          }
          100% {
            transform: rotate(360deg) translateX(${size === 'lg' ? '24px' : size === 'md' ? '20px' : '16px'}) rotate(-360deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * PulseLoader - Three-dot pulse animation
 *
 * Classic three-dot loading indicator with elegant timing.
 * Perfect for inline loading states or button loading.
 *
 * @example
 * ```tsx
 * <PulseLoader />
 * <PulseLoader size="lg" color="copper" />
 * ```
 */
export function PulseLoader({
  size = 'md',
  color = 'charcoal',
  className
}: {
  size?: 'sm' | 'md' | 'lg'
  color?: 'charcoal' | 'copper' | 'gray'
  className?: string
}) {
  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  }

  const gapSizes = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2'
  }

  const colorClasses = {
    charcoal: 'bg-charcoal-900',
    copper: 'bg-copper-500',
    gray: 'bg-gray-500'
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-flex items-center justify-center",
        gapSizes[size],
        className
      )}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            dotSizes[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1.4s'
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading, please wait</span>
    </div>
  )
}
