/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // AI-Inspired Color System
        'tech-blue': {
          50: '#eff6ff',
          500: '#0066FF',
          600: '#1E40AF',
          700: '#1d4ed8',
        },
        'ai-purple': {
          50: '#faf5ff',
          500: '#7C3AED',
          600: '#8B5CF6',
          700: '#7c2d12',
        },
        'electric-green': {
          50: '#f0fdf4',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        'bright-cyan': {
          50: '#f0fdfa',
          500: '#06B6D4',
          600: '#0891b2',
          700: '#0e7490',
        },
        // PG Brand Color System
        'navy': {
          50: '#f8f9fb',
          100: '#f0f2f7',
          200: '#d9dfeb',
          300: '#bcc5d9',
          400: '#8a96b8',
          500: '#3d4a7c',
          600: '#2e3a5f',
          700: '#232b47',
          800: '#1a1f32',
          900: '#121521',
          DEFAULT: '#3d4a7c',
        },
        'sky': {
          50: '#f8fcff',
          100: '#f0f8ff',
          200: '#e6f3ff',
          300: '#c4dff6',
          400: '#a8d0f0',
          500: '#7bb8e7',
          600: '#5a9dd8',
          700: '#4a82c4',
          800: '#3d6ba8',
          900: '#2f5487',
          DEFAULT: '#a8d0f0',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'display': ['Inter', 'Poppins', 'Outfit', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'animated-gradient': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        'tech-gradient': 'linear-gradient(135deg, #0066FF 0%, #7C3AED 50%, #10B981 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
            transform: "scale(1)",
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(124, 58, 237, 0.6)",
            transform: "scale(1.02)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient": "gradient 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}