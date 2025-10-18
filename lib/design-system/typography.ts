/**
 * PG Closets Typography Design System
 *
 * Complete typography system with:
 * - Font stack (Inter-based with system fallbacks)
 * - Type scale (modular scale based on 1.25 ratio)
 * - Weight system (300-700)
 * - Line heights (optimized for readability)
 * - Responsive scaling (fluid typography)
 * - Kit and Ace hierarchy (product-specific typography)
 *
 * @module typography
 */

/**
 * Font Families
 * Professional font stack with Inter as primary, system fonts as fallback
 */
export const fontFamilies = {
  primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
  body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
} as const;

/**
 * Font Weights
 * Range: 300 (Light) to 700 (Bold)
 */
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Type Scale
 * Modular scale based on 1.25 ratio (major third)
 * Base size: 16px
 */
export const fontSizes = {
  // Display sizes (hero, large headings)
  '6xl': '4rem',      // 64px - Hero headings
  '5xl': '3.5rem',    // 56px - Major section headers
  '4xl': '3rem',      // 48px - Primary page headers
  '3xl': '2.5rem',    // 40px - Section headers
  '2xl': '2rem',      // 32px - Subsection headers
  'xl': '1.5rem',     // 24px - Card headers, important text

  // Body sizes
  'lg': '1.125rem',   // 18px - Large body text, intro paragraphs
  'base': '1rem',     // 16px - Default body text
  'sm': '0.875rem',   // 14px - Small body text, captions
  'xs': '0.75rem',    // 12px - Labels, metadata
  'xxs': '0.625rem',  // 10px - Fine print
} as const;

/**
 * Line Heights
 * Optimized for readability across different text sizes
 */
export const lineHeights = {
  // Tight line heights for display text
  none: '1',
  tight: '1.1',
  snug: '1.2',

  // Normal line heights for body text
  normal: '1.5',
  relaxed: '1.6',
  loose: '1.75',

  // Extra loose for accessibility
  extra: '2',
} as const;

/**
 * Letter Spacing
 * Subtle tracking adjustments for different text sizes
 */
export const letterSpacing = {
  tighter: '-0.03em',
  tight: '-0.02em',
  normal: '-0.011em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.08em',
} as const;

/**
 * Responsive Font Sizes
 * Fluid typography that scales between min and max viewport widths
 */
export const responsiveFontSizes = {
  display: {
    mobile: '2.5rem',   // 40px
    tablet: '3.5rem',   // 56px
    desktop: '4rem',    // 64px
    fluid: 'clamp(2.5rem, 5vw + 1rem, 4rem)',
  },
  h1: {
    mobile: '2rem',     // 32px
    tablet: '2.5rem',   // 40px
    desktop: '3rem',    // 48px
    fluid: 'clamp(2rem, 4vw + 1rem, 3rem)',
  },
  h2: {
    mobile: '1.5rem',   // 24px
    tablet: '2rem',     // 32px
    desktop: '2.5rem',  // 40px
    fluid: 'clamp(1.5rem, 3vw + 0.5rem, 2.5rem)',
  },
  h3: {
    mobile: '1.25rem',  // 20px
    tablet: '1.5rem',   // 24px
    desktop: '2rem',    // 32px
    fluid: 'clamp(1.25rem, 2vw + 0.5rem, 2rem)',
  },
  h4: {
    mobile: '1.125rem', // 18px
    tablet: '1.25rem',  // 20px
    desktop: '1.5rem',  // 24px
    fluid: 'clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)',
  },
  body: {
    mobile: '1rem',     // 16px
    tablet: '1rem',     // 16px
    desktop: '1.125rem',// 18px
    fluid: 'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
  },
} as const;

/**
 * Typography Variants
 * Pre-configured text styles for common use cases
 */
export const typographyVariants = {
  // Display text (hero sections, major headings)
  display: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.light,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  },

  // Headings
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.light,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body text
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Specialized text
  label: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },

  // UI elements
  button: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  link: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    textDecoration: 'underline' as const,
  },

  // Code
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * Kit Typography Hierarchy
 * Typography system specifically for Kit product lines
 */
export const kitTypography = {
  // Kit product name (large, bold)
  productName: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Kit model number
  modelNumber: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Kit description
  description: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Kit features list
  feature: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Kit specifications
  specification: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Kit price
  price: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tight,
  },

  // Kit category badge
  categoryBadge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Ace Typography Hierarchy
 * Typography system specifically for Ace product lines
 */
