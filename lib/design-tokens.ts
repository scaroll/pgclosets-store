/**
 * PG Closets Design System Tokens
 * Single source of truth for all design decisions
 * Apple-inspired premium aesthetic for Ottawa luxury market
 */

// ============================================
// COLORS
// ============================================

export const colors = {
  // Brand Colors - Primary
  brand: {
    black: '#0f1419',
    charcoal: '#1a1a1a',
    slate: '#2d3748',
    graphite: '#4a5568',
    silver: '#cbd5e0',
    pearl: '#f7fafc',
    white: '#ffffff',
    navy: '#243c74',
    sky: '#89bee6',
  },

  // Apple Gray Scale (for premium feel)
  gray: {
    50: '#ffffff',
    100: '#f5f5f7',
    200: '#e8e8ed',
    300: '#d2d2d7',
    400: '#b0b0b5',
    500: '#86868b',
    600: '#6e6e73',
    700: '#515154',
    800: '#424245',
    900: '#1d1d1f',
    950: '#000000',
  },

  // Material Palette (closet industry)
  materials: {
    woodgrain: {
      light: '#FAF8F6',
      DEFAULT: '#8B7355',
      dark: '#2F261C',
    },
    metal: {
      light: '#F8F8F8',
      DEFAULT: '#A8A8A8',
      dark: '#2B2B2B',
      roseGold: '#B76E79',
      bronze: '#CD7F32',
      champagne: '#F7E7CE',
    },
    premium: {
      cream: '#F5F1EA',
      linen: '#EAE4D8',
      marble: '#F8F8F8',
      onyx: '#1A1A1A',
      pearl: '#FFFEF7',
      obsidian: '#0A0A0A',
    },
  },

  // Semantic Colors
  semantic: {
    success: { light: '#E8F5E9', DEFAULT: '#388E3C', dark: '#0D3F17' },
    warning: { light: '#FFF8E1', DEFAULT: '#F57C00', dark: '#732900' },
    error: { light: '#FFEBEE', DEFAULT: '#C62828', dark: '#3E0D0D' },
    info: { light: '#E1F5FE', DEFAULT: '#0277BD', dark: '#003047' },
  },

  // Interactive States
  interactive: {
    link: '#243c74',
    linkHover: '#0f1419',
    focus: '#2563eb',
    disabled: '#94a3b8',
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font Families
  fonts: {
    display: 'var(--font-cormorant), Georgia, Times New Roman, serif',
    body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    sf: '-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },

  // Font Sizes (Apple-inspired scale)
  sizes: {
    // Mobile-first (scales up responsively)
    xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],          // 14px
    base: ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],            // 16px
    lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],          // 18px
    xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],     // 20px
    '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],   // 24px
    '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],     // 48px
    '6xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],    // 64px
  },

  // Font Weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeights: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  // 4px base scale (Apple-inspired)
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  60: '15rem',      // 240px

  // Semantic spacing
  xs: '0.5rem',     // 8px
  sm: '0.75rem',    // 12px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '5rem',    // 80px
  '5xl': '7.5rem',  // 120px
  '6xl': '10rem',   // 160px
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  // Apple-inspired subtle shadows
  xs: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
  md: '0 4px 10px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 40px 0 rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 24px 48px rgba(0, 0, 0, 0.15)',

  // Specialized shadows
  floating: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)',
  elevated: '0 30px 80px rgba(0, 0, 0, 0.12), 0 12px 30px rgba(0, 0, 0, 0.06)',
  modal: '0 50px 100px rgba(0, 0, 0, 0.25), 0 20px 50px rgba(0, 0, 0, 0.15)',
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: '0',
  sm: '0.375rem',   // 6px
  DEFAULT: '0.5rem', // 8px
  md: '0.625rem',   // 10px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

// ============================================
// ANIMATIONS
// ============================================

export const animations = {
  // Durations
  durations: {
    instant: '100ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Easings (Apple-style)
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    apple: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '430px',   // Mobile (iPhone 14 Pro)
  md: '744px',   // Tablet (iPad Mini)
  lg: '1068px',  // Desktop (MacBook Air)
  xl: '1440px',  // Large Desktop (iMac)
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
} as const;

// ============================================
// COMPONENT TOKENS
// ============================================

export const components = {
  // Button tokens
  button: {
    sizes: {
      sm: { height: '36px', padding: '0 16px', fontSize: '14px' },
      md: { height: '44px', padding: '0 24px', fontSize: '16px' },
      lg: { height: '52px', padding: '0 32px', fontSize: '18px' },
    },
    radius: radius.md,
    minTouchTarget: '44px', // WCAG accessibility
  },

  // Card tokens
  card: {
    padding: {
      sm: spacing.md,
      md: spacing.lg,
      lg: spacing.xl,
    },
    radius: radius.xl,
    shadow: shadows.md,
  },

  // Input tokens
  input: {
    height: '44px', // Prevent iOS zoom
    padding: '0 16px',
    fontSize: '16px', // Prevent iOS zoom
    radius: radius.md,
    borderWidth: '1px',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get color value by path
 * @example getColor('brand.navy') => '#243c74'
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = colors;

  for (const key of keys) {
    value = value[key];
    if (!value) return path; // Return original if not found
  }

  return typeof value === 'string' ? value : value.DEFAULT || path;
}

/**
 * Get spacing value
 * @example getSpacing('md') => '1rem'
 */
export function getSpacing(key: keyof typeof spacing): string {
  return spacing[key];
}

/**
 * Get shadow value
 * @example getShadow('md') => '0 4px 10px...'
 */
export function getShadow(key: keyof typeof shadows): string {
  return shadows[key];
}

/**
 * Generate responsive font size with clamp
 * @example getResponsiveFontSize('2xl', '3xl') => 'clamp(1.5rem, 2vw, 1.875rem)'
 */
export function getResponsiveFontSize(min: string, max: string): string {
  const minSize = typography.sizes[min as keyof typeof typography.sizes]?.[0] || min;
  const maxSize = typography.sizes[max as keyof typeof typography.sizes]?.[0] || max;
  return `clamp(${minSize}, 2vw + 1rem, ${maxSize})`;
}

// ============================================
// THEME CONFIGURATION
// ============================================

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  radius,
  animations,
  breakpoints,
  zIndex,
  components,
} as const;

export type Theme = typeof theme;
export type ColorPath = string;
export type SpacingKey = keyof typeof spacing;
export type ShadowKey = keyof typeof shadows;
export type RadiusKey = keyof typeof radius;
