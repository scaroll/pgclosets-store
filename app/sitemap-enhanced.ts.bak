/**
 * AGENTS 36-40: Enhanced Dynamic Sitemap Generation
 * Comprehensive sitemap with all page types and priorities
 */

import type { MetadataRoute } from 'next'
import { BUSINESS_INFO } from '../lib/business-config'
import { products } from './products/products-data'
import { getNeighborhoodSlugs } from '../lib/seo/neighborhoods'

// Sitemap configuration
const SITEMAP_CONFIG = {
  changeFrequencies: {
    static: 'monthly' as const,
    dynamic: 'weekly' as const,
    frequent: 'daily' as const,
    yearly: 'yearly' as const
  },
  priorities: {
    homepage: 1.0,
    critical: 0.9,
    high: 0.8,
    medium: 0.7,
    low: 0.6,
    minimal: 0.5,
    legal: 0.3
  }
}

/**
 * Generate product URLs with enhanced metadata
 */
function generateProductSitemapEntries(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  // Group products by category for priority assignment
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(product)
    return acc
  }, {} as Record<string, typeof products>)

  // Popular categories get higher priority
  const categoryPriorities: Record<string, number> = {
    'Barn Doors': 0.75,
    'Bypass Doors': 0.75,
    'Bifold Doors': 0.7,
    'Pivot Doors': 0.7,
    'Hardware': 0.65,
    'Mirrors': 0.6
  }

  const productEntries: MetadataRoute.Sitemap = []

  Object.entries(productsByCategory).forEach(([category, categoryProducts]) => {
    categoryProducts.forEach((product, index) => {
      const handle = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const priority = categoryPriorities[category] || 0.6

      // First 5 products in each category get slightly higher priority
      const adjustedPriority = index < 5 ? Math.min(priority + 0.05, 0.9) : priority

      productEntries.push({
        url: `${baseUrl}/products/${handle}`,
        lastModified,
        changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
        priority: adjustedPriority
      })
    })
  })

  return productEntries
}

/**
 * Generate location-based URLs for local SEO
 */
function generateLocationSitemapEntries(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  // Main service areas
  const locationEntries: MetadataRoute.Sitemap = BUSINESS_INFO.serviceAreas.map((area, index) => {
    const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/${areaSlug}`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: index === 0 ? SITEMAP_CONFIG.priorities.critical : SITEMAP_CONFIG.priorities.high
    }
  })

  // Renin dealer location pages
  const reninLocationEntries: MetadataRoute.Sitemap = BUSINESS_INFO.serviceAreas.slice(0, 4).map((area, index) => {
    const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/renin/${areaSlug}`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: index === 0 ? SITEMAP_CONFIG.priorities.high : SITEMAP_CONFIG.priorities.medium
    }
  })

  // Neighborhood area pages for hyper-local SEO
  const neighborhoodEntries: MetadataRoute.Sitemap = getNeighborhoodSlugs().map((slug, index) => ({
    url: `${baseUrl}/areas/${slug}`,
    lastModified,
    changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
    priority: index < 5 ? SITEMAP_CONFIG.priorities.high : SITEMAP_CONFIG.priorities.medium
  }))

  // Service-location combination pages
  const serviceLocationEntries: MetadataRoute.Sitemap = []
  const services = ['installation', 'custom-design', 'measurement', 'consultation']
  const topAreas = BUSINESS_INFO.serviceAreas.slice(0, 3)

  services.forEach(service => {
    topAreas.forEach((area, index) => {
      const areaSlug = area.toLowerCase().replace(/\s+/g, '-')
      serviceLocationEntries.push({
        url: `${baseUrl}/services/${service}/${areaSlug}`,
        lastModified,
        changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
        priority: index === 0 ? SITEMAP_CONFIG.priorities.medium : SITEMAP_CONFIG.priorities.low
      })
    })
  })

  return [
    ...locationEntries,
    ...reninLocationEntries,
    ...neighborhoodEntries,
    ...serviceLocationEntries
  ]
}

/**
 * Generate category and collection pages
 */
function generateCategorySitemapEntries(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  const categories = [
    { slug: 'barn-doors', name: 'Barn Doors', priority: 0.85 },
    { slug: 'bifold-doors', name: 'Bifold Doors', priority: 0.85 },
    { slug: 'bypass-doors', name: 'Bypass Doors', priority: 0.85 },
    { slug: 'pivot-doors', name: 'Pivot Doors', priority: 0.8 },
    { slug: 'sliding-doors', name: 'Sliding Doors', priority: 0.8 },
    { slug: 'interior-doors', name: 'Interior Doors', priority: 0.75 },
    { slug: 'closet-doors', name: 'Closet Doors', priority: 0.85 },
    { slug: 'custom-doors', name: 'Custom Doors', priority: 0.75 },
    { slug: 'closet-systems', name: 'Closet Systems', priority: 0.8 },
    { slug: 'hardware', name: 'Hardware', priority: 0.7 },
    { slug: 'mirrors', name: 'Mirrors', priority: 0.65 },
    { slug: 'accessories', name: 'Accessories', priority: 0.6 }
  ]

  return categories.map(category => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified,
    changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
    priority: category.priority
  }))
}

