import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductByHandle, getProducts } from "@/lib/actions/commerce"
import StandardLayout from "@/components/layout/StandardLayout"
import { AppleCard, CardContent, CardHeader, CardTitle } from "@/components/ui/AppleCard"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { BUSINESS_INFO } from "@/lib/business-config"
import { ChevronRight, Star, Shield, Truck, Clock, Check, ArrowLeft, Heart, Share2, Zap } from "lucide-react"

// Format price helper
function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(price / 100); // Convert cents to dollars
}

// Enable ISR: Revalidate every hour
export const revalidate = 3600

export async function generateStaticParams() {
  const products = await getProducts({})
  return products.map((p) => ({ slug: p.handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  if (!product) return { title: "Product Not Found | PG Closets" }

  const title = `${product.title} | PG Closets Ottawa`
  const productPrice = product.variants[0]?.price ?? 0
  const description = `Premium ${product.title} closet doors in Ottawa. ${product.description}. Starting from ${formatPrice(productPrice)} CAD with professional installation by PG Closets.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.thumbnail || "/placeholder.svg",
          width: 1200,
          height: 630,
          alt: product.title,
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
      images: [product.thumbnail || "/placeholder.svg"],
    },
    alternates: {
      canonical: `${BUSINESS_INFO.urls.main}/products/${slug}`,
    },
  }
}

// Product Detail Component with Apple Design
function ProductImageGallery({ images, title }: { images: string[]; title: string }) {
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <AppleCard variant="elevated" className="p-0 overflow-hidden">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100">
          {displayImages[0] && (
            <Image
              src={displayImages[0]}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </AppleCard>

      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.slice(1, 5).map((image, idx) => (
            <AppleCard
              key={idx}
              variant="minimal"
              className="p-0 overflow-hidden cursor-pointer group"
              hover
            >
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={image}
                  alt={`${title} view ${idx + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </div>
            </AppleCard>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductInfo({ product }: { product: any }) {
  const price = product.variants[0]?.price || 0
  const originalPrice = product.variants[0]?.compare_at_price
  const savings = originalPrice ? originalPrice - price : 0

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
        <ChevronRight className="w-4 h-4" />
        {product.collection && (
          <>
            <Link
              href={`/products/${product.collection.handle}`}
              className="hover:text-gray-900 transition-colors"
            >
              {product.collection.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="font-medium text-gray-900">{product.title}</span>
      </nav>

      {/* Product Title & Rating */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
          <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
        </div>
      </div>

      {/* Price Section */}
      <AppleCard variant="glass" className="p-6">
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(price)} CAD
            </span>
            {originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md">
                  Save {formatPrice(savings)}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            + Professional installation available
          </p>
        </div>
      </AppleCard>

      {/* Key Features */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Key Features</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Premium Renin quality construction",
            "Custom sizing available",
            "10-year manufacturer warranty",
            "Professional installation included",
            "Free in-home consultation",
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <AppleCard variant="minimal" className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">10-Year Warranty</p>
              <p className="text-xs text-gray-600">Manufacturer backed</p>
            </div>
          </div>
        </AppleCard>
        <AppleCard variant="minimal" className="p-4">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Free Delivery</p>
              <p className="text-xs text-gray-600">Ottawa & area</p>
            </div>
          </div>
        </AppleCard>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6"
        >
          <Zap className="w-4 h-4 mr-2" />
          Get Instant Quote
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Urgency Message */}
      <AppleCard variant="featured" className="p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-600" />
          <p className="text-sm">
            <span className="font-medium text-gray-900">Limited time offer:</span>
            {" "}
            <span className="text-gray-700">Free installation on orders over $2,500</span>
          </p>
        </div>
      </AppleCard>
    </div>
  )
}

// Related Products Component
function RelatedProducts({ products }: { products: any[] }) {
  if (!products.length) return null

  return (
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">You May Also Like</h2>
        <p className="text-gray-600">Explore similar premium door solutions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.handle}`}>
            <AppleCard variant="link" hover className="h-full">
              <div className="space-y-3">
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    From {formatPrice(product.variants[0]?.price || 0)}
                  </p>
                </div>
              </div>
            </AppleCard>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default async function EnhancedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  if (!product) return notFound()

  const relatedProducts = (
    await getProducts({
      ...(product.collection?.handle && { collection: product.collection.handle })
    })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: `PGC-${product.title.replace(/\s+/g, "-").toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "Renin",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Renin Corp",
      url: "https://www.renin.com",
    },
    offers: {
      "@type": "Offer",
      price: product.variants[0]?.price || 0,
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: BUSINESS_INFO.name,
        url: BUSINESS_INFO.urls.main,
        email: BUSINESS_INFO.email,
        telephone: BUSINESS_INFO.phone,
      },
    },
    image: product.images?.length ? product.images : [product.thumbnail],
    category: product.collection?.title || "Closet Doors",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery
            images={Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img: any) => typeof img === 'string' ? img : img.url || product.thumbnail).filter(Boolean)
              : [product.thumbnail || "/placeholder.svg"]}
            title={product.title}
          />
          <ProductInfo product={product} />
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <AppleCard variant="default" className="p-8">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700">
                <p>{product.description}</p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Specifications
                </h3>
                <ul className="space-y-2">
                  <li>Material: Premium engineered wood</li>
                  <li>Style: {product.collection?.title || "Contemporary"}</li>
                  <li>Installation: Professional service available</li>
                  <li>Warranty: 10-year manufacturer warranty</li>
                  <li>Customization: Available in multiple sizes and finishes</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Why Choose {product.title}?
                </h3>
                <ul className="space-y-2">
                  <li>✓ Premium Renin quality and craftsmanship</li>
                  <li>✓ Perfect for Ottawa homes and climate</li>
                  <li>✓ Professional installation by certified experts</li>
                  <li>✓ Competitive pricing with flexible payment options</li>
                  <li>✓ Outstanding customer service and support</li>
                </ul>
              </div>
            </CardContent>
          </AppleCard>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />

        {/* CTA Section */}
        <section className="mt-16 mb-8">
          <AppleCard variant="gradient" className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Transform Your Space Today
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Get a free consultation and instant quote for your {product.title} installation.
              Our experts are ready to help you create your dream space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Download Catalog
              </Button>
            </div>
          </AppleCard>
        </section>
      </div>
    </StandardLayout>
  )
}