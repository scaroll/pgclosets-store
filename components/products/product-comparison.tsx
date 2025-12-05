"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Minus, Star, ShoppingBag, Eye, Plus } from "lucide-react"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

// ============================================================================
// Types
// ============================================================================

interface ProductComparisonProps {
  initialProducts?: Product[]
  maxProducts?: 2 | 3
  className?: string
  onProductSelect?: (products: Product[]) => void
}

interface ComparisonRow {
  label: string
  getValue: (product: Product) => React.ReactNode
  type?: "text" | "boolean" | "price" | "rating" | "badge"
}

// ============================================================================
// Product Comparison Component
// ============================================================================

export function ProductComparison({
  initialProducts = [],
  maxProducts = 3,
  className,
  onProductSelect,
}: ProductComparisonProps) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.slice(0, maxProducts)
  )

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId)
    setProducts(updatedProducts)
    onProductSelect?.(updatedProducts)
  }

  const handleAddProduct = () => {
    // This is a placeholder - in a real app, this would open a product selector modal
    console.log("Add product clicked")
  }

  const canAddMore = products.length < maxProducts

  // Define comparison rows
  const comparisonRows: ComparisonRow[] = [
    {
      label: "Price",
      getValue: (product) => {
        if (product.salePrice) {
          return (
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(product.salePrice)}
              </div>
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </div>
              <Badge variant="destructive" size="sm">
                Save {Math.round((1 - product.salePrice / product.price) * 100)}%
              </Badge>
            </div>
          )
        }
        return (
          <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
        )
      },
      type: "price",
    },
    {
      label: "Rating",
      getValue: (product) => (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium">
            {product.rating} / 5.0
          </div>
          <div className="text-xs text-muted-foreground">
            {product.reviewCount} reviews
          </div>
        </div>
      ),
      type: "rating",
    },
    {
      label: "Availability",
      getValue: (product) => (
        <div className="flex items-center justify-center gap-2">
          {product.inStock ? (
            <>
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700">In Stock</span>
            </>
          ) : (
            <>
              <X className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-700">Out of Stock</span>
            </>
          )}
        </div>
      ),
      type: "boolean",
    },
    {
      label: "Featured",
      getValue: (product) => (
        <div className="flex justify-center">
          {product.isFeatured ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Minus className="w-5 h-5 text-gray-300" />
          )}
        </div>
      ),
      type: "boolean",
    },
    {
      label: "New Arrival",
      getValue: (product) => (
        <div className="flex justify-center">
          {product.isNew ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Minus className="w-5 h-5 text-gray-300" />
          )}
        </div>
      ),
      type: "boolean",
    },
  ]

  if (products.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-muted-foreground mb-4">No products to compare</p>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Products
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Product Comparison</h2>
        <p className="text-muted-foreground">
          Compare up to {maxProducts} products side by side
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {/* Product Images and Names */}
            <div className="grid gap-0 bg-gray-50 border-b border-gray-200"
                 style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))` }}>
              {/* Empty cell for row labels */}
              <div className="p-6 font-semibold text-muted-foreground border-r border-gray-200">
                Products
              </div>

              {/* Product Cards */}
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "p-6 relative",
                      index < products.length - 1 && "border-r border-gray-200"
                    )}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="Remove product"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Product Image */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="block mb-4"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                        <Image
                          src={product.images[0] || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 250px"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isFeatured && (
                            <Badge variant="brand-primary" size="sm">
                              Featured
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge variant="brand-accent" size="sm">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Product Name */}
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Category */}
                    <Badge variant="outline" size="sm" className="mb-3">
                      {product.category}
                    </Badge>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={!product.inStock}
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                      <Button size="icon-sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                {/* Add Product Button */}
                {canAddMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 flex items-center justify-center min-h-[400px]"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleAddProduct}
                      className="h-auto flex-col gap-3 py-8 px-6"
                    >
                      <Plus className="w-8 h-8" />
                      <span>Add Product</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Comparison Rows */}
            {comparisonRows.map((row, rowIndex) => (
              <div
                key={row.label}
                className={cn(
                  "grid gap-0",
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
                style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))` }}
              >
                {/* Row Label */}
                <div className="p-6 font-semibold border-r border-t border-gray-200">
                  {row.label}
                </div>

                {/* Row Values */}
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={cn(
                      "p-6 flex items-center justify-center border-t border-gray-200",
                      index < products.length - 1 && "border-r"
                    )}
                  >
                    {row.getValue(product)}
                  </div>
                ))}

                {/* Empty cell for add button column */}
                {canAddMore && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50/30" />
                )}
              </div>
            ))}

            {/* Features Section */}
            <div
              className="grid gap-0 border-t-2 border-gray-300"
              style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))` }}
            >
              <div className="p-6 font-semibold bg-gray-100 border-r border-gray-200">
                Key Features
              </div>

              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "p-6 bg-gray-100",
                    index < products.length - 1 && "border-r border-gray-200"
                  )}
                >
                  <ul className="space-y-2">
                    {product.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {product.features.length > 5 && (
                      <li className="text-sm text-muted-foreground pl-6">
                        +{product.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </div>
              ))}

              {canAddMore && <div className="p-6 bg-gray-100" />}
            </div>

            {/* Specifications Section */}
            <div
              className="grid gap-0 border-t-2 border-gray-300"
              style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))` }}
            >
              <div className="p-6 font-semibold bg-white border-r border-gray-200">
                Specifications
              </div>

              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "p-6 bg-white",
                    index < products.length - 1 && "border-r border-gray-200"
                  )}
                >
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="text-sm">
                          <dt className="font-medium text-muted-foreground mb-1">
                            {key}
                          </dt>
                          <dd className="font-semibold">{value}</dd>
                        </div>
                      )
                    )}
                  </dl>
                </div>
              ))}

              {canAddMore && <div className="p-6 bg-white" />}
            </div>

            {/* Actions Footer */}
            <div
              className="grid gap-0 bg-gray-50 border-t-2 border-gray-300"
              style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))` }}
            >
              <div className="p-6 border-r border-gray-200" />

              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "p-6 flex flex-col gap-3",
                    index < products.length - 1 && "border-r border-gray-200"
                  )}
                >
                  <Button
                    size="lg"
                    variant="brand-primary"
                    className="w-full"
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Link href={`/products/${product.slug}`} className="w-full">
                    <Button size="lg" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}

              {canAddMore && <div className="p-6" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Compact Product Comparison (Mobile-Friendly)
// ============================================================================

export function ProductComparisonCompact({
  initialProducts = [],
  className,
}: Omit<ProductComparisonProps, "maxProducts">) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.slice(0, 2)
  )
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    if (selectedProductIndex >= products.length - 1) {
      setSelectedProductIndex(Math.max(0, products.length - 2))
    }
  }

  if (products.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-muted-foreground">No products to compare</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Product Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {products.map((product, index) => (
          <button
            key={product.id}
            onClick={() => setSelectedProductIndex(index)}
            className={cn(
              "relative flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all",
              selectedProductIndex === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveProduct(product.id)
              }}
              className="absolute top-1 right-1 p-1 rounded-full bg-white/90 hover:bg-white"
            >
              <X className="w-3 h-3" />
            </button>
          </button>
        ))}
      </div>

      {/* Selected Product Details */}
      <AnimatePresence mode="wait">
        {products.map(
          (product, index) =>
            index === selectedProductIndex && (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Product Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                  <Badge variant="outline" className="mb-4">
                    {product.category}
                  </Badge>

                  {/* Price */}
                  <div className="mb-4">
                    {product.salePrice ? (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(product.salePrice)}
                        </div>
                        <div className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specs */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Specifications
                    </h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(product.specifications)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-muted-foreground">{key}</dt>
                            <dd className="font-semibold">{value}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={!product.inStock}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Export all comparison components
// ============================================================================

export default ProductComparison
