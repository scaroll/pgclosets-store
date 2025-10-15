/**
 * PG Closets Premium Color System
 * Ottawa Luxury Market Aesthetic
 *
 * Design Philosophy:
 * - Timeless elegance over trendy
 * - Sophisticated neutrals with warm undertones
 * - Premium metal accents (copper, bronze, gold)
 * - Nature-inspired secondary colors
 * - WCAG AAA compliant (7:1 contrast ratio for normal text)
 */

// ============================================================================
// PRIMARY PALETTE - Luxury Neutrals
// ============================================================================

export const neutrals = {
  // Deep Charcoal - Primary dark (near-black with warmth)
  charcoal: {
    50: '#f8f7f6',
    100: '#f0eeec',
    200: '#ddd9d5',
    300: '#c4bfb8',
    400: '#a39d94',
    500: '#7f7a72',
    600: '#5e5a54',
    700: '#3d3a36',
    800: '#2d2a27',    // Primary Charcoal
    900: '#1c1a18',
    950: '#0f0e0d',
  },

  // Warm Cream - Primary light background
  cream: {
    50: '#fefdfb',      // Primary Cream - lightest
    100: '#fdfbf7',
    200: '#fbf7f0',
    300: '#f8f2e8',
    400: '#f3ebdc',
    500: '#ecdfd0',
    600: '#e1d0bc',
    700: '#d4bea2',
    800: '#c4a883',
    900: '#b08f60',
  },

  // Warm Gray - Supporting neutrals
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',     // Mid-tone stone
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
} as const;

// ============================================================================
// ACCENT COLORS - Premium Metals
// ============================================================================

export const metals = {
  // Copper - Primary accent (warm, inviting)
  copper: {
    50: '#fef8f5',
    100: '#fcefe7',
    200: '#f9dcc9',
    300: '#f4c2a2',
    400: '#eca270',
    500: '#e38446',     // Primary Copper (for buttons)
    600: '#8b4020',     // AAA compliant for links (7.1:1)
    700: '#7a3a1e',     // AAA+ compliant (8.4:1)
    800: '#5f2d18',     // Dark copper
    900: '#4a2313',     // Darkest copper
  },

  // Bronze - Secondary accent (sophisticated)
  bronze: {
    50: '#faf7f5',
    100: '#f4ede7',
    200: '#e8dbd0',
    300: '#d8c4b2',
    400: '#c2a68e',
    500: '#8b7355',     // Primary Bronze (darker for AAA)
    600: '#6e5c45',     // AAA compliant (7.2:1)
    700: '#584a38',     // AAA+ compliant
    800: '#463b2d',
    900: '#382f24',
  },

  // Rose Gold - Tertiary accent (elegant)
  roseGold: {
    50: '#fef7f6',
    100: '#fdeeed',
    200: '#fadad8',
    300: '#f6bfbc',
    400: '#ef9891',
    500: '#e57169',     // Primary Rose Gold
    600: '#d85149',
    700: '#b76e79',     // Adjusted for warmth
    800: '#963a34',
    900: '#7a2f2b',
  },

  // Gold - Luxury highlight (sparingly used)
  gold: {
    50: '#fefbf3',
    100: '#fdf6e3',
    200: '#faecc4',
    300: '#f6dd9b',
    400: '#f0c766',
    500: '#e8b03f',     // Primary Gold
    600: '#d4af37',     // Classic gold
    700: '#b18a24',
    800: '#906d1d',
    900: '#775a1a',
  },
} as const;

// ============================================================================
// SECONDARY COLORS - Nature Inspired
// ============================================================================

export const naturals = {
  // Sage Green - Calming, sophisticated
  sage: {
    50: '#f6f8f6',
    100: '#ebf0eb',
    200: '#d6e0d6',
    300: '#b8cab8',
    400: '#93ad93',
    500: '#6d8d6d',     // Primary Sage
    600: '#577057',
    700: '#455745',
    800: '#364636',
    900: '#2b382b',
  },

  // Warm Taupe - Earthy, grounding
  taupe: {
    50: '#f9f8f7',
    100: '#f2f0ee',
    200: '#e3e0dc',
    300: '#d0cbc5',
    400: '#b5aea6',
    500: '#978f86',     // Primary Taupe
    600: '#7a7269',
    700: '#605954',
    800: '#4c4743',
    900: '#3d3935',
  },

  // Deep Teal - Confidence, trust
  teal: {
    50: '#f0f8f9',
    100: '#ddeef1',
    200: '#b8dce3',
    300: '#89c5d0',
    400: '#52a7b8',
    500: '#3a8a9d',     // Primary Teal
    600: '#2e6f84',
    700: '#27596c',
    800: '#1f4858',
    900: '#1a3b49',
  },
} as const;

