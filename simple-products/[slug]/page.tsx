import Image from "next/image"
import Link from "next/link"
import simpleProducts from "@/data/simple-products.json"
import { SimpleAddToCartButton } from "@/components/simple-add-to-cart-button"

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return (simpleProducts as any[]).map((p) => ({ slug: p.slug }))
}

export default function SimpleProductDetail({ params }: Props) {
  const product = (simpleProducts as any[]).find((p) => p.slug === params.slug)
  if (!product) return <div className="py-20 text-center">Product not found.</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
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
