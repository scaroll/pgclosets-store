'use client'

import { Card, CardContent } from "@/components/ui/card"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QuickBuyButton, AddToCartButton } from "@/components/ui/paddle-button"
import { PriceComparison } from "@/components/checkout/paddle-price-display"
import { reninProducts, type Product } from "@/lib/renin-products"
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
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-6xl font-display font-black mb-6">
          <span className="bg-gradient-to-r from-tech-blue-600 via-ai-purple-600 to-electric-green-600 bg-clip-text text-transparent">
            AI-Curated
          </span>{" "}
          <span className="text-foreground">Collection</span>
        </h2>
        <p className="text-xl font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover our intelligently selected closet systems and barn doors, optimized through AI analysis 
          for exceptional quality, design harmony, and customer satisfaction.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <GlassCard 
            key={product.id} 
            variant={index % 3 === 0 ? "glow" : index % 3 === 1 ? "floating" : "default"}
            className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white/5 to-white/10"
          >
            <div className="aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/50 to-muted/20 relative">
              <Link href={`/store/products/${product.slug}`}>
                <img
                  src={product.images[0] || `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name}`
                  }}
                />
              </Link>
              {/* AI Quality Indicator */}
              <div className="absolute top-3 right-3 bg-electric-green-500/90 text-white text-xs px-2 py-1 rounded-full font-body font-medium backdrop-blur-sm">
                AI ✨
              </div>
            </div>
            <GlassCardContent className="p-6 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
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
                  </p>
                </div>

                <div className="space-y-3">
                  <PriceComparison
                    originalPrice={product.price}
                    salePrice={'sale_price' in product ? product.sale_price as number : undefined}
                  />
                  
                  <div className="flex gap-3">
                    <AddToCartButton
                      productId={product.id.toString()}
                      productName={product.name}
                      price={('sale_price' in product && product.sale_price as number) || product.price}
                      onAddToCart={handleAddToCart}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-tech-blue-500/30 text-tech-blue-600 hover:bg-tech-blue-500/10 hover:border-tech-blue-500/50 transition-all font-body"
                    />
                    <QuickBuyButton
                      productId={product.id.toString()}
                      price={('sale_price' in product && product.sale_price as number) || product.price}
                      productName={product.name}
                      onSuccess={handleQuickBuySuccess}
                      onError={handleQuickBuyError}
                      size="sm"
                      className="flex-1 bg-tech-gradient hover:scale-105 text-white font-body font-semibold shadow-lg hover:shadow-tech-blue-500/30 transition-all duration-300"
                    >
                      AI Buy
                    </QuickBuyButton>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/store/products">
          <Button 
            size="lg" 
            variant="outline" 
            className="group px-12 py-4 text-lg font-display font-semibold border-2 border-ai-purple-500/30 text-ai-purple-600 hover:bg-ai-purple-500/10 hover:border-ai-purple-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-gradient-to-r from-transparent via-ai-purple-500/5 to-transparent"
          >
            <span className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-ai-purple-600 to-tech-blue-600 bg-clip-text text-transparent">
                Explore Full AI Collection
              </span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Button>
        </Link>
      </div>
    </section>
  )
}