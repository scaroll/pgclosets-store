/**
 * Tabs Component - Apple-style tab navigation
 *
 * Features:
 * - Radix UI Tabs primitives
 * - Animated active indicator
 * - Dark mode support
 * - Keyboard navigation (Arrow keys)
 * - Multiple variants (line, pills, enclosed)
 * - Accessible (ARIA)
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="analytics">Analytics</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="analytics">Analytics content</TabsContent>
 * </Tabs>
 */

'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

/**
 * Tabs List - Container for tab triggers
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    /**
     * Visual variant for the tabs
     */
    variant?: 'line' | 'pills' | 'enclosed';
  }
>(({ className, variant = 'line', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center',
      // Line variant (default Apple style)
      variant === 'line' &&
        'border-b border-apple-gray-200 dark:border-apple-dark-border gap-6',
      // Pills variant (iOS style)
      variant === 'pills' &&
        'gap-2 p-1 rounded-apple-lg bg-apple-gray-100 dark:bg-apple-dark-bg-tertiary',
      // Enclosed variant (macOS style)
      variant === 'enclosed' &&
        'gap-1 p-1 rounded-apple-lg border border-apple-gray-200 dark:border-apple-dark-border bg-apple-gray-50 dark:bg-apple-dark-bg-secondary',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

/**
 * Tabs Trigger - Individual tab button
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    /**
     * Icon to display before the tab label
     */
    icon?: React.ReactNode;
    /**
     * Badge count to display
     */
    badge?: number | string;
    /**
     * Visual variant (should match TabsList variant)
     */
    variant?: 'line' | 'pills' | 'enclosed';
  }
>(({ className, icon, badge, variant = 'line', children, ...props }, ref) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'whitespace-nowrap text-apple-15 font-medium',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue-500 dark:focus-visible:ring-apple-blue-dark',
        'disabled:pointer-events-none disabled:opacity-50',

        // Line variant styles
        variant === 'line' && [
          'px-1 pb-3',
          'text-apple-gray-600 dark:text-apple-dark-text-secondary',
          'data-[state=active]:text-apple-gray-900 dark:data-[state=active]:text-apple-dark-text',
          'hover:text-apple-gray-900 dark:hover:text-apple-dark-text',
        ],

        // Pills variant styles
        variant === 'pills' && [
          'px-4 py-2 rounded-apple-sm',
          'text-apple-gray-700 dark:text-apple-dark-text-secondary',
          'data-[state=active]:bg-white dark:data-[state=active]:bg-apple-dark-bg-secondary',
          'data-[state=active]:text-apple-gray-900 dark:data-[state=active]:text-apple-dark-text',
          'data-[state=active]:shadow-apple-sm',
          'hover:text-apple-gray-900 dark:hover:text-apple-dark-text',
        ],

        // Enclosed variant styles
        variant === 'enclosed' && [
          'px-4 py-2 rounded-apple-sm',
          'text-apple-gray-700 dark:text-apple-dark-text-secondary',
          'data-[state=active]:bg-white dark:data-[state=active]:bg-apple-dark-bg-tertiary',
          'data-[state=active]:text-apple-gray-900 dark:data-[state=active]:text-apple-dark-text',
          'data-[state=active]:shadow-apple-sm',
          'hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary',
        ],

        className
      )}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'ml-1.5 inline-flex items-center justify-center',
            'rounded-full px-1.5 py-0.5',
            'text-apple-11 font-medium',
            'bg-apple-gray-200 text-apple-gray-700',
            'dark:bg-apple-dark-bg-tertiary dark:text-apple-dark-text-secondary',
            'data-[state=active]:bg-apple-blue-100 data-[state=active]:text-apple-blue-600',
            'dark:data-[state=active]:bg-apple-blue-dark/20 dark:data-[state=active]:text-apple-blue-dark'
          )}
        >
          {badge}
        </span>
      )}

      {/* Active indicator for line variant */}
      {variant === 'line' && (
        <TabsPrimitive.Trigger asChild value={props.value || ''}>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            initial={false}
          >
            <motion.div
              className="h-full bg-apple-blue-600 dark:bg-apple-blue-dark"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </motion.div>
        </TabsPrimitive.Trigger>
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

/**
 * Tabs Content - Content for each tab
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    /**
     * Enable animations when switching tabs
     */
    animated?: boolean;
  }
>(({ className, animated = true, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue-500 dark:focus-visible:ring-apple-blue-dark',
      'focus-visible:ring-offset-2',
      className
    )}
    {...props}
  >
    {animated ? (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    ) : (
      children
    )}
  </TabsPrimitive.Content>
));
TabsContent.displayName = 'TabsContent';

// Preset tab components for common use cases

/**
 * Line Tabs - Default Apple style with bottom border
 */
const LineTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs>
>((props, ref) => <Tabs ref={ref} {...props} />);
LineTabs.displayName = 'LineTabs';

/**
 * Pills Tabs - iOS style with pill-shaped buttons
 */
const PillsTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs>
>((props, ref) => <Tabs ref={ref} {...props} />);
PillsTabs.displayName = 'PillsTabs';

/**
 * Enclosed Tabs - macOS style with enclosed buttons
 */
const EnclosedTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs>
>((props, ref) => <Tabs ref={ref} {...props} />);
EnclosedTabs.displayName = 'EnclosedTabs';

export { Tabs, TabsList, TabsTrigger, TabsContent, LineTabs, PillsTabs, EnclosedTabs };
