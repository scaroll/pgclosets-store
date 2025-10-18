/**
 * Animation Utilities
 *
 * Helper functions for creating and composing animations
 */

import type { Variants, Transition } from 'framer-motion';
import { EASING, DURATION, STAGGER } from './constants';

/**
 * Create a fade animation variant
 */
export function fade(options?: {
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
}): Variants {
  const { from = 0, to = 1, duration = DURATION.normal, delay = 0 } = options || {};

  return {
    hidden: { opacity: from },
    visible: {
      opacity: to,
      transition: {
        duration,
        delay,
        ease: EASING.standard,
      },
    },
  };
}

/**
 * Create a slide animation variant
 */
export function slide(options?: {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
}): Variants {
  const {
    direction = 'up',
    distance = 20,
    duration = DURATION.normal,
    delay = 0,
  } = options || {};

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
    }
  };

  return {
    hidden: {
      opacity: 0,
      ...getTransform(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: EASING.decelerate,
      },
    },
  };
}

/**
 * Create a scale animation variant
 */
export function scale(options?: {
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
}): Variants {
  const { from = 0.95, to = 1, duration = DURATION.normal, delay = 0 } = options || {};

  return {
    hidden: {
      opacity: 0,
      scale: from,
    },
    visible: {
      opacity: 1,
      scale: to,
      transition: {
        duration,
        delay,
        ease: EASING.decelerate,
      },
    },
  };
}

/**
 * Create a stagger container variant
 */
export function staggerContainer(options?: {
  staggerChildren?: number;
  delayChildren?: number;
}): Variants {
  const { staggerChildren = STAGGER.standard, delayChildren = 0 } = options || {};

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

/**
 * Combine multiple animation variants
 */
export function combineVariants(...variants: Variants[]): Variants {
  return variants.reduce((combined, variant) => {
    return {
      hidden: { ...combined.hidden, ...variant.hidden },
      visible: { ...combined.visible, ...variant.visible },
    };
  }, {} as Variants);
}

/**
 * Create a custom transition
 */
export function createTransition(options?: {
  duration?: number;
  delay?: number;
  ease?: number[];
  type?: 'tween' | 'spring' | 'inertia';
  stiffness?: number;
  damping?: number;
}): Transition {
  const {
    duration = DURATION.normal,
    delay = 0,
    ease = EASING.standard,
    type = 'tween',
    stiffness,
    damping,
  } = options || {};

  if (type === 'spring') {
    return {
      type: 'spring',
      stiffness: stiffness || 200,
      damping: damping || 25,
      delay,
    };
  }

  return {
    type,
    duration,
    delay,
    ease,
  };
}

/**
 * Create a sequence of animations
 */
export function sequence(animations: Array<{ delay: number; variants: Variants }>): Variants {
  return animations.reduce((combined, { delay, variants }) => {
    const visibleVariant = typeof variants.visible === 'object' && variants.visible !== null
      ? variants.visible
      : {};
    const transition = 'transition' in visibleVariant ? visibleVariant.transition : {};

    return {
      hidden: { ...combined.hidden, ...variants.hidden },
      visible: {
        ...combined.visible,
        ...visibleVariant,
        transition: {
          ...(typeof transition === 'object' ? transition : {}),
          delay,
        },
      },
    };
  }, {} as Variants);
}

/**
 * Create a responsive animation based on viewport width
 */
export function responsiveVariant(options: {
  mobile: Variants;
  tablet?: Variants;
  desktop: Variants;
}): Variants {
  // This would need to be combined with useMediaQuery or similar
  // For now, returns desktop by default
  return options.desktop;
}

/**
 * Reduce motion for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply reduced motion variant
 */
export function withReducedMotion(variants: Variants): Variants {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
    };
  }
  return variants;
}
