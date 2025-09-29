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

  // Minimal webpack configuration to fix global variable issues
  webpack: (config, { webpack }) => {
    // Only add DefinePlugin for global variable definition
    config.plugins.push(
      new webpack.DefinePlugin({
        global: 'globalThis',
      })
    );

    return config;
  },
};

export default nextConfig;