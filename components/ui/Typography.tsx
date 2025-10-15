/**
 * Typography Component Library
 * Magazine-quality typography components for luxury brand aesthetic
 *
 * Features:
 * - Semantic HTML with proper heading hierarchy
 * - Accessible ARIA attributes
 * - Responsive fluid sizing
 * - OpenType features support
 * - Performance optimized
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type DisplaySize = 'xl' | 'lg' | 'md';
type BodySize = 'xl' | 'lg' | 'base' | 'sm' | 'xs';

interface BaseTypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

interface HeadingProps extends BaseTypographyProps {
  level?: HeadingLevel;
  balance?: boolean;
}

interface DisplayProps extends BaseTypographyProps {
  size?: DisplaySize;
  balance?: boolean;
}

interface BodyProps extends BaseTypographyProps {
  size?: BodySize;
  pretty?: boolean;
}

// ============================================================================
// DISPLAY COMPONENTS - Hero headings
// ============================================================================

export const Display = React.forwardRef<HTMLElement, DisplayProps>(
  ({ children, size = 'lg', balance = true, className, as, ...props }, ref) => {
    const Component = as || 'h1';

    const sizeClasses = {
      xl: 'text-display-xl',
      lg: 'text-display-lg',
      md: 'text-display-md',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          balance && 'text-wrap-balance',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Display.displayName = 'Display';

// ============================================================================
// HEADING COMPONENTS - Section headers
// ============================================================================

export const Heading = React.forwardRef<HTMLElement, HeadingProps>(
  ({ children, level = 1, balance = true, className, as, ...props }, ref) => {
    const Component = as || (`h${level}` as React.ElementType);

    const levelClasses = {
      1: 'text-h1',
      2: 'text-h2',
      3: 'text-h3',
      4: 'text-h4',
      5: 'text-h5',
      6: 'text-h6',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          levelClasses[level],
          balance && level <= 3 && 'text-wrap-balance',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// Semantic heading shortcuts
export const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={1} {...props} />
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={2} {...props} />
);
H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={3} {...props} />
);
H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={4} {...props} />
);
H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={5} {...props} />
);
H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={6} {...props} />
);
H6.displayName = 'H6';

// ============================================================================
// BODY TEXT COMPONENTS
// ============================================================================

export const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ children, size = 'base', pretty = true, className, as, ...props }, ref) => {
    const Component = as || 'p';

    const sizeClasses = {
      xl: 'text-body-xl',
      lg: 'text-body-lg',
      base: 'text-body',
      sm: 'text-body-sm',
      xs: 'text-body-xs',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          pretty && 'text-wrap-pretty',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Body.displayName = 'Body';

// Lead paragraph for article intros
export const Lead = React.forwardRef<HTMLParagraphElement, Omit<BodyProps, 'size'>>(
  ({ className, ...props }, ref) => (
    <Body
      ref={ref}
      size="xl"
      className={cn('lead', className)}
      {...props}
    />
  )
);

Lead.displayName = 'Lead';

// ============================================================================
// MICRO TYPOGRAPHY COMPONENTS
// ============================================================================

export const Caption = React.forwardRef<HTMLElement, BaseTypographyProps>(
  ({ children, className, as, ...props }, ref) => {
    const Component = as || 'span';

    return (
      <Component
        ref={ref}
        className={cn('text-caption', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Caption.displayName = 'Caption';

export const Overline = React.forwardRef<HTMLElement, BaseTypographyProps>(
  ({ children, className, as, ...props }, ref) => {
    const Component = as || 'span';

    return (
      <Component
        ref={ref}
        className={cn('text-overline', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Overline.displayName = 'Overline';

// ============================================================================
// SPECIAL TYPOGRAPHY COMPONENTS
// ============================================================================

interface BlockquoteProps extends BaseTypographyProps {
  cite?: string;
  author?: string;
}

export const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ children, cite, author, className, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn('blockquote', className)}
        {...props}
      >
        {children}
        {(cite || author) && (
          <cite>
            {author && `— ${author}`}
            {cite && author && ', '}
            {cite}
          </cite>
        )}
      </blockquote>
    );
  }
);

Blockquote.displayName = 'Blockquote';

export const Pullquote = React.forwardRef<HTMLElement, BaseTypographyProps>(
  ({ children, className, as, ...props }, ref) => {
    const Component = as || 'aside';

    return (
      <Component
        ref={ref}
        className={cn('pullquote', className)}
        role="note"
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Pullquote.displayName = 'Pullquote';

// ============================================================================
// CODE COMPONENTS
// ============================================================================

export const Code = React.forwardRef<HTMLElement, BaseTypographyProps>(
  ({ children, className, as, ...props }, ref) => {
    const Component = as || 'code';

    return (
      <Component
        ref={ref}
        className={cn('font-mono', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Code.displayName = 'Code';

interface PreProps extends BaseTypographyProps {
  language?: string;
}

export const Pre = React.forwardRef<HTMLPreElement, PreProps>(
  ({ children, language, className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn('font-mono', className)}
        data-language={language}
        {...props}
      >
        {children}
      </pre>
    );
  }
);

Pre.displayName = 'Pre';

// ============================================================================
// READING EXPERIENCE COMPONENT
// ============================================================================

interface ReadingContainerProps extends BaseTypographyProps {
  maxWidth?: 'narrow' | 'normal' | 'wide';
}

export const ReadingContainer = React.forwardRef<HTMLDivElement, ReadingContainerProps>(
  ({ children, maxWidth = 'normal', className, as, ...props }, ref) => {
    const Component = as || 'div';

    const widthClasses = {
      narrow: 'max-w-prose', // ~65ch
      normal: 'reading-width', // ~65-75ch
      wide: 'max-w-4xl',
    };

    return (
      <Component
        ref={ref}
        className={cn(widthClasses[maxWidth], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ReadingContainer.displayName = 'ReadingContainer';

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export const Typography = {
  Display,
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body,
  Lead,
  Caption,
  Overline,
  Blockquote,
  Pullquote,
  Code,
  Pre,
  ReadingContainer,
};

export default Typography;
