/**
 * Micro-Interactions
 *
 * Subtle, delightful interactions inspired by Kit and Ace
 */

import type { MotionProps, Variants } from 'framer-motion';
import { DURATION, EASING, SCALE, TRANSFORM, SPRING } from './constants';

/**
 * Button press effect (satisfying feedback)
 */
export const buttonPressEffect: MotionProps = {
  whileTap: {
    scale: SCALE.minimal,
    transition: {
      duration: DURATION.instant,
      ease: EASING.sharp,
    },
  },
};

/**
 * Checkbox animation (smooth check)
 */
export const checkboxVariants: Variants = {
  unchecked: {
    pathLength: 0,
    opacity: 0,
  },
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: DURATION.normal,
        ease: EASING.decelerate,
      },
      opacity: {
        duration: DURATION.instant,
      },
    },
  },
};

/**
 * Toggle switch animation (sliding indicator)
 */
export const toggleSwitchVariants: Variants = {
  off: {
    x: 0,
    transition: SPRING.smooth,
  },
  on: {
    x: 20, // Adjust based on switch size
    transition: SPRING.smooth,
  },
};

/**
 * Radio button animation (scale + fade)
 */
export const radioButtonVariants: Variants = {
  unchecked: {
    scale: 0,
    opacity: 0,
  },
  checked: {
    scale: 1,
    opacity: 1,
    transition: SPRING.subtle,
  },
};

/**
 * Input focus animation (subtle glow)
 */
export const inputFocusVariants: Variants = {
  idle: {
    scale: 1,
    transition: {
      duration: DURATION.fast,
      ease: EASING.standard,
    },
  },
  focused: {
    scale: 1.01,
    transition: {
      duration: DURATION.fast,
      ease: EASING.standard,
    },
  },
};

/**
 * Tooltip animation (fade + slide)
 */
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    y: TRANSFORM.subtle,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Badge notification (pop in)
 */
export const badgeNotificationVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: SPRING.bouncy,
  },
};

/**
 * Dropdown menu animation (slide + fade)
 */
export const dropdownVariants: Variants = {
  closed: {
    opacity: 0,
    y: -TRANSFORM.standard,
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Accordion panel animation (height expand)
 */
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: DURATION.normal,
        ease: EASING.accelerate,
      },
      opacity: {
        duration: DURATION.fast,
        ease: EASING.standard,
      },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: DURATION.normal,
        ease: EASING.decelerate,
      },
      opacity: {
        duration: DURATION.fast,
        ease: EASING.standard,
        delay: 0.05,
      },
    },
  },
};

/**
 * Tab indicator animation (sliding underline)
 */
export const tabIndicatorVariants: Variants = {
  animate: {
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Toast notification (slide in from side)
 */
export const toastVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: DURATION.fast,
      ease: EASING.accelerate,
    },
  },
};

/**
 * Like/favorite animation (heart pop)
 */
export const likeAnimationVariants: Variants = {
  idle: {
    scale: 1,
  },
  liked: {
    scale: [1, 1.3, 1],
    transition: {
      duration: DURATION.normal,
      ease: EASING.bounce,
    },
  },
};

/**
 * Star rating animation (sequential fill)
 */
export const starRatingVariants: Variants = {
  empty: {
    scale: 1,
    fill: 'transparent',
  },
  filled: (i: number) => ({
    scale: [1, 1.2, 1],
    fill: 'currentColor',
    transition: {
      delay: i * 0.05,
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  }),
};

/**
 * Count badge animation (number change)
 */
export const countBadgeVariants: Variants = {
  initial: {
    scale: 1,
  },
  updated: {
    scale: [1, 1.3, 1],
    transition: {
      duration: DURATION.normal,
      ease: EASING.bounce,
    },
  },
};

/**
 * Card flip animation (3D flip)
 */
export const cardFlipVariants: Variants = {
  front: {
    rotateY: 0,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
  back: {
    rotateY: 180,
    transition: {
      duration: DURATION.smooth,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Slider thumb animation (drag feedback)
 */
export const sliderThumbVariants: Variants = {
  idle: {
    scale: 1,
  },
  dragging: {
    scale: 1.2,
    transition: SPRING.subtle,
  },
};

/**
 * Pagination indicator (active state)
 */
export const paginationDotVariants: Variants = {
  inactive: {
    scale: 0.8,
    opacity: 0.4,
    transition: {
      duration: DURATION.fast,
      ease: EASING.standard,
    },
  },
  active: {
    scale: 1,
    opacity: 1,
    transition: SPRING.subtle,
  },
};

/**
 * Drag handle animation (subtle pulse)
 */
export const dragHandleVariants: MotionProps = {
  whileHover: {
    scale: 1.05,
    transition: {
      duration: DURATION.fast,
      ease: EASING.decelerate,
    },
  },
  whileDrag: {
    scale: 1.1,
    cursor: 'grabbing',
    transition: {
      duration: DURATION.instant,
      ease: EASING.sharp,
    },
  },
};

/**
 * Collapse icon animation (rotate chevron)
 */
export const collapseIconVariants: Variants = {
  collapsed: {
    rotate: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
  expanded: {
    rotate: 180,
    transition: {
      duration: DURATION.normal,
      ease: EASING.decelerate,
    },
  },
};

/**
 * Menu icon animation (hamburger to X)
 */
export const menuIconVariants = {
  top: {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: 45,
      y: 8,
      transition: {
        duration: DURATION.normal,
        ease: EASING.decelerate,
      },
    },
  },
  middle: {
    closed: {
      opacity: 1,
    },
    open: {
      opacity: 0,
      transition: {
        duration: DURATION.instant,
      },
    },
  },
  bottom: {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: -45,
      y: -8,
      transition: {
        duration: DURATION.normal,
        ease: EASING.decelerate,
      },
    },
  },
} as const;

/**
 * Success checkmark animation (draw + scale)
 */
export const successCheckmarkVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    scale: 1,
    transition: {
      pathLength: {
        duration: DURATION.smooth,
        ease: EASING.decelerate,
      },
      scale: {
        duration: DURATION.normal,
        ease: EASING.bounce,
      },
      opacity: {
        duration: DURATION.instant,
      },
    },
  },
};

/**
 * Error shake animation (horizontal shake)
 */
export const errorShakeVariants: Variants = {
  initial: {
    x: 0,
  },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: DURATION.normal,
      ease: EASING.standard,
    },
  },
};

/**
 * Copy to clipboard animation (bounce confirmation)
 */
export const copyConfirmVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 1,
  },
  copied: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: DURATION.normal,
      ease: EASING.bounce,
    },
  },
};
