/**
 * Breadcrumbs Component with JSON-LD Schema
 * SEO-optimized breadcrumb navigation
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { getBreadcrumbSchema, renderSchema } from '@/lib/seo/schemas'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Always include home as first item
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    ...items,
  ]

  // Generate JSON-LD schema
  const schema = getBreadcrumbSchema(breadcrumbItems)

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD schema from trusted source via renderSchema
        dangerouslySetInnerHTML={renderSchema(schema)}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            const isHome = index === 0

            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="mx-2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="text-gray-500 font-medium"
                    aria-current="page"
                  >
                    {isHome && (
                      <Home className="inline h-4 w-4 mr-1" aria-hidden="true" />
                    )}
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {isHome && (
                      <Home className="inline h-4 w-4 mr-1" aria-hidden="true" />
                    )}
                    {isHome ? '' : item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

/**
 * Helper function to generate breadcrumbs from pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  for (const path of paths) {
    currentPath += `/${path}`

    // Format the name (capitalize and replace hyphens with spaces)
    const name = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      name,
      url: currentPath,
    })
  }

  return breadcrumbs
}
