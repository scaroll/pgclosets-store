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

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Production optimizations
  poweredByHeader: false,

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
      "framer-motion",
    ],
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

  // Minimal webpack configuration to fix global variable issues
  webpack: (config, { webpack }) => {
    // Only add DefinePlugin for global variable definition
    config.plugins.push(
      new webpack.DefinePlugin({
        global: "globalThis",
      })
    );

    return config;
  },
};

export default nextConfig;
