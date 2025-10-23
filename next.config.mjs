/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  // NEXT.JS 15 PRODUCTION-READY CONFIGURATION
  // Apple-inspired performance optimizations with security best practices

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Production-ready output configuration
  // Temporarily disabled standalone mode due to middleware copy issues
  // output: 'standalone',
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Build configuration
  generateBuildId: async () => {
    // Use timestamp for unique builds in production
    return `build-${Date.now()}`
  },

  // TypeScript and ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),

  // Page extensions for App Router (including MDX)
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx', 'md'],

  // Advanced Compiler Optimizations
  compiler: {
    // Remove console logs in production (keep errors/warnings)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // Remove React development properties
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Image Optimization Configuration
  images: {
    // Support AVIF and WebP for better compression
    formats: ['image/avif', 'image/webp'],
    // Apple device sizes + standard breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Quality settings for different formats
    qualities: [75, 85, 90, 95],
    // One year cache for optimized images
    minimumCacheTTL: 31536000,
    // Security for SVGs
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.pgclosets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pgclosets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.renin.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'renin.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.renin.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },

  // Experimental Features for Next.js 15 (minimal for compatibility)
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'framer-motion',
      'date-fns',
    ],
  },

  // Webpack Configuration for Advanced Optimizations
  webpack: (config, { webpack, isServer }) => {
    // Fix for globalThis and Next.js 15 compatibility issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

  
    // Fix Supabase client-side bundling issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@supabase/supabase-js': 'commonjs @supabase/supabase-js',
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
      });
    }

  
    return config;
  },

  // Comprehensive Security and Performance Headers
  async headers() {
    return [
      // Global headers for all routes
      {
        source: '/:path*',
        headers: [
          // Security Headers (Apple-grade security)
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com https://checkout.stripe.com https://vitals.vercel-insights.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob: https: https://www.pgclosets.com https://cdn.renin.com https://www.renin.com https://renin.com https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com;
              frame-src 'self' https://js.stripe.com https://checkout.stripe.com;
              media-src 'self' blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=*, usb=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Performance Headers
          {
            key: 'Accept-Encoding',
            value: 'br, gzip, deflate',
          },
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=dns-prefetch, <https://fonts.gstatic.com>; rel=dns-prefetch, <https://images.unsplash.com>; rel=dns-prefetch',
          },
        ],
      },
      // Immutable caching for static assets
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Next.js static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Image optimization caching
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes (no caching)
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
        ],
      },
      // Public directory assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects and Rewrites
  async redirects() {
    return [
      // Add any necessary redirects here
      // Example:
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // Skip trailing slash redirect for cleaner URLs
  skipTrailingSlashRedirect: true,

  // Force dynamic rendering for problematic routes
  // output: undefined, // Let Vercel handle the output mode
}

export default nextConfig
