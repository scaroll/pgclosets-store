import { NextResponse } from 'next/server'
import { BUSINESS_INFO } from '@/lib/business-config'

export const dynamic = 'force-dynamic'

interface SitemapEntry {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export async function GET() {
  const baseUrl = BUSINESS_INFO.urls.main
  const currentDate = new Date().toISOString()

  // Static pages with Ottawa SEO focus
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/closet-doors-ottawa`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/bifold-doors-ottawa`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/custom-closets-ottawa`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/wardrobe-doors-ottawa`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7
    }
  ]

  // Product categories optimized for Ottawa market
  const productCategories = [
    'closet-doors',
    'bifold-doors',
    'bypass-doors',
    'barn-doors',
    'walk-in-closets',
    'reach-in-closets',
    'custom-organization',
    'closet-accessories'
  ]

  const categoryPages: SitemapEntry[] = productCategories.map(category => ({
    url: `${baseUrl}/products/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  }))

  // Ottawa service areas for local SEO
  const ottawaAreas = [
    'downtown-ottawa',
    'kanata',
    'orleans',
    'barrhaven',
    'nepean',
    'gloucester',
    'rockcliffe-park',
    'vanier',
    'westboro',
    'hintonburg'
  ]

  const localPages: SitemapEntry[] = ottawaAreas.map(area => ({
    url: `${baseUrl}/ottawa/${area}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  // Combine all pages
  const allPages = [...staticPages, ...categoryPages, ...localPages]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}