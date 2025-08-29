"use client"

import { useState } from "react"
import type { Product } from "@/lib/renin-products"
import { formatPrice } from "@/lib/renin-products"
import { RequestQuoteButton } from "@/components/ui/request-quote-button"
import { Check } from "@/components/ui/icons"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFinish, setSelectedFinish] = useState("")

  return (
    <div className="section-apple">
      <div className="container-apple">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-pg-sky" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
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
            {product.specifications["Standard Sizes"] && (
              <div>
                <label className="block text-sm font-medium text-pg-dark mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
                >
                  <option value="">Select Size</option>
                  {product.specifications["Standard Sizes"].split(", ").map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.specifications["Finish"] && (
              <div>
                <label className="block text-sm font-medium text-pg-dark mb-2">Finish</label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
                >
                  <option value="">Select Finish</option>
                  <option value="Natural">Natural</option>
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Espresso">Espresso</option>
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
                  selectedOptions={{ size: selectedSize, finish: selectedFinish }}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-green-700">
                <Check className="w-4 h-4" />
                <span>Professional installation available</span>
              </div>
            </div>

            {/* Features */}
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

            {/* Specifications */}
            <div>
              <h3 className="text-h3 mb-4">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm border-b border-pg-border pb-2">
                    <span className="font-medium">{key}:</span>
                    <span className="text-pg-gray">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
