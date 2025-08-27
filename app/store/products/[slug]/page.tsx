import { ProductDetails } from "@/components/store/product-details"
import { RelatedProducts } from "@/components/store/related-products"
import { reninProducts } from "@/lib/renin-products"
import { notFound } from "next/navigation"
// import { generateProductSchema, generateBreadcrumbSchema, generateBaseMetadata } from "@/lib/seo"
import type { Metadata } from "next"

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

// Generate static params for all products
export async function generateStaticParams() {
  const barnDoors = reninProducts.getBarnDoors()
  const hardware = reninProducts.getHardware()
  
  return [
    ...barnDoors.map(product => ({ slug: product.slug })),
    ...hardware.map(product => ({ slug: product.slug }))
  ]
}

// Generate metadata for each product
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = reninProducts.getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found | PG Closets',
      description: 'The requested product could not be found.'
    }
  }

  const isHardware = !('style' in product)
  const pricing = reninProducts.calculatePriceWithTax((product as any).sale_price || product.price)
  const productType = isHardware ? 'Hardware' : 'Barn Door'
  
  const title = `${product.name} - ${productType} | PG Closets Ottawa`
  const description = `${product.name} - Premium ${productType.toLowerCase()} with professional features and quality construction. $${pricing.total.toFixed(2)} CAD including HST. Professional installation available in Ottawa.`

  const metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/store/products/${slug}`,
      images: [product.images[0]]
    }
  }


  return metadata
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Get product from Renin database
  const product = reninProducts.getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get related products (recommendations)
  const relatedProducts = reninProducts.getRecommendations(product.id, 4)

  // Calculate pricing
  const pricing = reninProducts.calculatePriceWithTax((product as any).sale_price || product.price)

  // Add product schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images[0],
    "offers": {
      "@type": "Offer",
      "price": pricing.total,
      "priceCurrency": "CAD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": "Store", "item": "/store" },
      { "@type": "ListItem", "position": 3, "name": "Products", "item": "/store/products" },
      { "@type": "ListItem", "position": 4, "name": product.name, "item": `/store/products/${slug}` }
    ]
  }

  return (
    <>
      {/* Structured Data */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </>
  )
}
