import type { MetadataRoute } from 'next'
import { products } from './products/products-data'
import { BUSINESS_INFO } from '../lib/business-config'
import { getNeighborhoodSlugs } from '../lib/seo/neighborhoods'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  // Core pages with high priority for Ottawa market dominance
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/request-work`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/why-pg`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Location pages for local SEO - High priority for Ottawa market dominance
  const locationPages: MetadataRoute.Sitemap = BUSINESS_INFO.serviceAreas.map((area, index) => {
    const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/${areaSlug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: index === 0 ? 0.9 : 0.8, // Ottawa gets highest priority
    }
  })

  // Renin location pages for brand authority
  const reninLocationPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/renin`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...BUSINESS_INFO.serviceAreas.slice(0, 4).map((area, index) => {
      const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
      return {
        url: `${baseUrl}/renin/${areaSlug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: index === 0 ? 0.8 : 0.7, // Ottawa gets highest priority
      }
    })
  ]

  // Product category pages
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/products/barn-doors`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/bifold-doors`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/bypass-doors`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/pivot-doors`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/hardware`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products/mirrors`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Individual product pages from Renin database
  const productPages: MetadataRoute.Sitemap = products.map((product) => {
    // Generate handle from product name (same logic as in commerce.ts)
    const handle = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return {
      url: `${baseUrl}/products/${handle}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  })

  // Store pages
  const storePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/store`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store/products`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Store product pages (alternative URLs)
  const storeProductPages: MetadataRoute.Sitemap = products.map((product) => {
    // Generate handle from product name (same logic as in commerce.ts)
    const handle = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return {
      url: `${baseUrl}/store/products/${handle}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    };
  })

  // Blog and information pages
  const infoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Legal pages (lower priority)
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Neighborhood area pages (new SEO-optimized pages)
  const neighborhoodPages: MetadataRoute.Sitemap = getNeighborhoodSlugs().map((slug, index) => ({
    url: `${baseUrl}/areas/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: index === 0 ? 0.9 : 0.85, // Ottawa gets highest priority
  }))

  // Additional service area pages
  const additionalLocationPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/installation-ottawa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Account pages (authenticated, but still in sitemap for completeness)
  const accountPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/cart`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.5,
    },
  ]

  // Combine all pages with location pages prioritized for local SEO
  return [
    ...corePages,
    ...neighborhoodPages, // NEW: Neighborhood landing pages for SEO
    ...locationPages, // High priority for Ottawa market
    ...additionalLocationPages,
    ...reninLocationPages,
    ...categoryPages,
    ...productPages,
    ...storePages,
    ...storeProductPages,
    ...infoPages,
    ...accountPages,
    ...legalPages,
  ]
}

// Export individual sitemaps for robots.txt reference
export async function generateProductSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  return products.map((product) => {
    // Generate handle from product name (same logic as in commerce.ts)
    const handle = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return {
      url: `${baseUrl}/products/${handle}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  })
}

export async function generateLocationSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  const locationPages = BUSINESS_INFO.serviceAreas.map((area, index) => {
    const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/${areaSlug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: index === 0 ? 0.9 : 0.8, // Ottawa gets highest priority
    }
  })

  const reninLocationPages = BUSINESS_INFO.serviceAreas.slice(0, 4).map((area, index) => {
    const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/renin/${areaSlug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: index === 0 ? 0.8 : 0.7, // Ottawa gets highest priority
    }
  })

  return [...locationPages, ...reninLocationPages]
}
