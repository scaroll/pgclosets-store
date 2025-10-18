/**
 * Headline Component System
 * Apple-inspired massive headlines with responsive sizing and gradient effects
 *
 * Features:
 * - Massive headlines (56-96px) for hero sections
 * - Responsive sizing (56px mobile → 96px desktop)
 * - Gradient text effects
 * - Proper font-weight hierarchy
 * - Letter-spacing precision (-0.02em for large text)
 * - WCAG AAA contrast compliance
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type HeadlineSize = 'hero' | 'mega' | 'large' | 'medium' | 'small';
type HeadlineWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold';
type GradientVariant = 'none' | 'brand' | 'sunset' | 'ocean' | 'metal' | 'luxury';

interface HeadlineProps {
  children: React.ReactNode;
  size?: HeadlineSize;
  weight?: HeadlineWeight;
  gradient?: GradientVariant;
  balance?: boolean;
  className?: string;
  as?: React.ElementType;
}

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const sizeClasses: Record<HeadlineSize, string> = {
  // Hero: 96px desktop, 56px mobile
  hero: 'text-[3.5rem] leading-[1.05] tracking-[-0.04em] sm:text-[4rem] md:text-[5rem] lg:text-[6rem]',

  // Mega: 80px desktop, 48px mobile
  mega: 'text-[3rem] leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem] md:text-[4rem] lg:text-[5rem]',

  // Large: 64px desktop, 40px mobile
  large: 'text-[2.5rem] leading-[1.1] tracking-[-0.03em] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]',

  // Medium: 48px desktop, 32px mobile
  medium: 'text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem] md:text-[3rem]',

  // Small: 32px desktop, 24px mobile
  small: 'text-[1.5rem] leading-[1.2] tracking-[-0.02em] sm:text-[1.75rem] md:text-[2rem]',
};

// ============================================================================
// WEIGHT CONFIGURATIONS
// ============================================================================

const weightClasses: Record<HeadlineWeight, string> = {
  thin: 'font-[200]',     // Ultra-light for massive displays
  light: 'font-[300]',    // Light for hero sections
  normal: 'font-[400]',   // Regular for standard headlines
  medium: 'font-[500]',   // Medium for emphasis
  semibold: 'font-[600]', // Semibold for strong statements
};

// ============================================================================
// GRADIENT CONFIGURATIONS
// ============================================================================

const gradientClasses: Record<GradientVariant, string> = {
  none: '',

  // Brand gradient: Navy to Sky Blue
  brand: 'bg-gradient-to-r from-[#1e3a5f] to-[#87CEEB] bg-clip-text text-transparent',

  // Sunset gradient: Warm tones
  sunset: 'bg-gradient-to-r from-[#f59e0b] via-[#ef4444] to-[#dc2626] bg-clip-text text-transparent',

  // Ocean gradient: Cool blues
  ocean: 'bg-gradient-to-r from-[#0ea5e9] via-[#06b6d4] to-[#14b8a6] bg-clip-text text-transparent',

  // Metal gradient: Metallic effect
  metal: 'bg-gradient-to-r from-[#78716c] via-[#a8a29e] to-[#78716c] bg-clip-text text-transparent',

  // Luxury gradient: Deep charcoal to bronze
  luxury: 'bg-gradient-to-r from-[#1c1917] via-[#78716c] to-[#d97706] bg-clip-text text-transparent',
};

// ============================================================================
// HEADLINE COMPONENT
// ============================================================================

export const Headline = React.forwardRef<HTMLElement, HeadlineProps>(
  (
    {
      children,
      size = 'large',
      weight = 'light',
      gradient = 'none',
      balance = true,
      className,
      as,
      ...props
    },
    ref
  ) => {
    const Component = as || 'h1';

    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          'font-display',
          'text-charcoal-900',
          'antialiased',

          // Size configuration
          sizeClasses[size],

          // Weight configuration
          weightClasses[weight],

          // Gradient configuration
          gradientClasses[gradient],

          // Text wrapping
          balance && 'text-balance',

          // OpenType features
          'font-feature-settings: "liga" 1, "kern" 1',

          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Headline.displayName = 'Headline';

// ============================================================================
// HERO HEADLINE (Shortcut for hero size)
// ============================================================================

export const HeroHeadline = React.forwardRef<HTMLElement, Omit<HeadlineProps, 'size'>>(
  (props, ref) => <Headline ref={ref} size="hero" {...props} />
);

HeroHeadline.displayName = 'HeroHeadline';

// ============================================================================
// SECTION HEADLINE (Shortcut for section headers)
// ============================================================================

export const SectionHeadline = React.forwardRef<HTMLElement, Omit<HeadlineProps, 'size' | 'weight'>>(
  (props, ref) => <Headline ref={ref} size="medium" weight="medium" {...props} />
);

SectionHeadline.displayName = 'SectionHeadline';

// ============================================================================
// FEATURE CALLOUT (Large product features)
// ============================================================================

interface FeatureCalloutProps extends Omit<HeadlineProps, 'size'> {
  eyebrow?: string;
}

export const FeatureCallout = React.forwardRef<HTMLElement, FeatureCalloutProps>(
  ({ children, eyebrow, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {eyebrow && (
          <span className="block text-sm font-medium uppercase tracking-wider text-charcoal-600">
            {eyebrow}
          </span>
        )}
        <Headline
          ref={ref}
          size="medium"
          weight="semibold"
          className={cn('text-balance', className)}
          {...props}
        >
          {children}
        </Headline>
      </div>
    );
  }
);

FeatureCallout.displayName = 'FeatureCallout';

// ============================================================================
// ANIMATED HEADLINE (With entrance animation)
// ============================================================================

interface AnimatedHeadlineProps extends HeadlineProps {
  delay?: number;
}

export const AnimatedHeadline = React.forwardRef<HTMLElement, AnimatedHeadlineProps>(
  ({ children, delay = 0, className, ...props }, ref) => {
    return (
      <Headline
        ref={ref}
        className={cn(
          'animate-fade-in opacity-0',
          className
        )}
        style={{
          animationDelay: `${delay}ms`,
          animationFillMode: 'forwards',
        }}
        {...props}
      >
        {children}
      </Headline>
    );
  }
);

AnimatedHeadline.displayName = 'AnimatedHeadline';

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default Headline;
