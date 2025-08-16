'use client'

import { Button } from "@/components/ui/button"
import { reninProducts } from "@/lib/renin-products"
import Link from "next/link"

export function HeroSection() {
  // Get the featured sale product for hero pricing
  const featuredProducts = reninProducts.getFeaturedProducts()
  const heroProduct = featuredProducts[0] || reninProducts.getBarnDoors()[0]
  const heroPrice = heroProduct?.sale_price || heroProduct?.price || 679
  return (
    <section className="relative bg-gradient-to-br from-card to-background">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black text-foreground leading-tight">
                Transform Your Space with <span className="text-primary">Premium</span> Closet Systems
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover handcrafted barn doors and custom closet solutions that combine exceptional quality with
                timeless design. Perfect for discerning homeowners who value craftsmanship.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/store/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/store/inspiration">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                  View Inspiration
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Quality Guarantee</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card">
              <img
                src={heroProduct?.images.main || "/modern-walk-in-closet-barn-doors.png"}
                alt={heroProduct?.name || "Premium closet system with barn doors"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/modern-walk-in-closet-barn-doors.png"
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-lg">
              <div className="text-sm font-medium">Starting at</div>
              <div className="text-2xl font-bold">{reninProducts.formatPrice(heroPrice)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