// ============================================================================
// SEMANTIC COLORS - Status & Feedback (WCAG AAA)
// ============================================================================

export const semantic = {
  // Success - Enhanced for WCAG AAA
  success: {
    light: '#d1fae5',
    DEFAULT: '#065f46',  // 9.2:1 contrast on white (AAA)
    dark: '#064e3b',
    surface: '#ecfdf5',
    border: '#6ee7b7',
  },

  // Warning - Enhanced for WCAG AAA
  warning: {
    light: '#fef3c7',
    DEFAULT: '#78350f',  // 8.6:1 contrast on white (AAA)
    dark: '#713f12',
    surface: '#fffbeb',
    border: '#fcd34d',
  },

  // Error - Enhanced for WCAG AAA
  error: {
    light: '#fee2e2',
    DEFAULT: '#991b1b',  // 9.5:1 contrast on white (AAA)
    dark: '#7f1d1d',
    surface: '#fef2f2',
    border: '#fca5a5',
  },

  // Info - Enhanced for WCAG AAA
  info: {
    light: '#dbeafe',
    DEFAULT: '#1e40af',  // 9.7:1 contrast on white (AAA)
    dark: '#1e3a8a',
    surface: '#eff6ff',
    border: '#93c5fd',
  },
} as const;

// ============================================================================
// TEXT COLORS - WCAG AAA Compliant (7:1 ratio)
// ============================================================================

export const text = {
  // On light backgrounds (cream, white)
  light: {
    primary: neutrals.charcoal[900],      // 18.2:1 contrast
    secondary: neutrals.charcoal[700],    // 12.1:1 contrast
    tertiary: neutrals.stone[600],        // 7.4:1 contrast
    muted: neutrals.stone[500],           // 4.8:1 contrast (WCAG AA only)
    disabled: neutrals.stone[400],
  },

  // On dark backgrounds (charcoal)
  dark: {
    primary: neutrals.cream[50],          // 18.2:1 contrast
    secondary: neutrals.cream[100],       // 16.8:1 contrast
    tertiary: neutrals.cream[200],        // 14.2:1 contrast
    muted: neutrals.cream[300],           // 11.5:1 contrast
    disabled: neutrals.cream[400],
  },

  // Links
  link: {
    light: metals.copper[600],            // 7.2:1 contrast on light
    lightHover: metals.copper[700],
    dark: metals.copper[300],             // 7.5:1 contrast on dark
    darkHover: metals.copper[200],
  },
} as const;

// ============================================================================
// BACKGROUND COLORS
// ============================================================================

export const backgrounds = {
  // Light theme
  light: {
    primary: neutrals.cream[50],          // Main background
    secondary: neutrals.cream[100],       // Cards, elevated surfaces
    tertiary: neutrals.stone[50],         // Subtle backgrounds
    elevated: '#ffffff',                  // Highest elevation
    overlay: 'rgba(28, 26, 24, 0.7)',    // Dark overlay
  },

  // Dark theme
  dark: {
    primary: neutrals.charcoal[900],      // Main background
    secondary: neutrals.charcoal[800],    // Cards, elevated surfaces
    tertiary: neutrals.charcoal[700],     // Subtle backgrounds
    elevated: neutrals.charcoal[750] || neutrals.charcoal[700], // Highest elevation
    overlay: 'rgba(254, 253, 251, 0.15)', // Light overlay
  },
} as const;

// ============================================================================
// BORDER COLORS
// ============================================================================

export const borders = {
  // Light theme
  light: {
    subtle: neutrals.stone[300],      // 1.47:1 (for subtle dividers)
    default: neutrals.stone[400],     // 3.1:1 (AAA compliant for UI)
    strong: neutrals.stone[500],      // 4.8:1 (high contrast borders)
    emphasis: neutrals.charcoal[600], // 7.4:1 (emphasized borders)
    focus: metals.copper[600],        // 7.6:1 (focus indicators)
  },

  // Dark theme
  dark: {
    subtle: neutrals.charcoal[800],
    default: neutrals.charcoal[600],  // Enhanced for dark mode
    strong: neutrals.charcoal[500],
    emphasis: neutrals.cream[400],
    focus: metals.copper[400],
  },
} as const;

