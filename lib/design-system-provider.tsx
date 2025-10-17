'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

// Design token types
interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  shadows: Record<string, string>;
  animations: Record<string, string>;
  breakpoints: Record<string, string>;
  radius: Record<string, string>;
}

interface DesignSystemContextType {
  tokens: DesignTokens;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

// Default design tokens from CSS variables
const defaultTokens: DesignTokens = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    muted: 'var(--color-muted)',
    background: 'var(--bg-primary)',
    foreground: 'var(--text-primary)',
    border: 'var(--border-default)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
    '4xl': 'var(--spacing-4xl)',
  },
  typography: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
    '3xl': 'var(--text-3xl)',
    '4xl': 'var(--text-4xl)',
    '5xl': 'var(--text-5xl)',
    '6xl': 'var(--text-6xl)',
  },
  shadows: {
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
  },
  animations: {
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
    slower: 'var(--duration-slower)',
    ease: 'var(--ease-apple)',
  },
  breakpoints: {
    sm: '430px',
    md: '744px',
    lg: '1068px',
    xl: '1440px',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    full: 'var(--radius-full)',
  },
};

interface DesignSystemProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export function DesignSystemProvider({
  children,
  defaultTheme = 'light'
}: DesignSystemProviderProps) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(defaultTheme);

  // Sync theme with system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', e.matches);
    };

    // Set initial theme
    if (mediaQuery.matches && defaultTheme === 'light') {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [defaultTheme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const value: DesignSystemContextType = {
    tokens: defaultTokens,
    theme,
    setTheme,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within DesignSystemProvider');
  }
  return context;
}

// Utility hook for responsive design
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 430) setBreakpoint('sm');
      else if (width < 744) setBreakpoint('md');
      else if (width < 1068) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
  };
}

// Animation hook for consistent animations
export function useAnimation(type: keyof DesignTokens['animations'] = 'normal') {
  const { tokens } = useDesignSystem();

  return {
    duration: tokens.animations[type],
    className: `transition-all duration-[${tokens.animations[type]}] ease-[${tokens.animations.ease}]`,
  };
}

import { useState } from 'react';