import { FeaturedProducts } from "../../components/store/featured-products"
import { HeroSection } from "../../components/store/hero-section"
import { Button } from "../../components/ui/button"
import { productCategories, getFeaturedProducts } from "../../lib/enhanced-renin-products"
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
      <CTASection />
    </main>
  )
}

function CategoriesSection() {
  return (
    <section className="section">
      <div className="container-default">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-overline text-accent mb-3">Browse Collection</p>
          <h2 className="text-h2 mb-4">Shop by Category</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of premium Renin closet doors and hardware
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((category, index) => (
            <a
              key={category.id}
              href={`/store/products?category=${category.id}`}
              className="card card-product group"
            >
              {/* Image */}
              <div className="card-product-image">
                <Image
                  src={category.heroImage || "/placeholder.svg"}
                  alt={`${category.name} - Premium closet doors by Renin`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  priority={index < 3}
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="card-product-body text-center">
                <h3 className="text-h4 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-body-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <span className="btn btn-secondary btn-sm">
                  Shop {category.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="section bg-muted/50">
      <div className="container-default">
        <div className="card card-elevated p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>

          {/* Content */}
          <h2 className="text-h2 mb-4">Need Help Choosing?</h2>
          <p className="text-body-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Our Ottawa experts are here to help you find the perfect closet door
            solution for your home. Get personalized recommendations and a free quote.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" href="/contact">
              Free Consultation
            </Button>
            <Button variant="outline" size="lg" href="tel:613-422-5800">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              (613) 422-5800
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
