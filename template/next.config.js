/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'pg-closets-storage.b-cdn.net'
    ],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'pgclosets.com']
    },
    instrumentationHook: true
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  typescript: {
    // Enable type checking in development
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig