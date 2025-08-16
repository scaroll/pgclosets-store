import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paddle-payments-nl5k9vde7-peoples-group.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/store',
          '/store/products',
          '/store/products/*',
          '/products',
          '/products/*',
          '/categories',
          '/categories/*',
          '/barn-doors',
          '/barn-doors/*',
          '/hardware',
          '/hardware/*',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
          '/sitemap.xml'
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/_next',
          '/_vercel',
          '/preview',
          '/preview/*',
          '/search?*',
          '*?utm_*',
          '*&utm_*'
        ]
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/store',
          '/store/products',
          '/store/products/*',
          '/products',
          '/products/*',
          '/barn-doors',
          '/barn-doors/*',
          '/hardware',
          '/hardware/*',
          '/about'
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/cart',
          '/checkout',
          '/preview'
        ]
      },
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/store',
          '/store/products',
          '/store/products/*',
          '/products',
          '/products/*',
          '/barn-doors',
          '/barn-doors/*',
          '/hardware',
          '/hardware/*',
          '/about'
        ]
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/store',
          '/store/products',
          '/store/products/*',
          '/products',
          '/products/*',
          '/barn-doors',
          '/barn-doors/*',
          '/hardware',
          '/hardware/*',
          '/about'
        ]
      },
      {
        userAgent: 'Perplexity',
        allow: [
          '/',
          '/store',
          '/store/products',
          '/store/products/*',
          '/products',
          '/products/*',
          '/barn-doors',
          '/barn-doors/*',
          '/hardware',
          '/hardware/*',
          '/about'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}