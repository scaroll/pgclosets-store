/**
 * Enhanced Page Transitions
 *
 * Additional page transition variants for specific use cases
 */

import type { Variants } from 'framer-motion';
import { EASING, DURATION, OPACITY, TRANSFORM } from './constants';

/**
 * Slide and scale transition (iOS-style)
 */
export const slideScaleTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    x: TRANSFORM.elevated,
    scale: 0.95,
  },
  animate: {
    opacity: OPACITY.visible,
    x: 0,
    scale: 1,
    transition: {
      duration: DURATION.page,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    x: -TRANSFORM.elevated,
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Zoom transition (photo gallery style)
 */
export const zoomTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    scale: 0.8,
  },
  animate: {
    opacity: OPACITY.visible,
    scale: 1,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    scale: 1.1,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Blur and fade transition
 */
export const blurFadeTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: OPACITY.visible,
    filter: 'blur(0px)',
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    filter: 'blur(10px)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Reveal from center transition
 */
export const revealCenterTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    scale: 0,
    borderRadius: '50%',
  },
  animate: {
    opacity: OPACITY.visible,
    scale: 1,
    borderRadius: '0%',
    transition: {
      duration: DURATION.complex,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    scale: 0,
    borderRadius: '50%',
    transition: {
      duration: DURATION.normal,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Curtain transition (split reveal)
 */
export const curtainTransition = {
  left: {
    initial: { scaleX: 1, transformOrigin: 'left' },
    animate: {
      scaleX: 0,
      transition: {
        duration: DURATION.page,
        ease: EASING.decelerate,
      },
    },
    exit: {
      scaleX: 1,
      transition: {
        duration: DURATION.fast,
        ease: EASING.accelerate,
      },
    },
  },
  right: {
    initial: { scaleX: 1, transformOrigin: 'right' },
    animate: {
      scaleX: 0,
      transition: {
        duration: DURATION.page,
        ease: EASING.decelerate,
      },
    },
    exit: {
      scaleX: 1,
      transition: {
        duration: DURATION.fast,
        ease: EASING.accelerate,
      },
    },
  },
} as const;
