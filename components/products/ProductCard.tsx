import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useQuoteBasketStore } from '@/lib/stores/quote-basket-store'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'
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
  const { addItem: addToQuoteBasket } = useQuoteBasketStore()

  const handleAddToQuote = () => {
    addToQuoteBasket({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: displayPrice / 100, // Convert to dollars
      image: mainImage,
      quantity: 1,
    })
  }

  return (
    <Card
      className={cn(
        'apple-ease group flex h-full flex-col overflow-hidden border-0 bg-background shadow-apple-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-apple-xl',
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-3xl bg-apple-gray-50 dark:bg-apple-dark-bg-secondary"
      >
        <Image
          src={mainImage}
          alt={product.images[0]?.alt || product.name}
          fill
          className="ease-[cubic-bezier(0.25,0.1,0.25,1)] object-cover object-center transition-transform duration-700 group-hover:scale-105"
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

      <CardContent className="flex flex-grow flex-col justify-between px-6 py-5">
        <div className="space-y-2">
          <p className="text-apple-13 font-semibold uppercase tracking-wider text-apple-blue-600">
            {product.category.replace('-', ' ')}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-sf-display text-xl font-semibold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-medium text-foreground">
              ${(displayPrice / 100).toFixed(2)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${(product.price / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <AddToCartButton productId={product.id} className="h-11 rounded-full px-6" />
          <Button
            onClick={handleAddToQuote}
            variant="outline"
            size="default"
            className="border-apple-blue-200 text-apple-blue-700 hover:bg-apple-blue-50 h-11 flex-1 rounded-full"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Quote</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
