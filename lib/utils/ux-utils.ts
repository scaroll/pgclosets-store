/**
 * UX Utility Functions
 * Collection of utility functions for UX components
 */

// Device detection utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 1024;
};

export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Accessibility utilities
export const generateId = (prefix = 'ux') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTab);

  return () => {
    container.removeEventListener('keydown', handleTab);
  };
};

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Animation utilities
export const getReducedMotionPreference = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const createAnimationConfig = (duration = 300, easing = 'ease-out') => {
  const reducedMotion = getReducedMotionPreference();

  return {
    duration: reducedMotion ? 0 : duration,
    ease: easing,
    transition: {
      duration: reducedMotion ? 0 : duration / 1000,
      ease: easing,
    },
  };
};

// Touch gesture utilities
export const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getTouchCenter = (touch1: Touch, touch2: Touch) => {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
};

export const getSwipeDirection = (startX: number, startY: number, endX: number, endY: number, threshold = 50) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
    return null;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left';
  } else {
    return deltaY > 0 ? 'down' : 'up';
  }
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Viewport utilities
export const isInViewport = (element: HTMLElement, threshold = 0) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

export const getViewportSize = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
};

// Color utilities for accessibility
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getContrastRatio = (foreground: string, background: string) => {
  const fgColor = hexToRgb(foreground);
  const bgColor = hexToRgb(background);

  if (!fgColor || !bgColor) return 0;

  const fgLum = getLuminance(fgColor.r, fgColor.g, fgColor.b);
  const bgLum = getLuminance(bgColor.r, bgColor.g, bgColor.b);

  const brightest = Math.max(fgLum, bgLum);
  const darkest = Math.min(fgLum, bgLum);

  return (brightest + 0.05) / (darkest + 0.05);
};

export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
) => {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
};

// Form utilities
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validatePassword = (password: string, requirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}) => {
  const errors: string[] = [];

  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Storage utilities
export const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Haptic feedback utility
export const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 30,
  };

  navigator.vibrate(patterns[intensity]);
};

// URL utilities
export const updateURLParams = (params: Record<string, string | null>) => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  window.history.replaceState({}, '', url.toString());
};

export const getURLParam = (key: string, defaultValue = '') => {
  if (typeof window === 'undefined') return defaultValue;

  const url = new URL(window.location.href);
  return url.searchParams.get(key) || defaultValue;
};

export default {
  // Device detection
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,

  // Accessibility
  generateId,
  trapFocus,
  announceToScreenReader,

  // Animation
  getReducedMotionPreference,
  createAnimationConfig,

  // Touch gestures
  getTouchDistance,
  getTouchCenter,
  getSwipeDirection,

  // Performance
  debounce,
  throttle,

  // Viewport
  isInViewport,
  getViewportSize,

  // Color/Accessibility
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,

  // Form validation
  validateEmail,
  validatePhone,
  validatePassword,

  // Storage
  saveToLocalStorage,
  loadFromLocalStorage,

  // Haptics
  triggerHapticFeedback,

  // URL
  updateURLParams,
  getURLParam,
};