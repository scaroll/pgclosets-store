"use client";

import React, { useState, useRef, useEffect, useId, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  AlertTriangle,
  CheckCircle,
  Info,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
  Home,
  Search,
  User,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Accessibility Context
interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreference: (key: keyof AccessibilityPreferences, value: any) => void;
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
}

interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'dark';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  autoplayMedia: boolean;
  audioDescriptions: boolean;
  focusIndicators: 'default' | 'enhanced' | 'high-contrast';
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: 'medium',
  contrast: 'normal',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
  autoplayMedia: true,
  audioDescriptions: false,
  focusIndicators: 'default',
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Accessibility Provider
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
  const announcementRef = useRef<HTMLDivElement>(null);

  const updatePreference = (key: keyof AccessibilityPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));

    // Apply system-level changes
    if (key === 'fontSize') {
      document.documentElement.style.fontSize = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '24px',
      }[value];
    }

    if (key === 'contrast') {
      document.documentElement.setAttribute('data-contrast', value);
    }

    if (key === 'reducedMotion') {
      document.documentElement.style.setProperty('--motion-duration', value ? '0ms' : '200ms');
    }
  };

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.textContent = '';
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = message;
          announcementRef.current.setAttribute('aria-live', priority);
        }
      }, 100);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, announceMessage }}>
      {children}
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </AccessibilityContext.Provider>
  );
};

// Screen Reader Only Component
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Focus Trap Component
interface FocusTrapProps {
  active: boolean;
  children: React.ReactNode;
  initialFocus?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  active,
  children,
  initialFocus,
  restoreFocus = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

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

    // Focus initial element
    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else {
      firstElement?.focus();
    }

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      if (restoreFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [active, initialFocus, restoreFocus]);

  return <div ref={containerRef}>{children}</div>;
};

// Skip Navigation Links
interface SkipLink {
  href: string;
  label: string;
}

interface SkipNavigationProps {
  links: SkipLink[];
  className?: string;
}

