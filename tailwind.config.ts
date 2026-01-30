import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'

/**
 * PG Closets Unified Design System Tailwind Configuration
 * Optimized for production with design token integration
 * Premium Apple-inspired design for Ottawa luxury market
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
  // Prevent `delay-*` ambiguity between Tailwind's transition-delay utilities and
  // tailwindcss-animate's animation-delay utilities.
  corePlugins: {
    transitionDelay: false,
  },
  theme: {
    // Advanced Mobile-First Breakpoint System
    screens: {
      xs: '320px',
      xsm: '375px',
      sm: '430px',
      sml: '480px',
      md: '640px',
      lmd: '736px',
      lg: '768px',
      lgl: '834px',
      xl: '960px',
      lxl: '1024px',
      '2xl': '1280px',
      '2xlx': '1366px',
      '3xl': '1440px',
      '3xlx': '1536px',
      '4xl': '1920px',
      '5xl': '2560px',

      mobile: { max: '767px' },
      tablet: { min: '768px', max: '1023px' },
      desktop: { min: '1024px' },

      'fold-small': { max: '380px' },
      'fold-large': { min: '381px', max: '480px' },

      portrait: { raw: '(orientation: portrait)' },
      landscape: { raw: '(orientation: landscape)' },

      retina: { raw: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)' },
      'ultra-retina': { raw: '(-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)' },

      touch: { raw: '(hover: none) and (pointer: coarse)' },
      hover: { raw: '(hover: hover) and (pointer: fine)' },

      'motion-safe': { raw: '(prefers-reduced-motion: no-preference)' },
      'motion-reduce': { raw: '(prefers-reduced-motion: reduce)' },

      'dark-preferred': { raw: '(prefers-color-scheme: dark)' },
      'light-preferred': { raw: '(prefers-color-scheme: light)' },

      'data-saver': { raw: '(prefers-reduced-data: reduce)' },
      'data-plenty': { raw: '(prefers-reduced-data: no-preference)' },
    },
    extend: {
      colors: {
        // APPLE COLOR DNA
        'apple-gray': {
          50: '#ffffff',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#b0b0b5',
          500: '#86868b',
          600: '#6e6e73',
          700: '#515154',
          800: '#424245',
          900: '#1d1d1f',
          950: '#000000',
        },
        'apple-blue': {
          400: '#007aff',
          500: '#0071e3',
          600: '#0066cc',
          dark: '#0a84ff',
          'dark-hover': '#409cff',
        },
        'apple-dark': {
          bg: '#000000',
          'bg-elevated': '#1d1d1f',
          'bg-secondary': '#2c2c2e',
          'bg-tertiary': '#3a3a3c',
          text: '#f5f5f7',
          'text-secondary': '#98989d',
          'text-tertiary': '#6e6e73',
          border: 'rgba(255, 255, 255, 0.15)',
          'border-heavy': 'rgba(255, 255, 255, 0.25)',
        },

        // PG CLOSETS BRAND COLORS
        woodgrain: {
          DEFAULT: '#8B7355',
          50: '#FAF8F6',
          100: '#F2EDE7',
          200: '#E5DBCF',
          300: '#D1BFAD',
          400: '#B49A82',
          500: '#8B7355',
          600: '#6F5A44',
          700: '#5A4836',
          800: '#483929',
          900: '#2F261C',
        },
        metal: {
          DEFAULT: '#A8A8A8',
          50: '#F8F8F8',
          100: '#ECECEC',
          200: '#D9D9D9',
          300: '#BFBFBF',
          400: '#A8A8A8',
          500: '#8C8C8C',
          600: '#707070',
          700: '#5A5A5A',
          800: '#454545',
          900: '#2B2B2B',
          'rose-gold': '#B76E79',
          bronze: '#CD7F32',
          champagne: '#F7E7CE',
        },
        storage: {
          DEFAULT: '#4A5568',
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        door: {
          DEFAULT: '#2C5F4F',
          50: '#F0F7F4',
          100: '#D6EDE5',
          200: '#ADDCCB',
          300: '#7DC5AA',
          400: '#4FA884',
          500: '#2C5F4F',
          600: '#234C3F',
          700: '#1C3D33',
          800: '#162F28',
          900: '#0F211C',
        },
        premium: {
          cream: '#F5F1EA',
          linen: '#EAE4D8',
          marble: '#F8F8F8',
          onyx: '#1A1A1A',
          pearl: '#FFFEF7',
          obsidian: '#0A0A0A',
        },

        // SEMANTIC COLORS
        success: {
          DEFAULT: '#388E3C',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#0D3F17',
        },
        warning: {
          DEFAULT: '#F57C00',
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#F57C00',
          600: '#E65100',
          700: '#BF4300',
          800: '#993600',
          900: '#732900',
        },
        error: {
          DEFAULT: '#C62828',
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#C62828',
          600: '#B71C1C',
          700: '#8E1717',
          800: '#661212',
          900: '#3E0D0D',
        },
        info: {
          DEFAULT: '#0277BD',
          50: '#E1F5FE',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#0277BD',
          600: '#01579B',
          700: '#014A7F',
          800: '#013D63',
          900: '#003047',
        },

        // SHADCN/UI COMPATIBILITY
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
      },

      // TYPOGRAPHY SYSTEM
      fontFamily: {
        'sf-display': [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        'sf-text': [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        display: ['var(--font-inter)', 'Georgia', 'Times New Roman', 'serif'],
        body: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      fontSize: {
        'apple-11': ['0.6875rem', { lineHeight: '1.45454', letterSpacing: '0' }],
        'apple-13': ['0.8125rem', { lineHeight: '1.38462', letterSpacing: '0' }],
        'apple-15': ['0.9375rem', { lineHeight: '1.46667', letterSpacing: '0' }],
        'apple-17': ['1.0625rem', { lineHeight: '1.47059', letterSpacing: '0' }],
        'apple-21': ['1.3125rem', { lineHeight: '1.28571', letterSpacing: '-0.015em' }],
        'apple-28': ['1.75rem', { lineHeight: '1.14286', letterSpacing: '-0.015em' }],
        'apple-34': ['2.125rem', { lineHeight: '1.11765', letterSpacing: '-0.02em' }],
        'apple-48': ['3rem', { lineHeight: '1.08333', letterSpacing: '-0.025em' }],
        'apple-64': ['4rem', { lineHeight: '1.0625', letterSpacing: '-0.03em' }],
        'apple-80': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
      },

      // GRADIENT SYSTEM
      backgroundImage: {
        'apple-gradient-blue': 'linear-gradient(180deg, #007aff 0%, #0066cc 100%)',
        'apple-gradient-gray': 'linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%)',
        'apple-gradient-dark': 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',
        'gradient-woodgrain': 'linear-gradient(135deg, #5A4836 0%, #8B7355 50%, #6F5A44 100%)',
        'gradient-metal': 'linear-gradient(135deg, #8C8C8C 0%, #A8A8A8 50%, #8C8C8C 100%)',
        'gradient-premium': 'linear-gradient(135deg, #F5F1EA 0%, #EAE4D8 50%, #F5F1EA 100%)',
        'glass-light':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 100%)',
      },

      // SHADOW SYSTEM
      boxShadow: {
        'apple-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'apple-md': '0 4px 10px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 20px 40px 0 rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'apple-xl': '0 40px 80px 0 rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.05)',
        floating: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)',
        elevated: '0 30px 80px rgba(0, 0, 0, 0.12), 0 12px 30px rgba(0, 0, 0, 0.06)',
        modal: '0 50px 100px rgba(0, 0, 0, 0.25), 0 20px 50px rgba(0, 0, 0, 0.15)',
        inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },

      // SPACING SYSTEM
      spacing: {
        'apple-xs': '0.5rem',
        'apple-sm': '0.75rem',
        'apple-md': '1rem',
        'apple-lg': '1.5rem',
        'apple-xl': '2rem',
        'apple-2xl': '2.5rem',
        'apple-3xl': '3rem',
        'apple-4xl': '5rem',
        'apple-5xl': '7.5rem',
        'apple-6xl': '10rem',
      },

      // MAX WIDTH SYSTEM
      maxWidth: {
        'apple-text': '40rem',
        'apple-content': '64rem',
        'apple-page': '90rem',
        'apple-narrow': '48rem',
        'apple-wide': '80rem',
      },

      // ANIMATIONS
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
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
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-down': 'fade-down 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scale-in 0.4s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        shimmer: 'shimmer 2s infinite ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        apple: '10px',
        'apple-sm': '6px',
        'apple-lg': '16px',
      },

      zIndex: {
        base: '0',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },
    },
  },
  plugins: [tailwindAnimate],
}

export default config
