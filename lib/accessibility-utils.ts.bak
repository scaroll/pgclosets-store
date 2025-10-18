/**
 * Accessibility utility functions for the PG Closets application
 */

// Alt text validation and generation utilities
export const altTextUtils = {
  /**
   * Validates that alt text is descriptive and meaningful
   */
  validateAltText: (alt: string): boolean => {
    if (!alt || alt.trim().length === 0) return false;

    // Check for poor alt text patterns
    const poorPatterns = [
      /^image$/i,
      /^picture$/i,
      /^photo$/i,
      /^img$/i,
      /^screenshot$/i,
      /^untitled$/i,
      /^image_\d+$/i,
      /^dsc_\d+$/i,
      /^img_\d+$/i,
    ];

    return !poorPatterns.some(pattern => pattern.test(alt.trim()));
  },

  /**
   * Generates descriptive alt text for product images
   */
  generateProductAltText: (productName: string, imageType?: string): string => {
    const type = imageType ? ` ${imageType}` : '';
    return `${productName}${type} - Custom closet door by PG Closets`;
  },

  /**
   * Generates alt text for room/installation images
   */
  generateRoomAltText: (roomType: string, description?: string): string => {
    const desc = description ? ` featuring ${description}` : '';
    return `${roomType} with custom closet installation${desc} by PG Closets Ottawa`;
  },

  /**
   * Determines if an image should have empty alt text (decorative)
   */
  isDecorativeImage: (src: string, context?: string): boolean => {
    const decorativePatterns = [
      /decoration/i,
      /background/i,
      /spacer/i,
      /divider/i,
      /ornament/i,
    ];

    return decorativePatterns.some(pattern =>
      pattern.test(src) || (context && pattern.test(context))
    );
  }
};

// Focus management utilities
export const focusUtils = {
  /**
   * Sets focus to an element and scrolls it into view
   */
  focusElement: (elementId: string, smooth: boolean = true): boolean => {
    const element = document.getElementById(elementId);
    if (!element) return false;

    element.focus();
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start'
    });
    return true;
  },

  /**
   * Creates a focus trap for modal dialogs
   */
  createFocusTrap: (containerElement: HTMLElement): (() => void) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Focus the first element when trap is created
    firstElement?.focus();

    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }
};

// Color contrast utilities
export const colorUtils = {
  /**
   * Calculates the contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    // This is a simplified version - in a real app you'd want a more robust color parser
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Checks if a color combination meets WCAG AA standards
   */
  meetsWCAGAA: (backgroundColor: string, textColor: string, isLargeText: boolean = false): boolean => {
    const ratio = colorUtils.getContrastRatio(backgroundColor, textColor);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  /**
   * Checks if a color combination meets WCAG AAA standards
   */
  meetsWCAGAAA: (backgroundColor: string, textColor: string, isLargeText: boolean = false): boolean => {
    const ratio = colorUtils.getContrastRatio(backgroundColor, textColor);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
};

// Touch target utilities
export const touchUtils = {
  /**
   * Checks if an element meets minimum touch target size (44x44px)
   */
  meetsMinTouchTarget: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  },

  /**
   * Adds appropriate spacing around touch targets
   */
  ensureMinTouchTarget: (className: string): string => {
    return `${className} min-h-[44px] min-w-[44px] p-2`;
  }
};

// Screen reader utilities
export const screenReaderUtils = {
  /**
   * Announces a message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';

    document.body.appendChild(announcer);

    // Small delay to ensure screen readers pick up the announcement
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);

    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 2000);
  },

  /**
   * Creates accessible labels for form elements
   */
  createLabel: (inputId: string, labelText: string, required: boolean = false): string => {
    const requiredIndicator = required ? ' (required)' : '';
    return `${labelText}${requiredIndicator}`;
  }
};

// Keyboard navigation utilities
export const keyboardUtils = {
  /**
   * Common keyboard event handlers
   */
  handleEnterAndSpace: (callback: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },

  /**
   * Handle arrow key navigation for lists and menus
   */
  handleArrowNavigation: (elements: HTMLElement[], currentIndex: number) => (e: KeyboardEvent) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (currentIndex + 1) % elements.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = elements.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      elements[newIndex]?.focus();
    }

    return newIndex;
  }
};

const accessibilityUtils = {
  altTextUtils,
  focusUtils,
  colorUtils,
  touchUtils,
  screenReaderUtils,
  keyboardUtils
};

export default accessibilityUtils;