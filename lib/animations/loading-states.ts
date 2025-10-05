/**
 * Loading States
 *
 * Elegant loading animations and skeleton states
 */

import type { Variants } from 'framer-motion';
import { EASING, DURATION, OPACITY } from './constants';

/**
 * Spinner animation (circular loading)
 */
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Pulse animation (subtle breathing)
 */
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: EASING.standard,
      repeat: Infinity,
    },
  },
};

/**
 * Dots loading (three dots)
 */
export const dotsVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -10, 0],
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: EASING.standard,
      repeat: Infinity,
    },
  }),
};

/**
 * Skeleton shimmer (loading placeholder)
 */
export const skeletonVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Progress bar animation
 */
export const progressBarVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: DURATION.complex,
      ease: EASING.standard,
    },
  },
};

/**
 * Indeterminate progress bar (unknown duration)
 */
export const indeterminateProgressVariants: Variants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Ripple loading (expanding circles)
 */
export const rippleLoadingVariants: Variants = {
  animate: {
    scale: [0, 2],
    opacity: [0.5, 0],
    transition: {
      duration: 1.5,
      ease: EASING.decelerate,
      repeat: Infinity,
    },
  },
};

/**
 * Wave animation (undulating motion)
 */
export const waveVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -15, 0],
    transition: {
      delay: i * 0.1,
      duration: 1.2,
      ease: EASING.standard,
      repeat: Infinity,
    },
  }),
};

/**
 * Bounce loading (bouncing balls)
 */
export const bounceLoadingVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -30, 0],
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: EASING.bounce,
      repeat: Infinity,
    },
  }),
};

/**
 * Fade in/out loading (pulsing opacity)
 */
export const fadeLoadingVariants: Variants = {
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1.5,
      ease: EASING.standard,
      repeat: Infinity,
    },
  },
};

/**
 * Circular progress (determinate)
 */
export const circularProgressVariants: Variants = {
  initial: {
    pathLength: 0,
  },
  animate: (progress: number) => ({
    pathLength: progress / 100,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  }),
};

/**
 * Circular spinner (indeterminate)
 */
export const circularSpinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Skeleton card (content placeholder)
 */
export const skeletonCardVariants: Variants = {
  initial: {
    opacity: OPACITY.subtle,
  },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      ease: EASING.standard,
      repeat: Infinity,
    },
  },
};

/**
 * Loading bar (top of page)
 */
export const loadingBarVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  loading: {
    scaleX: [0, 0.3, 0.7, 0.9],
    transition: {
      duration: 2,
      ease: EASING.decelerate,
      times: [0, 0.3, 0.7, 1],
    },
  },
  complete: {
    scaleX: 1,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Typing indicator (chat bubbles)
 */
export const typingIndicatorVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -8, 0],
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: EASING.standard,
      repeat: Infinity,
    },
  }),
};

/**
 * Heartbeat animation (pulsing)
 */
export const heartbeatVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1, 1.2, 1],
    transition: {
      duration: 1.5,
      ease: EASING.standard,
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

/**
 * Glitch effect (error states)
 */
export const glitchVariants: Variants = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.3,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

/**
 * Blur loading (focus transition)
 */
export const blurLoadingVariants: Variants = {
  initial: {
    filter: 'blur(8px)',
    opacity: OPACITY.subtle,
  },
  animate: {
    filter: 'blur(0px)',
    opacity: OPACITY.visible,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Scale pulse loading
 */
export const scalePulseVariants: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      ease: EASING.standard,
      repeat: Infinity,
    },
  },
};

/**
 * Accordion loading (sequential reveal)
 */
export const accordionLoadingVariants: Variants = {
  initial: {
    height: 0,
    opacity: OPACITY.hidden,
  },
  animate: (i: number) => ({
    height: 'auto',
    opacity: OPACITY.visible,
    transition: {
      delay: i * 0.1,
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  }),
};
