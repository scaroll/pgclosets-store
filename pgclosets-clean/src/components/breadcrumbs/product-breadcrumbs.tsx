"use client"

import Link from "next/link"
import { ChevronRight, Home } from "@/components/ui/icons"
import { usePathname, useSearchParams } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

interface ProductBreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: React.ReactNode
}

// Category mapping for dynamic breadcrumbs
const categoryMap: Record<string, string> = {
  "barn-doors": "Barn Doors",
  "bypass-doors": "Bypass Doors",
  "bifold-doors": "Bifold Doors",
  "hardware": "Hardware",
  "all": "All Products"
}

// Generate breadcrumbs based on current path and search params
function generateBreadcrumbs(pathname: string, searchParams: URLSearchParams): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Always start with home
  breadcrumbs.push({
    label: "Home",
    href: "/"
  })

  // Handle different page types
  if (segments[0] === 'products') {
    // Products section
    const category = searchParams.get('category')

    if (category && categoryMap[category]) {
      // Category page: Home > Products > Category
      breadcrumbs.push({
        label: "Products",
        href: "/products"
      })
      breadcrumbs.push({
        label: categoryMap[category],
        href: `/products?category=${category}`,
        isCurrentPage: segments.length === 1
      })
    } else if (segments.length === 1) {
      // All products page: Home > Products
      breadcrumbs.push({
        label: "Products",
        href: "/products",
        isCurrentPage: true
      })
    } else if (segments.length === 2) {
      // Individual product page: Home > Products > Category > Product
      breadcrumbs.push({
        label: "Products",
        href: "/products"
      })

      // Try to determine category from product slug (simplified)
      const productSlug = segments[1]
      if (productSlug.includes('barn')) {
        breadcrumbs.push({
          label: "Barn Doors",
          href: "/products?category=barn-doors"
        })
      } else if (productSlug.includes('bypass')) {
        breadcrumbs.push({
          label: "Bypass Doors",
          href: "/products?category=bypass-doors"
        })
      } else if (productSlug.includes('bifold')) {
        breadcrumbs.push({
          label: "Bifold Doors",
          href: "/products?category=bifold-doors"
        })
      }

      // Product name (simplified - would normally come from product data)
      const productName = productSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label: productName,
        href: pathname,
        isCurrentPage: true
      })
    }
  } else if (segments[0] === 'about') {
    breadcrumbs.push({
      label: "About",
      href: "/about",
      isCurrentPage: true
    })
  } else if (segments[0] === 'services') {
    breadcrumbs.push({
      label: "Services",
      href: "/services",
      isCurrentPage: true
    })
  } else if (segments[0] === 'contact') {
    breadcrumbs.push({
      label: "Contact",
      href: "/contact",
      isCurrentPage: true
    })
  }

  return breadcrumbs
}

export function ProductBreadcrumbs({
  items,
  className = "",
  showHome = true,
  separator = <ChevronRight className="h-4 w-4 text-slate-400" />
}: ProductBreadcrumbsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Use provided items or generate from current path
  const breadcrumbItems = items || generateBreadcrumbs(pathname, searchParams)

  // Filter out home if showHome is false
  const displayItems = showHome ? breadcrumbItems : breadcrumbItems.slice(1)

  if (displayItems.length <= 1) {
    return null // Don't show breadcrumbs if there's only one item or less
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-slate-50 py-3 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {displayItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mr-2" aria-hidden="true">
                  {separator}
                </span>
              )}

              {item.isCurrentPage ? (
                <span
                  className="text-slate-900 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

// Specialized breadcrumb components for common use cases
export function ProductPageBreadcrumbs({
  categoryName,
  categoryHref,
  productName
}: {
  categoryName: string
  categoryHref: string
  productName: string
}) {
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: categoryName, href: categoryHref },
    { label: productName, href: "#", isCurrentPage: true }
  ]

  return <ProductBreadcrumbs items={items} />
}

export function CategoryPageBreadcrumbs({
  categoryName,
  categoryHref
}: {
  categoryName: string
  categoryHref: string
}) {
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: categoryName, href: categoryHref, isCurrentPage: true }
  ]

  return <ProductBreadcrumbs items={items} />
}

// JSON-LD structured data for SEO
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pgclosets.com'}${item.href}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}