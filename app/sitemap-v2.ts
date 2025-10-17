/**
 * Enhanced Sitemap for PG Closets v2
 * Aligned with master spec requirements
 */

import type { MetadataRoute } from 'next'

const CANONICAL_URL = 'https://www.pgclosets.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Homepage - Maximum Priority
  const homepage: MetadataRoute.Sitemap = [
    {
      url: CANONICAL_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Products Hub - High Priority
  const productsHub: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/products`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Product Category Pages - High Priority
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/products/bypass`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/products/bifold`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/products/pivot`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/products/swing`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/products/barn-sliding`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/products/room-dividers`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Service Pages
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/services/installation`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Core Pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${CANONICAL_URL}/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${CANONICAL_URL}/reviews`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CANONICAL_URL}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Location Hub
  const locationsHub: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/locations`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Location Pages - High Priority for Local SEO
  const locationPages: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/locations/ottawa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${CANONICAL_URL}/locations/kanata`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/locations/barrhaven`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/locations/nepean`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/locations/orleans`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/locations/stittsville`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/locations/gloucester`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Legal Pages - Low Priority
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_URL}/legal/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${CANONICAL_URL}/legal/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Combine all pages with proper prioritization
  return [
    ...homepage,
    ...productsHub,
    ...categoryPages,
    ...servicePages,
    ...locationsHub,
    ...locationPages,
    ...corePages,
    ...legalPages,
  ]
}

/**
 * Generate product-specific sitemap
 * This would be populated with actual product data
 */
export async function generateProductsSitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  // TODO: Replace with actual product data from catalog
  const mockProducts = [
    { category: 'bypass', slug: 'modern-bypass-door' },
    { category: 'bifold', slug: 'classic-bifold-door' },
    { category: 'barn-sliding', slug: 'rustic-barn-door' },
  ]

  return mockProducts.map((product) => ({
    url: `${CANONICAL_URL}/products/${product.category}/${product.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
}

/**
 * Validate sitemap URLs
 */
export function validateSitemap(sitemap: MetadataRoute.Sitemap): boolean {
  return sitemap.every((entry) => {
    // All URLs must use canonical domain
    if (!entry.url.startsWith(CANONICAL_URL)) {
      console.error(`Invalid URL: ${entry.url} - must use ${CANONICAL_URL}`)
      return false
    }

    // Priority must be between 0 and 1
    if (entry.priority && (entry.priority < 0 || entry.priority > 1)) {
      console.error(`Invalid priority for ${entry.url}: ${entry.priority}`)
      return false
    }

    return true
  })
}
