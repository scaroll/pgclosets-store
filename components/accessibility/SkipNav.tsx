"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkipNavLink {
  id: string;
  label: string;
  href?: string;
}

export interface SkipNavProps {
  links?: SkipNavLink[];
  className?: string;
}

const defaultLinks: SkipNavLink[] = [
  { id: 'main-content', label: 'Skip to main content', href: '#main-content' },
  { id: 'navigation', label: 'Skip to navigation', href: '#navigation' },
  { id: 'footer', label: 'Skip to footer', href: '#footer' },
  { id: 'search', label: 'Skip to search', href: '#search' },
];

/**
 * Skip Navigation Component
 * WCAG 2.1 Level AAA Compliance
 *
 * Provides keyboard users with quick access to main page sections.
 * Hidden by default, becomes visible when focused.
 */
export function SkipNav({ links = defaultLinks, className }: SkipNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) return;

    e.preventDefault();

    // Remove hash from href
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Set focus to target
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();

      // Scroll into view
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update URL hash
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', href);
      }

      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Skipped to ${targetElement.textContent || targetId}`;
      document.body.appendChild(announcement);

      setTimeout(() => {
        if (announcement.parentNode) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    }
  };

  return (
    <nav
      aria-label="Skip navigation links"
      className={cn(
        'skip-nav',
        // Hidden by default
        'sr-only',
        // Visible when focused
        'focus-within:not-sr-only',
        className
      )}
    >
      <div
        className={cn(
          // Fixed positioning at top
          'fixed top-0 left-0 right-0 z-[9999]',
          // High contrast background
          'bg-blue-700 text-white',
          // Padding and layout
          'px-4 py-3',
          // Flexbox for links
          'flex flex-wrap gap-4 items-center',
          // Shadow for visibility
          'shadow-lg'
        )}
      >
        <span className="text-sm font-medium mr-2">Quick Navigation:</span>
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href || `#${link.id}`}
            onClick={(e) => handleClick(e, link.href || `#${link.id}`)}
            className={cn(
              // Base styles
              'inline-flex items-center',
              // Padding for touch targets (AAA: 44x44px minimum)
              'px-4 py-2 min-h-[44px]',
              // Typography
              'text-sm font-medium',
              // Colors
              'text-white bg-blue-600 hover:bg-blue-500',
              // Border and radius
              'rounded-md border-2 border-blue-400',
              // Focus styles (AAA: highly visible)
              'focus:outline-none',
              'focus:ring-4 focus:ring-yellow-400',
              'focus:ring-offset-2 focus:ring-offset-blue-700',
              // Transitions
              'transition-all duration-200',
              // Underline on hover
              'hover:underline'
            )}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/**
 * Skip to Main Content - Simplified version
 */
export function SkipToMain({ className }: { className?: string }) {
  const props: SkipNavProps = {
    links: [{ id: 'main-content', label: 'Skip to main content' }]
  }

  if (className) {
    props.className = className
  }

  return <SkipNav {...props} />
}

/**
 * Enhanced Skip Navigation with custom targets
 */
export interface EnhancedSkipNavProps extends SkipNavProps {
  showCount?: boolean;
  variant?: 'compact' | 'expanded';
}

export function EnhancedSkipNav({
  links = defaultLinks,
  showCount = false,
  variant = 'expanded',
  className,
}: EnhancedSkipNavProps) {
  if (variant === 'compact') {
    return (
      <nav
        aria-label="Skip navigation"
        className={cn('sr-only focus-within:not-sr-only', className)}
      >
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999]">
          {links.slice(0, 1).map((link) => (
            <a
              key={link.id}
              href={link.href || `#${link.id}`}
              className={cn(
                'block px-6 py-3 min-h-[44px]',
                'bg-blue-700 text-white text-sm font-medium',
                'rounded-b-lg shadow-lg',
                'focus:outline-none focus:ring-4 focus:ring-yellow-400',
                'hover:bg-blue-600 transition-colors'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label={`Skip navigation${showCount ? ` (${links.length} shortcuts)` : ''}`}
      className={cn('sr-only focus-within:not-sr-only', className)}
    >
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-[9999]',
          'bg-gradient-to-r from-blue-700 to-blue-800',
          'text-white',
          'px-6 py-4',
          'shadow-2xl'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Navigation
            </h2>
            {showCount && (
              <span className="text-sm text-blue-200">
                {links.length} shortcuts available
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {links.map((link, index) => (
              <a
                key={link.id}
                href={link.href || `#${link.id}`}
                className={cn(
                  'inline-flex items-center gap-2',
                  'px-4 py-2 min-h-[44px]',
                  'text-sm font-medium',
                  'bg-blue-600 hover:bg-blue-500',
                  'rounded-lg border-2 border-blue-400',
                  'focus:outline-none',
                  'focus:ring-4 focus:ring-yellow-400',
                  'focus:ring-offset-2 focus:ring-offset-blue-800',
                  'transition-all duration-200',
                  'hover:scale-105'
                )}
              >
                <span
                  className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-blue-500 rounded-full"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Default export
 */
export default SkipNav;
