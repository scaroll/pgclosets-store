/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),

  // Advanced Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

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
    // Enable modern bundling optimizations
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-accordion",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-toast",
      "framer-motion",
      "recharts",
      "react-hook-form",
      "date-fns",
    ],
    // Optimize server components
    optimizeCss: true,

    // Modern image optimization
    turbotrace: {
      logLevel: "error",
      logDetail: false,
      contextDirectory: process.cwd(),
    },
  },

  // Image optimization - Enhanced for performance
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    formats: ["image/avif", "image/webp"], // AVIF first for better compression
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
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
              img-src 'self' data: blob: https://www.pgclosets.com https://cdn.renin.com https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com;
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
      // Static asset caching - Aggressive
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
      // Font caching
      {
        source: "/_next/static/media/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // JS/CSS caching
      {
        source: "/_next/static/css/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/chunks/(.*)",
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

  // Webpack optimization
  webpack: (config, { webpack, isServer, dev }) => {
    // Only add DefinePlugin for global variable definition
    config.plugins.push(
      new webpack.DefinePlugin({
        global: "globalThis",
      })
    );

    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for third-party libraries
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Radix UI components
            radixUI: {
              name: "radix-ui",
              test: /[\\/]node_modules[\\/]@radix-ui/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // React libraries
            react: {
              name: "react",
              test: /[\\/]node_modules[\\/](react|react-dom|react-hook-form)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            // Common chunks
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            // Lucide icons
            lucide: {
              name: "lucide",
              test: /[\\/]node_modules[\\/]lucide-react/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // Framer Motion
            framerMotion: {
              name: "framer-motion",
              test: /[\\/]node_modules[\\/]framer-motion/,
              priority: 25,
              reuseExistingChunk: true,
            },
          },
        },
        minimize: true,
      };

      // Tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
    }

    return config;
  },

  // Output optimization
  output: "standalone",

  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
};

export default nextConfig;
