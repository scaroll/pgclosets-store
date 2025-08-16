import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  base_price: number | null
  is_featured: boolean
  categories?: {
    name: string
  } | null
}

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
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
              <img
                src={`/abstract-geometric-shapes.png?height=400&width=400&query=${product.name}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  {product.categories && (
                    <Badge variant="secondary" className="mb-2">
                      {product.categories.name}
                    </Badge>
                  )}
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-muted-foreground line-clamp-2">{product.short_description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">{formatPrice(product.base_price)}</div>
                  <Link href={`/store/products/${product.slug}`}>
                    <Button className="bg-primary hover:bg-primary/90">View Details</Button>
                  </Link>
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
