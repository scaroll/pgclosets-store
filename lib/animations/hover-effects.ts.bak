/**
 * Hover Effects
 *
 * Refined hover and interaction states with subtle motion
 */

import type { MotionProps } from 'framer-motion';
import { DURATION, EASING, SCALE, TRANSFORM } from './constants';

/**
 * Subtle lift effect (cards, buttons)
 */
export const liftHover: MotionProps = {
  whileHover: {
    y: -TRANSFORM.subtle,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
  whileTap: {
    y: 0,
    transition: {
      duration: DURATION.instant,
      ease: EASING.sharp,
    },
  },
};

/**
 * Scale up effect (icons, interactive elements)
 */
export const scaleHover: MotionProps = {
  whileHover: {
    scale: SCALE.standard,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
  whileTap: {
    scale: SCALE.minimal,
    transition: {
      duration: DURATION.instant,
      ease: EASING.sharp,
    },
  },
};

/**
 * Subtle scale effect (minimal feedback)
 */
export const subtleScaleHover: MotionProps = {
  whileHover: {
    scale: 1.02,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
  whileTap: {
    scale: SCALE.minimal,
    transition: {
      duration: DURATION.instant,
      ease: EASING.sharp,
    },
  },
};

/**
 * Glow effect (premium elements)
 */
export const glowHover: MotionProps = {
  whileHover: {
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: DURATION.normal,
      ease: EASING.standard,
    },
  },
};

/**
 * Slide right effect (links, CTAs)
 */
export const slideRightHover: MotionProps = {
  whileHover: {
    x: TRANSFORM.subtle,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Underline expand effect (text links)
 */
export const underlineHover: MotionProps = {
  initial: { scaleX: 0 },
  whileHover: {
    scaleX: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Brightness effect (images, media)
 */
export const brightnessHover: MotionProps = {
  whileHover: {
    filter: 'brightness(1.1)',
    transition: {
      duration: DURATION.normal,
      ease: EASING.standard,
    },
  },
};

/**
 * Blur effect (background elements)
 */
export const blurHover: MotionProps = {
  whileHover: {
    filter: 'blur(4px)',
    transition: {
      duration: DURATION.normal,
      ease: EASING.standard,
    },
  },
};

/**
 * Rotate effect (icons, playful elements)
 */
export const rotateHover: MotionProps = {
  whileHover: {
    rotate: 5,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Bounce effect (playful CTAs)
 */
export const bounceHover: MotionProps = {
  whileHover: {
    y: [0, -8, 0],
    transition: {
      duration: DURATION.complex,
      ease: EASING.bounce,
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

/**
 * Pulse effect (notifications, badges)
 */
export const pulseHover: MotionProps = {
  whileHover: {
    scale: [1, 1.05, 1],
    transition: {
      duration: DURATION.complex,
      ease: EASING.standard,
      repeat: Infinity,
      repeatDelay: 0.3,
    },
  },
};

/**
 * Shadow lift effect (elevated cards)
 */
export const shadowLiftHover: MotionProps = {
  whileHover: {
    y: -TRANSFORM.standard,
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
  whileTap: {
    y: -TRANSFORM.subtle,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: DURATION.instant,
      ease: EASING.sharp,
    },
  },
};

/**
 * Border glow effect (focused inputs)
 */
export const borderGlowHover: MotionProps = {
  whileHover: {
    borderColor: 'rgba(0, 0, 0, 0.3)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.standard,
    },
  },
  whileFocus: {
    borderColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.standard,
    },
  },
};

/**
 * Tilt effect (3D cards)
 */
export const tiltHover: MotionProps = {
  whileHover: {
    rotateX: 5,
    rotateY: 5,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Shimmer effect (loading states)
 */
export const shimmerHover: MotionProps = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Reveal effect (content on hover)
 */
export const revealHover: MotionProps = {
  initial: { height: 0, opacity: 0 },
  whileHover: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Magnetic effect (cursor following)
 * Note: Requires custom implementation with mouse position
 */
export function createMagneticHover(strength: number = 0.3): MotionProps {
  return {
    whileHover: {
      transition: {
        duration: DURATION.fast,
        ease: EASING.decelerate,
      },
    },
  };
}

/**
 * Ripple effect (material design)
 * Note: Requires custom implementation with click position
 */
export const rippleEffect: MotionProps = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: {
      duration: DURATION.complex,
      ease: EASING.decelerate,
    },
  },
};
