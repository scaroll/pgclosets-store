/**
 * Framer Motion Animation System
 * Professional, elevated animations with Apple design principles
 */

import type { Variants, Transition } from 'framer-motion'

// ============================================================================
// EASING CURVES
// ============================================================================

/**
 * Apple-style easing curves and physics-based springs
 */
export const EASING = {
  smooth: [0.4, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },

  // Apple's exact "ease-apple" physics-based curve
  appleSpring: [0.25, 0.46, 0.45, 0.94] as const,
  appleSmooth: [0.16, 1, 0.3, 1] as const,

  // Apple spring physics with exact specifications
  applePhysics: {
    type: 'spring' as const,
    damping: 15,
    stiffness: 200,
    mass: 1
  }
}

/**
 * ELEVATED EASING CURVES
 * More dramatic, luxurious motion beyond Apple's refined subtlety
 */
export const ELEVATED_EASING = {
  // Expo curves for dramatic reveals
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInExpo: [0.7, 0, 0.84, 0] as const,
  easeInOutExpo: [0.87, 0, 0.13, 1] as const,

  // Bounce for playful interactions
  easeOutBack: [0.68, -0.55, 0.265, 1.55] as const,

  // Custom luxury curves
  luxury: [0.25, 0.1, 0.25, 1] as const,
  dramatic: [0.22, 0.61, 0.36, 1] as const,

  // Spring physics (softer than Apple)
  softSpring: {
    type: 'spring' as const,
    damping: 12,
    stiffness: 180,
    mass: 1
  },

  // Bouncy spring for CTAs
  bouncySpring: {
    type: 'spring' as const,
    damping: 10,
    stiffness: 250,
    mass: 0.8
  }
} as const

// ============================================================================
// DURATION CONSTANTS
// ============================================================================

/**
 * Standard duration presets
 */
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
  slower: 0.7,

  // Apple-style durations (slow, intentional)
  apple: 0.4,
  appleSlow: 0.6,
  appleVerySlow: 0.8,
  appleHover: 0.2
} as const

/**
 * ELEVATED DURATIONS
 * Longer, more luxurious timing than Apple's standards
 */
export const ELEVATED_DURATION = {
  quick: 0.3,
  standard: 0.4,
  luxurious: 0.6,
  dramatic: 0.8,
  epic: 1.2,

  hover: 0.4,
  scrollReveal: 0.8
} as const

// ============================================================================
// STAGGER TIMING
// ============================================================================

/**
 * Apple stagger timing standards
 */
export const STAGGER = {
  fast: 0.05,
  base: 0.08,
  slow: 0.1
} as const

/**
 * ELEVATED STAGGER TIMING
 * More deliberate delays for sophisticated choreography
 */
export const ELEVATED_STAGGER = {
  tight: 0.08,
  standard: 0.1,
  deliberate: 0.15,
  dramatic: 0.2
} as const

// ============================================================================
// TRANSITION HELPERS
// ============================================================================

export const createTransition = (
  duration: keyof typeof DURATION = 'base',
  delay = 0
): Transition => ({
  duration: DURATION[duration],
  delay,
  ease: EASING.smooth
})

export const createAppleTransition = (
  duration: 'apple' | 'appleSlow' | 'appleVerySlow' = 'apple',
  delay = 0
): Transition => ({
  duration: DURATION[duration],
  delay,
  ease: EASING.appleSpring
})

// ============================================================================
// VIEWPORT CONFIGURATIONS
// ============================================================================

export const viewportConfig = {
  once: true,
  amount: 0.3,
  margin: '-50px'
}

export const viewportEagerConfig = {
  once: true,
  amount: 0.1,
  margin: '-100px'
}

export const appleViewportConfig = {
  once: true,
  amount: 0.2,
  margin: '-10%'
}

export const elevatedViewportConfig = {
  once: true,
  amount: 0.2,
  margin: '-15%'
}

// ============================================================================
// BASIC FADE ANIMATIONS
// ============================================================================

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: createTransition('base')
  },
  exit: {
    opacity: 0,
    transition: createTransition('fast')
  }
}

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition('base')
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: createTransition('fast')
  }
}

export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition('base')
  }
}

export const fadeLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: createTransition('base')
  }
}

export const fadeRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: createTransition('base')
  }
}

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: createTransition('base')
  }
}

export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: createTransition('fast')
  },
  tap: {
    scale: 0.98,
    transition: createTransition('fast')
  }
}

export const hoverScaleProminentVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: createTransition('fast')
  },
  tap: {
    scale: 0.95,
    transition: createTransition('fast')
  }
}

