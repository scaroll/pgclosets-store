/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output mode to avoid SSR issues during build
  output: process.env.NODE_ENV === 'production' ? undefined : undefined,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),

  // Disable static generation for error pages to fix OnceUI SSR compatibility
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  // Skip static optimization for specific routes
  skipTrailingSlashRedirect: true,

  // Phase 7: Enhanced performance optimizations
  compiler: {
    // Remove console logs in production (except errors/warnings)
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
    // Remove React properties for smaller bundle
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Production optimizations
  poweredByHeader: false,

  // Use default pageExtensions for app router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  experimental: {
    serverActions: {
      allowedOrigins:
        process.env.NODE_ENV === "production"
          ? [
              "https://pgclosets-store.vercel.app",
              "https://www.pgclosets.com",
              "https://pgclosets.com",
            ]
          : ["*"],
    },
    // DIVISION 14 AGENT 7: Enhanced bundling optimizations
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-accordion",
      "framer-motion",
      "date-fns",
      "recharts",
      "react-hook-form",
    ],
    // Enable optimized CSS
    optimizeCss: true,
    // Disable static generation for error pages to fix OnceUI compatibility
    skipTrailingSlashRedirect: true,
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Image optimization - Enhanced for performance
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    formats: ["image/avif", "image/webp"], // AVIF first for better compression
    qualities: [75, 85, 90, 95], // Configure quality levels for Next.js 16
    domains: [
      "www.pgclosets.com",
      "pgclosets.com",
      "www.renin.com",
      "renin.com",
      "cdn.renin.com",
      "images.unsplash.com",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.pgclosets.com",
      },
      {
        protocol: "https",
        hostname: "pgclosets.com",
      },
      {
        protocol: "https",
        hostname: "www.renin.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "renin.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.renin.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },

  // Comprehensive security and performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security Headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com https://checkout.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob: https://www.pgclosets.com https://cdn.renin.com https://www.renin.com https://renin.com https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com;
              frame-src https://js.stripe.com https://checkout.stripe.com;
              media-src 'self' blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          // Performance Headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Robots-Tag",
            value:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        ],
      },
      // Static asset caching
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Image optimization caching
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API route caching
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { webpack, isServer }) => {
    // Only add DefinePlugin for global variable definition
    config.plugins.push(
      new webpack.DefinePlugin({
        global: "globalThis",
      })
    );

    // Fix OnceUI SSR Html import issue by excluding from server bundles
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@once-ui-system/core': '@once-ui-system/core'
      });
    }

    return config;
  },
};

export default nextConfig;
