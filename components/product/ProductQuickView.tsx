"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingCart, Star, Truck, Shield, ArrowRight, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  style: string
  material: string
  dimensions: {
    width: string
    height: string
    depth: string
  }
  features: string[]
  inStock: boolean
  rating: number
  reviewCount: number
  sku: string
}

interface ProductQuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (productId: string, quantity: number) => void
  onAddToWishlist: (productId: string) => void
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  if (!product) return null

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart(product.id, quantity)
      // Show success animation or notification
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true)
    try {
      await onAddToWishlist(product.id)
      // Show success animation or notification
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Product Images */}
              <div className="relative bg-gray-50 p-6">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner">
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-300 ${isImageZoomed ? 'scale-150' : 'scale-100'}`}
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-product.jpg'
                    }}
                  />

                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Zoom Toggle */}
                  <button
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                    className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        -{discountPercentage}%
                      </Badge>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>

                {/* Image Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          index === selectedImageIndex ? 'border-amber-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.jpg'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{product.category}</Badge>
                      <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.comparePrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Product Features */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Style:</span>
                        <span className="ml-2 font-medium">{product.style}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Material:</span>
                        <span className="ml-2 font-medium">{product.material}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Width:</span>
                        <span className="ml-2 font-medium">{product.dimensions.width}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Height:</span>
                        <span className="ml-2 font-medium">{product.dimensions.height}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>2 Year Warranty</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-50 rounded-l-lg"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-gray-50 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock || isAddingToCart}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {isAddingToCart ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleAddToWishlist}
                        disabled={isAddingToWishlist}
                        className="p-3"
                      >
                        {isAddingToWishlist ? (
                          <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* View Full Details */}
                    <Button variant="ghost" className="w-full justify-between group">
                      View Full Details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProductQuickView