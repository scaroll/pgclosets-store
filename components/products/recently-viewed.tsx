"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, X } from "lucide-react"
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store"
import { ProductCardCompact } from "./product-card"
import { Button } from "@/ui/button"
import { cn } from "@/lib/utils"

interface RecentlyViewedProps {
  className?: string
  title?: string
  maxItems?: number
  showClearButton?: boolean
  variant?: "horizontal" | "grid"
}

export function RecentlyViewed({
  className,
  title = "Recently Viewed",
  maxItems = 6,
  showClearButton = true,
  variant = "grid",
}: RecentlyViewedProps) {
  const [mounted, setMounted] = useState(false)
  const { products, clearAll } = useRecentlyViewedStore()

  // Only render on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const displayProducts = products.slice(0, maxItems)

  // Don't render if no products
  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-6 h-6 text-primary" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h2>
          </div>

          {showClearButton && displayProducts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Products Grid/Horizontal */}
        {variant === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCardCompact
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    salePrice: product.salePrice,
                    images: [product.image],
                    inStock: true,
                    category: product.category
                      ? { name: product.category }
                      : undefined,
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0 w-[200px] sm:w-[240px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCardCompact
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    salePrice: product.salePrice,
                    images: [product.image],
                    inStock: true,
                    category: product.category
                      ? { name: product.category }
                      : undefined,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* View Count Info */}
        {products.length > maxItems && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {maxItems} of {products.length} recently viewed products
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Compact version for sidebars or smaller spaces
 */
export function RecentlyViewedCompact({
  className,
  maxItems = 4,
}: {
  className?: string
  maxItems?: number
}) {
  const [mounted, setMounted] = useState(false)
  const { products } = useRecentlyViewedStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || products.length === 0) {
    return null
  }

  const displayProducts = products.slice(0, maxItems)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Recently Viewed</h3>
      </div>

      <div className="space-y-3">
        {displayProducts.map((product) => (
          <a
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {product.salePrice ? (
                  <>
                    <span className="text-sm font-bold text-primary">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {products.length > maxItems && (
        <p className="text-xs text-muted-foreground text-center">
          +{products.length - maxItems} more
        </p>
      )}
    </div>
  )
}

/**
 * Hook to track product views
 * Use this on product detail pages to automatically track views
 */
export function useTrackProductView() {
  const addProduct = useRecentlyViewedStore((state) => state.addProduct)

  const trackView = (product: {
    id: string
    slug: string
    name: string
    price: number
    salePrice?: number
    image: string
    category?: string
  }) => {
    // Add a small delay to avoid tracking during rapid navigation
    const timeoutId = setTimeout(() => {
      addProduct(product)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  return { trackView }
}
