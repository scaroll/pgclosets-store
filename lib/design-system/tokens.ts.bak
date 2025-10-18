/**
 * PG Closets Design System Tokens
 * Inspired by Kit and Ace: Minimal, Elegant, Approachable
 *
 * Design Philosophy:
 * - Clean and minimal aesthetic
 * - Approachable, not pretentious
 * - Focus on content and usability
 * - Sophisticated simplicity
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colors = {
  // Primary Brand Colors
  brand: {
    navy: {
      DEFAULT: '#1e3a5f',
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#1e3a5f', // Primary Navy
      900: '#102a43',
    },
    sky: {
      DEFAULT: '#87CEEB',
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#87CEEB', // Primary Sky Blue
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },

  // Neutral Palette - Warm and approachable
  neutral: {
    white: 'var(--color-secondary)',
    offwhite: '#fafaf9',
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    black: '#0a0a0a',
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#065f46',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#92400e',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#1e40af',
    },
  },

  // Interactive States
  interactive: {
    primary: {
      DEFAULT: '#1e3a5f',
      hover: '#334e68',
      active: '#102a43',
      disabled: '#9fb3c8',
    },
    secondary: {
      DEFAULT: '#87CEEB',
      hover: '#38bdf8',
      active: '#0ea5e9',
      disabled: '#bae6fd',
    },
  },

  // Surface Colors
  surface: {
    primary: 'var(--color-secondary)',
    secondary: '#fafaf9',
    tertiary: '#f5f5f4',
    elevated: 'var(--color-secondary)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors - WCAG AA Compliant
  text: {
    primary: '#1c1917',      // 16.63:1 contrast ratio on white
    secondary: '#57534e',    // 7.42:1 contrast ratio on white
    tertiary: '#78716c',     // 4.76:1 contrast ratio on white
    inverse: 'var(--color-secondary)',
    disabled: '#a8a29e',
    link: '#1e3a5f',
    linkHover: '#334e68',
  },

  // Border Colors
  border: {
    light: '#e7e5e4',
    DEFAULT: '#d6d3d1',
    dark: '#a8a29e',
    focus: '#87CEEB',
  },
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Fira Code',
      'Droid Sans Mono',
      'monospace',
    ],
  },

  // Type Scale - Perfect Fourth (1.333)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],          // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],   // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],   // 36px
    '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.03em' }],      // 48px
    '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.04em' }],     // 60px
    '7xl': ['4.5rem', { lineHeight: '4.5rem', letterSpacing: '-0.04em' }],    // 72px
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING SYSTEM (4px base)
// ============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Subtle, elegant shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const components = {
  button: {
    sizes: {
      sm: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        height: '2rem',
      },
      md: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        height: '2.5rem',
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        height: '3rem',
      },
    },
    variants: {
      primary: {
        background: colors.interactive.primary.DEFAULT,
        color: colors.text.inverse,
        hover: colors.interactive.primary.hover,
        active: colors.interactive.primary.active,
      },
      secondary: {
        background: colors.interactive.secondary.DEFAULT,
        color: colors.text.primary,
        hover: colors.interactive.secondary.hover,
        active: colors.interactive.secondary.active,
      },
      outline: {
        background: 'transparent',
        color: colors.text.primary,
        border: colors.border.DEFAULT,
        hover: colors.surface.secondary,
      },
      ghost: {
        background: 'transparent',
        color: colors.text.primary,
        hover: colors.surface.secondary,
      },
    },
  },

  input: {
    sizes: {
      sm: {
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        height: '2rem',
      },
      md: {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        height: '2.5rem',
      },
      lg: {
        padding: '1rem 1.25rem',
        fontSize: '1.125rem',
        height: '3rem',
      },
    },
  },

  card: {
    padding: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8],
    },
    borderRadius: borderRadius.lg,
    shadow: shadows.md,
  },
} as const;

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const accessibility = {
  // Focus Ring
  focusRing: {
    width: '2px',
    color: colors.border.focus,
    offset: '2px',
  },

  // Minimum Touch Target
  minTouchTarget: '44px',

  // Contrast Ratios (WCAG AA Compliant)
  contrastRatios: {
    normalText: 4.5,
    largeText: 3,
    uiComponents: 3,
  },
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  components,
  accessibility,
} as const;

export type DesignTokens = typeof designTokens;

// Helper function to get color with opacity
export function withOpacity(color: string, opacity: number): string {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

// Helper function to get responsive value
export function responsive<T>(values: Partial<Record<keyof typeof breakpoints, T>>): string {
  return Object.entries(values)
    .map(([breakpoint, value]) => `${breakpoint}:${value}`)
    .join(' ');
}
