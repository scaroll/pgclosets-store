// Exact copy of Final-Website homepage with Apple-inspired design - Server Component
import Link from "next/link"
import Image from "next/image"

// Lightweight components matching Final-Website exactly
import { Check, ArrowRight } from "@/components/ui/icons"

interface Product {
  name: string
  price: number
  originalPrice?: number
  image: string
  specs: string
  benefits: string[]
  features: string[]
  popular?: boolean
  newProduct?: boolean
  collection?: string
  material?: string
}

// Minimal product data for fastest loading - exact copy from Final-Website
const featuredProducts: Product[] = [
  {
    name: "Gatsby Chevron Barn Door",
    price: 679,
    originalPrice: 849,
    image: "/images/doors/barn/gatsby-chevron.jpg",
    specs: "72\" × 84\" Ready to Install",
    benefits: ["Modern chevron pattern", "Easy installation", "Durable construction"],
    features: ["Engineered wood", "Soft-close hardware", "5-year warranty"],
    popular: true,
    collection: "Modern"
  },
  {
    name: "Euro Premium Sliding Door",
    price: 1049,
    image: "/images/doors/bypass/euro-steel.jpg",
    specs: "48\" × 80\" Bypass System",
    benefits: ["Sleek European design", "Space saving", "Quiet operation"],
    features: ["Steel frame", "Tempered glass", "Premium hardware"],
    newProduct: true,
    collection: "Contemporary"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Ultra Lightweight - exact copy from Final-Website */}
      <section className="relative bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extralight tracking-tight text-slate-900">
                  Beautiful Closet Doors
                  <span className="block text-slate-600">Made Just For You</span>
                </h1>
                <p className="text-xl font-light text-slate-600 max-w-lg">
                  We&apos;re Ottawa&apos;s trusted team for custom closet doors that make your home look amazing
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  Get Your Free Quote
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-900 font-medium hover:border-slate-900 transition-colors"
                >
                  See Our Doors
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-sm text-slate-600">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={16} />
                  Free Installation
                </div>
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={16} />
                  5-Year Warranty
                </div>
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={16} />
                  Ottawa Local
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <Image
                src="/images/doors/barn/gatsby-chevron.jpg"
                alt="Beautiful custom closet doors in Ottawa home"
                width={600}
                height={400}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Minimal - exact copy from Final-Website */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
              Doors Our Customers Love
            </h2>
            <p className="text-xl font-light text-slate-600">
              Chosen by families just like yours who wanted something special
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredProducts.map((product, index) => (
              <div key={index} className="group border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  {product.popular && (
                    <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  {product.newProduct && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 text-xs font-medium">
                      New
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-medium text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-slate-600 mb-4">{product.specs}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-slate-900">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-slate-500 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="block w-full text-center py-3 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA Section - exact copy from Final-Website */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extralight tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl font-light text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s make your home more beautiful together! Give us a call or drop us a line - we&apos;d love to chat about your project.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
          >
            Get Free Quote Today
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
