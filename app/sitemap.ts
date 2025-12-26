import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.pgclosets.com'

  // Base routes
  const routes = [
    '',
    '/about',
    '/products',
    '/book-measure',
    '/blog',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Services
  const services = [
    '/services/custom-design',
    '/services/planning',
    '/services/maintenance',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Collections (Based on BentoGrid in HomePage)
  const collections = [
    '/collections/barn-doors',
    '/collections/bifold',
    '/collections/glass',
    '/collections/hardware',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...services, ...collections]
}
