/**
 * Unified Button Component - PG Closets Design System
 * Single source of truth for all button styles across the application
 * Replaces: btn classes, CTALogoButton, various button implementations
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Button variant configuration using design tokens
const buttonVariants = cva(
  // Base styles (shared across all variants)
  [
    'inline-flex items-center justify-center',
    'font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Primary - Black background (main CTA)
        primary: [
          'bg-black text-white',
          'hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5',
          'active:translate-y-0',
          'focus-visible:ring-gray-900',
        ],

        // Secondary - Outline style
        secondary: [
          'bg-transparent text-black',
          'border-2 border-gray-300',
          'hover:bg-gray-50 hover:border-gray-400',
          'focus-visible:ring-gray-500',
        ],

        // Ghost - Minimal style
        ghost: [
          'bg-transparent text-gray-900',
          'hover:bg-gray-100',
          'focus-visible:ring-gray-400',
        ],

        // Accent - Navy blue (secondary CTA)
        accent: [
          'bg-[#243c74] text-white',
          'hover:bg-[#1a2d5a] hover:shadow-md',
          'focus-visible:ring-[#243c74]',
        ],

        // Success - Green (confirmation actions)
        success: [
          'bg-green-600 text-white',
          'hover:bg-green-700 hover:shadow-md',
          'focus-visible:ring-green-600',
        ],

        // Destructive - Red (delete/cancel actions)
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700 hover:shadow-md',
          'focus-visible:ring-red-600',
        ],

        // Link - Text only
        link: [
          'text-[#243c74] underline-offset-4',
          'hover:underline',
          'focus-visible:ring-[#243c74]',
        ],
      },

      size: {
        // Small - 36px height
        sm: 'h-9 px-4 text-sm rounded-md',

        // Medium - 44px height (default, WCAG compliant)
        md: 'h-11 px-6 text-base rounded-lg',

        // Large - 52px height
        lg: 'h-13 px-8 text-lg rounded-lg',

        // Icon only - Square
        icon: 'h-11 w-11 rounded-lg',

        // Icon small
        iconSm: 'h-9 w-9 rounded-md',
      },

      // Full width option
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },

      // Loading state
      loading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
);

// TypeScript interfaces
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as a child component (for composition)
   */
  asChild?: boolean;

  /**
   * Show loading spinner
   */
  loading?: boolean;

  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;

  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode;

  /**
   * Link href (renders as Link component)
   */
  href?: string;

  /**
   * External link (renders as <a>)
   */
  external?: boolean;
}

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Unified Button Component
 *
 * @example
 * // Primary button
 * <Button>Get Quote</Button>
 *
 * @example
 * // Secondary button with link
 * <Button variant="secondary" href="/products">
 *   View Products
 * </Button>
 *
 * @example
 * // Loading state
 * <Button loading>Processing...</Button>
 *
 * @example
 * // With icons
 * <Button leftIcon={<ArrowLeft />} variant="ghost">
 *   Back
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      children,
      href,
      external,
      ...props
    },
    ref
  ) => {
    // Determine which component to render
    const Comp = asChild ? Slot : href ? (external ? 'a' : Link) : 'button';

    // Build className
    const classes = cn(
      buttonVariants({ variant, size, fullWidth, loading }),
      className
    );

    // Link-specific props
    const linkProps = href
      ? external
        ? { href, target: '_blank', rel: 'noopener noreferrer' }
        : { href }
      : {};

    // Button content
    const content = (
      <>
        {loading && <LoadingSpinner />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    return (
      <Comp
        className={classes}
        ref={ref as any}
        disabled={disabled || loading}
        {...linkProps}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

// ============================================
// SPECIALIZED BUTTON VARIANTS
// For common use cases across the site
// ============================================

/**
 * CTA Button - Primary call-to-action with logo
 * Use for: Main conversion actions (Get Quote, Book Consultation)
 */
export const CTAButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant'>
>(({ children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="primary"
      size="lg"
      className="uppercase tracking-widest shadow-lg"
      {...props}
    >
      {children}
    </Button>
  );
});
CTAButton.displayName = 'CTAButton';

/**
 * Quote Button - Specialized for product quote requests
 */
export const QuoteButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'children'>
>(({ ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="primary"
      className="uppercase tracking-widest"
      {...props}
    >
      Get Free Quote
    </Button>
  );
});
QuoteButton.displayName = 'QuoteButton';

/**
 * Link Button - Styled link that looks like a button
 */
export const LinkButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { href: string }
>(({ href, external = false, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      href={href}
      external={external}
      {...props}
    />
  );
});
LinkButton.displayName = 'LinkButton';

/**
 * Icon Button - For icon-only buttons
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'children'> & { icon: React.ReactNode; 'aria-label': string }
>(({ icon, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      size="icon"
      {...props}
    >
      {icon}
    </Button>
  );
});
IconButton.displayName = 'IconButton';

/**
 * Button Group - For grouping related buttons
 */
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}> = ({ children, className, orientation = 'horizontal' }) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row gap-2' : 'flex-col gap-2',
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};

// ============================================
// USAGE EXAMPLES & DOCUMENTATION
// ============================================

/**
 * USAGE GUIDE:
 *
 * 1. BASIC BUTTONS
 * ```tsx
 * <Button>Default Primary</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="link">Link Style</Button>
 * ```
 *
 * 2. SIZES
 * ```tsx
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium (Default)</Button>
 * <Button size="lg">Large</Button>
 * ```
 *
 * 3. WITH LINKS
 * ```tsx
 * <Button href="/products">Internal Link</Button>
 * <Button href="https://example.com" external>External Link</Button>
 * ```
 *
 * 4. WITH ICONS
 * ```tsx
 * <Button leftIcon={<ArrowLeft />}>Back</Button>
 * <Button rightIcon={<ArrowRight />}>Next</Button>
 * <IconButton icon={<Menu />} aria-label="Open menu" />
 * ```
 *
 * 5. LOADING STATES
 * ```tsx
 * <Button loading>Processing...</Button>
 * ```
 *
 * 6. FULL WIDTH
 * ```tsx
 * <Button fullWidth>Full Width Button</Button>
 * ```
 *
 * 7. SPECIALIZED VARIANTS
 * ```tsx
 * <CTAButton>Get Free Quote</CTAButton>
 * <QuoteButton />
 * ```
 *
 * 8. BUTTON GROUPS
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="primary">Save</Button>
 *   <Button variant="secondary">Cancel</Button>
 * </ButtonGroup>
 * ```
 *
 * MIGRATION GUIDE:
 *
 * Old patterns → New unified component:
 *
 * - `.btn-primary` → `<Button variant="primary">`
 * - `.btn-secondary` → `<Button variant="secondary">`
 * - `CTALogoButton` → `<CTAButton>`
 * - Custom button divs → `<Button asChild>`
 */
