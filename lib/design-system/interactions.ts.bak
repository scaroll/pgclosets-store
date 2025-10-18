/**
 * PG CLOSETS PREMIUM INTERACTION DESIGN SYSTEM
 *
 * Sophisticated interaction patterns for luxury e-commerce
 * Brand alignment: "Elevated taste without pretense"
 *
 * Performance targets:
 * - 60fps animations on mid-range devices
 * - <16ms per frame
 * - <100ms interaction response time
 * - GPU-accelerated transforms only
 *
 * Accessibility:
 * - Respects prefers-reduced-motion
 * - Keyboard navigation support
 * - WCAG 2.1 AA compliance
 */

// ========================================
// INTERACTION STATE DEFINITIONS
// ========================================

export type InteractionState =
  | 'idle'
  | 'hover'
  | 'active'
  | 'focus'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled';

export interface InteractionStateConfig {
  state: InteractionState;
  transform?: string;
  opacity?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
  duration?: number;
  easing?: EasingFunction;
}

// ========================================
// CUSTOM EASING CURVES
// ========================================

export type EasingFunction =
  | 'gentle'      // Subtle, refined movements
  | 'confident'   // Assured, purposeful
  | 'playful'     // Light, engaging
  | 'elegant'     // Graceful, flowing
  | 'instant'     // Immediate feedback
  | 'premium';    // Luxurious, smooth

export const EASING_CURVES: Record<EasingFunction, string> = {
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',      // easeOutQuad
  confident: 'cubic-bezier(0.4, 0, 0.2, 1)',            // Material standard
  playful: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',   // easeOutBack
  elegant: 'cubic-bezier(0.645, 0.045, 0.355, 1)',     // easeInOutCubic
  instant: 'cubic-bezier(0, 0, 0, 1)',                 // Linear, no delay
  premium: 'cubic-bezier(0.23, 1, 0.32, 1)',           // easeOutQuint
};

// ========================================
// TIMING CONSTANTS (milliseconds)
// ========================================

export const TIMING = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 750,
  delightful: 1000,
} as const;

// ========================================
// ANIMATION PRESETS
// ========================================

export interface AnimationPreset {
  duration: number;
  easing: string;
  properties: string[];
  description: string;
}

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  // Button interactions
  buttonHover: {
    duration: TIMING.fast,
    easing: EASING_CURVES.gentle,
    properties: ['transform', 'box-shadow', 'color'],
    description: 'Subtle lift and glow on hover',
  },
  buttonPress: {
    duration: TIMING.instant,
    easing: EASING_CURVES.confident,
    properties: ['transform', 'opacity'],
    description: 'Immediate tactile feedback',
  },

  // Card interactions
  cardHover: {
    duration: TIMING.normal,
    easing: EASING_CURVES.elegant,
    properties: ['transform', 'box-shadow'],
    description: 'Elevated card with enhanced shadow',
  },
  cardPress: {
    duration: TIMING.fast,
    easing: EASING_CURVES.confident,
    properties: ['transform'],
    description: 'Subtle press-down effect',
  },

  // Navigation interactions
  navItemHover: {
    duration: TIMING.fast,
    easing: EASING_CURVES.gentle,
    properties: ['color', 'background-color'],
    description: 'Smooth color transition',
  },

  // Modal/Dialog interactions
  modalEnter: {
    duration: TIMING.slow,
    easing: EASING_CURVES.premium,
    properties: ['opacity', 'transform'],
    description: 'Graceful fade and scale-in',
  },
  modalExit: {
    duration: TIMING.normal,
    easing: EASING_CURVES.confident,
    properties: ['opacity', 'transform'],
    description: 'Quick fade-out',
  },

  // Scroll-triggered animations
  scrollReveal: {
    duration: TIMING.slower,
    easing: EASING_CURVES.premium,
    properties: ['opacity', 'transform'],
    description: 'Fade and slide-up reveal',
  },

  // Loading states
  loadingPulse: {
    duration: TIMING.delightful,
    easing: EASING_CURVES.gentle,
    properties: ['opacity'],
    description: 'Gentle breathing effect',
  },

  // Success animations
  successScale: {
    duration: TIMING.slow,
    easing: EASING_CURVES.playful,
    properties: ['transform', 'opacity'],
    description: 'Celebratory scale-in with bounce',
  },
};

// ========================================
// TRANSFORM UTILITIES
// ========================================

export const TRANSFORMS = {
  // Hover effects
  liftSmall: 'translateY(-2px)',
  liftMedium: 'translateY(-4px)',
  liftLarge: 'translateY(-8px)',

  // Scale effects
  scaleSmall: 'scale(1.02)',
  scaleMedium: 'scale(1.05)',
  scaleLarge: 'scale(1.1)',

  // Press effects
  pressLight: 'scale(0.98)',
  pressMedium: 'scale(0.95)',

  // Magnetic effects (for cursor-following)
  magneticNear: 'translate(var(--tx), var(--ty)) scale(1.05)',
  magneticClose: 'translate(calc(var(--tx) * 1.5), calc(var(--ty) * 1.5)) scale(1.08)',
} as const;

// ========================================
// SHADOW PRESETS (Copper accent #B87333)
// ========================================

export const SHADOWS = {
  none: 'none',
  subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
  soft: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
  medium: '0 8px 16px -2px rgba(0, 0, 0, 0.12)',
  lifted: '0 12px 24px -4px rgba(0, 0, 0, 0.15)',
  dramatic: '0 20px 40px -8px rgba(0, 0, 0, 0.20)',

  // Premium copper glow
  copperGlow: '0 4px 16px -2px rgba(184, 115, 51, 0.3)',
  copperGlowLarge: '0 8px 32px -4px rgba(184, 115, 51, 0.4)',

  // Interactive states
  hoverLift: '0 12px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 16px -2px rgba(184, 115, 51, 0.2)',
  activeShadow: '0 2px 8px -1px rgba(0, 0, 0, 0.12)',
} as const;

