"use client"

import { useMemo, useState } from "react"
import type { ArcatProduct } from "@/lib/enhanced-renin-products"
import { formatPrice } from "@/lib/enhanced-renin-products"
import { RequestQuoteButton } from "../ui/request-quote-button"
import { Check } from "../ui/icons"
import { OptimizedImage } from "../ui/optimized-image"

interface ProductDetailClientProps {
  product: ArcatProduct
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const galleryImages = useMemo(() => {
    const images = [
      ...(Array.isArray(product.arcatImages) ? product.arcatImages : []),
      product.homeDepotImage,
    ].filter((src): src is string => typeof src === "string" && src.length > 0)

    return images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]
  }, [product])

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFinish, setSelectedFinish] = useState("")

  const standardSizes = product.specifications?.["Standard Sizes"]
  const sizeOptions = typeof standardSizes === "string" ? standardSizes.split(/,\s*/) : []

  const availableFinishes = product.specifications?.Finish?.split(/,\s*/) ?? []

  const visibleSpecifications = Object.entries(product.specifications ?? {}).filter(([, value]) =>
    Boolean(value),
  )

  return (
    <div className="section-apple">
      <div className="container-apple">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <OptimizedImage
                src={galleryImages[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-pg-sky" : "border-transparent"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      sizes="80px"
                      quality={80}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-h1 mb-4">{product.name}</h1>
              <p className="text-body-l text-pg-gray mb-6">{product.description}</p>
              <div className="text-3xl font-bold text-pg-navy">{formatPrice(product.price)}</div>
            </div>

            {/* Product Options */}
            {sizeOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-pg-dark mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {availableFinishes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-pg-dark mb-2">Finish</label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
                >
                  <option value="">Select Finish</option>
                  {availableFinishes.map((finish) => (
                    <option key={finish} value={finish}>
                      {finish}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="bg-pg-light rounded-lg p-6 border-2 border-pg-sky">
                <h4 className="font-semibold text-pg-dark mb-2 text-lg">Get Your Custom Quote</h4>
                <p className="text-sm text-pg-gray mb-4">
                  Professional installation included. Personalized pricing based on your specific requirements.
                </p>
                <RequestQuoteButton
                  product={product}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  selectedOptions={{
                    ...(selectedSize ? { size: selectedSize } : {}),
                    ...(selectedFinish ? { finish: selectedFinish } : {}),
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-green-700">
                <Check className="w-4 h-4" />
                <span>Professional installation available</span>
              </div>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="text-h3 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {visibleSpecifications.length > 0 && (
              <div>
                <h3 className="text-h3 mb-4">Specifications</h3>
                <div className="space-y-2">
                  {visibleSpecifications.map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm border-b border-pg-border pb-2">
                      <span className="font-medium">{key.replace(/_/g, " ")}:</span>
                      <span className="text-pg-gray">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
