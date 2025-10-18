/**
 * Body Copy Text Component System
 * Optimized for readability with proper typography hierarchy
 *
 * Features:
 * - Readable body text (17-21px)
 * - Optimal line-height (1.4-1.6)
 * - Proper text hierarchy (regular, medium, semibold)
 * - Color variations (primary, secondary, tertiary)
 * - Max-width for readability (680px)
 * - WCAG AAA contrast compliance
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'muted';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  pretty?: boolean;
  maxWidth?: boolean;
  className?: string;
  as?: React.ElementType;
}

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const sizeClasses: Record<TextSize, string> = {
  // Extra small: 14px
  xs: 'text-[0.875rem] leading-[1.4] tracking-[0]',

  // Small: 16px
  sm: 'text-[1rem] leading-[1.5] tracking-[-0.01em]',

  // Base: 17px (Apple's preferred body size)
  base: 'text-[1.0625rem] leading-[1.5] tracking-[-0.011em]',

  // Large: 19px
  lg: 'text-[1.1875rem] leading-[1.6] tracking-[-0.011em]',

  // Extra large: 21px
  xl: 'text-[1.3125rem] leading-[1.6] tracking-[-0.014em]',
};

// ============================================================================
// WEIGHT CONFIGURATIONS
// ============================================================================

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-[400]',
  medium: 'font-[500]',
  semibold: 'font-[600]',
  bold: 'font-[700]',
};

// ============================================================================
// COLOR CONFIGURATIONS
// ============================================================================

const colorClasses: Record<TextColor, string> = {
  primary: 'text-charcoal-900',     // Darkest for primary content
  secondary: 'text-charcoal-700',   // Medium for secondary content
  tertiary: 'text-charcoal-600',    // Lighter for tertiary content
  muted: 'text-charcoal-500',       // Muted for less important content
  inverse: 'text-cream-50',         // Inverse for dark backgrounds
};

// ============================================================================
// ALIGNMENT CONFIGURATIONS
// ============================================================================

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

// ============================================================================
// TEXT COMPONENT
// ============================================================================

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      size = 'base',
      weight = 'normal',
      color = 'primary',
      align = 'left',
      pretty = true,
      maxWidth = false,
      className,
      as,
      ...props
    },
    ref
  ) => {
    const Component = as || 'p';

    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          'font-body',
          'antialiased',

          // Size configuration
          sizeClasses[size],

          // Weight configuration
          weightClasses[weight],

          // Color configuration
          colorClasses[color],

          // Alignment configuration
          alignClasses[align],

          // Text wrapping
          pretty && 'text-pretty',

          // Max width for readability
          maxWidth && 'max-w-[680px]',

          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

// ============================================================================
// LEAD PARAGRAPH (Article intro)
// ============================================================================

export const Lead = React.forwardRef<HTMLParagraphElement, Omit<TextProps, 'size' | 'weight'>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      size="xl"
      weight="normal"
      className={cn('mb-6', className)}
      {...props}
    />
  )
);

Lead.displayName = 'Lead';

// ============================================================================
// CAPTION (Small text for labels, captions)
// ============================================================================

export const Caption = React.forwardRef<HTMLElement, Omit<TextProps, 'size'>>(
  ({ color = 'tertiary', className, ...props }, ref) => (
    <Text
      ref={ref}
      size="sm"
      color={color}
      className={cn('tracking-[0.01em]', className)}
      {...props}
    />
  )
);

Caption.displayName = 'Caption';

// ============================================================================
// LABEL (Form labels, UI text)
// ============================================================================

interface LabelProps extends Omit<TextProps, 'size' | 'weight'> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className, ...props }, ref) => (
    <Text
      ref={ref}
      as="label"
      size="sm"
      weight="medium"
      className={cn('block mb-2', className)}
      {...props}
    >
      {children}
      {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
    </Text>
  )
);

Label.displayName = 'Label';

// ============================================================================
// LINK TEXT (Styled links)
// ============================================================================

interface LinkTextProps extends TextProps {
  href?: string;
  external?: boolean;
  underline?: boolean;
}

export const LinkText = React.forwardRef<HTMLAnchorElement, LinkTextProps>(
  ({ children, href, external, underline = true, className, ...props }, ref) => (
    <Text
      ref={ref}
      as="a"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'text-charcoal-800 hover:text-charcoal-900',
        'transition-colors duration-200',
        underline && 'underline underline-offset-2 decoration-charcoal-400 hover:decoration-charcoal-900',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-900',
        className
      )}
      {...props}
    >
      {children}
      {external && (
        <span className="inline-block ml-1" aria-hidden="true">
          ↗
        </span>
      )}
    </Text>
  )
);

LinkText.displayName = 'LinkText';

// ============================================================================
// READING CONTAINER (Optimal reading width)
// ============================================================================

interface ReadingContainerProps {
  children: React.ReactNode;
  width?: 'narrow' | 'normal' | 'wide';
  className?: string;
}

export const ReadingContainer = React.forwardRef<HTMLDivElement, ReadingContainerProps>(
  ({ children, width = 'normal', className, ...props }, ref) => {
    const widthClasses = {
      narrow: 'max-w-[560px]',  // ~65ch for 14px
      normal: 'max-w-[680px]',  // ~65ch for 17px (optimal)
      wide: 'max-w-[840px]',    // ~75ch for wider reading
    };

    return (
      <div
        ref={ref}
        className={cn(widthClasses[width], 'mx-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ReadingContainer.displayName = 'ReadingContainer';

// ============================================================================
// PROSE CONTAINER (Article typography)
// ============================================================================

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'prose prose-charcoal max-w-none',
        // Headings
        'prose-headings:font-display prose-headings:font-medium prose-headings:text-charcoal-900',
        // Paragraphs
        'prose-p:text-[1.0625rem] prose-p:leading-[1.6] prose-p:text-charcoal-800',
        'prose-p:mb-6',
        // Links
        'prose-a:text-charcoal-900 prose-a:underline prose-a:underline-offset-2',
        'prose-a:decoration-charcoal-400 hover:prose-a:decoration-charcoal-900',
        // Lists
        'prose-li:text-[1.0625rem] prose-li:leading-[1.6] prose-li:text-charcoal-800',
        // Quotes
        'prose-blockquote:border-l-4 prose-blockquote:border-charcoal-300',
        'prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-charcoal-700',
        // Code
        'prose-code:text-[0.9em] prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5',
        'prose-code:rounded prose-code:font-mono',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Prose.displayName = 'Prose';

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default Text;
