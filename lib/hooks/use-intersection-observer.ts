'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    root = null,
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (isVisible) {
          setIsIntersecting(true);
          if (triggerOnce && !hasBeenVisible) {
            setHasBeenVisible(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, triggerOnce, hasBeenVisible]);

  return {
    targetRef,
    isIntersecting: triggerOnce ? hasBeenVisible || isIntersecting : isIntersecting,
    hasBeenVisible
  };
}

export function useIntersectionObserverList<T>(
  items: T[],
  options: UseIntersectionObserverOptions = {}
) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    observerRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, index]));
          }
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '100px',
          root: options.root || null
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [items.length, options.threshold, options.rootMargin, options.root]);

  const setRef = (index: number) => (element: HTMLElement | null) => {
    observerRefs.current[index] = element;
  };

  return {
    visibleItems,
    setRef,
    isVisible: (index: number) => visibleItems.has(index)
  };
}