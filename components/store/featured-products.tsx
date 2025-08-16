'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QuickBuyButton, AddToCartButton } from "@/components/ui/paddle-button"
import { PriceComparison } from "@/components/checkout/paddle-price-display"
import { reninProducts, type ReninProduct, type ReninHardware } from "@/lib/renin-products"

type Product = ReninProduct | ReninHardware
import Link from "next/link"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface FeaturedProductsProps {
  products?: Product[]
}

export function FeaturedProducts({ products: propProducts }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Use provided products or fetch featured products from Renin database
    if (propProducts) {
      setProducts(propProducts)
    } else {
      const featuredProducts = reninProducts.getFeaturedProducts()
      setProducts(featuredProducts)
    }
  }, [propProducts])

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing"
    return reninProducts.formatPrice(price)
  }

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
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our most popular closet systems and barn doors, handpicked for their exceptional quality and design.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square overflow-hidden rounded-t-lg bg-card">
              <Link href={`/store/products/${product.slug}`}>
                <img
                  src={product.images.main || `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name}`
                  }}
                />
              </Link>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {'style' in product ? `${product.style} • ${product.material}` : `Hardware • ${product.material}`}
                  </Badge>
                  {'sale_price' in product && product.sale_price && (
                    <Badge variant="destructive" className="mb-2 ml-2">
                      Sale
                    </Badge>
                  )}
                  <Link href={`/store/products/${product.slug}`}>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground line-clamp-2">
                    {product.features.slice(0, 2).join(' • ')}
                    {'size' in product ? ` • ${product.size} • ${product.finish}` : ''}
                  </p>
                </div>

                <div className="space-y-3">
                  <PriceComparison
                    originalPrice={product.price}
                    salePrice={'sale_price' in product ? product.sale_price : undefined}
                  />
                  
                  <div className="flex gap-2">
                    <AddToCartButton
                      productId={product.id}
                      productName={product.name}
                      price={('sale_price' in product && product.sale_price) || product.price}
                      onAddToCart={handleAddToCart}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    />
                    <QuickBuyButton
                      productId={product.id}
                      price={('sale_price' in product && product.sale_price) || product.price}
                      productName={product.name}
                      onSuccess={handleQuickBuySuccess}
                      onError={handleQuickBuyError}
                      size="sm"
                      className="flex-1"
                    >
                      Buy Now
                    </QuickBuyButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/store/products">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  )
}