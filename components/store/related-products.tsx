'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuickBuyButton, AddToCartButton } from "@/components/ui/paddle-button"
import { reninProducts, type Product } from "@/lib/renin-products"
import Link from "next/link"
import { toast } from "sonner"

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
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

  if (!products.length) {
    return null
  }

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
          Related Products
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover similar products that complement your selection
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square overflow-hidden rounded-t-lg bg-card">
              <Link href={`/store/products/${product.slug}`}>
                <img
                  src={product.images[0] || `/abstract-geometric-shapes.png?height=300&width=300&query=${product.name}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = `/abstract-geometric-shapes.png?height=300&width=300&query=${product.name}`
                  }}
                />
              </Link>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2 text-xs">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Badge>
                <Link href={`/store/products/${product.slug}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.features.slice(0, 2).join(' • ')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-foreground">
                    {formatPrice(product.price)}
                  </div>
                </div>

                <div className="space-y-2">
                  <AddToCartButton
                    productId={product.id.toString()}
                    productName={product.name}
                    price={product.price}
                    onAddToCart={handleAddToCart}
                    size="sm"
                    className="w-full"
                  />
                  <QuickBuyButton
                    productId={product.id.toString()}
                    price={product.price}
                    productName={product.name}
                    onSuccess={handleQuickBuySuccess}
                    onError={handleQuickBuyError}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Quick Buy
                  </QuickBuyButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}