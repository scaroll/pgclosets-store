import { ProductDetails } from "@/components/store/product-details"
import { RelatedProducts } from "@/components/store/related-products"
import { reninProducts } from "@/lib/renin-products"
import { notFound } from "next/navigation"

export default function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  // Get product from Renin database
  const product = reninProducts.getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Get related products (recommendations)
  const relatedProducts = reninProducts.getRecommendations(product.id, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
