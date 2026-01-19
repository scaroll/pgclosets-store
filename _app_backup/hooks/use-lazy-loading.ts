import { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyLoading({
  threshold = 0.1,
  rootMargin = '100px'
}: UseLazyLoadingOptions = {}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true
  });

  useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  const reset = useCallback(() => {
    setShouldLoad(false);
  }, []);

  return {
    ref,
    shouldLoad,
    isIntersecting,
    reset
  };
}