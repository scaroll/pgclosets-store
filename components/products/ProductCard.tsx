import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from './AddToCartButton'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number | null
  images: { url: string; alt: string }[]
  category: string
  featured: boolean
  inventory: number
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mainImage = product.images[0]?.url || '/placeholder.jpg'
  const displayPrice = product.salePrice || product.price

  return (
    <Card className={cn("group flex h-full flex-col overflow-hidden border-0 bg-transparent shadow-none transition-all duration-500 hover:shadow-xl hover:shadow-black/5", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F5F5F7]"
      >
        <Image
          src={mainImage}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.salePrice && (
          <Badge className="absolute right-3 top-3 border-transparent bg-red-500/90 text-white shadow-sm backdrop-blur-md hover:bg-red-600/90">
            Sale
          </Badge>
        )}
        {product.featured && !product.salePrice && (
          <Badge className="absolute right-3 top-3 border-transparent bg-white/90 text-black shadow-sm backdrop-blur-md hover:bg-white/100">
            Featured
          </Badge>
        )}
      </Link>

      <CardContent className="flex flex-grow flex-col justify-between px-1 py-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {product.category.replace('-', ' ')}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-gray-900">
              ${(displayPrice / 100).toFixed(2)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${(product.price / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-1 pb-4 pt-0">
         <div className="w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
           <AddToCartButton productId={product.id} price={displayPrice} />
         </div>
      </CardFooter>
    </Card>
  )
}
