/**
 * Animation Constants
 *
 * Refined timing and easing curves for subtle, high-quality animations.
 * Inspired by Kit and Ace's attention to detail.
 */

/**
 * Easing Curves
 * Custom bezier curves for natural, refined motion
 */
export const EASING = {
  // Subtle, natural easing (default)
  standard: [0.4, 0.0, 0.2, 1],

  // Smooth deceleration (elements entering)
  decelerate: [0.0, 0.0, 0.2, 1],

  // Smooth acceleration (elements exiting)
  accelerate: [0.4, 0.0, 1, 1],

  // Sharp, precise (micro-interactions)
  sharp: [0.4, 0.0, 0.6, 1],

  // Elastic bounce (playful interactions)
  bounce: [0.68, -0.55, 0.265, 1.55],

  // Smooth spring (natural physics)
  spring: [0.34, 1.56, 0.64, 1],

  // Apple-specific easing curves
  applePhysics: {
    type: 'spring' as const,
    damping: 15,      // Apple standard: 15
    stiffness: 200,   // Apple standard: 200
    mass: 1           // Apple standard: 1
  },
  appleSpring: [0.25, 0.46, 0.45, 0.94] as const, // cubic-bezier(0.25, 0.46, 0.45, 0.94) - "ease-apple"
  appleSmooth: [0.16, 1, 0.3, 1] as const, // Apple's signature smooth ease
} as const;

/**
 * Duration Values (in seconds)
 * Subtle timing for refined animations
 */
export const DURATION = {
  // Instant feedback (micro-interactions)
  instant: 0.1,

  // Quick transitions (hover states)
  fast: 0.2,

  // Standard transitions (most UI elements)
  normal: 0.3,

  // Smooth transitions (page elements)
  smooth: 0.4,

  // Complex transitions (multi-step animations)
  complex: 0.6,

  // Page transitions
  page: 0.5,
} as const;

/**
 * Stagger Delays (in seconds)
 * For animating lists and groups
 */
export const STAGGER = {
  minimal: 0.03,
  subtle: 0.05,
  standard: 0.08,
  relaxed: 0.12,
} as const;

/**
 * Scale Values
 * Subtle scale changes for refined interactions
 */
export const SCALE = {
  minimal: 0.98,
  subtle: 0.95,
  standard: 1.05,
  elevated: 1.08,
} as const;

/**
 * Opacity Values
 */
export const OPACITY = {
  hidden: 0,
  subtle: 0.6,
  visible: 1,
} as const;

/**
 * Transform Values (in pixels)
 */
export const TRANSFORM = {
  subtle: 4,
  standard: 8,
  elevated: 16,
  dramatic: 32,
} as const;

/**
 * Spring Configurations
 * Physics-based animations for natural motion
 */
export const SPRING = {
  // Subtle, refined spring
  subtle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },

  // Bouncy, playful spring
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },

  // Smooth, natural spring
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
  },

  // Stiff, responsive spring
  stiff: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
} as const;

/**
 * Viewport Margin
 * For scroll-triggered animations
 */
export const VIEWPORT_MARGIN = {
  immediate: '0px',
  early: '-100px',
  standard: '-200px',
  late: '-300px',
} as const;