// ============================================================================
// LIFT ANIMATIONS
// ============================================================================

export const liftVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -4,
    transition: createTransition('fast')
  }
}

export const liftProminentVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: createTransition('base')
  }
}

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

export const staggerFastContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
}

export const staggerSlowContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition('base')
  }
}

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: createTransition('base')
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: createTransition('fast')
  }
}

export const slideRightVariants: Variants = {
  initial: {
    opacity: 0,
    x: 50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: createTransition('base')
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: createTransition('fast')
  }
}

export const slideLeftVariants: Variants = {
  initial: {
    opacity: 0,
    x: -50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: createTransition('base')
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: createTransition('fast')
  }
}

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

export const scrollRevealVariants = {
  variants: fadeUpVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: viewportConfig
}

export const scrollScaleVariants = {
  variants: scaleVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: viewportConfig
}

// ============================================================================
// APPLE-STYLE ANIMATIONS
// ============================================================================

export const appleFadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createAppleTransition('apple')
  }
}

export const appleScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: createAppleTransition('appleSlow')
  }
}

export const appleHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: DURATION.fast,
      ease: EASING.appleSmooth
    }
  }
}

export const appleStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.base,
      delayChildren: 0.1
    }
  }
}

export const appleStaggerFastContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.fast,
      delayChildren: 0.05
    }
  }
}

export const appleStaggerSlowContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.slow,
      delayChildren: 0.15
    }
  }
}

export const appleStaggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createAppleTransition('apple')
  }
}

export const appleScrollReveal = {
  variants: appleFadeUpVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: appleViewportConfig
}

export const appleCardPreset = {
  variants: appleScaleVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: appleViewportConfig,
  whileHover: 'hover' as const,
  hoverVariants: appleHoverVariants
}

export const appleButtonPreset = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.95 },
  transition: {
    duration: DURATION.appleHover,
    ease: EASING.appleSpring
  }
}

export const appleLinkPreset = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
  transition: {
    duration: DURATION.appleHover,
    ease: EASING.appleSpring
  }
}

export const createAppleStagger = (
  itemCount: number,
  baseDelay = 0.1,
  staggerDelay: keyof typeof STAGGER = 'base'
) => {
  return Array.from({ length: itemCount }, (_, i) => ({
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: baseDelay + i * STAGGER[staggerDelay],
        duration: DURATION.apple,
        ease: EASING.appleSpring
      }
    }
  }))
}

// ============================================================================
// ELEVATED ANIMATION SYSTEM - BEYOND APPLE PHYSICS
// ============================================================================

/**
 * ELEVATED PAGE LOAD CHOREOGRAPHY
 * Staggered entrance with dramatic reveals
 */
export const elevatedPageLoadVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.90,
    rotate: -3
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      duration: ELEVATED_DURATION.dramatic,
      ease: ELEVATED_EASING.easeOutExpo,
      staggerChildren: ELEVATED_STAGGER.standard,
      delayChildren: 0.1
    }
  }
}

/**
 * SCROLL-TRIGGERED FADE-IN
 * Reveals elements earlier with blur-to-focus effect
 */
export const elevatedScrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: ELEVATED_DURATION.scrollReveal,
      ease: ELEVATED_EASING.easeOutExpo
    }
  }
}

/**
 * ELEVATED HOVER INTERACTIONS
 * More pronounced hover effects than Apple's subtle 1.02 scale
 */
export const elevatedHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.03,
    y: -8,
    transition: {
      duration: ELEVATED_DURATION.hover,
      ease: ELEVATED_EASING.softSpring.type === 'spring'
        ? ELEVATED_EASING.softSpring
        : ELEVATED_EASING.luxury
    }
  },
  tap: {
    scale: 0.93,
    transition: {
      duration: 0.15,
      ease: ELEVATED_EASING.easeInExpo
    }
  }
}

/**
 * ELEVATED BUTTON PRESET
 * Magnetic cursor effect with enhanced feedback
 */
export const elevatedButtonPreset = {
  whileHover: {
    scale: 1.03,
    y: -4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
  },
  whileTap: {
    scale: 0.93,
    y: 0
  },
  transition: {
    duration: ELEVATED_DURATION.hover,
    ease: ELEVATED_EASING.luxury
  }
}

/**
 * ELEVATED CARD ANIMATION
 * Combines scale, lift, and subtle rotation
 */
