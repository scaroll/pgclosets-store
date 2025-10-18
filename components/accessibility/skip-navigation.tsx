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
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Base positioning and styling
        "sr-only focus:not-sr-only",
        "absolute top-0 left-4 z-50",
        "bg-pg-button-primary text-white",
        "px-4 py-2 rounded-md",
        "font-medium text-sm",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",
        // Transition for smooth appearance
        "transition-all duration-300 ease-in-out",
        // Ensure it appears above all other content
        "transform -translate-y-full focus:translate-y-0",
        // Ensure minimum touch target size
        "min-h-[44px] min-w-[44px] flex items-center justify-center",
        className
      )}
      onClick={() => {
        // Ensure the target element gets focus for screen readers
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipNavigation;