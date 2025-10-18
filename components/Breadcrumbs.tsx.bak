"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  /**
   * Custom labels for path segments (e.g., { 'products': 'Our Products' })
   */
  customLabels?: Record<string, string>
  /**
   * Show home icon instead of "Home" text
   */
  showHomeIcon?: boolean
}

export function Breadcrumbs({
  items,
  className,
  customLabels = {},
  showHomeIcon = true,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = React.useMemo(() => {
    if (items) return items

    const paths = pathname?.split("/").filter(Boolean) || []

    const generatedItems: BreadcrumbItem[] = paths.map((path, index) => {
      const href = `/${  paths.slice(0, index + 1).join("/")}`

      // Convert kebab-case to Title Case and apply custom labels
      const label = customLabels[path] || path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return { label, href }
    })

    return generatedItems
  }, [pathname, items, customLabels])

  // Don't render if on home page
  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
    >
      <ol
        className="flex items-center space-x-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home Link */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            className={cn(
              "flex items-center hover:text-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            )}
            itemProp="item"
          >
            {showHomeIcon ? (
              <>
                <Home className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </>
            ) : (
              <span itemProp="name">Home</span>
            )}
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const position = index + 2 // +1 for array index, +1 for home

          return (
            <React.Fragment key={item.href}>
              <li aria-hidden="true" className="flex items-center">
                <ChevronRight className="h-4 w-4" />
              </li>

              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {isLast ? (
                  // Current page - not a link
                  <span
                    className="font-medium text-foreground"
                    aria-current="page"
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                ) : (
                  // Link to intermediate page
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    )}
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={position.toString()} />
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Breadcrumbs with compact mobile variant
 */
export function ResponsiveBreadcrumbs(props: BreadcrumbsProps) {
  return (
    <>
      {/* Desktop: Full breadcrumbs */}
      <div className="hidden md:block">
        <Breadcrumbs {...props} />
      </div>

      {/* Mobile: Only show parent link */}
      <div className="md:hidden">
        <MobileBreadcrumbs {...props} />
      </div>
    </>
  )
}

function MobileBreadcrumbs({ items, customLabels = {} }: BreadcrumbsProps) {
  const pathname = usePathname()

  const parentItem = React.useMemo(() => {
    if (items && items.length > 0) {
      return items[items.length - 2] || { label: "Home", href: "/" }
    }

    const paths = pathname?.split("/").filter(Boolean) || []
    if (paths.length <= 1) return null

    const parentPath = paths[paths.length - 2]
    const href = `/${  paths.slice(0, -1).join("/")}`
    const label = customLabels[parentPath] || parentPath
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return { label, href }
  }, [pathname, items, customLabels])

  if (!parentItem) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      <Link
        href={parentItem.href}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" />
        <span>{parentItem.label}</span>
      </Link>
    </nav>
  )
}
