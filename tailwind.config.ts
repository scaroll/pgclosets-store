// @ts-nocheck - Tailwind config with unused cssVar
import type { Config } from "tailwindcss";

/**
 * PG Closets Unified Design System Tailwind Configuration
 * Optimized for production with design token integration
 * Premium Apple-inspired design for Ottawa luxury market
 */

// Design token integration functions
const _cssVar = (name: string) => `var(--${name})`;
// const spacing = (name: string) => cssVar(`spacing-${name}`);
// const text = (name: string) => cssVar(`text-${name}`);
// const shadow = (name: string) => cssVar(`shadow-${name}`);
// const radius = (name: string) => cssVar(`radius-${name}`);

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    // Advanced Mobile-First Breakpoint System
    // Comprehensive coverage from small phones to large displays
    screens: {
      // Ultra-small mobile devices
      'xs': '320px',   // iPhone SE minimum safe area
      'xsm': '375px',  // iPhone SE/mini - Small mobile
      'sm': '430px',   // iPhone 14 Pro/15 - Standard mobile
      'sml': '480px',  // Large phones/Foldable

      // Tablets and small laptops
      'md': '640px',   // Small tablets (iPad Mini)
      'lmd': '736px',  // iPad Air portrait
      'lg': '768px',   // iPad/Small tablets
      'lgl': '834px',  // iPad Pro 11"
      'xl': '960px',   // Large tablets/Small laptops
      'lxl': '1024px', // iPad Pro 12.9"/Small desktop

      // Desktop displays
      '2xl': '1280px', // Standard desktop
      '2xlx': '1366px', // Laptop standard
      '3xl': '1440px', // Large desktop (iMac)
      '3xlx': '1536px', // MacBook Pro
      '4xl': '1920px', // Full HD desktop
      '5xl': '2560px', // 4K displays

      // Custom device-specific breakpoints
      'mobile': {'max': '767px'},    // Mobile-only queries
      'tablet': {'min': '768px', 'max': '1023px'}, // Tablet-specific
      'desktop': {'min': '1024px'},  // Desktop and up

      // Foldable phone support
      'fold-small': {'max': '380px'}, // Small foldable screens
      'fold-large': {'min': '381px', 'max': '480px'}, // Large foldable

      // Orientation-specific
      'portrait': {'raw': '(orientation: portrait)'},
      'landscape': {'raw': '(orientation: landscape)'},

      // Device pixel ratio optimization
      'retina': {'raw': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'},
      'ultra-retina': {'raw': '(-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)'},

      // Touch device detection
      'touch': {'raw': '(hover: none) and (pointer: coarse)'},
      'hover': {'raw': '(hover: hover) and (pointer: fine)'},

      // Reduced motion support
      'motion-safe': {'raw': '(prefers-reduced-motion: no-preference)'},
      'motion-reduce': {'raw': '(prefers-reduced-motion: reduce)'},

      // Dark mode preference
      'dark-preferred': {'raw': '(prefers-color-scheme: dark)'},
      'light-preferred': {'raw': '(prefers-color-scheme: light)'},

      // Data saving mode
      'data-saver': {'raw': '(prefers-reduced-data: reduce)'},
      'data-plenty': {'raw': '(prefers-reduced-data: no-preference)'},
    },
    extend: {
      colors: {
        // ========================================
        // APPLE COLOR DNA
        // Premium, minimalist, timeless
        // ========================================

        // Apple Gray Scale - Professional Foundation
        'apple-gray': {
          50: '#ffffff',      // Pure white
          100: '#f5f5f7',     // Barely-there gray (Apple's subtle background)
          200: '#e8e8ed',     // Light mode separator
          300: '#d2d2d7',     // Light mode border
          400: '#b0b0b5',     // Muted text
          500: '#86868b',     // Secondary text
          600: '#6e6e73',     // Tertiary text
          700: '#515154',     // Subtle elements
          800: '#424245',     // Dark mode text
          900: '#1d1d1f',     // Near black (titles, headlines)
          950: '#000000',     // Pure black (accent text)
        },

        // Apple Blue - Professional, Trustworthy
        'apple-blue': {
          400: '#007aff',     // iOS system blue (vibrant)
          500: '#0071e3',     // Link blue (standard light mode)
          600: '#0066cc',     // Primary blue (Apple's signature)
          dark: '#0a84ff',    // Brighter blue for dark mode
          'dark-hover': '#409cff', // Even brighter for hover states
        },

        // Apple Dark Mode Palette - Pure Black OLED Optimization
        'apple-dark': {
          bg: '#000000',           // Pure black background (OLED optimized)
          'bg-elevated': '#1d1d1f', // Elevated surfaces (near black)
          'bg-secondary': '#2c2c2e', // Cards and containers
          'bg-tertiary': '#3a3a3c',  // Tertiary surfaces
          text: '#f5f5f7',         // Primary text (excellent contrast AAA)
          'text-secondary': '#98989d', // Secondary text (good contrast AA)
          'text-tertiary': '#6e6e73',  // Tertiary text
          border: 'rgba(255, 255, 255, 0.15)', // Subtle borders
          'border-heavy': 'rgba(255, 255, 255, 0.25)', // Prominent borders
        },

        // ========================================
        // PG CLOSETS BRAND COLORS
        // Closet industry theme - Wood, Metal, Premium Materials
        // ========================================

        // Woodgrain Collection - Natural, Warm, Timeless
        'woodgrain': {
          DEFAULT: '#8B7355', // Medium walnut
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

        // Metal Accents - Handles, Hardware, Premium Finishes
        'metal': {
          DEFAULT: '#A8A8A8', // Brushed aluminum
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
          'rose-gold': '#B76E79', // Premium rose gold hardware
          bronze: '#CD7F32',      // Classic bronze
          champagne: '#F7E7CE',   // Champagne gold
        },

        // Storage Solutions - Professional, Organized, Clean
        'storage': {
          DEFAULT: '#4A5568', // Modern charcoal
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

        // Door Collection - Sophisticated, Elegant
        'door': {
          DEFAULT: '#2C5F4F', // Forest green (natural doors)
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

        // Premium Palette - High-End Finishes
        'premium': {
          cream: '#F5F1EA',      // Soft cream finish
          linen: '#EAE4D8',      // Natural linen
          marble: '#F8F8F8',     // Marble white
          onyx: '#1A1A1A',       // Onyx black
          pearl: '#FFFEF7',      // Pearl white
          obsidian: '#0A0A0A',   // Deep obsidian
        },

        // ========================================
        // SEMANTIC COLORS - Professional Status Indicators
        // ========================================

        'success': {
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
          900: '#0D3F17'
        },
        'warning': {
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
          900: '#732900'
        },
        'error': {
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
          900: '#3E0D0D'
        },
        'info': {
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
          900: '#003047'
        },

        // ========================================
        // SHADCN/UI COMPATIBILITY
        // Keep for existing component library
        // ========================================

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },

      // ========================================
      // TYPOGRAPHY SYSTEM
      // SF Pro inspired with Apple precision
      // ========================================

      fontFamily: {
        'sf-display': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'sf-text': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
        'display': ['var(--font-serif-display)', 'Georgia', 'Times New Roman', 'serif'],
        'body': ['var(--font-sans-body)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-sans-body)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-serif-display)', 'Georgia', 'Times New Roman', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      fontSize: {
        // Apple type scale (static sizes)
        'apple-11': ['0.6875rem', { lineHeight: '1.45454', letterSpacing: '0' }],        // 11px
        'apple-13': ['0.8125rem', { lineHeight: '1.38462', letterSpacing: '0' }],        // 13px
        'apple-15': ['0.9375rem', { lineHeight: '1.46667', letterSpacing: '0' }],        // 15px
        'apple-17': ['1.0625rem', { lineHeight: '1.47059', letterSpacing: '0' }],        // 17px
        'apple-21': ['1.3125rem', { lineHeight: '1.28571', letterSpacing: '-0.015em' }], // 21px
        'apple-28': ['1.75rem', { lineHeight: '1.14286', letterSpacing: '-0.015em' }],   // 28px
        'apple-34': ['2.125rem', { lineHeight: '1.11765', letterSpacing: '-0.02em' }],   // 34px
        'apple-48': ['3rem', { lineHeight: '1.08333', letterSpacing: '-0.025em' }],      // 48px
        'apple-64': ['4rem', { lineHeight: '1.0625', letterSpacing: '-0.03em' }],        // 64px
        'apple-80': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.035em' }],         // 80px
      },

      // ========================================
      // GRADIENT SYSTEM
      // Subtle, sophisticated, Apple-inspired
      // ========================================

      backgroundImage: {
        // Apple gradient utilities
        'apple-gradient-blue': 'linear-gradient(180deg, #007aff 0%, #0066cc 100%)',
        'apple-gradient-gray': 'linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%)',
        'apple-gradient-dark': 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',

        // Wood & Material Gradients
        'gradient-woodgrain': 'linear-gradient(135deg, #5A4836 0%, #8B7355 50%, #6F5A44 100%)',
        'gradient-metal': 'linear-gradient(135deg, #8C8C8C 0%, #A8A8A8 50%, #8C8C8C 100%)',
        'gradient-premium': 'linear-gradient(135deg, #F5F1EA 0%, #EAE4D8 50%, #F5F1EA 100%)',

        // Background Ambience
        'gradient-bg-light': 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 50%, #F5F5F5 100%)',
        'gradient-bg-dark': 'linear-gradient(180deg, #0A0A0A 0%, #000000 50%, #0D1117 100%)',

        // Overlay Gradients - Readability
        'gradient-overlay-dark': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.85) 100%)',
        'gradient-overlay-light': 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.65) 80%, rgba(255,255,255,0.9) 100%)',

        // Glass Morphism Gradients
        'glass-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 100%)',
      },

      // ========================================
      // SHADOW SYSTEM
      // Apple's precise, minimal shadow DNA
      // ========================================

      boxShadow: {
        // Apple shadow utilities
        'apple-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'apple-md': '0 4px 10px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 20px 40px 0 rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'apple-xl': '0 40px 80px 0 rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.05)',

        // Premium elevated shadows
        'floating': '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)',
        'elevated': '0 30px 80px rgba(0, 0, 0, 0.12), 0 12px 30px rgba(0, 0, 0, 0.06)',
        'modal': '0 50px 100px rgba(0, 0, 0, 0.25), 0 20px 50px rgba(0, 0, 0, 0.15)',

        // Inset depth
        'inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },

      // ========================================
      // SPACING SYSTEM
      // Apple 4px base scale + Magazine spacing
      // ========================================

      spacing: {
        // Apple Spacing DNA - Precise 4px base
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '14': '3.5rem',   // 56px
        '16': '4rem',     // 64px
        '18': '4.5rem',   // 72px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '28': '7rem',     // 112px
        '32': '8rem',     // 128px
        '36': '9rem',     // 144px
        '40': '10rem',    // 160px
        '48': '12rem',    // 192px
        '60': '15rem',    // 240px

        // Apple semantic spacing
        'apple-xs': '0.5rem',    // 8px
        'apple-sm': '0.75rem',   // 12px
        'apple-md': '1rem',      // 16px
        'apple-lg': '1.5rem',    // 24px
        'apple-xl': '2rem',      // 32px
        'apple-2xl': '2.5rem',   // 40px
        'apple-3xl': '3rem',     // 48px
        'apple-4xl': '5rem',     // 80px
        'apple-5xl': '7.5rem',   // 120px
        'apple-6xl': '10rem',    // 160px
      },

      // ========================================
      // MAX WIDTH SYSTEM
      // Apple content widths
      // ========================================

      maxWidth: {
        'apple-text': '40rem',      // 640px - optimal line length
        'apple-content': '64rem',   // 1024px - main content
        'apple-page': '90rem',      // 1440px - maximum page width
        'apple-narrow': '48rem',    // 768px - narrow content
        'apple-wide': '80rem',      // 1280px - wide content
      },

      // ========================================
      // GLASSMORPHISM
      // Apple blur utilities
      // ========================================

      backdropBlur: {
        'apple': '20px',
        'apple-sm': '12px',
        'apple-lg': '32px',
      },

      // ========================================
      // ANIMATIONS
      // Smooth, professional, Apple-inspired
      // ========================================

      keyframes: {
        // Apple-style animations
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
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
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
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

      // ========================================
      // BORDER RADIUS
      // ========================================

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'apple': '10px',
        'apple-sm': '6px',
        'apple-lg': '16px',
      },

      // ========================================
      // Z-INDEX SCALE
      // ========================================

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
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
