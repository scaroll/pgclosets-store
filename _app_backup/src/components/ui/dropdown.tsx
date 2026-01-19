/**
 * Dropdown Component - Animated dropdown menu with Radix UI
 *
 * Features:
 * - Radix UI DropdownMenu primitives
 * - Framer Motion animations
 * - Dark mode support
 * - Keyboard navigation
 * - Nested submenus
 * - Icons and shortcuts
 *
 * @example
 * <Dropdown>
 *   <DropdownTrigger>Open Menu</DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem>Profile</DropdownItem>
 *     <DropdownItem>Settings</DropdownItem>
 *     <DropdownSeparator />
 *     <DropdownItem destructive>Logout</DropdownItem>
 *   </DropdownContent>
 * </Dropdown>
 */

'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dropdown = DropdownMenuPrimitive.Root;
const DropdownTrigger = DropdownMenuPrimitive.Trigger;
const DropdownGroup = DropdownMenuPrimitive.Group;
const DropdownPortal = DropdownMenuPrimitive.Portal;
const DropdownSub = DropdownMenuPrimitive.Sub;
const DropdownSubTrigger = DropdownMenuPrimitive.SubTrigger;
const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

/**
 * Dropdown Content - Main menu container
 */
const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      asChild
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          // Base styles - Apple dropdown DNA
          'z-dropdown min-w-[12rem] overflow-hidden rounded-apple-lg',
          'bg-white dark:bg-apple-dark-bg-secondary',
          'shadow-floating',
          'border border-apple-gray-200 dark:border-apple-dark-border',
          'p-1',
          className
        )}
      >
        {props.children}
      </motion.div>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = 'DropdownContent';

/**
 * Dropdown Submenu Content
 */
const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    asChild
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'z-dropdown min-w-[12rem] overflow-hidden rounded-apple-lg',
        'bg-white dark:bg-apple-dark-bg-secondary',
        'shadow-floating',
        'border border-apple-gray-200 dark:border-apple-dark-border',
        'p-1',
        className
      )}
    >
      {props.children}
    </motion.div>
  </DropdownMenuPrimitive.SubContent>
));
DropdownSubContent.displayName = 'DropdownSubContent';

/**
 * Dropdown Item - Individual menu item
 */
const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    /**
     * Show destructive styling (for delete/logout actions)
     */
    destructive?: boolean;
    /**
     * Icon to display before the item
     */
    icon?: React.ReactNode;
    /**
     * Keyboard shortcut to display
     */
    shortcut?: string;
  }
>(({ className, destructive, icon, shortcut, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Base styles
      'relative flex items-center gap-2 rounded-apple-sm px-2 py-1.5',
      'text-apple-15 outline-none cursor-pointer',
      'transition-colors duration-150',
      // Default state
      'text-apple-gray-900 dark:text-apple-dark-text',
      // Hover state
      'hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary',
      'focus:bg-apple-gray-100 dark:focus:bg-apple-dark-bg-tertiary',
      // Destructive variant
      destructive && 'text-error-600 dark:text-error-400',
      destructive && 'hover:bg-error-50 dark:hover:bg-error-900/20',
      // Disabled state
      'disabled:opacity-50 disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    {icon && <span className="inline-flex shrink-0">{icon}</span>}
    <span className="flex-1">{children}</span>
    {shortcut && (
      <span
        className={cn(
          'ml-auto text-apple-13',
          'text-apple-gray-500 dark:text-apple-dark-text-tertiary'
        )}
      >
        {shortcut}
      </span>
    )}
  </DropdownMenuPrimitive.Item>
));
DropdownItem.displayName = 'DropdownItem';

/**
 * Dropdown Checkbox Item
 */
const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex items-center gap-2 rounded-apple-sm px-2 py-1.5 pl-8',
      'text-apple-15 outline-none cursor-pointer',
      'text-apple-gray-900 dark:text-apple-dark-text',
      'hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary',
      'focus:bg-apple-gray-100 dark:focus:bg-apple-dark-bg-tertiary',
      'disabled:opacity-50 disabled:pointer-events-none',
      'transition-colors duration-150',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = 'DropdownCheckboxItem';

/**
 * Dropdown Radio Item
 */
const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex items-center gap-2 rounded-apple-sm px-2 py-1.5 pl-8',
      'text-apple-15 outline-none cursor-pointer',
      'text-apple-gray-900 dark:text-apple-dark-text',
      'hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary',
      'focus:bg-apple-gray-100 dark:focus:bg-apple-dark-bg-tertiary',
      'disabled:opacity-50 disabled:pointer-events-none',
      'transition-colors duration-150',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <div className="h-2 w-2 rounded-full bg-apple-blue-600 dark:bg-apple-blue-dark" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownRadioItem.displayName = 'DropdownRadioItem';

/**
 * Dropdown Label - Section label
 */
const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-apple-13 font-semibold',
      'text-apple-gray-600 dark:text-apple-dark-text-secondary',
      className
    )}
    {...props}
  />
));
DropdownLabel.displayName = 'DropdownLabel';

/**
 * Dropdown Separator
 */
const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      '-mx-1 my-1 h-px',
      'bg-apple-gray-200 dark:bg-apple-dark-border',
      className
    )}
    {...props}
  />
));
DropdownSeparator.displayName = 'DropdownSeparator';

/**
 * Dropdown Submenu Trigger
 */
const DropdownSubTriggerComponent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    icon?: React.ReactNode;
  }
>(({ className, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'relative flex items-center gap-2 rounded-apple-sm px-2 py-1.5',
      'text-apple-15 outline-none cursor-pointer',
      'text-apple-gray-900 dark:text-apple-dark-text',
      'hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary',
      'focus:bg-apple-gray-100 dark:focus:bg-apple-dark-bg-tertiary',
      'disabled:opacity-50 disabled:pointer-events-none',
      'transition-colors duration-150',
      className
    )}
    {...props}
  >
    {icon && <span className="inline-flex shrink-0">{icon}</span>}
    <span className="flex-1">{children}</span>
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownSubTriggerComponent.displayName = 'DropdownSubTrigger';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownRadioGroup,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownSubTriggerComponent as DropdownSubTriggerItem,
};
