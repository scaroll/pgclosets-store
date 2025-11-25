/** @type {import('next').NextConfig} */
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

  // Experimental Features for Next.js 15
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-accordion',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-select',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'date-fns',
      'recharts',
      'react-hook-form',
      'class-variance-authority',
      'tailwind-merge',
    ],

    // Enable optimistic client cache
    optimisticClientCache: true,

    // Server Actions security
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === 'production'
        ? [
            'https://pgclosets-store.vercel.app',
            'https://www.pgclosets.com',
            'https://pgclosets.com',
          ]
        : ['localhost:3000', '127.0.0.1:3000'],
    },
  },

  // Webpack Configuration for Advanced Optimizations
  webpack: (config, { webpack, isServer }) => {
    // Global compatibility
    config.plugins.push(
      new webpack.DefinePlugin({
        global: 'globalThis',
      })
    )

    // Tree shaking and optimization
    config.optimization = {
      ...config.optimization,
      sideEffects: false,
    }

    // Client-side bundle splitting for optimal loading
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk (React, React DOM)
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI library chunk (Radix UI components)
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            priority: 35,
            enforce: true,
          },
          // Animation chunk (Framer Motion)
          motion: {
            name: 'motion',
            chunks: 'async',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 30,
            enforce: true,
          },
          // Commons chunk for shared code
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
          // Library chunk for remaining vendor code
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            chunks: 'all',
            priority: 10,
          },
        },
        // Optimize chunk size for fast loading
        maxSize: 70000,
      }
    }

    return config
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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com https://checkout.stripe.com https://vitals.vercel-insights.com https://vercel.live https://*.vercel.live;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob: https: https://www.pgclosets.com https://cdn.renin.com https://www.renin.com https://renin.com https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://*.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com https://vercel.live wss://vercel.live https://*.vercel.live wss://*.vercel.live;
              frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://vercel.live https://*.vercel.live;
              media-src 'self' blob: https: https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://*.vercel-storage.com;
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
}

export default nextConfig
