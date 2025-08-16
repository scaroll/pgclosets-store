import Image from 'next/image'
import Link from 'next/link'
import { reninProducts } from '@/lib/renin-products'

interface GridTileImageProps {
  src: string
  alt: string
  label: {
    title: string
    amount: string
    currencyCode: string
    position: 'center' | 'bottom'
  }
  fill?: boolean
  sizes?: string
  priority?: boolean
}

function GridTileImage({ src, alt, label, fill, sizes, priority }: GridTileImageProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white">
      <Image
        className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4 text-white ${
          label.position === 'center' ? 'justify-center text-center' : ''
        }`}
      >
        <h3 className="text-xl font-semibold">{label.title}</h3>
        <p className="text-lg">
          {label.amount} {label.currencyCode}
        </p>
      </div>
    </div>
  )
}

function ThreeItemGridItem({
  product,
  size,
  priority
}: {
  product: any
  size: 'full' | 'half'
  priority?: boolean
}) {
  const image = product.images?.main || '/placeholder.jpg'
  const price = product.sale_price || product.price || '0'
  
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/store/products/${product.slug}`}
        prefetch={true}
      >
        <GridTileImage
          src={image}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={product.name}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: product.name,
            amount: price.toString(),
            currencyCode: 'CAD'
          }}
        />
      </Link>
    </div>
  )
}

export function ThreeItemGrid() {
  // Get featured products from our Renin database
  const products = reninProducts.getBarnDoors().slice(0, 3)
  
  if (!products[0] || !products[1] || !products[2]) return null

  const [firstProduct, secondProduct, thirdProduct] = products

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" product={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" product={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" product={thirdProduct} />
    </section>
  )
}