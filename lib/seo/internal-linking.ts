/**
 * AGENT 14: Link Building Agent - Internal Linking Strategy
 * Intelligent internal linking for SEO optimization
 */

import { BUSINESS_INFO } from '../business-config'

/**
 * Link relationship types
 */
export type LinkRelationship =
  | 'category-to-product'
  | 'product-to-related'
  | 'location-to-service'
  | 'service-to-product'
  | 'blog-to-product'
  | 'breadcrumb'

/**
 * Internal link structure
 */
export interface InternalLink {
  href: string
  text: string
  title?: string
  relationship: LinkRelationship
  priority: number // 1-10, higher = more important
}

/**
 * Generate related product links
 */
export function generateRelatedProductLinks(params: {
  currentProductId: string
  category?: string
  style?: string
  material?: string
}): InternalLink[] {
  const links: InternalLink[] = []

  // Category link
  if (params.category) {
    links.push({
      href: `/products/${params.category.toLowerCase().replace(/\s+/g, '-')}`,
      text: `View all ${params.category}`,
      title: `Browse our complete ${params.category} collection`,
      relationship: 'category-to-product',
      priority: 9
    })
  }

  // Style-based recommendations
  if (params.style) {
    links.push({
      href: `/products?style=${encodeURIComponent(params.style)}`,
      text: `More ${params.style} doors`,
      title: `Explore ${params.style} style closet doors`,
      relationship: 'product-to-related',
      priority: 7
    })
  }

  // Material-based recommendations
  if (params.material) {
    links.push({
      href: `/products?material=${encodeURIComponent(params.material)}`,
      text: `${params.material} options`,
      title: `View ${params.material} closet doors`,
      relationship: 'product-to-related',
      priority: 6
    })
  }

  return links
}

/**
 * Generate location-based service links
 */
export function generateLocationServiceLinks(neighborhood: string): InternalLink[] {
  return [
    {
      href: '/services',
      text: 'Our Services',
      title: `Professional closet door services in ${neighborhood}`,
      relationship: 'location-to-service',
      priority: 8
    },
    {
      href: '/services/installation',
      text: 'Installation Service',
      title: `Expert installation in ${neighborhood}`,
      relationship: 'location-to-service',
      priority: 9
    },
    {
      href: '/services/design',
      text: 'Design Consultation',
      title: `Free design consultation for ${neighborhood} residents`,
      relationship: 'location-to-service',
      priority: 8
    },
    {
      href: '/contact',
      text: 'Contact Us',
      title: `Get in touch with our ${neighborhood} team`,
      relationship: 'location-to-service',
      priority: 7
    }
  ]
}

/**
 * Generate breadcrumb navigation
 */
export function generateBreadcrumbs(path: string[]): InternalLink[] {
  const breadcrumbs: InternalLink[] = [
    {
      href: '/',
      text: 'Home',
      title: BUSINESS_INFO.name,
      relationship: 'breadcrumb',
      priority: 10
    }
  ]

  let currentPath = ''
  path.forEach((segment, index) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      href: currentPath,
      text: formatBreadcrumbText(segment),
      title: formatBreadcrumbText(segment),
      relationship: 'breadcrumb',
      priority: 10 - index
    })
  })

  return breadcrumbs
}

/**
 * Format breadcrumb text
 */
function formatBreadcrumbText(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate footer navigation links
 */
export function generateFooterLinks(): Record<string, InternalLink[]> {
  return {
    'Products': [
      {
        href: '/products/barn-doors',
        text: 'Barn Doors',
        relationship: 'category-to-product',
        priority: 9
      },
      {
        href: '/products/bypass-doors',
        text: 'Bypass Doors',
        relationship: 'category-to-product',
        priority: 9
      },
      {
        href: '/products/bifold-doors',
        text: 'Bifold Doors',
        relationship: 'category-to-product',
        priority: 8
      },
      {
        href: '/products/pivot-doors',
        text: 'Pivot Doors',
        relationship: 'category-to-product',
        priority: 7
      },
    ],
    'Services': [
      {
        href: '/services/installation',
        text: 'Installation',
        relationship: 'service-to-product',
        priority: 9
      },
      {
        href: '/services/design',
        text: 'Design Consultation',
        relationship: 'service-to-product',
        priority: 8
      },
      {
        href: '/services/measurement',
        text: 'Measurement',
        relationship: 'service-to-product',
        priority: 7
      },
    ],
    'Areas Served': BUSINESS_INFO.serviceAreas.slice(0, 5).map((area, index) => ({
      href: `/areas/${area.toLowerCase().replace(/\s+/g, '-')}`,
      text: area,
      relationship: 'location-to-service' as LinkRelationship,
      priority: 9 - index
    })),
    'Company': [
      {
        href: '/about',
        text: 'About Us',
        relationship: 'breadcrumb' as LinkRelationship,
        priority: 6
      },
      {
        href: '/contact',
        text: 'Contact',
        relationship: 'breadcrumb' as LinkRelationship,
        priority: 8
      },
      {
        href: '/gallery',
        text: 'Gallery',
        relationship: 'breadcrumb' as LinkRelationship,
        priority: 7
      },
    ]
  }
}

/**
 * Calculate link equity distribution
 */
export interface LinkEquity {
  page: string
  inboundLinks: number
  outboundLinks: number
  linkEquityScore: number
  recommendations: string[]
}

export function analyzeLinkEquity(pages: Array<{
  url: string
  inboundLinks: number
  outboundLinks: number
}>): LinkEquity[] {
  return pages.map(page => {
    // Simple link equity calculation
    const linkEquityScore = page.inboundLinks / Math.max(page.outboundLinks, 1)

    const recommendations: string[] = []

    if (page.outboundLinks === 0) {
      recommendations.push('Add internal links to related content')
    }

    if (page.outboundLinks > 100) {
      recommendations.push('Too many outbound links - may dilute link equity')
    }

    if (page.inboundLinks === 0) {
      recommendations.push('Create backlinks from high-authority pages')
    }

    if (linkEquityScore < 0.5) {
      recommendations.push('Improve link equity by reducing outbound links or gaining more inbound links')
    }

    return {
      page: page.url,
      inboundLinks: page.inboundLinks,
      outboundLinks: page.outboundLinks,
      linkEquityScore,
      recommendations
    }
  })
}

/**
 * Generate contextual links within content
 */
export function generateContextualLinks(
  content: string,
  availableLinks: Map<string, string> // keyword -> URL
): string {
  let linkedContent = content

  // Sort by length (longest first) to avoid partial matches
  const sortedKeywords = Array.from(availableLinks.keys()).sort((a, b) => b.length - a.length)

  sortedKeywords.forEach(keyword => {
    const url = availableLinks.get(keyword)
    if (!url) return

    // Only link first occurrence
    const regex = new RegExp(`\\b${keyword}\\b`, 'i')
    linkedContent = linkedContent.replace(regex, match => {
      return `<a href="${url}" title="${match}">${match}</a>`
    })
  })

  return linkedContent
}
