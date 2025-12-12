import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

/**
 * PG Closets Design System - Kit and Ace Inspired
 * Elevated simplicity, quiet confidence, warm neutrals
 * Sharp corners, light font weights, minimal shadows
 */

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{css,scss}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Responsive Breakpoint System
    screens: {
      xs: '320px',
      sm: '480px',
      md: '640px',
      lg: '768px',
      xl: '1024px',
      '2xl': '1280px',
      '3xl': '1440px',
      '4xl': '1920px',

      // Device-specific
      mobile: { max: '767px' },
      tablet: { min: '768px', max: '1023px' },
      desktop: { min: '1024px' },

      // Preference queries
      'motion-safe': { raw: '(prefers-reduced-motion: no-preference)' },
      'motion-reduce': { raw: '(prefers-reduced-motion: reduce)' },
    },
    extend: {
      colors: {
        // ========================================
        // KIT AND ACE - WARM NEUTRALS
        // Elevated simplicity, quiet confidence
        // ========================================

        // Warm Whites & Backgrounds
        warm: {
          white: '#FAFAF8',
          gray: '#F5F5F3',
          50: '#FAFAF8',
          100: '#F5F5F3',
          200: '#EEEDE9',
          300: '#E5E5E3',
          400: '#D4D4D0',
          500: '#A3A39F',
          600: '#6B6B6B',
          700: '#4A4A48',
          800: '#2D2D2B',
          900: '#1A1A1A',
        },

        // Bronze Accent - Warm, sophisticated
        bronze: {
          DEFAULT: '#8B7355',
          50: '#F7F4F1',
          100: '#EDE7E0',
          200: '#DDD2C4',
          300: '#C9B8A5',
          400: '#B49A82',
          500: '#8B7355',
          600: '#6F5A44',
          700: '#5A4836',
          800: '#483929',
          900: '#2F261C',
        },

        // Slate - Refined text colors
        slate: {
          DEFAULT: '#1A1A1A',
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#8C8C8C',
          500: '#6B6B6B',
          600: '#4A4A48',
          700: '#333331',
          800: '#242422',
          900: '#1A1A1A',
          950: '#0D0D0D',
        },

        // ========================================
        // SHADCN/UI COMPATIBILITY
        // ========================================

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Semantic colors
        success: {
          DEFAULT: '#3D7A4A',
          50: '#F0F7F1',
          500: '#3D7A4A',
          600: '#2D5A36',
        },
        warning: {
          DEFAULT: '#B5792E',
          50: '#FDF8F0',
          500: '#B5792E',
          600: '#8A5A1F',
        },
        error: {
          DEFAULT: '#B54B4B',
          50: '#FDF0F0',
          500: '#B54B4B',
          600: '#8A3636',
        },
      },

      // ========================================
      // TYPOGRAPHY - GEIST FONTS
      // Light weights, refined hierarchy
      // ========================================

      fontFamily: {
        // Kit and Ace typography - Modern system font stack
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
      },

      fontSize: {
        // Kit and Ace type scale - refined, minimal
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        base: ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },

      // ========================================
      // SPACING - GENEROUS WHITESPACE
      // ========================================

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
      },

      maxWidth: {
        content: '42rem', // 672px - optimal reading width
        narrow: '52rem', // 832px - narrow content
        wide: '72rem', // 1152px - wide content
        page: '90rem', // 1440px - max page width
      },

      // ========================================
      // SHADOWS - MINIMAL, SUBTLE
      // ========================================

      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        elevated: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
        none: 'none',
      },

      // ========================================
      // BORDER RADIUS - SHARP CORNERS
      // Kit and Ace: 0-4px radius
      // ========================================

      borderRadius: {
        none: '0',
        sm: '0.125rem', // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.25rem', // 4px
        lg: '0.375rem', // 6px - max for Kit and Ace
        xl: '0.5rem', // 8px
        full: '9999px',
      },

      // ========================================
      // ANIMATIONS - SUBTLE, REFINED
      // ========================================

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      // ========================================
      // TRANSITIONS
      // ========================================

      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ========================================
      // Z-INDEX SCALE
      // ========================================

      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },

      // ========================================
      // BACKDROP BLUR
      // ========================================

      backdropBlur: {
        xs: '4px',
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
