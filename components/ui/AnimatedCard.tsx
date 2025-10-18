"use client"

/**
 * AnimatedCard - Sophisticated card with premium hover states
 *
 * Features:
 * - Elegant lift and shadow animations on hover
 * - Image zoom effect (105% scale)
 * - Copper accent line reveal
 * - Smooth state transitions
 * - GPU-accelerated transforms
 * - Respects prefers-reduced-motion
 *
 * Performance:
 * - Transform and opacity only (GPU accelerated)
 * - Intersection Observer for lazy animation
 * - <16ms per frame target
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  prefersReducedMotion,
  createScrollRevealObserver,
} from '@/lib/design-system/interactions';

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  revealOnScroll?: boolean;
  delay?: number;
  imageSlot?: React.ReactNode;
  accentPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none';
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      className,
      variant = 'default',
      hoverEffect = 'lift',
      revealOnScroll = false,
      delay = 0,
      imageSlot,
      accentPosition = 'bottom',
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(!revealOnScroll);
    const [isHovered, setIsHovered] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = prefersReducedMotion();

    // Scroll reveal with Intersection Observer
    React.useEffect(() => {
      if (!revealOnScroll || reducedMotion) {
        setIsVisible(true);
        return;
      }

      const element = cardRef.current;
      if (!element) return;

      const observer = createScrollRevealObserver(
        (entry) => {
          if (entry.isIntersecting) {
            // Add delay for staggered animations
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
          once: true,
        }
      );

      if (observer) {
        observer.observe(element);
        return () => observer.disconnect();
      }
    }, [revealOnScroll, reducedMotion, delay]);

    // Base styles
    const baseStyles = cn(
      // Layout
      'relative overflow-hidden rounded-md',
      'transition-all duration-300 ease-out',
      'will-change-transform',
      'transform-gpu',
      // Focus
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-copper-500 focus-within:ring-offset-2'
    );

    // Variant styles
    const variantStyles = {
      default: cn(
        'bg-white',
        'border border-charcoal-100',
        'shadow-soft'
      ),
      elevated: cn(
        'bg-white',
        'shadow-medium'
      ),
      outlined: cn(
        'bg-transparent',
        'border-2 border-charcoal-200'
      ),
      ghost: cn(
        'bg-transparent'
      ),
    };

    // Hover effect styles
    const hoverStyles = {
      lift: !reducedMotion && cn(
        'hover:-translate-y-1 hover:shadow-lifted',
        'hover:border-copper-500/30'
      ),
      glow: !reducedMotion && cn(
        'hover:shadow-copperGlowLarge',
        'hover:border-copper-500/50'
      ),
      scale: !reducedMotion && cn(
        'hover:scale-[1.02]',
        'hover:shadow-lifted'
      ),
      none: '',
    };

    // Scroll reveal animation
    const revealStyles = cn(
      revealOnScroll && !isVisible && 'opacity-0 translate-y-8',
      revealOnScroll && isVisible && 'opacity-100 translate-y-0'
    );

    return (
      <div
        ref={cardRef}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles[hoverEffect],
          revealStyles,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Copper accent line */}
        {accentPosition !== 'none' && (
          <div
            className={cn(
              'absolute bg-gradient-to-r from-copper-500 to-copper-600',
              'transition-all duration-500 ease-out',
              {
                top: accentPosition === 'top' && cn(
                  'top-0 left-0 right-0 h-1',
                  isHovered ? 'w-full' : 'w-0'
                ),
                bottom: accentPosition === 'bottom' && cn(
                  'bottom-0 left-0 right-0 h-1',
                  isHovered ? 'w-full' : 'w-0'
                ),
                left: accentPosition === 'left' && cn(
                  'left-0 top-0 bottom-0 w-1',
                  isHovered ? 'h-full' : 'h-0'
                ),
                right: accentPosition === 'right' && cn(
                  'right-0 top-0 bottom-0 w-1',
                  isHovered ? 'h-full' : 'h-0'
                ),
              }
            )}
            aria-hidden="true"
          />
        )}

        {/* Image slot with zoom effect */}
        {imageSlot && (
          <div className="relative overflow-hidden">
            <div
              className={cn(
                'transition-transform duration-500 ease-out',
                !reducedMotion && isHovered && 'scale-105'
              )}
            >
              {imageSlot}
            </div>

            {/* Overlay gradient on hover */}
            {!reducedMotion && (
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent',
                  'transition-opacity duration-300',
                  isHovered ? 'opacity-100' : 'opacity-0'
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Card content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Subtle glow effect */}
        {!reducedMotion && hoverEffect === 'glow' && (
          <div
            className={cn(
              'absolute inset-0 rounded-md',
              'bg-gradient-radial from-copper-500/20 via-transparent to-transparent',
              'opacity-0 transition-opacity duration-500',
              isHovered && 'opacity-100'
            )}
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };

// ========================================
// CARD HEADER COMPONENT
// ========================================

export interface AnimatedCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const AnimatedCardHeader = React.forwardRef<HTMLDivElement, AnimatedCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

AnimatedCardHeader.displayName = 'AnimatedCardHeader';

// ========================================
// CARD TITLE COMPONENT
// ========================================

export interface AnimatedCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const AnimatedCardTitle = React.forwardRef<HTMLParagraphElement, AnimatedCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-display text-2xl font-light tracking-tight text-charcoal-900',
        className
      )}
      {...props}
    />
  )
);

AnimatedCardTitle.displayName = 'AnimatedCardTitle';

// ========================================
// CARD DESCRIPTION COMPONENT
// ========================================

export interface AnimatedCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const AnimatedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  AnimatedCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-charcoal-600 leading-relaxed', className)}
    {...props}
  />
));

AnimatedCardDescription.displayName = 'AnimatedCardDescription';

// ========================================
// CARD CONTENT COMPONENT
// ========================================

export interface AnimatedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AnimatedCardContent = React.forwardRef<HTMLDivElement, AnimatedCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

AnimatedCardContent.displayName = 'AnimatedCardContent';

// ========================================
// CARD FOOTER COMPONENT
// ========================================

export interface AnimatedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const AnimatedCardFooter = React.forwardRef<HTMLDivElement, AnimatedCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);

AnimatedCardFooter.displayName = 'AnimatedCardFooter';

// ========================================
// EXPORTS
// ========================================

export {
  AnimatedCardHeader,
  AnimatedCardTitle,
  AnimatedCardDescription,
  AnimatedCardContent,
  AnimatedCardFooter,
};
