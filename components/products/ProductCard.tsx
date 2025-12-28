import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0]?.url || '/placeholder.jpg'
  const displayPrice = product.salePrice || product.price

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        className="group relative block h-64 w-full bg-gray-100"
      >
        <Image
          src={mainImage}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.salePrice && (
          <Badge className="absolute right-2 top-2 bg-red-500 hover:bg-red-600">Sale</Badge>
        )}
        {product.featured && !product.salePrice && (
          <Badge className="absolute right-2 top-2 bg-black text-white hover:bg-gray-800">
            Featured
          </Badge>
        )}
      </Link>

      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm capitalize text-gray-500">
              {product.category.replace('-', ' ')}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="line-clamp-1 text-lg font-semibold hover:underline">{product.name}</h3>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4 pt-0">
        <p className="line-clamp-2 text-sm text-gray-600">{product.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">${(displayPrice / 100).toFixed(2)}</span>
            {product.salePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${(product.price / 100).toFixed(2)}
              </span>
            )}
          </div>
          {product.inventory < 5 && product.inventory > 0 && (
            <span className="text-xs font-medium text-orange-500">
              Only {product.inventory} left!
            </span>
          )}
        </div>

        <AddToCartButton productId={product.id} price={displayPrice} />
      </CardFooter>
    </Card>
  )
}
