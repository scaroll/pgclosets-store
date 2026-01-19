/**
 * Tooltip Component - Subtle tooltips with dark mode
 *
 * Features:
 * - Radix UI Tooltip primitives
 * - Smooth animations
 * - Dark mode optimized
 * - Configurable delay
 * - Multiple placement options
 * - Accessible (ARIA)
 *
 * @example
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Helpful information</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 */

'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Tooltip Provider - Wrap your app or component tree
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip Root - Individual tooltip instance
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * Tooltip Trigger - Element that triggers the tooltip
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip Content - The tooltip popup content
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    /**
     * Visual variant for the tooltip
     */
    variant?: 'default' | 'dark' | 'light' | 'premium';
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Show arrow pointing to trigger
     */
    showArrow?: boolean;
  }
>(
  (
    {
      className,
      sideOffset = 4,
      variant = 'default',
      size = 'md',
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -5 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            // Base styles
            'z-tooltip overflow-hidden rounded-apple-sm',
            'shadow-apple-md',
            'animate-in fade-in-0 zoom-in-95',

            // Size variants
            size === 'sm' && 'px-2 py-1 text-apple-11',
            size === 'md' && 'px-3 py-1.5 text-apple-13',
            size === 'lg' && 'px-4 py-2 text-apple-15',

            // Variant styles
            variant === 'default' && [
              'bg-apple-gray-900 text-white',
              'dark:bg-apple-dark-bg-tertiary dark:text-apple-dark-text',
              'dark:border dark:border-apple-dark-border',
            ],
            variant === 'dark' && 'bg-black text-white',
            variant === 'light' && [
              'bg-white text-apple-gray-900',
              'border border-apple-gray-200',
              'shadow-floating',
            ],
            variant === 'premium' && [
              'bg-gradient-premium text-woodgrain-900',
              'border border-woodgrain-200',
              'shadow-elevated',
            ],

            className
          )}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className={cn(
                variant === 'default' &&
                  'fill-apple-gray-900 dark:fill-apple-dark-bg-tertiary',
                variant === 'dark' && 'fill-black',
                variant === 'light' && 'fill-white',
                variant === 'premium' && 'fill-premium-cream'
              )}
            />
          )}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = 'TooltipContent';

/**
 * Simple Tooltip - Convenient wrapper for common use case
 *
 * @example
 * <SimpleTooltip content="Click to edit">
 *   <Button>Edit</Button>
 * </SimpleTooltip>
 */
interface SimpleTooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  /**
   * Delay before showing tooltip (ms)
   */
  delayDuration?: number;
  /**
   * Visual variant
   */
  variant?: 'default' | 'dark' | 'light' | 'premium';
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Placement side
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Alignment
   */
  align?: 'start' | 'center' | 'end';
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  children,
  content,
  delayDuration = 200,
  variant = 'default',
  size = 'md',
  side = 'top',
  align = 'center',
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent variant={variant} size={size} side={side} align={align}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
SimpleTooltip.displayName = 'SimpleTooltip';

/**
 * Keyboard Shortcut Tooltip - Display keyboard shortcuts
 *
 * @example
 * <KeyboardTooltip keys={['⌘', 'K']}>
 *   <Button>Search</Button>
 * </KeyboardTooltip>
 */
interface KeyboardTooltipProps {
  children: React.ReactElement;
  keys: string[];
  /**
   * Additional description text
   */
  description?: string;
  /**
   * Delay before showing tooltip (ms)
   */
  delayDuration?: number;
  /**
   * Placement side
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const KeyboardTooltip: React.FC<KeyboardTooltipProps> = ({
  children,
  keys,
  description,
  delayDuration = 200,
  side = 'top',
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} variant="dark" size="md">
          <div className="flex items-center gap-2">
            {description && <span>{description}</span>}
            <div className="flex items-center gap-1">
              {keys.map((key, index) => (
                <React.Fragment key={index}>
                  <kbd
                    className={cn(
                      'inline-flex items-center justify-center',
                      'px-1.5 py-0.5 rounded',
                      'bg-white/10 text-white',
                      'text-apple-11 font-mono',
                      'border border-white/20',
                      'min-w-[1.25rem]'
                    )}
                  >
                    {key}
                  </kbd>
                  {index < keys.length - 1 && (
                    <span className="text-white/60 text-apple-11">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
KeyboardTooltip.displayName = 'KeyboardTooltip';

/**
 * Rich Tooltip - Tooltip with title and description
 *
 * @example
 * <RichTooltip
 *   title="Premium Feature"
 *   description="Upgrade to access advanced analytics"
 * >
 *   <Button>Analytics</Button>
 * </RichTooltip>
 */
interface RichTooltipProps {
  children: React.ReactElement;
  title: string;
  description: string;
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
  /**
   * Visual variant
   */
  variant?: 'default' | 'dark' | 'light' | 'premium';
  /**
   * Delay before showing tooltip (ms)
   */
  delayDuration?: number;
  /**
   * Placement side
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const RichTooltip: React.FC<RichTooltipProps> = ({
  children,
  title,
  description,
  icon,
  variant = 'light',
  delayDuration = 200,
  side = 'top',
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          variant={variant}
          size="lg"
          side={side}
          className="max-w-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {icon && <span className="shrink-0">{icon}</span>}
              <p className="font-semibold">{title}</p>
            </div>
            <p
              className={cn(
                'text-apple-13',
                variant === 'light' && 'text-apple-gray-600',
                variant === 'default' && 'text-white/80 dark:text-apple-dark-text-secondary',
                variant === 'dark' && 'text-white/80',
                variant === 'premium' && 'text-woodgrain-700'
              )}
            >
              {description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
RichTooltip.displayName = 'RichTooltip';

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  KeyboardTooltip,
  RichTooltip,
};