export const SkipNavigation: React.FC<SkipNavigationProps> = ({ links, className }) => {
  return (
    <div className={cn('sr-only focus-within:not-sr-only', className)}>
      <div className="fixed top-0 left-0 z-50 bg-blue-600 text-white p-4 space-x-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

// Accessible Button with enhanced focus states
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className,
}) => {
  const { preferences } = useAccessibility();

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const focusStyles = {
    default: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    enhanced: 'focus:outline-none focus:ring-4 focus:ring-offset-2',
    'high-contrast': 'focus:outline-2 focus:outline-yellow-400 focus:ring-4 focus:ring-yellow-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        focusStyles[preferences.focusIndicators],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};

// Accessible Modal/Dialog
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const { announceMessage, preferences } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      announceMessage(`Dialog opened: ${title}`, 'assertive');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, title, announceMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <FocusTrap active={isOpen}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{
                  duration: preferences.reducedMotion ? 0 : 0.2,
                }}
                className={cn(
                  'relative w-full max-w-lg bg-white rounded-lg shadow-xl',
                  className
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    aria-label="Close dialog"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Description */}
                {description && (
                  <div className="px-6 pt-4">
                    <p id={descriptionId} className="text-sm text-gray-600">
                      {description}
                    </p>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
              </motion.div>
            </FocusTrap>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Color Contrast Validator
interface ColorContrastProps {
  foreground: string;
  background: string;
  text: string;
  level?: 'AA' | 'AAA';
}

export const ColorContrastValidator: React.FC<ColorContrastProps> = ({
  foreground,
  background,
  text,
  level = 'AA',
}) => {
  const [contrast, setContrast] = useState<number>(0);
  const [passes, setPasses] = useState<boolean>(false);

  useEffect(() => {
    // Calculate color contrast ratio
    const calculateContrast = (fg: string, bg: string): number => {
      // This is a simplified calculation
      // In production, use a proper color contrast library
      const hex2rgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const luminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const fgColor = hex2rgb(fg);
      const bgColor = hex2rgb(bg);

      if (!fgColor || !bgColor) return 0;

      const fgLum = luminance(fgColor.r, fgColor.g, fgColor.b);
      const bgLum = luminance(bgColor.r, bgColor.g, bgColor.b);

      const brightest = Math.max(fgLum, bgLum);
      const darkest = Math.min(fgLum, bgLum);

      return (brightest + 0.05) / (darkest + 0.05);
    };

    const ratio = calculateContrast(foreground, background);
    setContrast(ratio);

    const threshold = level === 'AAA' ? 7 : 4.5;
    setPasses(ratio >= threshold);
  }, [foreground, background, level]);

  return (
    <div className="p-4 border rounded-lg">
      <div
        className="p-4 rounded mb-4"
        style={{ color: foreground, backgroundColor: background }}
      >
        {text}
      </div>
      <div className="flex items-center space-x-2">
        {passes ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
        <span className="text-sm">
          Contrast: {contrast.toFixed(2)}:1 ({level} {passes ? 'Pass' : 'Fail'})
        </span>
      </div>
    </div>
  );
};

// Accessible Data Table
interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface AccessibleTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  caption: string;
  sortable?: boolean;
  className?: string;
}

export function AccessibleTable<T extends Record<string, any>>({
  data,
  columns,
  caption,
  sortable = false,
  className,
}: AccessibleTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const { announceMessage } = useAccessibility();

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof T) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const column = columns.find(col => col.key === key);
    if (column) {
      announceMessage(
        `Table sorted by ${column.header}, ${direction === 'asc' ? 'ascending' : 'descending'}`
      );
    }
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse border border-gray-300" role="table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="bg-gray-50 border border-gray-300 px-4 py-2 text-left font-semibold"
                scope="col"
                {...(sortable && column.sortable && {
                  'aria-sort': sortConfig.key === column.key
                    ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                    : 'none'
                })}
              >
                {sortable && column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Sort by ${column.header}`}
                  >
                    <span>{column.header}</span>
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={String(column.key)}
                  className="border border-gray-300 px-4 py-2"
                  {...(colIndex === 0 && { scope: 'row' })}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Accessible Progress Bar
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
  className?: string;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  className,
}) => {
  const percentage = (value / max) * 100;
  const progressId = useId();

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <label htmlFor={progressId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {showValue && (
          <span className="text-sm text-gray-600" aria-live="polite">
            {value} / {max}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          id={progressId}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Accessibility Settings Panel
export const AccessibilitySettingsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, updatePreference } = useAccessibility();

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility Settings"
      description="Customize your accessibility preferences"
    >
      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <div className="space-y-2">
            {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
              <label key={size} className="flex items-center">
                <input
                  type="radio"
                  name="fontSize"
                  value={size}
                  checked={preferences.fontSize === size}
                  onChange={(e) => updatePreference('fontSize', e.target.value)}
                  className="mr-2"
                />
                <span className="capitalize">{size.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contrast */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contrast
          </label>
          <div className="space-y-2">
            {(['normal', 'high', 'dark'] as const).map((contrast) => (
              <label key={contrast} className="flex items-center">
                <input
                  type="radio"
                  name="contrast"
                  value={contrast}
                  checked={preferences.contrast === contrast}
                  onChange={(e) => updatePreference('contrast', e.target.value)}
                  className="mr-2"
                />
                <span className="capitalize">{contrast}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Motion */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
              className="mr-2"
            />
            Reduce Motion
          </label>
        </div>

        {/* Keyboard Navigation */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.keyboardNavigation}
              onChange={(e) => updatePreference('keyboardNavigation', e.target.checked)}
              className="mr-2"
            />
            Enhanced Keyboard Navigation
          </label>
        </div>

        {/* Screen Reader */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.screenReader}
              onChange={(e) => updatePreference('screenReader', e.target.checked)}
              className="mr-2"
            />
            Screen Reader Optimizations
          </label>
        </div>
      </div>
    </AccessibleModal>
  );
};

export default {
  AccessibilityProvider,
  useAccessibility,
  ScreenReaderOnly,
  FocusTrap,
  SkipNavigation,
  AccessibleButton,
  AccessibleModal,
  ColorContrastValidator,
  AccessibleTable,
  AccessibleProgress,
  AccessibilitySettingsPanel,
};