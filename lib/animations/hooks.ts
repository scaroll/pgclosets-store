/**
 * Animation Hooks
 *
 * Custom React hooks for animation patterns
 */

'use client';

import type { RefObject } from 'react';
import { useEffect, useState, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { VIEWPORT_MARGIN, SPRING } from './constants';

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(options?: {
  once?: boolean;
  margin?: string;
  amount?: number | 'some' | 'all';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    ...(options?.margin ? { margin: options.margin } : {}),
    amount: options?.amount ?? 0.3,
  });

  return { ref, isInView };
}

/**
 * Hook for parallax scroll effects
 */
export function useParallax(distance: number = 50): {
  ref: RefObject<HTMLElement>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'] as any,
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return { ref, y };
}

/**
 * Hook for smooth spring animations
 */
export function useSmoothSpring(value: number, config = SPRING.smooth): MotionValue<number> {
  return useSpring(value, config);
}

/**
 * Hook for scroll progress
 */
export function useScrollProgress(options?: {
  target?: RefObject<HTMLElement>;
  offset?: [string, string];
}) {
  const { scrollYProgress } = useScroll({
    target: options?.target,
    offset: (options?.offset ?? ['start end', 'end start']) as any,
  });

  return scrollYProgress;
}

/**
 * Hook for stagger delay calculation
 */
export function useStaggerDelay(index: number, stagger: number = 0.05): number {
  return index * stagger;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for viewport-based animations
 */
export function useViewportAnimation(ref: RefObject<HTMLElement>) {
  const isInView = useInView(ref, {
    once: true,
    margin: VIEWPORT_MARGIN.standard,
  });

  return isInView;
}

/**
 * Hook for mouse position tracking
 */
export function useMousePosition(): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return position;
}

/**
 * Hook for magnetic cursor effect
 */
export function useMagneticEffect(
  ref: RefObject<HTMLElement>,
  strength: number = 0.3
): { x: MotionValue<number>; y: MotionValue<number> } {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, strength]);

  const x = useSpring(position.x, SPRING.smooth);
  const y = useSpring(position.y, SPRING.smooth);

  return { x, y };
}

/**
 * Hook for scroll-based scale
 */
export function useScrollScale(options?: {
  target?: RefObject<HTMLElement>;
  min?: number;
  max?: number;
}): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: options?.target,
    offset: ['start end', 'end start'],
  });

  return useTransform(scrollYProgress, [0, 1], [options?.min ?? 0.8, options?.max ?? 1]);
}

/**
 * Hook for scroll-based opacity
 */
export function useScrollOpacity(options?: {
  target?: RefObject<HTMLElement>;
  min?: number;
  max?: number;
}): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: options?.target,
    offset: ['start end', 'end start'],
  });

  return useTransform(scrollYProgress, [0, 1], [options?.min ?? 0, options?.max ?? 1]);
}

/**
 * Hook for intersection observer with callback
 */
export function useIntersectionObserver(
  ref: RefObject<HTMLElement>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, callback, options]);
}

/**
 * Hook for animated counter
 */
export function useAnimatedCounter(
  target: number,
  duration: number = 2000
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

/**
 * Hook for scroll direction detection
 */
export function useScrollDirection(): 'up' | 'down' | null {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}

/**
 * Hook for element dimensions
 */
export function useElementSize(ref: RefObject<HTMLElement>): {
  width: number;
  height: number;
} {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

/**
 * Hook for debounced animation trigger
 */
export function useDebouncedAnimation(
  value: boolean,
  delay: number = 300
): boolean {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
