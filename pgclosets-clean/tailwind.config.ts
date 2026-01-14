// Mobile-first Tailwind config matching Final-Website exactly
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
        'tablet-p': '768px',
        'tablet-l': '1024px',
        'desktop': '1280px',
        'ultra': '1920px',
        'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
        'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
        'mobile-s': '320px',
        'mobile-m': '375px',
        'mobile-l': '414px',
        'mobile-xl': '480px',
      },
      colors: {
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
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        // PG Closets brand colors using CSS variables
        'pg-navy': 'var(--pg-navy)',
        'pg-sky': 'var(--pg-sky)',
        'pg-dark': 'var(--pg-dark)',
        'pg-offwhite': 'var(--pg-offwhite)',
        'pg-gray': 'var(--pg-gray)',
        'pg-border': 'var(--pg-border)',
        // Alias pg-blue to pg-sky for backward compatibility
        'pg-blue': 'var(--pg-sky)',

        // Exact slate palette specifications
        slate: {
          50: '#f8fafc',   // Background sections
          400: '#94a3b8',  // Accent elements, borders
          500: '#64748b',  // Intermediate
          600: '#475569',  // Body text, secondary elements
          900: '#0f172a'   // Primary buttons, headings
        }
      },

      // Typography system with exact Inter font stack
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif']
      },

      // Exact font weights
      fontWeight: {
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      },

      // Letter spacing for Apple-inspired typography
      letterSpacing: {
        tight: '-0.025em'
      },

      // Spacing scale based on 8px system
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '36': '9rem',     // 144px
        '44': '11rem',    // 176px
        '52': '13rem',    // 208px
        '60': '15rem',    // 240px
        '68': '17rem',    // 272px
        '76': '19rem',    // 304px
        '84': '21rem',    // 336px
        '92': '23rem',    // 368px
        '100': '25rem',   // 400px
        '108': '27rem',   // 432px
        '116': '29rem',   // 464px
        '124': '31rem',   // 496px
        '132': '33rem',   // 528px
        '140': '35rem'    // 560px
      },

      // Box shadows for depth
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.16)'
      },

      // Transition timing
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      // Product-specific aspect ratios
      aspectRatio: {
        'square': '1 / 1',
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'wide': '16 / 9'
      },

      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'slide-in-right': {
          from: {
            transform: 'translateX(100%)'
          },
          to: {
            transform: 'translateX(0)'
          }
        },
        'slide-out-right': {
          from: {
            transform: 'translateX(0)'
          },
          to: {
            transform: 'translateX(100%)'
          }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(137, 190, 230, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(137, 190, 230, 0.6)' }
        },
        'fadeInUp': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'fadeInUp': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;