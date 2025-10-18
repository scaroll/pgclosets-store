/**
 * UnifiedCard Component
 * Token-based card system replacing all card variations
 * Accessibility: WCAG AA, semantic HTML, keyboard navigation
 */

import React from 'react';
import { colors, spacing, radius, shadows, components } from '@/lib/design-tokens';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat' | 'interactive';
type CardSize = 'sm' | 'md' | 'lg';

interface UnifiedCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  as?: React.ElementType;
  className?: string;
  onClick?: () => void;
  href?: string;
  hover?: boolean;
  focusable?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const variants = {
  default: {
    bg: colors.brand.white,
    border: `1px solid ${colors.gray[200]}`,
    shadow: shadows.sm,
  },
  elevated: {
    bg: colors.brand.white,
    border: 'none',
    shadow: shadows.md,
  },
  outlined: {
    bg: 'transparent',
    border: `1px solid ${colors.gray[300]}`,
    shadow: 'none',
  },
  flat: {
    bg: colors.gray[100],
    border: 'none',
    shadow: 'none',
  },
  interactive: {
    bg: colors.brand.white,
    border: `1px solid ${colors.gray[200]}`,
    shadow: shadows.sm,
  },
} as const;

const hoverStyles = {
  default: {
    shadow: shadows.md,
    translateY: '-2px',
  },
  elevated: {
    shadow: shadows.lg,
    translateY: '-4px',
  },
  outlined: {
    borderColor: colors.gray[400],
    translateY: '0',
  },
  flat: {
    bg: colors.gray[200],
    translateY: '0',
  },
  interactive: {
    shadow: shadows.lg,
    translateY: '-2px',
    borderColor: colors.brand.navy,
  },
} as const;

export const UnifiedCard = React.forwardRef<HTMLElement, UnifiedCardProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      as = 'div',
      className = '',
      onClick,
      href,
      hover = false,
      focusable = false,
      ariaLabel,
      ariaDescribedBy,
    },
    ref
  ) => {
    const Component = href ? 'a' : as;
    const isInteractive = onClick || href || variant === 'interactive';
    const variantStyles = variants[variant];
    const padding = components.card.padding[size];

    const baseStyles: React.CSSProperties = {
      background: variantStyles.bg,
      border: variantStyles.border,
      borderRadius: components.card.radius,
      boxShadow: variantStyles.shadow,
      padding,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 250ms cubic-bezier(0.23, 1, 0.32, 1)',
      outline: 'none',
    };

    const interactiveStyles: React.CSSProperties = isInteractive
      ? {
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }
      : {};

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.();
      }
    };

    return (
      <Component
        ref={ref}
        href={href}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={`unified-card ${className}`}
        style={{ ...baseStyles, ...interactiveStyles }}
        tabIndex={isInteractive || focusable ? 0 : undefined}
        role={onClick && !href ? 'button' : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        onMouseEnter={(e) => {
          if (hover || isInteractive) {
            const hoverStyle = hoverStyles[variant];
            e.currentTarget.style.boxShadow = hoverStyle.shadow || variantStyles.shadow;
            e.currentTarget.style.transform = `translateY(${hoverStyle.translateY})`;
            if ('borderColor' in hoverStyle) {
              e.currentTarget.style.borderColor = hoverStyle.borderColor;
            }
            if ('bg' in hoverStyle) {
              e.currentTarget.style.background = hoverStyle.bg;
            }
          }
        }}
        onMouseLeave={(e) => {
          if (hover || isInteractive) {
            e.currentTarget.style.boxShadow = variantStyles.shadow;
            e.currentTarget.style.transform = 'translateY(0)';
            if ('borderColor' in hoverStyles[variant]) {
              e.currentTarget.style.borderColor = 'initial';
            }
            if ('bg' in hoverStyles[variant] && variant === 'flat') {
              e.currentTarget.style.background = variantStyles.bg;
            }
          }
        }}
        onFocus={(e) => {
          if (isInteractive || focusable) {
            e.currentTarget.style.outline = `2px solid ${colors.interactive.focus}`;
            e.currentTarget.style.outlineOffset = '2px';
          }
        }}
        onBlur={(e) => {
          if (isInteractive || focusable) {
            e.currentTarget.style.outline = 'none';
          }
        }}
      >
        {children}
      </Component>
    );
  }
);

UnifiedCard.displayName = 'UnifiedCard';

/* ========================================
   SUB-COMPONENTS
======================================== */

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`card-header ${className}`}
    style={{
      marginBottom: spacing.md,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
    }}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}> = ({ children, as: Component = 'h3', className = '' }) => (
  <Component
    className={`card-title ${className}`}
    style={{
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.gray[900],
    }}
  >
    {children}
  </Component>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p
    className={`card-description ${className}`}
    style={{
      margin: 0,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.gray[600],
    }}
  >
    {children}
  </p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`card-content ${className}`}
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`card-footer ${className}`}
    style={{
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTop: `1px solid ${colors.gray[200]}`,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
    }}
  >
    {children}
  </div>
);

/* ========================================
   USAGE EXAMPLES
======================================== */

/*
// Basic card
<UnifiedCard>
  <CardHeader>
    <CardTitle>Premium Closet System</CardTitle>
    <CardDescription>Custom designed for your space</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
  <CardFooter>
    <button>Learn More</button>
  </CardFooter>
</UnifiedCard>

// Interactive card with hover
<UnifiedCard
  variant="interactive"
  hover
  onClick={() => console.log('clicked')}
  ariaLabel="View product details"
>
  <CardContent>Product content</CardContent>
</UnifiedCard>

// Elevated card (product showcase)
<UnifiedCard variant="elevated" size="lg">
  <CardHeader>
    <CardTitle as="h2">Featured Product</CardTitle>
  </CardHeader>
  <CardContent>
    <img src="/product.jpg" alt="Product" />
  </CardContent>
</UnifiedCard>

// Link card
<UnifiedCard
  href="/products/closet-systems"
  variant="interactive"
  ariaLabel="Browse closet systems"
>
  <CardContent>Navigation card</CardContent>
</UnifiedCard>

// Outlined minimal card
<UnifiedCard variant="outlined" size="sm">
  <CardContent>Minimal content</CardContent>
</UnifiedCard>
*/
