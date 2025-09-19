import { FeaturedProducts } from "../../components/store/featured-products"
import { HeroSection } from "../../components/store/hero-section"
import { Button } from "../../components/ui/button"
import { categories, getFeaturedProducts } from "../../lib/renin-products"
import Image from "next/image"

export const metadata = {
  title: "Premium Closet Door Store | Renin Products | PG Closets Ottawa",
  description:
    "Shop premium Renin closet doors online. Barn doors, bypass doors, bifold doors with professional installation. Free shipping in Ottawa area.",
}

export default function StorePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <main>
      <HeroSection />

      <CategoriesSection />
      <FeaturedProducts products={featuredProducts} />

      <section className="section-apple bg-gradient-to-br from-pg-offwhite to-white">
        <div className="container-apple">
          <div className="card-apple p-16 text-center">
            <h2 className="text-h2 mb-4">Need Help Choosing?</h2>
            <p className="text-body-l text-pg-gray mb-8 max-w-2xl mx-auto">
              Our Ottawa experts are here to help you find the perfect closet door solution for your home
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" href="/contact">
                Free Consultation
              </Button>
              <Button variant="secondary" size="lg" href="tel:613-422-5800">
                Call (613) 422-5800
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function CategoriesSection() {
  return (
    <section className="section-apple">
      <div className="container-apple">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">Shop by Category</h2>
          <p className="text-body-l text-pg-gray max-w-2xl mx-auto">
            Discover our complete range of premium Renin closet doors and hardware
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-apple">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`/store/products?category=${category.id}`}
              className="card-apple overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
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
                <h3 className="text-h3 mb-2 group-hover:text-pg-sky transition-colors">{category.name}</h3>
                <p className="text-body-s text-pg-gray mb-4">{category.description}</p>
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
