import { reninProducts } from './renin-products'
import type { MetadataRoute } from 'next'

export interface SitemapEntry {
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paddle-payments-nl5k9vde7-peoples-group.vercel.app'

export function generateStaticSitemapEntries(): SitemapEntry[] {
  const currentDate = new Date().toISOString()
  
  return [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/store`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/store/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ]
}

export function generateProductSitemapEntries(): SitemapEntry[] {
  const currentDate = new Date().toISOString()
  const entries: SitemapEntry[] = []
  
  // Category pages
  entries.push(
    {
      url: `${baseUrl}/barn-doors`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/hardware`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    }
  )
  
  // Individual product pages
  const barnDoors = reninProducts.getBarnDoors()
  const hardware = reninProducts.getHardware()
  
  // Barn door products
  barnDoors.forEach(product => {
    entries.push({
      url: `${baseUrl}/store/products/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    })
    
    // Individual barn door category pages
    entries.push({
      url: `${baseUrl}/barn-doors/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6
    })
  })
  
  // Hardware products
  hardware.forEach(product => {
    entries.push({
      url: `${baseUrl}/store/products/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    })
    
    entries.push({
      url: `${baseUrl}/hardware/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6
    })
  })
  
  return entries
}

export function generateProgrammaticSEOPages(): SitemapEntry[] {
  const currentDate = new Date().toISOString()
  const entries: SitemapEntry[] = []
  
  // Style-based pages
  const styles = ['industrial', 'modern', 'rustic', 'traditional', 'contemporary']
  styles.forEach(style => {
    entries.push({
      url: `${baseUrl}/barn-doors/style/${style}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6
    })
  })
  
  // Material-based pages
  const materials = ['wood', 'steel', 'pine', 'mdf', 'composite']
  materials.forEach(material => {
    entries.push({
      url: `${baseUrl}/barn-doors/material/${material}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6
    })
  })
  
  // Ottawa area location pages
  const locations = ['ottawa', 'kanata', 'orleans', 'nepean', 'gloucester', 'barrhaven']
  locations.forEach(location => {
    entries.push({
      url: `${baseUrl}/locations/${location}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    })
  })
  
  // Installation service pages
  entries.push(
    {
      url: `${baseUrl}/services/installation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/services/consultation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/services/maintenance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    }
  )
  
  return entries
}

export function generateFullSitemap(): MetadataRoute.Sitemap {
  const staticEntries = generateStaticSitemapEntries()
  const productEntries = generateProductSitemapEntries()
  const seoEntries = generateProgrammaticSEOPages()
  
  return [...staticEntries, ...productEntries, ...seoEntries]
}