// ========================================
// INTERACTION PATTERNS
// ========================================

export interface InteractionPattern {
  name: string;
  states: Record<string, InteractionStateConfig>;
  transitions: string;
  willChange?: string;
}

export const INTERACTION_PATTERNS: Record<string, InteractionPattern> = {
  premiumButton: {
    name: 'Premium Button',
    states: {
      idle: {
        state: 'idle',
        transform: 'translateY(0) scale(1)',
        opacity: 1,
      },
      hover: {
        state: 'hover',
        transform: 'translateY(-2px) scale(1.02)',
        duration: TIMING.fast,
        easing: 'gentle',
      },
      active: {
        state: 'active',
        transform: 'translateY(0) scale(0.98)',
        duration: TIMING.instant,
        easing: 'confident',
      },
      focus: {
        state: 'focus',
        transform: 'translateY(0) scale(1)',
      },
    },
    transitions: 'transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 150ms ease',
    willChange: 'transform',
  },

  luxuryCard: {
    name: 'Luxury Card',
    states: {
      idle: {
        state: 'idle',
        transform: 'translateY(0) scale(1)',
        opacity: 1,
      },
      hover: {
        state: 'hover',
        transform: 'translateY(-4px) scale(1.02)',
        duration: TIMING.normal,
        easing: 'elegant',
      },
    },
    transitions: 'transform 250ms cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow 250ms ease',
    willChange: 'transform',
  },

  magneticCTA: {
    name: 'Magnetic Call-to-Action',
    states: {
      idle: {
        state: 'idle',
        transform: 'translate(0, 0) scale(1)',
      },
      hover: {
        state: 'hover',
        transform: 'translate(var(--tx), var(--ty)) scale(1.05)',
        duration: TIMING.fast,
        easing: 'confident',
      },
    },
    transitions: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  },

  scrollReveal: {
    name: 'Scroll Reveal',
    states: {
      idle: {
        state: 'idle',
        transform: 'translateY(40px)',
        opacity: 0,
      },
      hover: {
        state: 'hover',
        transform: 'translateY(0)',
        opacity: 1,
        duration: TIMING.slower,
        easing: 'premium',
      },
    },
    transitions: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1), opacity 500ms ease',
    willChange: 'transform, opacity',
  },
};

// ========================================
// ACCESSIBILITY UTILITIES
// ========================================

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets safe animation duration based on user preference
 */
export function getSafeDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Gets safe transform based on user preference
 */
export function getSafeTransform(transform: string): string {
  return prefersReducedMotion() ? 'none' : transform;
}

/**
 * Creates CSS class string with reduced motion support
 */
export function getInteractionClass(
  normalClass: string,
  reducedClass?: string
): string {
  return prefersReducedMotion() && reducedClass ? reducedClass : normalClass;
}

// ========================================
// HAPTIC FEEDBACK (Mobile)
// ========================================

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection';

/**
 * Triggers haptic feedback on supported devices
 */
export function triggerHaptic(style: HapticStyle = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  const patterns: Record<HapticStyle, number[]> = {
    light: [10],
    medium: [20],
    heavy: [30],
    selection: [5, 10],
  };

  navigator.vibrate(patterns[style]);
}

// ========================================
// PERFORMANCE UTILITIES
// ========================================

/**
 * Checks if device supports GPU acceleration
 */
export function supportsGPUAcceleration(): boolean {
  if (typeof document === 'undefined') return false;

  const el = document.createElement('div');
  const transforms = [
    'transform',
    'WebkitTransform',
    'MozTransform',
    'OTransform',
    'msTransform',
  ];

  return transforms.some(t => el.style[t as any] !== undefined);
}

/**
 * Optimizes animation for performance
 */
export function optimizeAnimation(element: HTMLElement): void {
  // Force hardware acceleration
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';

  // Add will-change for properties that will animate
  element.style.willChange = 'transform, opacity';
}

/**
 * Cleans up animation optimization
 */
export function cleanupAnimation(element: HTMLElement): void {
  element.style.willChange = 'auto';
}

// ========================================
// INTERSECTION OBSERVER UTILITIES
// ========================================

export interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Creates an Intersection Observer for scroll reveals
 */
export function createScrollRevealObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: ScrollRevealOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    once = true,
  } = options;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { threshold, rootMargin }
  );
}

// ========================================
// COPPER ACCENT COLOR
// ========================================

export const COPPER_ACCENT = '#B87333';
export const COPPER_VARIANTS = {
  50: '#FDF8F3',
  100: '#F9EFE5',
  200: '#F3DCC6',
  300: '#E5C4A0',
  400: '#D4A473',
  500: COPPER_ACCENT, // #B87333
  600: '#A35E28',
  700: '#8A4D1F',
  800: '#71401A',
  900: '#5E3517',
};

// ========================================
// EXPORTS
// ========================================

export default {
  EASING_CURVES,
  TIMING,
  ANIMATION_PRESETS,
  TRANSFORMS,
  SHADOWS,
  INTERACTION_PATTERNS,
  COPPER_ACCENT,
  COPPER_VARIANTS,
  prefersReducedMotion,
  getSafeDuration,
  getSafeTransform,
  getInteractionClass,
  triggerHaptic,
  supportsGPUAcceleration,
  optimizeAnimation,
  cleanupAnimation,
  createScrollRevealObserver,
};
