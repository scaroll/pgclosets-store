import type { Config } from "tailwindcss";

// Performance-optimized Tailwind config for PG Closets Store

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  // Safelist critical classes to prevent purging
  safelist: [
    'animate-pulse',
    'animate-shimmer',
    'animate-fade-in',
    'animate-slide-up',
    'animate-scale-in',
    'gpu-accelerated',
    'will-change-transform',
    'will-change-opacity',
    'aspect-square',
    'aspect-video'
  ],
  theme: {
  	extend: {
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
  			// PG brand colors
  			'pg-navy': 'var(--pg-navy)',
  			'pg-sky': 'var(--pg-sky)',
  			'pg-dark': 'var(--pg-dark)',
  			'pg-offwhite': 'var(--pg-offwhite)',
  			'pg-gray': 'var(--pg-gray)',
  			'pg-border': 'var(--pg-border)',
  			// Accessible colors for WCAG AA compliance
  			'pg-text': {
  				primary: 'var(--pg-text-primary)',
  				secondary: 'var(--pg-text-secondary)',
  				muted: 'var(--pg-text-muted)'
  			},
  			'pg-link': {
  				DEFAULT: 'var(--pg-link)',
  				hover: 'var(--pg-link-hover)'
  			},
  			'pg-button': {
  				primary: 'var(--pg-button-primary)',
  				'primary-hover': 'var(--pg-button-primary-hover)',
  				secondary: 'var(--pg-button-secondary)',
  				'secondary-hover': 'var(--pg-button-secondary-hover)'
  			},
  			'pg-status': {
  				error: 'var(--pg-error)',
  				success: 'var(--pg-success)',
  				warning: 'var(--pg-warning)'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
  					height: '0'
  				}
  			},
  			shimmer: {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			},
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'slide-up': {
  				'0%': { opacity: '0', transform: 'translateY(40px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'scale-in': {
  				'0%': { opacity: '0', transform: 'scale(0.95)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			blob: {
  				'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
  				'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
  				'66%': { transform: 'translate(-20px, 20px) scale(0.9)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shimmer: 'shimmer 2s infinite ease-in-out',
  			'fade-in': 'fade-in 0.5s ease-out',
  			'slide-up': 'slide-up 0.6s ease-out',
  			'scale-in': 'scale-in 0.4s ease-out',
  			blob: 'blob 7s infinite'
  		},
  		animationDelay: {
  			'2000': '2s',
  			'4000': '4s'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
