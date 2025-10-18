/**
 * PG Closets Design System
 * Central export point for all design tokens and utilities
 */

// Export all design tokens
export {
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
  designTokens,
  withOpacity,
  responsive,
  type DesignTokens,
} from './tokens';

// Export Apple Design System
export {
  appleDesignSystem,
  appleTypography,
  appleColors,
  appleSpacing,
  appleBorderRadius,
  appleShadows,
  appleBlur,
  appleTransitions,
  appleBreakpoints,
  appleZIndex,
  appleComponents,
  getResponsiveFontSize,
  hexToRgba,
  getElevation,
  getSpacing,
  type AppleDesignSystem,
  type AppleTypography,
  type AppleColors,
  type AppleSpacing,
  type AppleBorderRadius,
  type AppleShadows,
  type AppleBlur,
  type AppleTransitions,
  type AppleBreakpoints,
  type AppleZIndex,
  type AppleComponents,
} from './apple-tokens';

// Re-export specific token groups for convenience
export { colors as Colors } from './tokens';
export { typography as Typography } from './tokens';
export { spacing as Spacing } from './tokens';
export { borderRadius as BorderRadius } from './tokens';
export { shadows as Shadows } from './tokens';

/**
 * Design System Version
 */
export const DESIGN_SYSTEM_VERSION = '1.0.0';

/**
 * Brand Colors Quick Access
 */
export const brandColors = {
  navy: '#1e3a5f',
  skyBlue: '#87CEEB',
} as const;

/**
 * Common Component Configurations
 */
export const componentConfig = {
  button: {
    minHeight: '44px',
    borderRadius: '0.5rem',
    paddingX: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    paddingY: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
    },
  },
  input: {
    minHeight: '44px',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    focusRingWidth: '2px',
    focusRingOffset: '2px',
  },
  card: {
    borderRadius: '0.5rem',
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },
} as const;

/**
 * Utility function to create className strings with design tokens
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility to get responsive spacing value
 */
export function getResponsiveSpacing(
  mobile: keyof typeof spacing,
  tablet?: keyof typeof spacing,
  desktop?: keyof typeof spacing
): string {
  const values = [
    spacing[mobile],
    tablet && `md:${spacing[tablet]}`,
    desktop && `lg:${spacing[desktop]}`,
  ];
  return values.filter(Boolean).join(' ');
}

/**
 * Typography preset classes
 */
export const typographyPresets = {
  hero: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-pg-text-primary',
  h1: 'text-4xl md:text-5xl font-bold tracking-tight text-pg-text-primary',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight text-pg-text-primary',
  h3: 'text-2xl md:text-3xl font-semibold text-pg-text-primary',
  h4: 'text-xl md:text-2xl font-semibold text-pg-text-primary',
  h5: 'text-lg md:text-xl font-medium text-pg-text-primary',
  body: 'text-base leading-relaxed text-pg-text-primary',
  bodySecondary: 'text-base leading-relaxed text-pg-text-secondary',
  small: 'text-sm text-pg-text-secondary',
  caption: 'text-xs text-pg-text-tertiary',
  overline: 'text-sm uppercase tracking-wide font-medium text-pg-text-secondary',
  link: 'text-pg-text-link hover:text-pg-text-linkHover underline underline-offset-4 transition-colors duration-200',
} as const;

/**
 * Common spacing patterns
 */
export const spacingPresets = {
  sectionVertical: 'py-16 md:py-24 lg:py-32',
  sectionHorizontal: 'px-6 md:px-12 lg:px-24',
  containerMaxWidth: 'max-w-7xl mx-auto',
  stack: {
    tight: 'space-y-2',
    default: 'space-y-4',
    relaxed: 'space-y-6',
    loose: 'space-y-8',
  },
  inline: {
    tight: 'space-x-2',
    default: 'space-x-4',
    relaxed: 'space-x-6',
    loose: 'space-x-8',
  },
} as const;

/**
 * Animation presets
 */
export const animationPresets = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  shimmer: 'animate-shimmer',
} as const;

/**
 * Accessibility utilities
 */
export const a11y = {
  srOnly: 'sr-only',
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pg-sky-300 focus-visible:ring-offset-2',
  skipLink: 'skip-to-main',
} as const;

/**
 * Common button class presets
 */
export const buttonPresets = {
  primary: `
    bg-pg-navy-800
    hover:bg-pg-navy-700
    active:bg-pg-navy-900
    text-white
    px-6 py-3
    rounded-lg
    font-medium
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
    min-h-[44px]
  `,
  secondary: `
    bg-pg-sky-300
    hover:bg-pg-sky-400
    active:bg-pg-sky-500
    text-pg-navy-800
    px-6 py-3
    rounded-lg
    font-medium
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
    min-h-[44px]
  `,
  outline: `
    bg-transparent
    border-2 border-pg-neutral-300
    hover:bg-pg-neutral-50
    active:bg-pg-neutral-100
    text-pg-text-primary
    px-6 py-3
    rounded-lg
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
    min-h-[44px]
  `,
  ghost: `
    bg-transparent
    hover:bg-pg-neutral-50
    active:bg-pg-neutral-100
    text-pg-text-primary
    px-6 py-3
    rounded-lg
    font-medium
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
    min-h-[44px]
  `,
} as const;

/**
 * Common input class presets
 */
export const inputPresets = {
  default: `
    w-full
    px-4 py-3
    border border-pg-border-DEFAULT
    rounded-lg
    text-base
    text-pg-text-primary
    placeholder:text-pg-text-disabled
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:border-transparent
    disabled:bg-pg-neutral-100 disabled:cursor-not-allowed
    transition-all duration-200
    min-h-[44px]
  `,
  error: `
    w-full
    px-4 py-3
    border-2 border-pg-semantic-error-DEFAULT
    rounded-lg
    text-base
    text-pg-text-primary
    focus:outline-none focus:ring-2 focus:ring-pg-semantic-error-DEFAULT focus:border-transparent
    min-h-[44px]
  `,
} as const;

/**
 * Common card class presets
 */
export const cardPresets = {
  default: `
    bg-white
    border border-pg-border-light
    rounded-lg
    shadow-md
    p-6
    hover:shadow-lg
    transition-shadow duration-200
  `,
  interactive: `
    block
    bg-white
    border border-pg-border-light
    rounded-lg
    shadow-md
    p-6
    hover:shadow-lg
    hover:border-pg-navy-800
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
    transition-all duration-200
    group
  `,
} as const;
