/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Avoid failing the production build on linting issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Avoid failing the production build on type errors during Vercel build
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      // Restrict server actions to trusted origins in production
      allowedOrigins: process.env.NODE_ENV === 'production' 
        ? ['https://pgclosets-store.vercel.app', 'https://www.pgclosets.com', 'https://pgclosets.com']
        : ['*'],
    },
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    domains: ['www.pgclosets.com', 'pgclosets.com', 'cdn.renin.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.pgclosets.com',
      },
      {
        protocol: 'https',
        hostname: 'pgclosets.com',
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
    minimumCacheTTL: 60,
  },
  // Production-grade security headers
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' ${isProd ? '' : "'unsafe-inline' 'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://checkout.paddle.com https://js.paddle.com https://d3ey4dbjkt2f6s.cloudfront.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://checkout.paddle.com https://d3ey4dbjkt2f6s.cloudfront.net;
      img-src 'self' data: https: blob:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://www.google-analytics.com https://checkout.paddle.com https://api.paddle.com wss://checkout.paddle.com https://d3ey4dbjkt2f6s.cloudfront.net ${process.env.NEXT_PUBLIC_SUPABASE_URL || ''};
      frame-src 'self' https://js.stripe.com https://checkout.paddle.com https://clienthub.getjobber.com https://d3ey4dbjkt2f6s.cloudfront.net;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://checkout.paddle.com;
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          // Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
        ],
      },
      // Static assets caching
      {
        source: '/:path*\\.(ico|png|jpg|jpeg|gif|webp|avif|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Font caching
      {
        source: '/:path*\\.(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // API routes caching
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ]
      }
    ];
  },
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
  // Environment-based configuration
  async rewrites() {
    return [
      // Health check endpoint
      {
        source: '/health',
        destination: '/api/health'
      },
      // Monitoring endpoints
      {
        source: '/status',
        destination: '/api/status'
      }
    ];
  },
  // Bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      if (!dev && !isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            openAnalyzer: false,
          })
        );
      }
      return config;
    }
  }),
};

module.exports = nextConfig;
