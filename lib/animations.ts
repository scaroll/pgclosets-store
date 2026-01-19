// PG Closets Animation Variants
// Motion 12.27+ configuration for Apple-inspired subtle animations

import type { Variants, Transition } from 'motion/react'

// Default easing curve (Apple-style)
export const easeOut = [0.25, 0.46, 0.45, 0.94] as const
export const easeInOut = [0.65, 0, 0.35, 1] as const

// Default transition
export const defaultTransition: Transition = {
  duration: 0.6,
  ease: easeOut,
}

// Fade in animation
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// Fade up animation (most common)
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
    },
  },
}

// Scale in animation
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
}

// Slide in from right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
}

// Stagger container for children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Stagger with longer delay
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// Hero text reveal (word by word)
export const textReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

// Image reveal with scale
export const imageReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 1.05,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeInOut,
    },
  },
}

// Viewport settings for scroll animations
export const viewportOnce = {
  once: true,
  margin: '-100px' as const,
}

export const viewportRepeat = {
  once: false,
  margin: '-50px' as const,
  amount: 0.3 as const,
}

// Parallax helper (for use with useScroll + useTransform)
export const parallaxRatio = {
  subtle: 0.1,
  medium: 0.2,
  strong: 0.3,
}

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: 0.3,
    ease: easeOut,
  },
}

export const hoverLift = {
  y: -4,
  transition: {
    duration: 0.3,
    ease: easeOut,
  },
}

// Button press animation
export const tapScale = {
  scale: 0.98,
}

// Nav link animation
export const navLink: Variants = {
  initial: {
    opacity: 0.6,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
}

// Product card animation
export const productCard: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
}

// Scroll indicator bounce
export const scrollIndicator: Variants = {
  initial: {
    y: 0,
    opacity: 0.6,
  },
  animate: {
    y: [0, 8, 0],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Page transition (for View Transitions fallback)
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}
