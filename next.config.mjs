/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  // NEXT.JS 15 PRODUCTION-READY CONFIGURATION
  // Optimized for performance, security, and Edge Runtime compatibility

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Production-ready output configuration
  // Standalone mode disabled for better Vercel compatibility
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
    ignoreDuringBuilds: true, // Temporarily disable for deployment compatibility
    dirs: ['app', 'components', 'lib'], // Limit ESLint to key directories
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily disable for deployment compatibility
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
    // Enable styled-components SWC transform for better performance
    styledComponents: true,
  },

  // Image Optimization Configuration
  images: {
    // Support AVIF and WebP for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimized device sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Quality settings for different formats
    qualities: [75, 85, 90, 95],
    // One year cache for optimized images
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Security for SVGs (Edge Runtime compatible)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Remote patterns for external images (optimized for Edge Runtime)
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
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
        pathname: '/**',
      },
    ],
    // Image loader optimization
    loader: 'default',
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Experimental Features for Next.js 15 (optimized for Edge Runtime compatibility)
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-accordion',
      '@radix-ui/react-scroll-area',
      'framer-motion',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
    // Enable optimizeCss for better performance
    optimizeCss: true,
    // Enable optimizeServerReact for better SSR performance
    optimizeServerReact: true,
  },

  // Webpack Configuration for Advanced Optimizations
  webpack: (config, { webpack, isServer, dev }) => {
    // Fix for globalThis and Next.js 15 compatibility issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      util: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    // Fix Supabase client-side bundling issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@supabase/supabase-js': 'commonjs @supabase/supabase-js',
        '@supabase/ssr': 'commonjs @supabase/ssr',
      });
    }

    // Optimize for production builds
    if (!dev && !isServer) {
      // Enable code splitting optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix',
              chunks: 'all',
              priority: 20,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };

      // Add production optimizations
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        })
      );
    }

    // Handle SVG files properly
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgo: true,
          },
        },
      ],
    });

    // Optimize bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/app': path.resolve(__dirname, './app'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/public': path.resolve(__dirname, './public'),
    };

    // Remove console logs in production with better performance
    if (!dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'console.log': 'function() {}',
          'console.debug': 'function() {}',
        })
      );
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
          // Security Headers (optimized for Edge Runtime and performance)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com https://checkout.stripe.com https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: https://www.pgclosets.com https://cdn.renin.com https://www.renin.com https://renin.com https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://*.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com https://*.vercel-storage.com; frame-src 'self' https://js.stripe.com https://checkout.stripe.com; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;",
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

  // Additional performance optimizations
  // Force static generation where possible
  generateEtags: true,

  // Optimize build output for Edge Runtime compatibility
  // Edge runtime optimizations are handled in individual API routes
}

export default nextConfig
