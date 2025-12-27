'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative mb-4 aspect-square rounded bg-gray-100">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          )}
        </div>
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </Link>
    </div>
  )
}

export function ProductCardCompact({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return <ProductCard product={product} className={className} />
}

export function ProductCardFeatured({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return <ProductCard product={product} className={className} />
}

export function ProductCardHorizontal({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return <ProductCard product={product} className={className} />
}
