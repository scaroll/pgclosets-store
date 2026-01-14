/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    optimizeCss: true,
    webpackBuildWorker: true,
  },

  // Webpack optimizations for better bundle size and performance
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    // Production optimizations
    if (!dev) {
      // Bundle analyzer for size monitoring
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 500000,
            minSize: 100000,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            maxSize: 300000,
          },
        },
      }

      // Tree shaking optimization
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    // Image optimization
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      use: [
        {
          loader: 'next/image-loader',
          options: {
            publicPath: '/_next/',
          },
        },
      ],
    })

    return config
  },
  
  // Image optimization
  images: {
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.homedepot.ca',
      },
      {
        protocol: 'https',
        hostname: 'www.homedepot.ca',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
}

export default nextConfig
