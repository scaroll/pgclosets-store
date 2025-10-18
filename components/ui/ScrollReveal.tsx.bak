"use client"

/**
 * ScrollReveal - Intersection Observer-based reveal animations
 *
 * Features:
 * - Fade and slide-up reveal on scroll
 * - Staggered animations for multiple elements
 * - Custom animation variants
 * - Respects prefers-reduced-motion
 * - Performance-optimized with Intersection Observer
 *
 * Performance:
 * - Lazy animation triggering
 * - GPU-accelerated transforms
 * - Minimal DOM manipulation
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  TIMING,
  EASING_CURVES,
  prefersReducedMotion,
  createScrollRevealObserver,
} from '@/lib/design-system/interactions';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';
export type RevealVariant = 'gentle' | 'confident' | 'dramatic';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: RevealDirection;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  triggerOnce?: boolean;
}

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      className,
      direction = 'up',
      variant = 'confident',
      delay = 0,
      duration,
      distance = 40,
      threshold = 0.1,
      once = true,
      triggerOnce = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasAnimated, setHasAnimated] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = prefersReducedMotion();

    // Skip animation if reduced motion is preferred
    React.useEffect(() => {
      if (reducedMotion) {
        setIsVisible(true);
        setHasAnimated(true);
      }
    }, [reducedMotion]);

    // Set up Intersection Observer
    React.useEffect(() => {
      if (reducedMotion || hasAnimated) return;

      const element = elementRef.current;
      if (!element) return;

      const observer = createScrollRevealObserver(
        (entry) => {
          if (entry.isIntersecting) {
            // Add delay for staggered animations
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasAnimated(true);
              }
            }, delay);
          } else if (!once && !triggerOnce) {
            // Reset animation if not "once" mode
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin: '0px 0px -50px 0px',
          once: triggerOnce,
        }
      );

      if (observer) {
        observer.observe(element);
        return () => observer.disconnect();
      }
    }, [threshold, delay, once, triggerOnce, reducedMotion, hasAnimated]);

    // Variant configurations
    const variantConfig = {
      gentle: {
        duration: duration || TIMING.slower,
        easing: EASING_CURVES.gentle,
      },
      confident: {
        duration: duration || TIMING.slow,
        easing: EASING_CURVES.confident,
      },
      dramatic: {
        duration: duration || TIMING.slower,
        easing: EASING_CURVES.premium,
      },
    };

    const config = variantConfig[variant];

    // Direction-specific transforms
    const getInitialTransform = () => {
      if (reducedMotion) return 'none';

      switch (direction) {
        case 'up':
          return `translateY(${distance}px)`;
        case 'down':
          return `translateY(-${distance}px)`;
        case 'left':
          return `translateX(${distance}px)`;
        case 'right':
          return `translateX(-${distance}px)`;
        case 'fade':
          return 'none';
        default:
          return `translateY(${distance}px)`;
      }
    };

    const baseStyles = cn(
      'will-change-transform',
      'transform-gpu',
      'transition-all',
      !reducedMotion && !isVisible && 'opacity-0'
    );

    return (
      <div
        ref={elementRef}
        className={cn(baseStyles, className)}
        style={
          !reducedMotion
            ? {
                transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${config.duration}ms`,
                transitionTimingFunction: config.easing,
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollReveal.displayName = 'ScrollReveal';

export { ScrollReveal };

// ========================================
// STAGGERED SCROLL REVEAL
// ========================================

export interface StaggeredScrollRevealProps {
  children: React.ReactNode[];
  direction?: RevealDirection;
  variant?: RevealVariant;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredScrollReveal: React.FC<StaggeredScrollRevealProps> = ({
  children,
  direction = 'up',
  variant = 'confident',
  staggerDelay = 100,
  className,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal
          key={index}
          direction={direction}
          variant={variant}
          delay={index * staggerDelay}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

// ========================================
// REVEAL ON SCROLL HOOK
// ========================================

export interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal(
  options: UseScrollRevealOptions = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = createScrollRevealObserver(
      (entry) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        once: options.once !== undefined ? options.once : true,
      }
    );

    if (observer) {
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [options.threshold, options.rootMargin, options.once, reducedMotion]);

  return [elementRef, isVisible];
}

// ========================================
// FADE IN COMPONENT
// ========================================

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
}

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ className, delay = 0, duration = TIMING.slow, children, ...props }, ref) => {
    return (
      <ScrollReveal
        ref={ref}
        direction="fade"
        delay={delay}
        duration={duration}
        className={className}
        {...props}
      >
        {children}
      </ScrollReveal>
    );
  }
);

FadeIn.displayName = 'FadeIn';

// ========================================
// SLIDE UP COMPONENT
// ========================================

export interface SlideUpProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  distance?: number;
}

export const SlideUp = React.forwardRef<HTMLDivElement, SlideUpProps>(
  ({ className, delay = 0, distance = 40, children, ...props }, ref) => {
    return (
      <ScrollReveal
        ref={ref}
        direction="up"
        delay={delay}
        distance={distance}
        variant="confident"
        className={className}
        {...props}
      >
        {children}
      </ScrollReveal>
    );
  }
);

SlideUp.displayName = 'SlideUp';

// ========================================
// SCALE IN COMPONENT
// ========================================

export interface ScaleInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
}

export const ScaleIn = React.forwardRef<HTMLDivElement, ScaleInProps>(
  ({ className, delay = 0, duration = TIMING.slow, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = prefersReducedMotion();

    React.useEffect(() => {
      if (reducedMotion) {
        setIsVisible(true);
        return;
      }

      const element = elementRef.current;
      if (!element) return;

      const observer = createScrollRevealObserver(
        (entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        },
        { threshold: 0.1, once: true }
      );

      if (observer) {
        observer.observe(element);
        return () => observer.disconnect();
      }
    }, [delay, reducedMotion]);

    return (
      <div
        ref={elementRef}
        className={cn(
          'will-change-transform transform-gpu transition-all',
          !reducedMotion && !isVisible && 'opacity-0 scale-95',
          !reducedMotion && isVisible && 'opacity-100 scale-100',
          className
        )}
        style={
          !reducedMotion
            ? {
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: EASING_CURVES.elegant,
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScaleIn.displayName = 'ScaleIn';
