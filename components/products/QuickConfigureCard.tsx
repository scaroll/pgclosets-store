export interface Product {
  id: string
  title: string
  slug: string | null
  handle: string | null
  price: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function deriveSlug(product: Product): string | null {
  if (product.slug && product.slug !== 'undefined') {
    return product.slug
  }
  if (product.handle) {
    return product.handle
  }
  if (product.title) {
    return slugify(product.title)
  }
  return null
}

import { ArrowRight, Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export interface Product {
  id: string
  title: string
  slug: string | null
  handle: string | null
  price: number
  description?: string
  image?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function deriveSlug(product: Product): string {
  if (product.slug && product.slug !== 'undefined') {
    return product.slug
  }
  if (product.handle) {
    return product.handle
  }
  if (product.title) {
    return slugify(product.title)
  }
  return `product-${product.id}`
}

export function QuickConfigureCard({ product }: { product: Product }) {
  const slug = deriveSlug(product)
  const formattedPrice = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(product.price)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md">
      {/* Image Placeholder area - would be a real image in prod */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <div className="flex h-full w-full items-center justify-center text-neutral-400">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-sm font-medium">No Image</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            <Link href={`/products/${slug}`} className="hover:underline">
              {product.title}
            </Link>
          </h3>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formattedPrice}</p>
        </div>

        {product.description && (
          <p className="mb-4 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 hover:bg-blue-700"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>

          <button
            type="button"
            className="flex items-center justify-center rounded-full border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 hover:bg-neutral-50 hover:text-red-500 dark:hover:text-red-400"
            aria-label={`Add ${product.title} to wishlist`}
          >
            <Heart className="h-4 w-4" />
          </button>

          <Link
            href={`/products/${slug}`}
            className="flex items-center justify-center rounded-full border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 hover:bg-neutral-50 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label={`View details for ${product.title}`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
