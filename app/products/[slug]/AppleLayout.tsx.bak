"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Check, ShoppingBag, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductImage {
  url: string
  alt: string
}

interface ColorOption {
  name: string
  value: string
  image?: string
}

interface SizeOption {
  name: string
  value: string
  available: boolean
}

interface Specification {
  label: string
  value: string
}

interface AppleLayoutProps {
  product: {
    name: string
    price: string
    tagline?: string
    images: ProductImage[]
    colors?: ColorOption[]
    sizes?: SizeOption[]
    specifications: Specification[]
    description?: string
    features?: string[]
  }
}

export function AppleLayout({ product }: AppleLayoutProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.value)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.value)
  const [quantity, setQuantity] = useState(1)
  const [isSticky, setIsSticky] = useState(false)

  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Sticky image handling
  useEffect(() => {
    const handleScroll = () => {
      if (!imageContainerRef.current) return
      const rect = imageContainerRef.current.getBoundingClientRect()
      setIsSticky(rect.top <= 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddToBag = () => {
    console.log("Add to bag:", {
      product: product.name,
      color: selectedColor,
      size: selectedSize,
      quantity,
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Product Hero */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Images (Sticky) */}
          <div ref={imageContainerRef} className="lg:sticky lg:top-24 lg:h-fit">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900"
            >
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  quality={90}
                />
              )}

              {/* Image Zoom on Hover */}
              <div className="absolute inset-0 transition-transform duration-500 hover:scale-110" />
            </motion.div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square w-16 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#0071e3]"
                        : "border-transparent hover:border-neutral-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              {product.tagline && (
                <p className="text-sm font-semibold text-[#0071e3]">
                  {product.tagline}
                </p>
              )}

              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                {product.name}
              </h1>

              <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
                {product.price}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                {product.description}
              </p>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Color:{" "}
                  <span className="font-normal">
                    {product.colors.find((c) => c.value === selectedColor)?.name}
                  </span>
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-12 w-12 rounded-full border-2 transition-all ${
                        selectedColor === color.value
                          ? "border-[#0071e3]"
                          : "border-neutral-300 hover:border-neutral-400"
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Size
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => size.available && setSelectedSize(size.value)}
                      disabled={!size.available}
                      className={`rounded-lg border-2 py-3 text-sm font-semibold transition-all ${
                        selectedSize === size.value
                          ? "border-[#0071e3] bg-[#0071e3] text-white"
                          : size.available
                            ? "border-neutral-300 text-neutral-900 hover:border-neutral-400 dark:text-white"
                            : "cursor-not-allowed border-neutral-200 text-neutral-400 line-through"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Quantity
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-lg border-2 border-neutral-300 p-2 transition-colors hover:border-neutral-400"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5 w-5" />
                </button>

                <span className="min-w-[3ch] text-center text-lg font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-lg border-2 border-neutral-300 p-2 transition-colors hover:border-neutral-400"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Add to Bag Button */}
            <Button
              onClick={handleAddToBag}
              className="w-full bg-[#0071e3] py-6 text-lg font-semibold hover:bg-[#0077ed]"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Bag
            </Button>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3 border-t border-neutral-200 pt-8 dark:border-neutral-800">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-[#0071e3]" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Technical Specifications */}
        {product.specifications.length > 0 && (
          <div className="mt-20 space-y-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Technical Specifications
            </h2>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="grid gap-4 py-6 md:grid-cols-3"
                >
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {spec.label}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 md:col-span-2">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Bag Bar (Mobile) */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 p-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {product.name}
                </p>
                <p className="text-lg font-semibold">{product.price}</p>
              </div>

              <Button
                onClick={handleAddToBag}
                className="bg-[#0071e3] hover:bg-[#0077ed]"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Bag
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
