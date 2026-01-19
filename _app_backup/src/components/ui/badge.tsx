/**
 * Badge Component - Status indicators with Apple design system
 *
 * Features:
 * - Multiple semantic variants (default, success, warning, error, info)
 * - Dark mode optimized
 * - TypeScript types
 * - Accessible labels
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Failed</Badge>
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Base styles - Apple minimalist DNA
  'inline-flex items-center gap-1.5 rounded-apple-sm px-2.5 py-0.5 text-apple-13 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-apple-gray-200 text-apple-gray-900 dark:bg-apple-dark-bg-tertiary dark:text-apple-dark-text',
        success:
          'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300 dark:border dark:border-success-700/50',
        warning:
          'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300 dark:border dark:border-warning-700/50',
        error:
          'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300 dark:border dark:border-error-700/50',
        info:
          'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300 dark:border dark:border-info-700/50',
        premium:
          'bg-gradient-premium text-woodgrain-800 dark:bg-gradient-to-r dark:from-metal-600 dark:to-metal-700 dark:text-white border border-woodgrain-200 dark:border-metal-600',
      },
      size: {
        sm: 'text-apple-11 px-2 py-0.5',
        md: 'text-apple-13 px-2.5 py-0.5',
        lg: 'text-apple-15 px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'aria-label'>,
    VariantProps<typeof badgeVariants> {
  /**
   * Optional icon to display before the badge text
   */
  icon?: React.ReactNode | undefined;
  /**
   * Optional dot indicator for status badges
   */
  showDot?: boolean | undefined;
  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string | undefined;
}

/**
 * Badge component for status indicators and labels
 */
const BadgeRoot = React.forwardRef<HTMLDivElement, BadgeProps>((
  {
    className,
    variant,
    size,
    icon,
    showDot = false,
    children,
    ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      role="status"
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success-600 dark:bg-success-400',
            variant === 'warning' && 'bg-warning-600 dark:bg-warning-400',
            variant === 'error' && 'bg-error-600 dark:bg-error-400',
            variant === 'info' && 'bg-info-600 dark:bg-info-400',
            variant === 'default' && 'bg-apple-gray-600 dark:bg-apple-dark-text-secondary'
          )}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
    </div>
  );
});
BadgeRoot.displayName = 'Badge';

// Create a compound component with sub-components
type BadgeComponent = typeof BadgeRoot & {
  Success: typeof BadgeRoot;
  Warning: typeof BadgeRoot;
  Error: typeof BadgeRoot;
  Info: typeof BadgeRoot;
  Premium: typeof BadgeRoot;
};

const Badge = BadgeRoot as BadgeComponent;

// Preset badge components for common use cases
Badge.Success = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => {
    return <BadgeRoot ref={ref} variant="success" {...props} />;
  }
) as typeof BadgeRoot;
Badge.Success.displayName = 'Badge.Success';

Badge.Warning = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => {
    return <BadgeRoot ref={ref} variant="warning" {...props} />;
  }
) as typeof BadgeRoot;
Badge.Warning.displayName = 'Badge.Warning';

Badge.Error = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => {
    return <BadgeRoot ref={ref} variant="error" {...props} />;
  }
) as typeof BadgeRoot;
Badge.Error.displayName = 'Badge.Error';

Badge.Info = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => {
    return <BadgeRoot ref={ref} variant="info" {...props} />;
  }
) as typeof BadgeRoot;
Badge.Info.displayName = 'Badge.Info';

Badge.Premium = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => {
    return <BadgeRoot ref={ref} variant="premium" {...props} />;
  }
) as typeof BadgeRoot;
Badge.Premium.displayName = 'Badge.Premium';

export { Badge, badgeVariants };
