'use client'

import { Badge } from "@/components/ui/badge"
import { ProductActions } from "@/components/ui/paddle-button"
import { PriceComparison } from "@/components/checkout/paddle-price-display"
import { reninProducts, type ReninProduct, type ReninHardware } from "@/lib/renin-products"
import { Star, Truck, Shield, Award } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Product = ReninProduct | ReninHardware

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing"
    return reninProducts.formatPrice(price)
  }

  // Check if product has sale price
  const salePrice = 'sale_price' in product ? product.sale_price : undefined
  const regularPrice = product.price
  const displayPrice = salePrice || regularPrice

  const handleAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
    toast.success(`Added ${item.name} to cart!`, {
      description: `Quantity: ${item.quantity} • Price: ${formatPrice(item.price)}`
    })
  }

  const handleQuickBuySuccess = (data: any) => {
    toast.success("Redirecting to checkout...", {
      description: "Your payment is being processed"
    })
  }

  const handleQuickBuyError = (error: string) => {
    toast.error("Payment failed", {
      description: error
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-card border">
          <img
            src={product.image || `/abstract-geometric-shapes.png?height=600&width=600&query=${product.name}`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `/abstract-geometric-shapes.png?height=600&width=600&query=${product.name}`
            }}
          />
        </div>
        
        {/* Thumbnail images */}
        <div className="grid grid-cols-4 gap-2">
          {[
            product.image,
            product.image, // Use same image for now since we have one high-quality image
            product.image,
            product.image
          ].filter(Boolean).slice(0, 4).map((imageSrc, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-md bg-card border cursor-pointer hover:border-primary transition-colors">
              <img
                src={imageSrc || `/abstract-geometric-shapes.png?height=150&width=150&query=${product.name}-${index}`}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `/abstract-geometric-shapes.png?height=150&width=150&query=${product.name}-${index}`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="secondary">
              {'category' in product ? product.category : product.material}
            </Badge>
            {salePrice && (
              <Badge variant="destructive">Sale</Badge>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            {product.name}
          </h1>
          
          <p className="text-xl text-muted-foreground">
            {'category' in product 
              ? `${product.material || 'Wood'} • ${product.finish || product.finishes?.[0] || 'Natural'}` 
              : `${product.finish} • ${product.material}`
            }
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.8) • 127 reviews</span>
          </div>
        </div>

        {/* Price */}
        <PriceComparison
          originalPrice={regularPrice}
          salePrice={salePrice}
        />

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
              className="h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-10 w-16 rounded-md border border-input bg-background px-3 text-center"
            />
            <button
              onClick={() => setSelectedQuantity(selectedQuantity + 1)}
              className="h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {displayPrice && (
          <ProductActions
            productId={product.id.toString()}
            productName={product.name}
            price={displayPrice}
            onAddToCart={handleAddToCart}
            onQuickBuySuccess={handleQuickBuySuccess}
            onQuickBuyError={handleQuickBuyError}
            className="flex-col sm:flex-row"
          />
        )}

        {/* Product Features */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Product Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free shipping to Ottawa area</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">2-year warranty included</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm">Professional installation available</span>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Description</h3>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{product.features.slice(0, 3).join('. ')}.</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU:</span>
              <span className="font-medium">{'sku' in product ? product.sku : product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material:</span>
              <span className="font-medium">{product.material || 'Wood'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finish:</span>
              <span className="font-medium">{product.finish || ('finishes' in product ? product.finishes?.[0] : 'Natural') || 'Natural'}</span>
            </div>
            {'style' in product && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Style:</span>
                  <span className="font-medium">{'category' in product ? product.category : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{'sizes' in product ? product.sizes?.join(', ') : 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="font-medium">Standard Size</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hardware:</span>
                  <span className="font-medium">Sold separately</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Installation:</span>
                  <span className="font-medium">Professional Available</span>
                </div>
              </>
            )}
            {product.length && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Length:</span>
                <span className="font-medium">{product.length} inches</span>
              </div>
            )}
            {product.weight_capacity && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight Capacity:</span>
                <span className="font-medium">{product.weight_capacity} lbs</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Installation:</span>
              <span className="font-medium">Professional service available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}