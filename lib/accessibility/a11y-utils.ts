/**
 * Comprehensive Accessibility Utilities
 * WCAG 2.1 AAA Compliance Framework
 */

// ============================================================================
// COLOR CONTRAST UTILITIES (AAA: 7:1 for normal text, 4.5:1 for large text)
// ============================================================================

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  level: 'Fail' | 'AA' | 'AAA';
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance (WCAG formula)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check color contrast compliance
 */
export function checkColorContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;

  const passesAA = ratio >= aaThreshold;
  const passesAAA = ratio >= aaaThreshold;

  let level: 'Fail' | 'AA' | 'AAA' = 'Fail';
  if (passesAAA) level = 'AAA';
  else if (passesAA) level = 'AA';

  return { ratio, passesAA, passesAAA, level };
}

/**
 * Suggest accessible color based on background
 */
export function suggestAccessibleColor(
  background: string,
  preferDark: boolean = true
): string {
  const bgRgb = hexToRgb(background);
  if (!bgRgb) return preferDark ? 'var(--color-primary)' : 'var(--color-secondary)';

  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  // If background is dark, suggest light text; if light, suggest dark text
  return bgLum > 0.5 ? 'var(--color-primary)' : 'var(--color-secondary)';
}

// ============================================================================
// FOCUS MANAGEMENT UTILITIES
// ============================================================================

export interface FocusTrapOptions {
  initialFocus?: HTMLElement;
  returnFocus?: boolean;
  allowEscape?: boolean;
  onEscape?: () => void;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => {
      // Ensure element is visible
      return (
        el.offsetWidth > 0 ||
        el.offsetHeight > 0 ||
        el.getClientRects().length > 0
      );
    }
  );
}

/**
 * Create a focus trap for modals/dialogs
 */
export function createFocusTrap(
  container: HTMLElement,
  options: FocusTrapOptions = {}
): () => void {
  const { initialFocus, returnFocus = true, allowEscape = true, onEscape } = options;

  const previousActiveElement = document.activeElement as HTMLElement;
  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in focus trap container');
    return () => {};
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Focus initial element
  if (initialFocus && focusableElements.includes(initialFocus)) {
    initialFocus.focus();
  } else {
    firstElement.focus();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle Escape key
    if (e.key === 'Escape' && allowEscape) {
      e.preventDefault();
      onEscape?.();
      return;
    }

    // Handle Tab key
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    if (returnFocus && previousActiveElement) {
      previousActiveElement.focus();
    }
  };
}

/**
 * Set focus with scroll into view
 */
export function setFocus(
  element: HTMLElement | string,
  options: { smooth?: boolean; preventScroll?: boolean } = {}
): boolean {
  const { smooth = true, preventScroll = false } = options;

  const el = typeof element === 'string' ? document.getElementById(element) : element;

  if (!el) {
    console.warn('Element not found for focus');
    return false;
  }

  el.focus({ preventScroll });

  if (!preventScroll) {
    el.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'center',
    });
  }

  return true;
}

// ============================================================================
// SCREEN READER UTILITIES
// ============================================================================

export type AnnounceMode = 'polite' | 'assertive' | 'off';

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  mode: AnnounceMode = 'polite',
  timeout: number = 1000
): void {
  if (mode === 'off') return;

  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', mode);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';

  document.body.appendChild(announcer);

  // Small delay to ensure screen readers pick it up
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  // Remove after announcement
  setTimeout(() => {
    if (announcer.parentNode) {
      document.body.removeChild(announcer);
    }
  }, timeout + 100);
}

/**
 * Create accessible label text
 */
export function createAccessibleLabel(
  label: string,
  required: boolean = false,
  helpText?: string
): { label: string; ariaLabel: string } {
  const requiredSuffix = required ? ' (required)' : '';
  const helpSuffix = helpText ? `. ${helpText}` : '';

  return {
    label: `${label}${requiredSuffix}`,
    ariaLabel: `${label}${requiredSuffix}${helpSuffix}`,
  };
}

// ============================================================================
// KEYBOARD NAVIGATION UTILITIES
// ============================================================================

export type KeyboardHandler = (event: KeyboardEvent) => void;

/**
 * Handle Enter and Space key activation (for custom interactive elements)
 */
export function handleActivationKeys(callback: () => void): KeyboardHandler {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
}

/**
 * Handle arrow key navigation in lists/menus
 */
export function createArrowNavigationHandler(
  elements: HTMLElement[],
  orientation: 'vertical' | 'horizontal' = 'vertical',
  loop: boolean = true
): (currentIndex: number) => KeyboardHandler {
  return (currentIndex: number) => (e: KeyboardEvent) => {
    let newIndex = currentIndex;
    const maxIndex = elements.length - 1;

    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        newIndex = loop
          ? (currentIndex + 1) % elements.length
          : Math.min(currentIndex + 1, maxIndex);
        break;

      case prevKey:
        e.preventDefault();
        newIndex = loop
          ? currentIndex === 0
            ? maxIndex
            : currentIndex - 1
          : Math.max(currentIndex - 1, 0);
        break;

      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        newIndex = maxIndex;
        break;

      default:
        return;
    }

    if (newIndex !== currentIndex && elements[newIndex]) {
      elements[newIndex].focus();
    }
  };
}

// ============================================================================
// ARIA UTILITIES
// ============================================================================

/**
 * Set multiple ARIA attributes
 */
export function setAriaAttributes(
  element: HTMLElement,
  attributes: Record<string, string | boolean | number>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
    element.setAttribute(ariaKey, String(value));
  });
}

/**
 * Generate unique ID for ARIA relationships
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create ARIA label from visible text
 */
export function createAriaLabelFromText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

// ============================================================================
// TOUCH TARGET UTILITIES
// ============================================================================

export interface TouchTargetSize {
  width: number;
  height: number;
  passes: boolean;
}

/**
 * Check if element meets minimum touch target size (44x44px AAA)
 */
export function checkTouchTargetSize(element: HTMLElement): TouchTargetSize {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG AAA minimum

  return {
    width: rect.width,
    height: rect.height,
    passes: rect.width >= minSize && rect.height >= minSize,
  };
}

/**
 * Get recommended touch target classes
 */
export function getTouchTargetClasses(
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const sizes = {
    small: 'min-h-[44px] min-w-[44px] p-2',
    medium: 'min-h-[48px] min-w-[48px] p-3',
    large: 'min-h-[56px] min-w-[56px] p-4',
  };

  return sizes[size];
}

// ============================================================================
// ALT TEXT UTILITIES
// ============================================================================

const POOR_ALT_PATTERNS = [
  /^image$/i,
  /^picture$/i,
  /^photo$/i,
  /^img$/i,
  /^screenshot$/i,
  /^untitled$/i,
  /^image_?\d+$/i,
  /^dsc_?\d+$/i,
  /^img_?\d+$/i,
];

/**
 * Validate alt text quality
 */
export function validateAltText(alt: string): {
  valid: boolean;
  reason?: string;
} {
  if (!alt || alt.trim().length === 0) {
    return { valid: false, reason: 'Alt text is empty' };
  }

  if (alt.length > 250) {
    return {
      valid: false,
      reason: 'Alt text too long (max 250 characters recommended)',
    };
  }

  for (const pattern of POOR_ALT_PATTERNS) {
    if (pattern.test(alt.trim())) {
      return {
        valid: false,
        reason: 'Alt text is not descriptive enough',
      };
    }
  }

  return { valid: true };
}

/**
 * Generate product alt text
 */
export function generateProductAlt(
  productName: string,
  variant?: string,
  imageType?: string
): string {
  const parts = [productName];

  if (variant) parts.push(`in ${variant}`);
  if (imageType) parts.push(`- ${imageType} view`);

  return parts.join(' ');
}

/**
 * Check if image is decorative
 */
export function isDecorativeImage(
  src: string,
  context?: string
): boolean {
  const decorativePatterns = [
    /decoration/i,
    /background/i,
    /spacer/i,
    /divider/i,
    /ornament/i,
    /pattern/i,
  ];

  return decorativePatterns.some(
    (pattern) =>
      pattern.test(src) || (context && pattern.test(context))
  );
}

// ============================================================================
// FORM ACCESSIBILITY UTILITIES
// ============================================================================

export interface FormFieldValidation {
  required: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: string) => string | null;
}

/**
 * Generate accessible form field attributes
 */
export function getFormFieldAttributes(
  name: string,
  label: string,
  validation?: FormFieldValidation,
  errorMessage?: string
): {
  id: string;
  name: string;
  'aria-label': string;
  'aria-required'?: 'true';
  'aria-invalid'?: 'true';
  'aria-describedby'?: string;
} {
  const id = generateAriaId(name);
  const attributes: any = {
    id,
    name,
    'aria-label': label,
  };

  if (validation?.required) {
    attributes['aria-required'] = 'true';
  }

  if (errorMessage) {
    attributes['aria-invalid'] = 'true';
    attributes['aria-describedby'] = `${id}-error`;
  }

  return attributes;
}

// ============================================================================
// MOTION PREFERENCE UTILITIES
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get safe animation duration
 */
