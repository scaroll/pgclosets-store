import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProducts } from "@/lib/actions/commerce"
import StandardLayout from "@/components/layout/StandardLayout"
import { AppleCard } from "@/components/ui/AppleCard"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { BUSINESS_INFO } from "@/lib/business-config"
import { ChevronRight, Grid3X3, Grid2X2, List, Star, Truck, Shield } from "lucide-react"
import { Suspense } from "react"

// Format price helper
function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

// Category mappings for better URL structure
const CATEGORY_INFO = {
  "bifold-doors": {
    title: "Bifold Closet Doors",
    description: "Space-saving bifold door solutions perfect for Ottawa homes. Premium Renin quality with professional installation.",
    image: "/images/categories/bifold-hero.jpg",
    features: ["Space-saving design", "Easy operation", "Multiple panel options", "Custom sizing available"],
  },
  "bypass-doors": {
    title: "Bypass Sliding Doors",
    description: "Smooth-gliding bypass door systems for maximum accessibility. Ideal for wider closet openings.",
    image: "/images/categories/bypass-hero.jpg",
    features: ["Smooth operation", "Full closet access", "Modern aesthetics", "Quiet sliding mechanism"],
  },
  "barn-doors": {
    title: "Barn Doors",
    description: "Rustic charm meets modern functionality. Statement-making barn doors for any room.",
    image: "/images/categories/barn-hero.jpg",
    features: ["Decorative hardware", "Statement design", "Space-efficient", "Easy installation"],
  },
  "french-doors": {
    title: "French Doors",
    description: "Elegant French door designs bringing sophistication to your Ottawa home.",
    image: "/images/categories/french-hero.jpg",
    features: ["Classic elegance", "Glass panel options", "Natural light", "Timeless design"],
  },
  "pivot-doors": {
    title: "Pivot Doors",
    description: "Contemporary pivot door systems for a modern, minimalist look.",
    image: "/images/categories/pivot-hero.jpg",
    features: ["Modern design", "Unique operation", "Statement piece", "Premium hardware"],
  },
  "custom-doors": {
    title: "Custom Door Solutions",
    description: "Tailored door solutions designed specifically for your unique space and style.",
    image: "/images/categories/custom-hero.jpg",
    features: ["Fully customizable", "Any size or style", "Personal consultation", "Unique designs"],
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_INFO).map((category) => ({
    category,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const categoryData = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]

  if (!categoryData) {
    return { title: "Category Not Found | PG Closets" }
  }

  const title = `${categoryData.title} | PG Closets Ottawa`
  const description = `${categoryData.description} Browse our selection of premium ${categoryData.title.toLowerCase()} with free consultation and professional installation in Ottawa.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: categoryData.image,
          width: 1200,
          height: 630,
          alt: categoryData.title,
        },
      ],
      type: "website",
      locale: "en_CA",
      siteName: "PG Closets",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [categoryData.image],
    },
    alternates: {
      canonical: `${BUSINESS_INFO.urls.main}/products/${category}`,
    },
  }
}

// Filter Sidebar Component
function FilterSidebar() {
  return (
    <div className="space-y-6">
      <AppleCard variant="default" className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Filter Options</h3>

        {/* Price Range */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Price Range</h4>
          <div className="space-y-2">
            {["Under $500", "$500 - $1000", "$1000 - $2000", "Over $2000"].map((range) => (
              <label key={range} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm text-gray-600">{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Material */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Material</h4>
          <div className="space-y-2">
            {["Engineered Wood", "Solid Wood", "Glass Panels", "Mirror", "Composite"].map((material) => (
              <label key={material} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm text-gray-600">{material}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Style</h4>
          <div className="space-y-2">
            {["Modern", "Traditional", "Contemporary", "Rustic", "Transitional"].map((style) => (
              <label key={style} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm text-gray-600">{style}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Features</h4>
          <div className="space-y-2">
            {["Soft Close", "Mirror Panels", "Glass Inserts", "Custom Size", "Quick Ship"].map((feature) => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm text-gray-600">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full mt-6">
          Clear Filters
        </Button>
      </AppleCard>

      {/* Trust Badges */}
      <AppleCard variant="glass" className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Why Choose PG Closets?</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">10-Year Warranty</p>
              <p className="text-xs text-gray-600">All products backed by Renin</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Free Delivery</p>
              <p className="text-xs text-gray-600">Ottawa & surrounding areas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">5-Star Service</p>
              <p className="text-xs text-gray-600">500+ satisfied customers</p>
            </div>
          </div>
        </div>
      </AppleCard>
    </div>
  )
}

// Product Grid Component
function ProductGrid({ products, category: _category }: { products: any[]; category: string }) {
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {products.length} products
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Best Selling</option>
            </select>
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.handle}`}>
            <AppleCard variant="link" hover className="h-full">
              <div className="space-y-4">
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.metadata?.badge && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      {product.metadata.badge}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">(4.8)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.variants[0]?.price || 0)}
                    </span>
                    {product.variants[0]?.compare_at_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.variants[0].compare_at_price)}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Quick Quote
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </AppleCard>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {products.length >= 9 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}

// Category Hero Component
function CategoryHero({ categoryData }: { categoryData: any }) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-gray-900">{categoryData.title}</span>
            </nav>

            <h1 className="text-5xl font-bold text-gray-900">
              {categoryData.title}
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              {categoryData.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {categoryData.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Free Consultation
              </Button>
              <Button size="lg" variant="outline">
                Download Catalog
              </Button>
            </div>
          </div>

          <div className="relative">
            <AppleCard variant="elevated" className="p-0 overflow-hidden">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src="/images/categories/default-hero.jpg"
                  alt={categoryData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AppleCard>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function EnhancedCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const categoryData = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]

  if (!categoryData) {
    notFound()
  }

  // Get products for this category
  const products = await getProducts({ collection: category })

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryData.title,
    description: categoryData.description,
    url: `${BUSINESS_INFO.urls.main}/products/${category}`,
    mainEntity: {
      "@type": "ProductCollection",
      name: categoryData.title,
      description: categoryData.description,
      url: `${BUSINESS_INFO.urls.main}/products/${category}`,
      numberOfItems: products.length,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BUSINESS_INFO.urls.main,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${BUSINESS_INFO.urls.main}/products`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryData.title,
          item: `${BUSINESS_INFO.urls.main}/products/${category}`,
        },
      ],
    },
  }

  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Category Hero */}
      <CategoryHero categoryData={categoryData} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid products={products} category={category} />
            </Suspense>
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our experts are here to help you find the perfect {categoryData.title.toLowerCase()} for your home.
            Get personalized recommendations and a free quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Chat with Expert
            </Button>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}