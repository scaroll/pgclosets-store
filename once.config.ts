/**
 * Once UI Configuration for PG Closets
 * Premium closet and storage solutions in Ottawa
 *
 * This configuration maps PG Closets' luxury brand identity to Once UI design tokens
 * Brand colors: Copper (#B87333), Charcoal (#2C2C2C), Cream (#F5F5DC)
 */

import type { OnceUIConfig } from '@once-ui-system/core';

const config: OnceUIConfig = {
  // ============================================================================
  // THEME CONFIGURATION
  // ============================================================================
  theme: {
    // Default theme mode
    defaultTheme: 'system', // 'light' | 'dark' | 'system'

    // Theme persistence
    storage: 'localStorage',
    storageKey: 'pg-closets-theme',

    // Color scheme configuration
    schemes: {
      // Neutral color scheme - Warm gray palette for sophistication
      neutral: 'gray', // Options: gray, sand, slate

      // Brand color - Copper accent for luxury
      brand: 'orange', // Will be customized with PG copper tones

      // Accent color - Charcoal for contrast
      accent: 'gray', // Will be customized with deep charcoal

      // Solid color style
      solid: 'contrast', // Options: color, contrast
      solidStyle: 'flat', // Options: flat, plastic
    },

    // Visual style configuration
    visual: {
      // Border style
      border: 'playful', // Options: rounded, playful, conservative

      // Surface style
      surface: 'filled', // Options: filled, translucent

      // Transition style
      transition: 'all', // Options: all, micro, macro
    },

    // Scaling (font size, spacing, etc.)
    scaling: 100, // 90-110 recommended range

    // Data visualization style
    vizStyle: 'categorical', // Options: categorical, sequential
  },

  // ============================================================================
  // CUSTOM COLOR TOKENS - PG Closets Brand Identity
  // ============================================================================
  tokens: {
    colors: {
      // Custom brand color - Copper
      brand: {
        100: '#fef8f5',
        200: '#fcefe7',
        300: '#f9dcc9',
        400: '#f4c2a2',
        500: '#eca270',
        600: '#e38446', // Primary Copper
        700: '#8b4020', // AAA compliant
        800: '#7a3a1e',
        900: '#5f2d18',
      },

      // Custom accent color - Charcoal
      accent: {
        100: '#f8f7f6',
        200: '#f0eeec',
        300: '#ddd9d5',
        400: '#c4bfb8',
        500: '#a39d94',
        600: '#7f7a72',
        700: '#5e5a54',
        800: '#3d3a36',
        900: '#2d2a27', // Primary Charcoal
      },

      // Semantic colors (already WCAG AAA compliant)
      semantic: {
        success: {
          DEFAULT: '#065f46',
          light: '#d1fae5',
          dark: '#064e3b',
        },
        warning: {
          DEFAULT: '#78350f',
          light: '#fef3c7',
          dark: '#713f12',
        },
        error: {
          DEFAULT: '#991b1b',
          light: '#fee2e2',
          dark: '#7f1d1d',
        },
        info: {
          DEFAULT: '#1e40af',
          light: '#dbeafe',
          dark: '#1e3a8a',
        },
      },
    },

    // Typography configuration
    typography: {
      fontFamily: {
        display: 'var(--font-cormorant), Georgia, Times New Roman, serif',
        body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif',
        mono: 'Menlo, Monaco, Courier New, monospace',
      },

      // Font size scale (rem units)
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '3.75rem', // 60px
      },

      // Font weight scale
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },

      // Line height scale
      lineHeight: {
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },

      // Letter spacing
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },

    // Spacing scale (4px base unit)
    spacing: {
      0: '0',
      1: '0.25rem',   // 4px
      2: '0.5rem',    // 8px
      3: '0.75rem',   // 12px
      4: '1rem',      // 16px
      5: '1.25rem',   // 20px
      6: '1.5rem',    // 24px
      8: '2rem',      // 32px
      10: '2.5rem',   // 40px
      12: '3rem',     // 48px
      16: '4rem',     // 64px
      20: '5rem',     // 80px
      24: '6rem',     // 96px
      32: '8rem',     // 128px
      40: '10rem',    // 160px
      48: '12rem',    // 192px
      56: '14rem',    // 224px
      64: '16rem',    // 256px
    },

    // Border radius scale
    borderRadius: {
      none: '0',
      sm: '0.125rem',   // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      '2xl': '1rem',    // 16px
      '3xl': '1.5rem',  // 24px
      full: '9999px',
    },

    // Shadow scale
    shadows: {
      sm: '0 1px 2px 0 rgba(28, 26, 24, 0.05)',
      DEFAULT: '0 4px 6px -1px rgba(28, 26, 24, 0.1), 0 2px 4px -1px rgba(28, 26, 24, 0.06)',
      md: '0 4px 6px -1px rgba(28, 26, 24, 0.1), 0 2px 4px -1px rgba(28, 26, 24, 0.06)',
      lg: '0 10px 15px -3px rgba(28, 26, 24, 0.1), 0 4px 6px -2px rgba(28, 26, 24, 0.05)',
      xl: '0 20px 25px -5px rgba(28, 26, 24, 0.1), 0 10px 10px -5px rgba(28, 26, 24, 0.04)',
      '2xl': '0 25px 50px -12px rgba(28, 26, 24, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(28, 26, 24, 0.06)',
      // Premium copper-tinted shadows
      premium: '0 8px 32px -4px rgba(227, 132, 70, 0.12), 0 4px 16px -2px rgba(28, 26, 24, 0.08)',
      premiumHover: '0 12px 40px -4px rgba(227, 132, 70, 0.18), 0 8px 24px -4px rgba(28, 26, 24, 0.12)',
    },

    // Z-index scale
    zIndex: {
      base: 0,
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modalBackdrop: 1040,
      modal: 1050,
      popover: 1060,
      tooltip: 1070,
    },
  },

  // ============================================================================
  // RESPONSIVE BREAKPOINTS
  // ============================================================================
  breakpoints: {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px', // Extra large desktop
  },

  // ============================================================================
  // COMPONENT DEFAULTS
  // ============================================================================
  components: {
    // Button defaults
    button: {
      defaultVariant: 'primary',
      defaultSize: 'md',
      // Copper primary, charcoal secondary
    },

    // Input defaults
    input: {
      defaultSize: 'md',
      defaultVariant: 'outline',
    },

    // Card defaults
    card: {
      defaultPadding: 'md',
      defaultRadius: 'lg',
    },
  },

  // ============================================================================
  // ANIMATION & TRANSITIONS
  // ============================================================================
  animation: {
    // Transition durations (ms)
    duration: {
      fast: 150,
      DEFAULT: 200,
      slow: 300,
      slower: 500,
    },

    // Easing functions
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Reduced motion preference
    respectMotionPreference: true,
  },

  // ============================================================================
  // ACCESSIBILITY
  // ============================================================================
  a11y: {
    // Focus visible style
    focusVisible: {
      style: 'ring', // 'ring' | 'outline' | 'custom'
      color: 'brand', // Use brand color (copper) for focus
      width: '2px',
      offset: '2px',
    },

    // Skip to content link
    skipToContent: true,

    // Announce changes to screen readers
    announceRouteChanges: true,

    // Color contrast warnings (dev only)
    colorContrastWarnings: true,
  },

  // ============================================================================
  // PERFORMANCE
  // ============================================================================
  performance: {
    // Lazy load images
    lazyLoadImages: true,

    // Optimize animations
    optimizeAnimations: true,

    // Prefetch links
    prefetchLinks: false,
  },

  // ============================================================================
  // SEO & META
  // ============================================================================
  seo: {
    // Default meta tags
    defaultTitle: 'PG Closets | Custom Closets & Storage Solutions in Ottawa',
    titleTemplate: '%s | PG Closets',
    defaultDescription: 'Custom closets, pantries & storage solutions in Ottawa. Professional design & installation by local experts.',

    // OpenGraph defaults
    ogImage: '/images/og-image.png',
    ogType: 'website',

    // Twitter card
    twitterCard: 'summary_large_image',
    twitterSite: '@pgclosets',
  },
};

export default config;

// Type exports for TypeScript support
export type { OnceUIConfig };