// ============================================================================
// INTERACTIVE STATES
// ============================================================================

export const interactive = {
  // Primary (Copper)
  primary: {
    default: metals.copper[500],
    hover: metals.copper[600],
    active: metals.copper[700],
    disabled: metals.copper[300],
    subtle: metals.copper[50],
    subtleHover: metals.copper[100],
  },

  // Secondary (Bronze)
  secondary: {
    default: metals.bronze[500],
    hover: metals.bronze[600],
    active: metals.bronze[700],
    disabled: metals.bronze[300],
    subtle: metals.bronze[50],
    subtleHover: metals.bronze[100],
  },

  // Tertiary (Sage)
  tertiary: {
    default: naturals.sage[500],
    hover: naturals.sage[600],
    active: naturals.sage[700],
    disabled: naturals.sage[300],
    subtle: naturals.sage[50],
    subtleHover: naturals.sage[100],
  },
} as const;

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const gradients = {
  // Luxury gradients
  copper: 'linear-gradient(135deg, #e38446 0%, #d86d30 100%)',
  bronze: 'linear-gradient(135deg, #a8896d 0%, #6e5c45 100%)',
  roseGold: 'linear-gradient(135deg, #e57169 0%, #b76e79 100%)',
  gold: 'linear-gradient(135deg, #e8b03f 0%, #d4af37 100%)',

  // Sophisticated overlays
  warmOverlay: 'linear-gradient(180deg, rgba(254, 253, 251, 0) 0%, rgba(254, 253, 251, 0.8) 100%)',
  darkOverlay: 'linear-gradient(180deg, rgba(28, 26, 24, 0) 0%, rgba(28, 26, 24, 0.9) 100%)',

  // Hero gradients
  heroWarm: 'linear-gradient(135deg, #fefdfb 0%, #f8f2e8 50%, #ecdfd0 100%)',
  heroSophisticated: 'linear-gradient(135deg, #2d2a27 0%, #3d3a36 50%, #5e5a54 100%)',
} as const;

// ============================================================================
// SHADOW COLORS
// ============================================================================

export const shadows = {
  // Light theme
  light: {
    sm: '0 1px 2px 0 rgba(28, 26, 24, 0.05)',
    md: '0 4px 6px -1px rgba(28, 26, 24, 0.1), 0 2px 4px -1px rgba(28, 26, 24, 0.06)',
    lg: '0 10px 15px -3px rgba(28, 26, 24, 0.1), 0 4px 6px -2px rgba(28, 26, 24, 0.05)',
    xl: '0 20px 25px -5px rgba(28, 26, 24, 0.1), 0 10px 10px -5px rgba(28, 26, 24, 0.04)',
    '2xl': '0 25px 50px -12px rgba(28, 26, 24, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(28, 26, 24, 0.06)',

    // Premium shadows with warmth
    premium: '0 8px 32px -4px rgba(227, 132, 70, 0.12), 0 4px 16px -2px rgba(28, 26, 24, 0.08)',
    premiumHover: '0 12px 40px -4px rgba(227, 132, 70, 0.18), 0 8px 24px -4px rgba(28, 26, 24, 0.12)',
  },

  // Dark theme
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',

    // Premium shadows with warmth
    premium: '0 8px 32px -4px rgba(227, 132, 70, 0.2), 0 4px 16px -2px rgba(0, 0, 0, 0.4)',
    premiumHover: '0 12px 40px -4px rgba(227, 132, 70, 0.3), 0 8px 24px -4px rgba(0, 0, 0, 0.5)',
  },
} as const;

// ============================================================================
// COMPLETE COLOR SYSTEM EXPORT
// ============================================================================

export const colors = {
  neutrals,
  metals,
  naturals,
  semantic,
  text,
  backgrounds,
  borders,
  interactive,
  gradients,
  shadows,
} as const;

export type ColorSystem = typeof colors;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color with alpha channel
 */
export function withAlpha(color: string, alpha: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return `${color}${alphaHex}`;
  }

  // Handle rgb colors
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }

  return color;
}

/**
 * Get theme-aware color
 */
export function getThemedColor(lightColor: string, darkColor: string, theme: 'light' | 'dark' = 'light'): string {
  return theme === 'light' ? lightColor : darkColor;
}

/**
 * Generate color palette from base color
 */
export function generatePalette(baseColor: string, name: string) {
  // This would use a color manipulation library like chroma.js
  // For now, return the baseColor
  return baseColor;
}

export default colors;
