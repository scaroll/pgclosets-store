/**
 * Design System Utility Functions
 * Optimized for production with minimal bundle size
 */

// Get CSS variable value from root
export const getCSSVar = (varName: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

// Set CSS variable on root
export const setCSSVar = (varName: string, value: string): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(varName, value);
};

// Token getters - memoized for performance
const tokenCache = new Map<string, string>();

export const getToken = (category: string, key: string): string => {
  const cacheKey = `${category}-${key}`;
  if (tokenCache.has(cacheKey)) return tokenCache.get(cacheKey)!;

  const varName = `--${category}-${key}`;
  const value = getCSSVar(varName);
  tokenCache.set(cacheKey, value);
  return value;
};

// Color utilities
export const color = {
  primary: () => getCSSVar('--color-primary'),
  secondary: () => getCSSVar('--color-secondary'),
  accent: () => getCSSVar('--color-accent'),
  text: (variant: 'primary' | 'secondary' | 'muted' | 'inverse' = 'primary') =>
    getCSSVar(`--text-${variant}`),
  bg: (variant: 'primary' | 'secondary' | 'tertiary' | 'overlay' = 'primary') =>
    getCSSVar(`--bg-${variant}`),
  border: (variant: 'default' | 'light' | 'dark' = 'default') =>
    getCSSVar(`--border-${variant}`),
  status: (type: 'error' | 'success' | 'warning' | 'info') =>
    getCSSVar(`--status-${type}`),
};

// Spacing utilities
export const spacing = {
  xs: () => getCSSVar('--spacing-xs'),
  sm: () => getCSSVar('--spacing-sm'),
  md: () => getCSSVar('--spacing-md'),
  lg: () => getCSSVar('--spacing-lg'),
  xl: () => getCSSVar('--spacing-xl'),
  '2xl': () => getCSSVar('--spacing-2xl'),
  '3xl': () => getCSSVar('--spacing-3xl'),
  '4xl': () => getCSSVar('--spacing-4xl'),
  get: (size: string) => getCSSVar(`--spacing-${size}`),
};

// Typography utilities
export const typography = {
  size: (size: string) => getCSSVar(`--text-${size}`),
  weight: (weight: 'light' | 'regular' | 'medium' | 'semibold' | 'bold') =>
    getCSSVar(`--font-${weight}`),
  lineHeight: (height: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose') =>
    getCSSVar(`--leading-${height}`),
  font: (family: 'sans' | 'mono') => getCSSVar(`--font-${family}`),
};

// Shadow utilities
export const shadow = {
  xs: () => getCSSVar('--shadow-xs'),
  sm: () => getCSSVar('--shadow-sm'),
  md: () => getCSSVar('--shadow-md'),
  lg: () => getCSSVar('--shadow-lg'),
  xl: () => getCSSVar('--shadow-xl'),
  '2xl': () => getCSSVar('--shadow-2xl'),
  get: (size: string) => getCSSVar(`--shadow-${size}`),
};

// Animation utilities
export const animation = {
  duration: (speed: 'fast' | 'normal' | 'slow' | 'slower') =>
    getCSSVar(`--duration-${speed}`),
  easing: (type: 'in-out' | 'out' | 'in' | 'apple' = 'apple') =>
    getCSSVar(`--ease-${type}`),
  transition: (
    property = 'all',
    duration = 'normal',
    easing = 'apple'
  ) => `${property} ${animation.duration(duration)} ${animation.easing(easing)}`,
};

// Border radius utilities
export const radius = {
  sm: () => getCSSVar('--radius-sm'),
  md: () => getCSSVar('--radius-md'),
  lg: () => getCSSVar('--radius-lg'),
  xl: () => getCSSVar('--radius-xl'),
  '2xl': () => getCSSVar('--radius-2xl'),
  full: () => getCSSVar('--radius-full'),
  get: (size: string) => getCSSVar(`--radius-${size}`),
};

// Z-index utilities
export const zIndex = {
  dropdown: () => getCSSVar('--z-dropdown'),
  sticky: () => getCSSVar('--z-sticky'),
  fixed: () => getCSSVar('--z-fixed'),
  modalBackdrop: () => getCSSVar('--z-modal-backdrop'),
  modal: () => getCSSVar('--z-modal'),
  popover: () => getCSSVar('--z-popover'),
  tooltip: () => getCSSVar('--z-tooltip'),
  notification: () => getCSSVar('--z-notification'),
};

// Breakpoint utilities
export const breakpoints = {
  sm: 430,
  md: 744,
  lg: 1068,
  xl: 1440,

  up: (breakpoint: keyof typeof breakpoints) =>
    `(min-width: ${breakpoints[breakpoint]}px)`,
  down: (breakpoint: keyof typeof breakpoints) =>
    `(max-width: ${breakpoints[breakpoint] - 1}px)`,
  between: (min: keyof typeof breakpoints, max: keyof typeof breakpoints) =>
    `(min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px)`,
};

// Media query helper
export const mq = breakpoints;

// Theme utilities
export const theme = {
  isDark: () => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  },
  toggle: () => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark');
    const newTheme = theme.isDark() ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return newTheme;
  },
  set: (newTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  },
};

// Class name utilities
export const cn = (...classes: (string | undefined | null | boolean)[]) =>
  classes.filter(Boolean).join(' ');

// Style object builder for inline styles
export const styleBuilder = {
  spacing: (top?: string, right?: string, bottom?: string, left?: string) => {
    const t = top ? spacing.get(top) : undefined;
    const r = right ? spacing.get(right) : undefined;
    const b = bottom ? spacing.get(bottom) : undefined;
    const l = left ? spacing.get(left) : undefined;

    return {
      ...(t && { paddingTop: t }),
      ...(r && { paddingRight: r }),
      ...(b && { paddingBottom: b }),
      ...(l && { paddingLeft: l }),
    };
  },

  flex: (
    direction?: 'row' | 'column',
    justify?: 'start' | 'center' | 'end' | 'between' | 'around',
    align?: 'start' | 'center' | 'end' | 'stretch'
  ) => ({
    display: 'flex',
    ...(direction && { flexDirection: direction }),
    ...(justify && {
      justifyContent: justify === 'between' ? 'space-between' :
                     justify === 'around' ? 'space-around' :
                     `flex-${justify}`
    }),
    ...(align && { alignItems: align === 'stretch' ? 'stretch' : `flex-${align}` }),
  }),

  grid: (cols?: number, gap?: string) => ({
    display: 'grid',
    ...(cols && { gridTemplateColumns: `repeat(${cols}, 1fr)` }),
    ...(gap && { gap: spacing.get(gap) }),
  }),
};

// Export all utilities as a single object for convenience
export const ds = {
  color,
  spacing,
  typography,
  shadow,
  animation,
  radius,
  zIndex,
  breakpoints,
  mq,
  theme,
  cn,
  style: styleBuilder,
  getCSSVar,
  setCSSVar,
  getToken,
};