/**
 * Generate service pages
 */
function generateServiceSitemapEntries(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  const services = [
    { slug: 'installation', name: 'Professional Installation', priority: 0.85 },
    { slug: 'custom-design', name: 'Custom Design Service', priority: 0.8 },
    { slug: 'measurement', name: 'Free Measurement', priority: 0.75 },
    { slug: 'consultation', name: 'Design Consultation', priority: 0.75 },
    { slug: 'warranty', name: 'Lifetime Warranty', priority: 0.7 },
    { slug: 'financing', name: 'Financing Options', priority: 0.65 },
    { slug: 'commercial', name: 'Commercial Services', priority: 0.7 }
  ]

  const mainServicePage = {
    url: `${baseUrl}/services`,
    lastModified,
    changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
    priority: SITEMAP_CONFIG.priorities.critical
  }

  const servicePages = services.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified,
    changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
    priority: service.priority
  }))

  return [mainServicePage, ...servicePages]
}

/**
 * Main sitemap generation function
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date()

  // Core pages with highest priority
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
      priority: SITEMAP_CONFIG.priorities.homepage
    },
    {
      url: `${baseUrl}/products`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
      priority: SITEMAP_CONFIG.priorities.critical
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.high
    },
    {
      url: `${baseUrl}/request-work`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.high
    },
    {
      url: `${baseUrl}/quote`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.high
    }
  ]

  // About and company pages
  const companyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.medium
    },
    {
      url: `${baseUrl}/why-pg`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.medium
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.medium
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.low
    },
    {
      url: `${baseUrl}/careers`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.minimal
    }
  ]

  // Store and shopping pages
  const storePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/store`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
      priority: SITEMAP_CONFIG.priorities.high
    },
    {
      url: `${baseUrl}/store/products`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
      priority: SITEMAP_CONFIG.priorities.medium
    },
    {
      url: `${baseUrl}/products/new`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
      priority: SITEMAP_CONFIG.priorities.medium
    },
    {
      url: `${baseUrl}/products/sale`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.frequent,
      priority: SITEMAP_CONFIG.priorities.high
    },
    {
      url: `${baseUrl}/products/catalog`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.medium
    }
  ]

  // Resource and informational pages
  const resourcePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.dynamic,
      priority: SITEMAP_CONFIG.priorities.low
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.low
    },
    {
      url: `${baseUrl}/guides`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.minimal
    },
    {
      url: `${baseUrl}/resources`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.minimal
    },
    {
      url: `${baseUrl}/size-guide`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.low
    },
    {
      url: `${baseUrl}/installation-guide`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.low
    }
  ]

  // User account pages (public facing)
  const accountPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/cart`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.frequent,
      priority: SITEMAP_CONFIG.priorities.minimal
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.frequent,
      priority: SITEMAP_CONFIG.priorities.low
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.frequent,
      priority: SITEMAP_CONFIG.priorities.minimal
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.minimal
    },
    {
      url: `${baseUrl}/register`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.minimal
    }
  ]

  // Legal and policy pages
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.yearly,
      priority: SITEMAP_CONFIG.priorities.legal
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified,
      changeFrequency: SITEMAP_CONFIG.changeFrequencies.static,
      priority: SITEMAP_CONFIG.priorities.legal
    }
  ]

  // Generate all sitemap entries
  const productEntries = generateProductSitemapEntries()
  const locationEntries = generateLocationSitemapEntries()
  const categoryEntries = generateCategorySitemapEntries()
  const serviceEntries = generateServiceSitemapEntries()

  // Combine all entries with priority order
  return [
    ...corePages,
    ...locationEntries,    // Location pages for local SEO
    ...serviceEntries,     // Service pages
    ...categoryEntries,    // Category/collection pages
    ...storePages,        // Store and shopping pages
    ...companyPages,      // About and company info
    ...productEntries,    // Individual product pages
    ...resourcePages,     // Resources and guides
    ...accountPages,      // User account pages
    ...legalPages        // Legal pages at the end
  ]
}

/**
 * Generate split sitemaps for large sites
 */
export async function generateProductSitemap(): Promise<MetadataRoute.Sitemap> {
  return generateProductSitemapEntries()
}

export async function generateLocationSitemap(): Promise<MetadataRoute.Sitemap> {
  return generateLocationSitemapEntries()
}

export async function generateCategorySitemap(): Promise<MetadataRoute.Sitemap> {
  return generateCategorySitemapEntries()
}

export async function generateServiceSitemap(): Promise<MetadataRoute.Sitemap> {
  return generateServiceSitemapEntries()
}

/**
 * Sitemap index for managing multiple sitemaps
 */
export function sitemapIndex(): string {
  const baseUrl = BUSINESS_INFO.urls.main
  const lastModified = new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-locations.xml</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>
</sitemapindex>`
}