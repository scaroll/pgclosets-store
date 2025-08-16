import { MetadataRoute } from 'next'
import { generateFullSitemap } from '@/lib/sitemap'

export default function sitemap(): MetadataRoute.Sitemap {
  return generateFullSitemap()
}