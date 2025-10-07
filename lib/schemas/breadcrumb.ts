/**
 * Breadcrumb Schema Generator
 * Creates structured breadcrumb navigation for search results
 */

import { BUSINESS_INFO } from '../business-config'

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface BreadcrumbListSchema {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  }
}

/**
 * Generate JSON-LD script tag for Breadcrumb
 */
export function generateBreadcrumbScriptTag(breadcrumbs: BreadcrumbItem[]): string {
  const schema = generateBreadcrumbSchema(breadcrumbs)
  return JSON.stringify(schema)
}

/**
 * Generate breadcrumbs from URL path
 */
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const baseUrl = BUSINESS_INFO.urls.main
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: 'Home',
      url: baseUrl,
    },
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Convert segment to readable name
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      name,
      url: `${baseUrl}${currentPath}`,
    })
  })

  return breadcrumbs
}

/**
 * Generate breadcrumbs for product pages
 */
export function generateProductBreadcrumbs(
  category: string,
  productName: string,
  productSlug: string
): BreadcrumbItem[] {
  const baseUrl = BUSINESS_INFO.urls.main

  const categoryName = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return [
    {
      name: 'Home',
      url: baseUrl,
    },
    {
      name: 'Products',
      url: `${baseUrl}/products`,
    },
    {
      name: categoryName,
      url: `${baseUrl}/products/${category}`,
    },
    {
      name: productName,
      url: `${baseUrl}/products/${category}/${productSlug}`,
    },
  ]
}

/**
 * Generate breadcrumbs for location pages
 */
export function generateLocationBreadcrumbs(location: string): BreadcrumbItem[] {
  const baseUrl = BUSINESS_INFO.urls.main

  return [
    {
      name: 'Home',
      url: baseUrl,
    },
    {
      name: 'Service Areas',
      url: `${baseUrl}/locations`,
    },
    {
      name: location,
      url: `${baseUrl}/locations/${location.toLowerCase()}`,
    },
  ]
}
