/**
 * DESIGN SYSTEM TYPOGRAPHY COMPONENTS
 * Luxury typography with perfect hierarchy
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

// Display Text
export const Display = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = 'h1', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('ds-display', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Display.displayName = 'Display';

export const DisplayXL = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = 'h1', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('ds-display-xl', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

DisplayXL.displayName = 'DisplayXL';

// Headings
export const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1 ref={ref} className={cn('ds-h1', className)} {...props}>
        {children}
      </h1>
    );
  }
);

H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2 ref={ref} className={cn('ds-h2', className)} {...props}>
        {children}
      </h2>
    );
  }
);

H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn('ds-h3', className)} {...props}>
        {children}
      </h3>
    );
  }
);

H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h4 ref={ref} className={cn('ds-h4', className)} {...props}>
        {children}
      </h4>
    );
  }
);

H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h5 ref={ref} className={cn('ds-h5', className)} {...props}>
        {children}
      </h5>
    );
  }
);

H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h6 ref={ref} className={cn('ds-h6', className)} {...props}>
        {children}
      </h6>
    );
  }
);

H6.displayName = 'H6';

// Body Text
export const BodyXL = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn('ds-body-xl', className)} {...props}>
        {children}
      </Component>
    );
  }
);

BodyXL.displayName = 'BodyXL';

export const BodyLG = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn('ds-body-lg', className)} {...props}>
        {children}
      </Component>
    );
  }
);

BodyLG.displayName = 'BodyLG';

export const Body = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn('ds-body', className)} {...props}>
        {children}
      </Component>
    );
  }
);

Body.displayName = 'Body';

export const BodySM = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn('ds-body-sm', className)} {...props}>
        {children}
      </Component>
    );
  }
);

BodySM.displayName = 'BodySM';

// Captions and Labels
export const Caption = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, as: Component = 'span', children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn('ds-caption', className)} {...props}>
        {children}
      </Component>
    );
  }
);

Caption.displayName = 'Caption';

export const Label = React.forwardRef<HTMLLabelElement, TypographyProps & { htmlFor?: string }>(
  ({ className, children, htmlFor, ...props }, ref) => {
    return (
      <label ref={ref} htmlFor={htmlFor} className={cn('ds-label', className)} {...props}>
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';
