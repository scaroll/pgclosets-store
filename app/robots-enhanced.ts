/**
 * AGENTS 36-40: Enhanced Robots.txt Configuration
 * Advanced robots.txt with comprehensive crawler directives
 */

import type { MetadataRoute } from 'next'
import { BUSINESS_INFO } from '../lib/business-config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BUSINESS_INFO.urls.main
  const isDevelopment = process.env.NODE_ENV === 'development'

  // If in development, disallow all crawlers
  if (isDevelopment) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/'
        }
      ],
      host: baseUrl
    }
  }

  // Production robots.txt with comprehensive rules
  return {
    rules: [
      // Googlebot - Most important, specific rules
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/tmp/',
          '/private/',
          '/*.json$',
          '/*?*sort=',
          '/*?*filter=',
          '/*?*page=',
          '/*?*search=',
          '/*?*utm_*',
          '/*?*ref=',
          '/*?*session=',
          '/*?*token='
        ],
        crawlDelay: undefined // Google ignores crawl-delay
      },
      // Googlebot Image
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/products/',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.png$',
          '/*.webp$'
        ],
        disallow: [
          '/private/',
          '/tmp/'
        ]
      },
      // Bingbot - Microsoft Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/*.json$'
        ],
        crawlDelay: 1
      },
      // Slurp - Yahoo
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/*.json$'
        ],
        crawlDelay: 1
      },
      // DuckDuckBot
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/*.json$'
        ],
        crawlDelay: 1
      },
      // Baiduspider - Chinese search engine
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/*.json$'
        ],
        crawlDelay: 1
      },
      // Yandex - Russian search engine
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/*.json$'
        ],
        crawlDelay: 1
      },
      // Facebook crawler
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ]
      },
      // Twitter bot
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ]
      },
      // LinkedIn bot
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ]
      },
      // WhatsApp crawler
      {
        userAgent: 'WhatsApp',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ]
      },
      // Apple bot
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/*.json$'
        ]
      },
      // SEO and analysis bots - Allow
      {
        userAgent: 'AhrefsBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ],
        crawlDelay: 2
      },
      {
        userAgent: 'SemrushBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ],
        crawlDelay: 2
      },
      {
        userAgent: 'Screaming Frog SEO Spider',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/'
        ]
      },
      {
        userAgent: 'Moz',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/'
        ],
        crawlDelay: 2
      },
      // Block bad bots
      {
        userAgent: 'MJ12bot',
        disallow: '/'
      },
      {
        userAgent: 'AhrefsBot/5.2',
        disallow: '/'
      },
      {
        userAgent: 'SemrushBot-SA',
        disallow: '/'
      },
      {
        userAgent: 'DotBot',
        disallow: '/'
      },
      {
        userAgent: 'PetalBot',
        disallow: '/'
      },
      {
        userAgent: 'GPTBot',
        disallow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/'
      },
      {
        userAgent: 'CCBot',
        disallow: '/'
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/'
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/'
      },
      // Default rule for all other user agents
      {
        userAgent: '*',
        allow: [
          '/',
          '/products/',
          '/services/',
          '/about/',
          '/contact/',
          '/gallery/',
          '/areas/',
          '/blog/',
          '/faq/',
          '/sitemap.xml',
          '/sitemap-*.xml'
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/preview/',
          '/private/',
          '/tmp/',
          '/test/',
          '/staging/',
          '/*.json$',
          '/*.xml$',
          '/*.config.js$',
          '/404',
          '/500',
          '/offline',
          '/*?*sort=',
          '/*?*filter=',
          '/*?*page=',
          '/*?*search=',
          '/*?*utm_*',
          '/*?*ref=',
          '/*?*session=',
          '/*?*token=',
          '/*?*preview=',
          '/*?*draft=',
          '/cart',
          '/checkout',
          '/account',
          '/wishlist',
          '/compare',
          '/order/',
          '/invoice/',
          '/download/',
          '/thank-you',
          '/confirmation'
        ],
        crawlDelay: 1
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-products.xml`,
      `${baseUrl}/sitemap-locations.xml`,
      `${baseUrl}/sitemap-categories.xml`,
      `${baseUrl}/sitemap-services.xml`
    ],
    host: baseUrl
  }
}

/**
 * Generate robots.txt string for edge functions
 */
export function generateRobotsTxt(): string {
  const robotsData = robots()
  const lines: string[] = []

  // Ensure rules is an array
  const rules = Array.isArray(robotsData.rules) ? robotsData.rules : [robotsData.rules]

  // Add each rule set
  rules.forEach((rule) => {
    // Handle userAgent which can be string or array
    const userAgents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent]
    userAgents.forEach((ua) => {
      lines.push(`User-agent: ${ua}`)
    })

    if (rule.allow) {
      const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow]
      allows.forEach((path: string) => {
        lines.push(`Allow: ${path}`)
      })
    }

    if (rule.disallow) {
      const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow]
      disallows.forEach((path: string) => {
        lines.push(`Disallow: ${path}`)
      })
    }

    if (rule.crawlDelay) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`)
    }

    lines.push('') // Empty line between rules
  })

  // Add sitemaps
  if (robotsData.sitemap) {
    const sitemaps = Array.isArray(robotsData.sitemap) ? robotsData.sitemap : [robotsData.sitemap]
    sitemaps.forEach(sitemap => {
      lines.push(`Sitemap: ${sitemap}`)
    })
  }

  // Add host
  if (robotsData.host) {
    lines.push(`Host: ${robotsData.host}`)
  }

  return lines.join('\n')
}