export function getSafeAnimationDuration(
  defaultDuration: number,
  reducedDuration: number = 0
): number {
  return prefersReducedMotion() ? reducedDuration : defaultDuration;
}

/**
 * Get safe animation classes
 */
export function getSafeAnimationClasses(animationClass: string): string {
  return prefersReducedMotion() ? '' : animationClass;
}

// ============================================================================
// COMPREHENSIVE ACCESSIBILITY CHECKER
// ============================================================================

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  element?: HTMLElement;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

/**
 * Perform comprehensive accessibility audit
 */
export function auditAccessibility(
  container: HTMLElement = document.body
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check images
  const images = container.querySelectorAll<HTMLImageElement>('img');
  images.forEach((img) => {
    if (!img.alt && img.alt !== '') {
      issues.push({
        type: 'error',
        category: 'Images',
        message: `Image missing alt attribute: ${img.src}`,
        element: img,
        wcagLevel: 'A',
      });
    } else if (img.alt) {
      const validation = validateAltText(img.alt);
      if (!validation.valid) {
        issues.push({
          type: 'warning',
          category: 'Images',
          message: `Poor alt text: ${validation.reason}`,
          element: img,
          wcagLevel: 'AA',
        });
      }
    }
  });

  // Check form inputs
  const inputs = container.querySelectorAll<HTMLInputElement>(
    'input:not([type="hidden"]), textarea, select'
  );
  inputs.forEach((input) => {
    const hasLabel =
      input.labels?.length ||
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby');

    if (!hasLabel) {
      issues.push({
        type: 'error',
        category: 'Forms',
        message: `Form input missing label: ${input.name || input.id}`,
        element: input,
        wcagLevel: 'A',
      });
    }
  });

  // Check buttons
  const buttons = container.querySelectorAll<HTMLButtonElement>(
    'button, [role="button"]'
  );
  buttons.forEach((button) => {
    const hasText =
      button.textContent?.trim() ||
      button.getAttribute('aria-label') ||
      button.getAttribute('aria-labelledby');

    if (!hasText) {
      issues.push({
        type: 'error',
        category: 'Interactive',
        message: 'Button missing accessible text',
        element: button,
        wcagLevel: 'A',
      });
    }

    // Check touch target size
    const targetSize = checkTouchTargetSize(button);
    if (!targetSize.passes) {
      issues.push({
        type: 'warning',
        category: 'Touch Targets',
        message: `Button too small (${Math.round(targetSize.width)}x${Math.round(targetSize.height)}px). Minimum 44x44px required.`,
        element: button,
        wcagLevel: 'AAA',
      });
    }
  });

  // Check headings
  const headings = container.querySelectorAll<HTMLHeadingElement>(
    'h1, h2, h3, h4, h5, h6'
  );
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (level - previousLevel > 1) {
      issues.push({
        type: 'warning',
        category: 'Structure',
        message: `Heading level skipped from H${previousLevel} to H${level}`,
        element: heading,
        wcagLevel: 'AA',
      });
    }
    previousLevel = level;
  });

  // Check ARIA roles
  const ariaElements = container.querySelectorAll('[role]');
  ariaElements.forEach((element) => {
    const role = element.getAttribute('role');
    if (role === 'button' || role === 'link') {
      const hasTabIndex = element.hasAttribute('tabindex');
      if (!hasTabIndex) {
        issues.push({
          type: 'error',
          category: 'ARIA',
          message: `Interactive ARIA role without tabindex: ${role}`,
          element: element as HTMLElement,
          wcagLevel: 'A',
        });
      }
    }
  });

  return issues;
}

/**
 * Export all utilities
 */
export const a11yUtils = {
  // Color contrast
  hexToRgb,
  getLuminance,
  getContrastRatio,
  checkColorContrast,
  suggestAccessibleColor,

  // Focus management
  getFocusableElements,
  createFocusTrap,
  setFocus,

  // Screen readers
  announceToScreenReader,
  createAccessibleLabel,

  // Keyboard navigation
  handleActivationKeys,
  createArrowNavigationHandler,

  // ARIA
  setAriaAttributes,
  generateAriaId,
  createAriaLabelFromText,

  // Touch targets
  checkTouchTargetSize,
  getTouchTargetClasses,

  // Alt text
  validateAltText,
  generateProductAlt,
  isDecorativeImage,

  // Forms
  getFormFieldAttributes,

  // Motion
  prefersReducedMotion,
  getSafeAnimationDuration,
  getSafeAnimationClasses,

  // Audit
  auditAccessibility,
};

export default a11yUtils;
