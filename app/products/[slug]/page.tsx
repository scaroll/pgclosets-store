import { Button } from '@/components/ui/button'
import { getProductBySlug } from '@/lib/products'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-xl font-medium text-gray-900">${product.price}</p>
          </div>

          <div className="prose prose-sm mt-4 text-gray-600">
            <p>{product.description}</p>
          </div>

          <div className="mt-8">
            <Button size="lg" className="w-full md:w-auto">
              Add to Cart
            </Button>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-lg font-semibold">Features</h2>
              <ul className="mt-4 list-disc pl-5 text-sm text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
