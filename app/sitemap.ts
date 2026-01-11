import { SAMPLE_POSTS } from '@/lib/blog'
import { SAMPLE_PRODUCTS } from '@/lib/products'
import { SAMPLE_SERVICES } from '@/lib/services'
import type { MetadataRoute } from 'next'

// Assume these are the cities we support for dynamic generation or we'd fetch them
const CITIES = ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pgclosets.com'

  const products = SAMPLE_PRODUCTS.map(product => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const services = SAMPLE_SERVICES.map(service => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const cities = CITIES.map(city => ({
    url: `${baseUrl}/locations/${city}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const posts = SAMPLE_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.1,
    },
    ...products,
    ...services,
    ...cities,
    ...posts,
  ]
}
