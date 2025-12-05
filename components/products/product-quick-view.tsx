"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { ShoppingCart, ExternalLink, Star, X, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import { AddToCartButton } from "./add-to-cart-button"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  images: string[]
  description?: string
  category?: { name: string }
  rating?: number
  reviewCount?: number
  inStock: boolean
  featured?: boolean
  bestseller?: boolean
  variants?: Array<{
    id: string
    color: string
    colorHex: string
  }>
}

interface ProductQuickViewProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Image Section */}
          <div className="relative aspect-square md:aspect-auto bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <Badge variant="brand-primary" size="sm">
                  Featured
                </Badge>
              )}
              {product.bestseller && (
                <Badge variant="brand-accent" size="sm">
                  Bestseller
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" size="sm">
                  -{discount}%
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" size="sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Image Gallery Indicator */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === 0 ? "bg-white w-6" : "bg-white/60"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-3">
              {/* Category */}
              {product.category && (
                <Badge variant="outline" size="sm" className="w-fit">
                  {product.category.name}
                </Badge>
              )}

              {/* Product Name */}
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-left pr-8">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(product.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  {product.reviewCount && (
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-4 border-b">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="destructive" size="sm">
                    Save {discount}%
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Available Colors
                </h4>
                <div className="flex items-center gap-2">
                  {product.variants.slice(0, 8).map((variant) => (
                    <button
                      key={variant.id}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-600 hover:scale-110 transition-all"
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.color}
                    />
                  ))}
                  {product.variants.length > 8 && (
                    <span className="text-xs text-muted-foreground">
                      +{product.variants.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {product.inStock ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <span className="font-medium">In Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span className="font-medium">Out of Stock</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {/* Add to Cart Button */}
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.salePrice || product.price,
                  image: product.images[0],
                }}
                disabled={!product.inStock}
                className="w-full"
              />

              {/* View Full Details Link */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full h-14 text-base font-semibold"
              >
                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => onOpenChange(false)}
                >
                  <ExternalLink className="w-5 h-5" />
                  View Full Details
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            {!product.inStock && (
              <p className="text-sm text-muted-foreground text-center">
                Currently unavailable. Check back soon or contact us for more
                information.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// ProductQuickViewTrigger - Convenience component for triggering quick view
// ============================================================================
interface ProductQuickViewTriggerProps {
  product: Product
  children?: React.ReactNode
  className?: string
}

export function ProductQuickViewTrigger({
  product,
  children,
  className,
}: ProductQuickViewTriggerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={className}
        variant="secondary"
        size="sm"
      >
        {children || (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </>
        )}
      </Button>

      <ProductQuickView product={product} open={open} onOpenChange={setOpen} />
    </>
  )
}