export const elevatedCardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.90,
    y: 40,
    rotateX: 8
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: ELEVATED_DURATION.luxurious,
      ease: ELEVATED_EASING.easeOutExpo
    }
  },
  hover: {
    scale: 1.02,
    y: -12,
    rotateY: 2,
    transition: {
      duration: ELEVATED_DURATION.hover,
      ease: ELEVATED_EASING.softSpring
    }
  }
}

/**
 * PAGE TRANSITION CHOREOGRAPHY
 * Smooth cross-fade with slight scale
 */
export const elevatedPageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(8px)'
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: ELEVATED_EASING.easeOutExpo
    }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(8px)',
    transition: {
      duration: 0.4,
      ease: ELEVATED_EASING.easeInExpo
    }
  }
}

/**
 * MODAL ENTRANCE
 * Spring entrance with blur-in effect
 */
export const elevatedModalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 50,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: ELEVATED_EASING.easeOutBack
    }
  }
}

/**
 * TAB SWITCHING ANIMATION
 * Horizontal slide with fade
 */
export const elevatedTabVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: ELEVATED_EASING.easeOutExpo
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: ELEVATED_EASING.easeInExpo
    }
  })
}

/**
 * ACCORDION ANIMATION
 * Height with ease-out
 */
export const elevatedAccordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.5,
        ease: ELEVATED_EASING.easeInExpo
      },
      opacity: {
        duration: 0.3,
        ease: ELEVATED_EASING.easeInExpo
      }
    }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.5,
        ease: ELEVATED_EASING.easeOutExpo
      },
      opacity: {
        duration: 0.4,
        ease: ELEVATED_EASING.easeOutExpo,
        delay: 0.1
      }
    }
  }
}

/**
 * FLOATING ANIMATION
 * Gentle vertical oscillation for hero elements
 */
export const elevatedFloatingVariants: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: ELEVATED_EASING.luxury,
      repeatType: 'loop' as const
    }
  }
}

/**
 * TEXT REVEAL ANIMATION
 * Character-by-character reveal
 */
export const elevatedTextRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1
    }
  }
}

export const elevatedTextRevealChar: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: 90
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.3,
      ease: ELEVATED_EASING.easeOutExpo
    }
  }
}

/**
 * GRADIENT ANIMATION PRESET
 * Rotating hue for cards and backgrounds
 */
export const elevatedGradientAnimation = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      ease: 'linear' as const,
      repeat: Infinity
    }
  }
}

/**
 * RIPPLE EFFECT PRESET
 * For button clicks
 */
export const elevatedRippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0.5
  },
  animate: {
    scale: 2,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: ELEVATED_EASING.easeOutExpo
    }
  }
}

/**
 * ELEVATED STAGGER CONTAINER
 * More deliberate stagger than Apple
 */
export const elevatedStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ELEVATED_STAGGER.standard,
      delayChildren: 0.15
    }
  }
}

/**
 * ELEVATED STAGGER ITEM
 * Pairs with elevated stagger container
 */
export const elevatedStaggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ELEVATED_DURATION.scrollReveal,
      ease: ELEVATED_EASING.easeOutExpo
    }
  }
}

// ============================================================================
// COMBINED ANIMATION PRESETS
// ============================================================================

export const cardAnimationPreset = {
  variants: fadeUpVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: viewportConfig,
  whileHover: { y: -4 },
  transition: createTransition('fast')
}

export const buttonAnimationPreset = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: createTransition('fast')
}

export const iconButtonAnimationPreset = {
  whileHover: { scale: 1.1, rotate: 5 },
  whileTap: { scale: 0.9 },
  transition: createTransition('fast')
}

export const imageAnimationPreset = {
  variants: {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: createTransition('slow')
    }
  },
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: viewportConfig
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const createStaggeredAnimation = (
  items: number,
  baseDelay = 0,
  staggerDelay = 0.1
) => {
  return Array.from({ length: items }, (_, i) => ({
    opacity: 0,
    y: 20,
    transition: {
      delay: baseDelay + i * staggerDelay,
      duration: DURATION.base,
      ease: EASING.smooth
    }
  }))
}

export const respectMotionPreference = (animation: Variants): Variants => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } }
    }
  }
  return animation
}

export const createMagneticEffect = (
  mouseX: number,
  mouseY: number,
  elementX: number,
  elementY: number,
  strength = 0.3
) => {
  const deltaX = mouseX - elementX
  const deltaY = mouseY - elementY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  if (distance < 100) {
    return {
      x: deltaX * strength,
      y: deltaY * strength,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    }
  }

  return { x: 0, y: 0 }
}
