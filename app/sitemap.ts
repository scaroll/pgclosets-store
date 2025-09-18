import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.pgclosets.com"
  const currentDate = new Date().toISOString()

  // Define product categories and main products
  const productSlugs = [
    'euro-1-lite-bypass', 'euro-3-lite-bypass', 'euro-5-lite-bypass',
    'georgian-6-panel-bypass', 'parsons-flush-panel-bypass',
    'heritage-rustic-plank', 'heritage-shaker', 'heritage-gladstone',
    'euro-1-lite-bifold', 'euro-3-lite-bifold', 'georgian-6-panel-bifold',
    'ashbury-2-panel-bifold', 'parsons-flush-panel-bifold',
    'euro-1-lite-pivot', 'euro-3-lite-pivot', 'provincial-8-lite-pivot',
    'crochet-multi-x-pivot'
  ]

  // Core business pages with appropriate priorities
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store/products`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quote-submitted`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  // Add dynamic product pages
  const productPages = productSlugs.map(slug => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Add service area pages
  const serviceAreas = ['ottawa', 'kanata', 'nepean', 'orleans', 'barrhaven']
  const servicePages = serviceAreas.map(area => ({
    url: `${baseUrl}/${area}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...servicePages]
}
