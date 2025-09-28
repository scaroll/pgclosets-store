/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

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

  // Image optimization
  images: {
    domains: [
      "www.pgclosets.com",
      "pgclosets.com",
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
    formats: ["image/webp", "image/avif"],
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
        ],
      },
    ];
  },

  // Critical webpack fix for SSR build issues
  webpack: (config, { isServer, webpack }) => {
    // Fix "self is not defined" error in SSR
    if (isServer) {
      // Add banner at the top of every file to define self
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'if (typeof self === "undefined") { global.self = global; }',
          raw: true,
          entryOnly: false,
        })
      );
    }

    // Handle Node.js polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      buffer: false,
      stream: false,
      util: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      url: false,
      zlib: false,
      querystring: false,
      net: false,
      tls: false,
      child_process: false,
      // Leave global unresolved, will be handled by ProvidePlugin
    };

    // Provide global variables
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: 'globalthis',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },
};

export default nextConfig;