import type { MetadataRoute } from "next"
import { BUSINESS_INFO } from "./lib/business-config"

/**
 * SEO AGENT #7: Comprehensive XML Sitemap
 * Optimized for Ottawa closet door search dominance
 * Priority-based structure targeting key conversion pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const currentDate = new Date().toISOString()

  // Priority 1.0 - Homepage (highest priority)
  const homepage = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 1.0,
  }

  // Priority 0.9 - Main Product Collections (money pages)
  const collections = [
    "renin-barn-doors",
    "renin-bypass-doors",
    "renin-bifold-doors",
    "renin-pivot-doors",
    "renin-closet-doors",
    "renin-room-dividers",
    "hardware",
    "mirrors",
  ].map(slug => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Priority 0.8 - Location Landing Pages (local SEO)
  const locations = [
    "ottawa",
    "kanata",
    "barrhaven",
    "orleans",
    "nepean",
  ].map(location => ({
    url: `${baseUrl}/${location}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Priority 0.8 - Renin Location Pages (geo-targeted)
  const reninLocations = [
    "ottawa",
    "kanata",
    "barrhaven",
    "orleans",
  ].map(location => ({
    url: `${baseUrl}/renin/${location}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Priority 0.7 - Service Pages
  const services = [
    { slug: "consultation", freq: "monthly" as const },
    { slug: "installation-ottawa", freq: "monthly" as const },
  ].map(service => ({
    url: `${baseUrl}/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: service.freq,
    priority: 0.7,
  }))

  // Priority 0.7 - Key Information Pages
  const info = [
    { slug: "faq", freq: "monthly" as const },
    { slug: "quote", freq: "monthly" as const },
    { slug: "contact", freq: "monthly" as const },
    { slug: "about", freq: "monthly" as const },
    { slug: "why-pg", freq: "monthly" as const },
    { slug: "store", freq: "weekly" as const },
  ].map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: currentDate,
    changeFrequency: page.freq,
    priority: 0.7,
  }))

  // Priority 0.6 - Product Category Pages
  const productCategories = [
    "barn-doors",
    "bypass-doors",
    "bifold-doors",
    "pivot-doors",
    "sliding-doors",
    "french-doors",
    "closet-doors",
    "interior-doors",
    "custom-doors",
    "room-dividers",
    "hardware",
    "closet-systems",
  ].map(category => ({
    url: `${baseUrl}/products/${category}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Priority 0.5 - Secondary Pages
  const secondary = [
    { slug: "book-measurement", freq: "monthly" as const },
    { slug: "instant-estimate", freq: "monthly" as const },
    { slug: "gallery", freq: "monthly" as const },
    { slug: "blog", freq: "weekly" as const },
  ].map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: currentDate,
    changeFrequency: page.freq,
    priority: 0.5,
  }))

  // Priority 0.3 - Legal & Policy Pages
  const legal = [
    "privacy-policy",
    "terms-of-service",
    "return-policy",
    "shipping-policy",
  ].map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }))

  // Combine all pages in priority order
  return [
    homepage,
    ...collections,
    ...locations,
    ...reninLocations,
    ...services,
    ...info,
    ...productCategories,
    ...secondary,
    ...legal,
  ]
}
