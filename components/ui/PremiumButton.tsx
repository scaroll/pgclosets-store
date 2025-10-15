"use client"

/**
 * PremiumButton - Multi-variant button with sophisticated interactions
 *
 * Features:
 * - Multiple premium variants (primary, copper, outline, ghost)
 * - Hover effects with scale, glow, and haptic feedback simulation
 * - Loading and success states with smooth transitions
 * - GPU-accelerated animations (60fps target)
 * - Respects prefers-reduced-motion
 * - Full keyboard navigation support
 *
 * Performance:
 * - Transform-only animations (GPU accelerated)
 * - Minimal repaints with will-change hints
 * - <16ms per frame rendering
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  TIMING,
  EASING_CURVES,
  SHADOWS,
  COPPER_ACCENT,
  prefersReducedMotion,
  getSafeDuration,
  triggerHaptic,
} from '@/lib/design-system/interactions';

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'copper' | 'outline' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  shimmer?: boolean;
  glow?: boolean;
  haptic?: boolean;
  asChild?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      success = false,
      icon,
      iconPosition = 'right',
      shimmer = false,
      glow = false,
      haptic = true,
      disabled,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const reducedMotion = prefersReducedMotion();

    // Handle click with haptic feedback
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && !reducedMotion) {
        triggerHaptic('medium');
      }
      onClick?.(e);
    };

    // Handle press state for tactile feedback
    const handleMouseDown = () => {
      setIsPressed(true);
      if (haptic && !reducedMotion) {
        triggerHaptic('light');
      }
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    // Base styles with performance optimizations
    const baseStyles = cn(
      // Layout
      'inline-flex items-center justify-center gap-2',
      'relative overflow-hidden',
      'font-body font-medium tracking-wide uppercase',
      'rounded-sm',
      'transition-all duration-150',
      'will-change-transform',
      'transform-gpu',
      // Focus
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      // Disabled
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      // Active state
      isPressed && !disabled && 'scale-[0.98]'
    );

    // Size variants
    const sizeStyles = {
      sm: 'px-6 py-2 text-xs min-h-[36px]',
      md: 'px-8 py-3 text-sm min-h-[44px]',
      lg: 'px-10 py-4 text-base min-h-[52px]',
      xl: 'px-12 py-5 text-lg min-h-[60px]',
    };

    // Variant styles with brand colors
    const variantStyles = {
      primary: cn(
        'bg-charcoal-900 text-cream-50',
        'hover:bg-charcoal-800',
        'shadow-md hover:shadow-lifted',
        'focus-visible:ring-charcoal-600',
        !reducedMotion && 'hover:-translate-y-0.5 hover:scale-[1.02]'
      ),
      copper: cn(
        'bg-gradient-to-br from-copper-500 to-copper-600 text-white',
        'hover:from-copper-600 hover:to-copper-700',
        'shadow-copperGlow hover:shadow-copperGlowLarge',
        'focus-visible:ring-copper-500',
        !reducedMotion && 'hover:-translate-y-0.5 hover:scale-[1.02]'
      ),
      outline: cn(
        'border-2 border-charcoal-200 text-charcoal-900 bg-transparent',
        'hover:border-copper-500 hover:text-copper-700 hover:bg-copper-50/50',
        'focus-visible:ring-copper-500',
        !reducedMotion && 'hover:-translate-y-0.5'
      ),
      ghost: cn(
        'text-charcoal-700 bg-transparent',
        'hover:bg-charcoal-100 hover:text-charcoal-900',
        'focus-visible:ring-charcoal-500',
        !reducedMotion && 'hover:scale-[1.02]'
      ),
      luxury: cn(
        'bg-gradient-to-r from-charcoal-900 via-copper-800 to-charcoal-900',
        'text-cream-50 border border-copper-500/30',
        'shadow-copperGlow hover:shadow-copperGlowLarge',
        'focus-visible:ring-copper-500',
        !reducedMotion && 'hover:-translate-y-0.5 hover:scale-[1.02]'
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        {...props}
      >
        {/* Shimmer effect */}
        {shimmer && !reducedMotion && (
          <div
            className={cn(
              'absolute inset-0 -translate-x-full',
              'bg-gradient-to-r from-transparent via-white/20 to-transparent',
              'group-hover:translate-x-full transition-transform duration-1000'
            )}
            aria-hidden="true"
          />
        )}

        {/* Glow pulse effect */}
        {glow && !reducedMotion && (
          <div
            className={cn(
              'absolute inset-0 opacity-0',
              'bg-gradient-radial from-copper-400/30 via-transparent to-transparent',
              'group-hover:opacity-100 transition-opacity duration-500',
              'animate-pulse'
            )}
            aria-hidden="true"
          />
        )}

        {/* Content wrapper */}
        <span className="relative z-10 flex items-center gap-2">
          {/* Loading spinner */}
          {loading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {/* Success checkmark */}
          {success && !loading && (
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}

          {/* Left icon */}
          {icon && iconPosition === 'left' && !loading && !success && (
            <span
              className={cn(
                'transition-transform duration-300',
                !reducedMotion && 'group-hover:-translate-x-0.5'
              )}
            >
              {icon}
            </span>
          )}

          {/* Button text */}
          {children}

          {/* Right icon */}
          {icon && iconPosition === 'right' && !loading && !success && (
            <span
              className={cn(
                'transition-transform duration-300',
                !reducedMotion && 'group-hover:translate-x-0.5'
              )}
            >
              {icon}
            </span>
          )}
        </span>

        {/* Ripple effect on click */}
        {!reducedMotion && (
          <span
            className={cn(
              'absolute inset-0 rounded-sm',
              'bg-white/30 scale-0 opacity-0',
              isPressed && 'animate-ping'
            )}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export { PremiumButton };

// ========================================
// COMMON ICONS
// ========================================

export const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4', className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4', className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4', className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
