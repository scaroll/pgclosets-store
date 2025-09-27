import { notFound } from "next/navigation"
import { getProductBySlug, getProductsByCategory } from "@/lib/enhanced-renin-products"
import { ProductDetailClient } from "@/components/store/product-detail-client"
import { RelatedProducts } from "@/components/store/related-products"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found | PG Closets",
    }
  }

  return {
    title: `${product.name} | Premium Closet Doors | PG Closets Ottawa`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: (product.arcatImages.length > 0 ? product.arcatImages : [product.homeDepotImage]).filter(Boolean),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <main>
      <ProductDetailClient product={product} />

      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </main>
  )
}
