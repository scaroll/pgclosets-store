"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@/lib/medusa"
import { useMedusaCart } from "./cart-provider"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface ProductDetailProps {
  product: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
}

export function MedusaProductDetail({ product, region }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem, isLoading } = useMedusaCart()

  const images = product.images || []
  const variants = product.variants || []

  const handleAddToCart = async () => {
    if (selectedVariant) {
      await addItem(selectedVariant.id, quantity)
    }
  }

  const selectedPrice = selectedVariant?.calculated_price
  const formattedPrice = selectedPrice && region 
    ? formatPrice(selectedPrice.calculated_amount, region.currency_code)
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse">
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-indigo-500 ${
                      index === selectedImage ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <span className="sr-only">Image {index + 1}</span>
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover object-center"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Image */}
          <div className="w-full aspect-square">
            <Image
              src={images[selectedImage]?.url || "/placeholder.svg"}
              alt={product.title || "Product"}
              fill
              className="object-cover object-center rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            {formattedPrice && (
              <p className="text-3xl tracking-tight text-gray-900">
                {formattedPrice}
              </p>
            )}
          </div>

          {/* Status Badge */}
          {product.status && (
            <div className="mt-4">
              <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>
          )}

          <form className="mt-6">
            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant
                </label>
                <Select 
                  value={selectedVariant?.id || ""} 
                  onValueChange={(value) => {
                    const variant = variants.find(v => v.id === value)
                    setSelectedVariant(variant || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.title}
                        {variant.calculated_price && region && (
                          <span className="ml-2 text-gray-500">
                            {formatPrice(variant.calculated_price.calculated_amount, region.currency_code)}
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <Select 
                value={quantity.toString()} 
                onValueChange={(value) => setQuantity(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add to Cart */}
            <div className="mt-10 flex">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || isLoading}
                className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </form>

          {/* Product Details */}
          {(product.weight || product.length || product.width || product.height) && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul>
                  {product.weight && <li>Weight: {product.weight}g</li>}
                  {product.length && <li>Length: {product.length}cm</li>}
                  {product.width && <li>Width: {product.width}cm</li>}
                  {product.height && <li>Height: {product.height}cm</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}