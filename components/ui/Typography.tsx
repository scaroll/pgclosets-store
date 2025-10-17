/**
 * Typography System
 * Token-based typography components with responsive scaling
 * Accessibility: Semantic HTML, proper heading hierarchy
 */

import React from 'react';
import { colors, typography, getResponsiveFontSize } from '@/lib/design-tokens';

/* ========================================
   DISPLAY COMPONENT (Hero headlines)
======================================== */

type DisplaySize = '1' | '2' | '3' | '4';
type DisplayWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

interface DisplayProps {
  children: React.ReactNode;
  size?: DisplaySize;
  weight?: DisplayWeight;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  align?: 'left' | 'center' | 'right';
  color?: string;
  className?: string;
  gradient?: boolean;
}

const displaySizes = {
  '1': { mobile: '2xl', desktop: '6xl' }, // 24px -> 64px
  '2': { mobile: 'xl', desktop: '5xl' },  // 20px -> 48px
  '3': { mobile: 'lg', desktop: '4xl' },  // 18px -> 36px
  '4': { mobile: 'base', desktop: '3xl' }, // 16px -> 30px
} as const;

export const Display: React.FC<DisplayProps> = ({
  children,
  size = '1',
  weight = 'semibold',
  as: Component = 'h1',
  align = 'left',
  color = colors.gray[900],
  className = '',
  gradient = false,
}) => {
  const { mobile, desktop } = displaySizes[size];
  const fontSize = getResponsiveFontSize(mobile, desktop);

  const gradientStyle = gradient
    ? {
        background: `linear-gradient(135deg, ${colors.brand.navy} 0%, ${colors.brand.sky} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : {};

  return (
    <Component
      className={`display ${className}`}
      style={{
        fontFamily: typography.fonts.display,
        fontSize,
        fontWeight: typography.weights[weight],
        lineHeight: typography.lineHeights.tight,
        letterSpacing: '-0.02em',
        textAlign: align,
        color: gradient ? undefined : color,
        margin: 0,
        ...gradientStyle,
      }}
    >
      {children}
    </Component>
  );
};

/* ========================================
   HEADING COMPONENT
======================================== */

type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';
type HeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface HeadingProps {
  children: React.ReactNode;
  level: HeadingLevel;
  weight?: HeadingWeight;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  font?: 'display' | 'body' | 'sf';
  color?: string;
  className?: string;
  id?: string;
}

const defaultHeadingSizes: Record<HeadingLevel, keyof typeof typography.sizes> = {
  '1': '3xl',
  '2': '2xl',
  '3': 'xl',
  '4': 'lg',
  '5': 'base',
  '6': 'sm',
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  level,
  weight = 'semibold',
  size,
  font = 'display',
  color = colors.gray[900],
  className = '',
  id,
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const finalSize = size || defaultHeadingSizes[level];
  const [fontSize, fontConfig] = typography.sizes[finalSize];

  return (
    <Component
      id={id}
      className={`heading ${className}`}
      style={{
        fontFamily: typography.fonts[font],
        fontSize,
        fontWeight: typography.weights[weight],
        lineHeight: typeof fontConfig === 'object' ? fontConfig.lineHeight : typography.lineHeights.snug,
        letterSpacing: typeof fontConfig === 'object' ? fontConfig.letterSpacing : '0',
        color,
        margin: 0,
      }}
    >
      {children}
    </Component>
  );
};

/* ========================================
   TEXT COMPONENT (Body copy)
======================================== */

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
type TextVariant = 'body' | 'lead' | 'caption' | 'label' | 'code';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  as?: 'p' | 'span' | 'div' | 'label' | 'code' | 'strong' | 'em';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  className?: string;
  id?: string;
}

const variantDefaults = {
  body: {
    size: 'base' as TextSize,
    weight: 'regular' as TextWeight,
    as: 'p' as const,
    lineHeight: 'relaxed' as const,
  },
  lead: {
    size: 'lg' as TextSize,
    weight: 'regular' as TextWeight,
    as: 'p' as const,
    lineHeight: 'relaxed' as const,
  },
  caption: {
    size: 'sm' as TextSize,
    weight: 'regular' as TextWeight,
    as: 'span' as const,
    lineHeight: 'normal' as const,
  },
  label: {
    size: 'sm' as TextSize,
    weight: 'medium' as TextWeight,
    as: 'label' as const,
    lineHeight: 'normal' as const,
  },
  code: {
    size: 'sm' as TextSize,
    weight: 'regular' as TextWeight,
    as: 'code' as const,
    lineHeight: 'normal' as const,
  },
} as const;

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size,
  weight,
  as,
  color = colors.gray[700],
  align = 'left',
  lineHeight,
  className = '',
  id,
}) => {
  const defaults = variantDefaults[variant];
  const Component = as || defaults.as;
  const finalSize = size || defaults.size;
  const finalWeight = weight || defaults.weight;
  const finalLineHeight = lineHeight || defaults.lineHeight;

  const [fontSize, fontConfig] = typography.sizes[finalSize];
  const fontFamily = variant === 'code' ? typography.fonts.mono : typography.fonts.body;

  const codeStyles =
    variant === 'code'
      ? {
          background: colors.gray[100],
          padding: '0.125rem 0.375rem',
          borderRadius: '0.25rem',
          border: `1px solid ${colors.gray[200]}`,
        }
      : {};

  return (
    <Component
      id={id}
      className={`text ${className}`}
      style={{
        fontFamily,
        fontSize,
        fontWeight: typography.weights[finalWeight],
        lineHeight: typography.lineHeights[finalLineHeight],
        letterSpacing: typeof fontConfig === 'object' ? fontConfig.letterSpacing : '0',
        color,
        textAlign: align,
        margin: 0,
        ...codeStyles,
      }}
    >
      {children}
    </Component>
  );
};

/* ========================================
   UTILITY COMPONENTS
======================================== */

export const TextLink: React.FC<{
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
  underline?: boolean;
}> = ({ children, href, className = '', external = false, underline = true }) => (
  <a
    href={href}
    className={`text-link ${className}`}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    style={{
      color: colors.interactive.link,
      textDecoration: underline ? 'underline' : 'none',
      textDecorationThickness: '1px',
      textUnderlineOffset: '2px',
      transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = colors.interactive.linkHover;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = colors.interactive.link;
    }}
    onFocus={(e) => {
      e.currentTarget.style.outline = `2px solid ${colors.interactive.focus}`;
      e.currentTarget.style.outlineOffset = '2px';
    }}
    onBlur={(e) => {
      e.currentTarget.style.outline = 'none';
    }}
  >
    {children}
  </a>
);

export const Blockquote: React.FC<{
  children: React.ReactNode;
  cite?: string;
  className?: string;
}> = ({ children, cite, className = '' }) => (
  <blockquote
    className={`blockquote ${className}`}
    cite={cite}
    style={{
      margin: 0,
      paddingLeft: '1.5rem',
      borderLeft: `4px solid ${colors.brand.navy}`,
      fontFamily: typography.fonts.display,
      fontSize: typography.sizes.lg[0],
      fontStyle: 'italic',
      color: colors.gray[800],
      lineHeight: typography.lineHeights.relaxed,
    }}
  >
    {children}
  </blockquote>
);

/* ========================================
   USAGE EXAMPLES
======================================== */

/*
// Display headlines (hero sections)
<Display size="1" gradient>
  Premium Closet Solutions for Ottawa
</Display>

<Display size="2" weight="bold" align="center">
  Transform Your Space
</Display>

// Headings (page sections)
<Heading level="1" size="3xl">
  Our Products
</Heading>

<Heading level="2" font="sf" weight="medium">
  Featured Collections
</Heading>

<Heading level="3" size="xl" color={colors.brand.navy}>
  Custom Barn Doors
</Heading>

// Body text
<Text variant="lead">
  Discover custom closet solutions designed for your home.
</Text>

<Text variant="body" lineHeight="loose">
  Our expert team will help you create the perfect storage solution
  with premium materials and craftsmanship.
</Text>

<Text variant="caption" color={colors.gray[600]}>
  Available in Ottawa, Kanata, Barrhaven, and surrounding areas.
</Text>

// Labels and code
<Text variant="label" as="label" htmlFor="email">
  Email Address
</Text>

<Text variant="code">npm install pg-closets</Text>

// Links
<TextLink href="/products" underline>
  Browse Products
</TextLink>

<TextLink href="https://external.com" external>
  Learn More
</TextLink>

// Blockquotes
<Blockquote cite="https://reviews.com">
  Outstanding quality and service! Our custom closet exceeded expectations.
</Blockquote>
*/
