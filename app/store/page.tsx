import { FeaturedProducts } from "@/components/store/featured-products"
import { HeroSection } from "@/components/store/hero-section"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts, productCategories } from "@/lib/enhanced-renin-products"
import Image from "next/image"
import StandardLayout from "@/components/layout/StandardLayout"

export const metadata = {
  title: "Premium Closet Door Store | Renin Products | PG Closets Ottawa",
  description:
    "Shop premium Renin closet doors online. Barn doors, bypass doors, bifold doors with professional installation. Free shipping in Ottawa area.",
}

export default function StorePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <StandardLayout>
      <main>
        <HeroSection />

        <CategoriesSection />
        <FeaturedProducts products={featuredProducts} />

        <section className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white shadow-xl p-16 text-center">
              <h2 className="text-3xl font-extralight text-slate-900 mb-4 tracking-tight">Need Help Choosing?</h2>
              <p className="text-lg text-slate-600 font-light mb-8 max-w-2xl mx-auto">
                Our Ottawa experts are here to help you find the perfect closet door solution for your home
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" href="/contact">
                  Free Consultation
                </Button>
                <Button variant="secondary" size="lg" href="mailto:spencer@peoplesgrp.com">
                  Email: spencer@peoplesgrp.com
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </StandardLayout>
  )
}

function CategoriesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extralight text-slate-900 mb-4 tracking-tight">Shop by Category</h2>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
            Discover our complete range of premium Renin closet doors and hardware
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((category, index) => (
            <a
              key={category.id}
              href={`/store/products?category=${category.id}`}
              className="bg-white shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={category.heroImage || "/placeholder.svg"}
                  alt={`${category.name} - Premium closet doors by Renin`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={index < 3}
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-extralight text-slate-900 mb-2 tracking-wide group-hover:text-slate-700 transition-colors">{category.name}</h3>
                <p className="text-slate-600 font-light mb-4">{category.description}</p>
                <Button variant="secondary" size="sm">
                  Shop {category.name}
                </Button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
