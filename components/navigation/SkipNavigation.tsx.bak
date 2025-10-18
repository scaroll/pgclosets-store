'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkipNavigationProps {
  className?: string;
  targetId?: string;
}

const SkipNavigation: React.FC<SkipNavigationProps> = ({
  className,
  targetId = "main-content"
}) => {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Find the target element
    const target = document.getElementById(targetId);
    if (target) {
      // Set tabindex to -1 to make element focusable if it's not already
      const originalTabIndex = target.getAttribute('tabindex');
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }

      // Focus the target and scroll into view
      target.focus({ preventScroll: false });
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      // Restore original tabindex if we modified it
      if (originalTabIndex === null && target.getAttribute('tabindex') === '-1') {
        target.removeAttribute('tabindex');
      }

      // Announce the skip to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = 'Skipped to main content';
      document.body.appendChild(announcement);

      // Clean up the announcement after screen readers have processed it
      setTimeout(() => {
        if (announcement.parentNode) {
          announcement.parentNode.removeChild(announcement);
        }
      }, 1000);
    }
  };

  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Base positioning and styling - positioned at very top of viewport
        "sr-only focus:not-sr-only",
        "fixed top-2 left-4 z-[9999]",
        "bg-blue-600 text-white",
        "px-6 py-3 rounded-md",
        "font-semibold text-base",
        "shadow-lg border-2 border-white",
        // Enhanced focus styles for WCAG compliance
        "focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white",
        "focus:bg-blue-700",
        // Transition for smooth appearance
        "transition-all duration-200 ease-in-out",
        // Ensure it appears above all other content when focused
        "transform -translate-y-16 focus:translate-y-0",
        // Ensure minimum touch target size (44x44px minimum)
        "min-h-[44px] min-w-[120px] flex items-center justify-center",
        // High contrast for visibility
        "text-white bg-blue-600 focus:bg-blue-700",
        className
      )}
      onClick={handleSkip}
      // ARIA attributes for better screen reader support
      aria-label="Skip to main content area"
      title="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipNavigation;