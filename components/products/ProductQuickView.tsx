'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Product } from '@/data/renin-products'
import { cn } from '@/lib/utils'
import {
  ShoppingCart,
  Heart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Sparkles,
  Star,
  X
} from 'lucide-react'

export interface ProductQuickViewProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({
  product,
  open,
  onOpenChange
}: ProductQuickViewProps) {
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedGlass, setSelectedGlass] = useState(product.glass?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = () => {
    // Add to cart logic here
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, 99))
  }

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 md:aspect-auto">
            <div className="relative h-full w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Category badge */}
            <Badge
              variant="secondary"
              className="absolute left-4 top-4 bg-white/90 backdrop-blur-sm"
            >
              {product.category}
            </Badge>

            {/* Favorite button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute right-4 top-4 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </button>
          </div>

          {/* Product Details Section */}
          <ScrollArea className="h-[600px] md:h-auto">
            <div className="space-y-6 p-6">
              {/* Header */}
              <div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(24 reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </p>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  In Stock
                </Badge>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Size Selection */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Size
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Selection */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Finish
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.finishes.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={cn(
                        'rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-all',
                        selectedFinish === finish
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-4 w-4 shrink-0 rounded-full border-2',
                            selectedFinish === finish
                              ? 'border-primary bg-primary'
                              : 'border-gray-300 bg-white'
                          )}
                        >
                          {selectedFinish === finish && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="truncate">{finish}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Glass Selection (if applicable) */}
              {product.glass && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Glass Type
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.glass.map((glass) => (
                      <button
                        key={glass}
                        onClick={() => setSelectedGlass(glass)}
                        className={cn(
                          'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                          selectedGlass === glass
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        )}
                      >
                        {glass}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Quantity
                  </label>
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={handleDecrement}
                      className="px-3 py-2 hover:bg-muted"
                      disabled={quantity === 1}
                    >
                      -
                    </button>
                    <span className="min-w-[3ch] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-3 py-2 hover:bg-muted"
                      disabled={quantity === 99}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 gap-2"
                    size="lg"
                    disabled={addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $500. Professional installation available.
                  Contact us for a free online quote.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