export const aceTypography = {
  // Ace product name (elegant, refined)
  productName: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.light,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  },

  // Ace collection name
  collectionName: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },

  // Ace description (more spacious)
  description: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.loose,
    letterSpacing: letterSpacing.normal,
  },

  // Ace technical details
  technicalDetail: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Ace feature highlight
  featureHighlight: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Ace price
  price: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tighter,
  },

  // Ace series badge
  seriesBadge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Utility Functions
 */

/**
 * Generate CSS class name from typography variant
 */
export function getTypographyClassName(variant: keyof typeof typographyVariants): string {
  return `typography-${variant}`;
}

/**
 * Convert typography object to CSS properties
 */
export function typographyToCSS(typography: typeof typographyVariants[keyof typeof typographyVariants]): Record<string, string | number> {
  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    ...(typography.textTransform && { textTransform: typography.textTransform }),
    ...(typography.textDecoration && { textDecoration: typography.textDecoration }),
  };
}

/**
 * Get responsive font size CSS with clamp
 */
export function getResponsiveFontSize(
  variant: keyof typeof responsiveFontSizes
): string {
  return responsiveFontSizes[variant].fluid;
}

/**
 * Calculate optimal line height based on font size
 * Uses formula: lineHeight = baseLineHeight + (fontSize / maxFontSize) * heightRange
 */
export function calculateLineHeight(fontSize: number, baseLineHeight = 1.5): number {
  const maxFontSize = 64; // Max display size
  const heightRange = 0.5; // Range from 1.5 to 1.0

  if (fontSize >= maxFontSize) {
    return baseLineHeight - heightRange;
  }

  return baseLineHeight - (fontSize / maxFontSize) * heightRange;
}

/**
 * Generate fluid typography CSS with clamp
 */
export function generateFluidTypography(
  minSize: number,
  maxSize: number,
  minViewport = 320,
  maxViewport = 1200
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSize;

  return `clamp(${minSize}px, ${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${maxSize}px)`;
}

/**
 * Type exports for TypeScript
 */
export type FontFamily = typeof fontFamilies[keyof typeof fontFamilies];
export type FontWeight = typeof fontWeights[keyof typeof fontWeights];
export type FontSize = typeof fontSizes[keyof typeof fontSizes];
export type LineHeight = typeof lineHeights[keyof typeof lineHeights];
export type LetterSpacing = typeof letterSpacing[keyof typeof letterSpacing];
export type TypographyVariant = keyof typeof typographyVariants;
export type KitTypographyVariant = keyof typeof kitTypography;
export type AceTypographyVariant = keyof typeof aceTypography;

/**
 * CSS Variables Export
 * For use in global CSS or Tailwind config
 */
export const typographyCSSVariables = {
  '--font-family-primary': fontFamilies.primary,
  '--font-family-display': fontFamilies.display,
  '--font-family-body': fontFamilies.body,
  '--font-family-mono': fontFamilies.mono,

  '--font-weight-light': fontWeights.light,
  '--font-weight-regular': fontWeights.regular,
  '--font-weight-medium': fontWeights.medium,
  '--font-weight-semibold': fontWeights.semibold,
  '--font-weight-bold': fontWeights.bold,

  '--font-size-6xl': fontSizes['6xl'],
  '--font-size-5xl': fontSizes['5xl'],
  '--font-size-4xl': fontSizes['4xl'],
  '--font-size-3xl': fontSizes['3xl'],
  '--font-size-2xl': fontSizes['2xl'],
  '--font-size-xl': fontSizes.xl,
  '--font-size-lg': fontSizes.lg,
  '--font-size-base': fontSizes.base,
  '--font-size-sm': fontSizes.sm,
  '--font-size-xs': fontSizes.xs,
  '--font-size-xxs': fontSizes.xxs,

  '--line-height-none': lineHeights.none,
  '--line-height-tight': lineHeights.tight,
  '--line-height-snug': lineHeights.snug,
  '--line-height-normal': lineHeights.normal,
  '--line-height-relaxed': lineHeights.relaxed,
  '--line-height-loose': lineHeights.loose,
  '--line-height-extra': lineHeights.extra,

  '--letter-spacing-tighter': letterSpacing.tighter,
  '--letter-spacing-tight': letterSpacing.tight,
  '--letter-spacing-normal': letterSpacing.normal,
  '--letter-spacing-wide': letterSpacing.wide,
  '--letter-spacing-wider': letterSpacing.wider,
  '--letter-spacing-widest': letterSpacing.widest,
} as const;

/**
 * Default export with all typography systems
 */
export default {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  responsiveFontSizes,
  typographyVariants,
  kitTypography,
  aceTypography,
  typographyCSSVariables,
  getTypographyClassName,
  typographyToCSS,
  getResponsiveFontSize,
  calculateLineHeight,
  generateFluidTypography,
};
