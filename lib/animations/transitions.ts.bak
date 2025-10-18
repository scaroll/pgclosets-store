/**
 * Page Transitions
 *
 * Subtle, elegant page transition animations
 */

import type { Variants } from 'framer-motion';
import { EASING, DURATION, OPACITY, TRANSFORM } from './constants';

/**
 * Fade transition (subtle, refined)
 */
export const fadeTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
  },
  animate: {
    opacity: OPACITY.visible,
    transition: {
      duration: DURATION.page,
      ease: EASING.standard,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Slide up transition (elegant entrance)
 */
export const slideUpTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    y: TRANSFORM.standard,
  },
  animate: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATION.page,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    y: -TRANSFORM.subtle,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Slide down transition (gentle exit)
 */
export const slideDownTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    y: -TRANSFORM.standard,
  },
  animate: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATION.page,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    y: TRANSFORM.subtle,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Slide left transition (forward navigation)
 */
export const slideLeftTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    x: TRANSFORM.elevated,
  },
  animate: {
    opacity: OPACITY.visible,
    x: 0,
    transition: {
      duration: DURATION.page,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    x: -TRANSFORM.elevated,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Slide right transition (backward navigation)
 */
export const slideRightTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    x: -TRANSFORM.elevated,
  },
  animate: {
    opacity: OPACITY.visible,
    x: 0,
    transition: {
      duration: DURATION.page,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    x: TRANSFORM.elevated,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Scale transition (subtle zoom)
 */
export const scaleTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    scale: 0.98,
  },
  animate: {
    opacity: OPACITY.visible,
    scale: 1,
    transition: {
      duration: DURATION.page,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    scale: 0.98,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Crossfade transition (smooth blend)
 */
export const crossfadeTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
  },
  animate: {
    opacity: OPACITY.visible,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.standard,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.standard,
    },
  },
};

/**
 * Modal transition (centered scale + fade)
 */
export const modalTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
    scale: 0.95,
    y: TRANSFORM.standard,
  },
  animate: {
    opacity: OPACITY.visible,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Drawer transition (slide from edge)
 */
export const drawerTransition = {
  left: {
    initial: { x: '-100%' },
    animate: {
      x: 0,
      transition: { duration: DURATION.normal, ease: EASING.decelerate },
    },
    exit: {
      x: '-100%',
      transition: { duration: DURATION.fast, ease: EASING.accelerate },
    },
  },
  right: {
    initial: { x: '100%' },
    animate: {
      x: 0,
      transition: { duration: DURATION.normal, ease: EASING.decelerate },
    },
    exit: {
      x: '100%',
      transition: { duration: DURATION.fast, ease: EASING.accelerate },
    },
  },
  top: {
    initial: { y: '-100%' },
    animate: {
      y: 0,
      transition: { duration: DURATION.normal, ease: EASING.decelerate },
    },
    exit: {
      y: '-100%',
      transition: { duration: DURATION.fast, ease: EASING.accelerate },
    },
  },
  bottom: {
    initial: { y: '100%' },
    animate: {
      y: 0,
      transition: { duration: DURATION.normal, ease: EASING.decelerate },
    },
    exit: {
      y: '100%',
      transition: { duration: DURATION.fast, ease: EASING.accelerate },
    },
  },
} as const;

/**
 * Backdrop transition (overlay fade)
 */
export const backdropTransition: Variants = {
  initial: {
    opacity: OPACITY.hidden,
  },
  animate: {
    opacity: OPACITY.subtle,
    transition: {
      duration: DURATION.normal,
      ease: EASING.standard,
    },
  },
  exit: {
    opacity: OPACITY.hidden,
    transition: {
      duration: DURATION.fast,
      ease: EASING.standard,
    },
  },
};
