import Image from "next/image"
import Link from "next/link"
import simpleProducts from "@/data/simple-products.json"
import { SimpleAddToCartButton } from "@/components/simple-add-to-cart-button"
import { PremiumProductDetail } from "@/components/product/PremiumProductDetail"

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return (simpleProducts as any[]).map((p) => ({ slug: p.slug }))
}

// Helper function to get related products based on category
function getRelatedProducts(currentProduct: any, allProducts: any[], limit = 4) {
  return allProducts
    .filter(p =>
      p.id !== currentProduct.id &&
      p.category === currentProduct.category
    )
    .slice(0, limit)
}

export default async function SimpleProductDetail({ params }: Props) {
  const { slug } = params
  const product = (simpleProducts as any[]).find((p) => p.slug === slug)
  if (!product) return <div className="py-20 text-center">Product not found.</div>

  // Get related products for recommendations
  const relatedProducts = getRelatedProducts(product, simpleProducts as any[], 4)

  // Use premium PDP for all products
  if (product.configurator_data) {
    return <PremiumProductDetail product={product} relatedProducts={relatedProducts} />
  }

  // Legacy PDP for products without configurator (fallback)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</div>
          <h1 className="text-3xl font-bold mt-1">{product.title}</h1>
          <div className="text-xl font-semibold mt-2">${(product.price / 100).toFixed(2)}</div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <div className="mt-6">
            <SimpleAddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                slug: product.slug,
              }}
            />
          </div>
          <div className="mt-6">
            <Link href="/simple-products" className="text-sm text-primary underline-offset-4 hover:underline">
              Back to products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
