"use client"

import Script from 'next/script'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

/**
 * Breadcrumb Schema Component
 * Generates structured data for breadcrumb navigation
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `https://www.pgclosets.com${item.url}`
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

/**
 * Visual Breadcrumb Component
 * Renders accessible breadcrumb navigation
 */
interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbNavigation({ items, className = '' }: BreadcrumbNavigationProps) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumb-navigation ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-slate-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-slate-400" aria-hidden="true">
                /
              </span>
            )}
            {index === items.length - 1 ? (
              <span
                className="text-slate-900 font-medium"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                className="hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 rounded"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Combined Breadcrumb Component
 * Includes both visual navigation and schema markup
 */
interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showNavigation?: boolean
  className?: string
}

export function Breadcrumb({
  items,
  showNavigation = true,
  className = ''
}: BreadcrumbProps) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      {showNavigation && (
        <BreadcrumbNavigation items={items} className={className} />
      )}
    </>
  )
}

/**
 * Hook to generate breadcrumbs based on current path
 */
import { usePathname } from 'next/navigation'

export function useBreadcrumbs() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', url: '/' }
    ]

    // Build breadcrumbs from path segments
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Convert segment to readable name
      let name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Special cases for known routes
      const routeNames: Record<string, string> = {
        'products': 'Products',
        'about': 'About Us',
        'services': 'Services',
        'contact': 'Contact',
        'request-work': 'Request Work',
        'gallery': 'Gallery',
        'blog': 'Blog',
        'ottawa': 'Ottawa',
        'kanata': 'Kanata',
        'barrhaven': 'Barrhaven',
        'orleans': 'Orleans',
        'nepean': 'Nepean',
        'barn-doors': 'Barn Doors',
        'bifold-doors': 'Bifold Doors',
        'bypass-doors': 'Bypass Doors',
        'pivot-doors': 'Pivot Doors',
        'hardware': 'Hardware',
        'mirrors': 'Mirrors'
      }

      if (routeNames[segment]) {
        name = routeNames[segment]
      }

      breadcrumbs.push({
        name,
        url: currentPath
      })
    })

    return breadcrumbs
  }

  return generateBreadcrumbs()
}