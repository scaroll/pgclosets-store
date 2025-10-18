/**
 * Scroll Animations
 *
 * Refined scroll-triggered animations with viewport detection
 */

import type { Variants } from 'framer-motion';
import { EASING, DURATION, OPACITY, TRANSFORM, VIEWPORT_MARGIN, STAGGER } from './constants';

/**
 * Viewport configuration for scroll animations
 */
export const defaultViewport = {
  once: true, // Animate only once when entering viewport
  margin: VIEWPORT_MARGIN.standard, // Start animation before element is visible
  amount: 0.3, // Trigger when 30% of element is visible
};

/**
 * Fade in on scroll (subtle entrance)
 */
export const fadeInScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
  },
  visible: {
    opacity: OPACITY.visible,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Slide up on scroll (elegant reveal)
 */
export const slideUpScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORM.elevated,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Slide down on scroll
 */
export const slideDownScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: -TRANSFORM.elevated,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Slide from left on scroll
 */
export const slideLeftScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    x: -TRANSFORM.dramatic,
  },
  visible: {
    opacity: OPACITY.visible,
    x: 0,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Slide from right on scroll
 */
export const slideRightScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    x: TRANSFORM.dramatic,
  },
  visible: {
    opacity: OPACITY.visible,
    x: 0,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Scale up on scroll (zoom in)
 */
export const scaleUpScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    scale: 0.9,
  },
  visible: {
    opacity: OPACITY.visible,
    scale: 1,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Blur to focus on scroll
 */
export const blurFocusScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: OPACITY.visible,
    filter: 'blur(0px)',
    transition: {
      duration: DURATION.complex,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Stagger children on scroll (list items)
 */
export const staggerChildrenScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
  },
  visible: {
    opacity: OPACITY.visible,
    transition: {
      staggerChildren: STAGGER.standard,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item (child of staggerChildrenScroll)
 */
export const staggerItemScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORM.standard,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Reveal on scroll (height expand)
 */
export const revealScroll: Variants = {
  hidden: {
    height: 0,
    opacity: OPACITY.hidden,
  },
  visible: {
    height: 'auto',
    opacity: OPACITY.visible,
    transition: {
      height: {
        duration: DURATION.smooth,
        ease: EASING.decelerate,
      },
      opacity: {
        duration: DURATION.normal,
        ease: EASING.standard,
      },
    },
  },
};

/**
 * Progress bar on scroll
 */
export const progressScroll: Variants = {
  hidden: {
    scaleX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: DURATION.complex,
      ease: EASING.standard,
    },
  },
};

/**
 * Rotate in on scroll
 */
export const rotateInScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    rotate: -10,
  },
  visible: {
    opacity: OPACITY.visible,
    rotate: 0,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Flip in on scroll (3D effect)
 */
export const flipInScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    rotateX: -90,
    transformPerspective: 1000,
  },
  visible: {
    opacity: OPACITY.visible,
    rotateX: 0,
    transition: {
      duration: DURATION.complex,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Parallax effect (slower scroll speed)
 * Note: Requires custom scroll tracking
 */
export const parallaxScroll: Variants = {
  hidden: {
    y: 0,
  },
  visible: {
    y: -50, // Adjust based on desired parallax intensity
    transition: {
      duration: 0,
    },
  },
};

/**
 * Card stack effect (sequential reveal)
 */
export const cardStackScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    scale: 0.9,
    y: TRANSFORM.elevated,
  },
  visible: (i: number) => ({
    opacity: OPACITY.visible,
    scale: 1,
    y: 0,
    transition: {
      delay: i * STAGGER.standard,
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  }),
};

/**
 * Split text animation (word by word)
 * Note: Requires text splitting implementation
 */
export const splitTextScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORM.standard,
  },
  visible: (i: number) => ({
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  }),
};

/**
 * Counter animation (numbers counting up)
 */
export const counterScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
  },
  visible: {
    opacity: OPACITY.visible,
    transition: {
      duration: DURATION.complex,
      ease: EASING.standard,
    },
  },
};

/**
 * Draw line animation (SVG path)
 */
export const drawLineScroll: Variants = {
  hidden: {
    pathLength: 0,
    opacity: OPACITY.hidden,
  },
  visible: {
    pathLength: 1,
    opacity: OPACITY.visible,
    transition: {
      pathLength: {
        duration: DURATION.complex,
        ease: EASING.standard,
      },
      opacity: {
        duration: DURATION.fast,
      },
    },
  },
};

/**
 * Masonry grid animation (Pinterest-style)
 */
export const masonryScroll: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    scale: 0.8,
  },
  visible: (i: number) => ({
    opacity: OPACITY.visible,
    scale: 1,
    transition: {
      delay: (i % 3) * STAGGER.subtle, // Stagger by column
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  }),
};
