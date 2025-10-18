/**
 * Navigation & UI Text Component System
 * Optimized typography for navigation, buttons, links, and UI elements
 *
 * Features:
 * - SF Pro inspired UI text (13-17px)
 * - Link hover states with smooth transitions
 * - Breadcrumb typography
 * - Button text styling
 * - Form label optimization
 * - WCAG AAA accessibility
 */

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  external?: boolean;
  className?: string;
}

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

interface ButtonTextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

// ============================================================================
// NAV LINK (Primary navigation links)
// ============================================================================

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, active = false, external = false, className, ...props }, ref) => {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    const Component = external ? 'a' : Link;

    return (
      <Component
        ref={ref}
        href={href}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1.5',
          'text-[0.9375rem] font-[500] leading-[1.4]',
          'tracking-[-0.01em]',
          'transition-colors duration-200',

          // Color states
          active
            ? 'text-charcoal-900'
            : 'text-charcoal-700 hover:text-charcoal-900',

          // Focus state
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal-900',
          'rounded-sm',

          // Active indicator
          active && 'relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-charcoal-900',

          className
        )}
        {...linkProps}
        {...props}
      >
        {children}
        {external && (
          <svg
            className="w-3 h-3 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </Component>
    );
  }
);

NavLink.displayName = 'NavLink';

// ============================================================================
// FOOTER LINK (Smaller, lighter footer links)
// ============================================================================

export const FooterLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, external = false, className, ...props }, ref) => {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    const Component = external ? 'a' : Link;

    return (
      <Component
        ref={ref}
        href={href}
        className={cn(
          'text-[0.875rem] font-[400] leading-[1.5]',
          'text-charcoal-600 hover:text-charcoal-900',
          'transition-colors duration-200',
          'underline decoration-transparent hover:decoration-charcoal-600',
          'underline-offset-2',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-900',
          'rounded-sm',
          className
        )}
        {...linkProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

FooterLink.displayName = 'FooterLink';

// ============================================================================
// BREADCRUMB (Navigation breadcrumb trail)
// ============================================================================

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'text-[0.875rem] font-[400] text-charcoal-600',
                      'hover:text-charcoal-900 transition-colors duration-200',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-900',
                      'rounded-sm'
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'text-[0.875rem]',
                      isLast ? 'font-[500] text-charcoal-900' : 'font-[400] text-charcoal-600'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <svg
                    className="w-4 h-4 text-charcoal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

// ============================================================================
// BUTTON TEXT (Text inside buttons)
// ============================================================================

export const ButtonText = React.forwardRef<HTMLSpanElement, ButtonTextProps>(
  ({ children, size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-[0.8125rem] font-[500] tracking-[0.01em]',
      md: 'text-[0.9375rem] font-[500] tracking-[0]',
      lg: 'text-[1rem] font-[600] tracking-[-0.01em]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          sizeClasses[size],
          'uppercase leading-none',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ButtonText.displayName = 'ButtonText';

// ============================================================================
// FORM LABEL (Accessible form labels)
// ============================================================================

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, htmlFor, required = false, optional = false, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          'block text-[0.9375rem] font-[500] leading-[1.4]',
          'text-charcoal-900 mb-2',
          'tracking-[-0.01em]',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error-600 ml-1" aria-label="required">
            *
          </span>
        )}
        {optional && (
          <span className="text-charcoal-500 text-[0.8125rem] font-[400] ml-2">
            (optional)
          </span>
        )}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

// ============================================================================
// HELPER TEXT (Form helper/error text)
// ============================================================================

interface HelperTextProps {
  children: React.ReactNode;
  error?: boolean;
  className?: string;
}

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ children, error = false, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-[0.8125rem] font-[400] leading-[1.4] mt-2',
          error ? 'text-error-600' : 'text-charcoal-600',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

HelperText.displayName = 'HelperText';

// ============================================================================
// BADGE TEXT (Small status badges)
// ============================================================================

interface BadgeTextProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const BadgeText = React.forwardRef<HTMLSpanElement, BadgeTextProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-stone-100 text-charcoal-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      error: 'bg-error-100 text-error-800',
      info: 'bg-info-100 text-info-800',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-1',
          'text-[0.75rem] font-[600] uppercase tracking-wider',
          'rounded-full',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BadgeText.displayName = 'BadgeText';

// ============================================================================
// MENU ITEM TEXT (Dropdown/menu items)
// ============================================================================

interface MenuItemTextProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MenuItemText = React.forwardRef<HTMLSpanElement, MenuItemTextProps>(
  ({ children, active = false, disabled = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'text-[0.9375rem] font-[400] leading-[1.4]',
          active && 'font-[500]',
          disabled
            ? 'text-charcoal-400 cursor-not-allowed'
            : 'text-charcoal-900',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

MenuItemText.displayName = 'MenuItemText';

// ============================================================================
// TAB TEXT (Tab navigation)
// ============================================================================

interface TabTextProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export const TabText = React.forwardRef<HTMLSpanElement, TabTextProps>(
  ({ children, active = false, disabled = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'text-[0.9375rem] leading-[1.4]',
          'transition-all duration-200',
          active
            ? 'font-[600] text-charcoal-900'
            : 'font-[400] text-charcoal-600',
          !disabled && !active && 'hover:text-charcoal-800',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

TabText.displayName = 'TabText';

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  NavLink,
  FooterLink,
  Breadcrumb,
  ButtonText,
  FormLabel,
  HelperText,
  BadgeText,
  MenuItemText,
  TabText,
};
