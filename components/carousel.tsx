import Image from 'next/image'
import Link from 'next/link'
import { reninProducts } from '@/lib/renin-products'

export function Carousel() {
  // Get more products for carousel
  const products = reninProducts.getBarnDoors().slice(3, 8)

  if (!products.length) return null

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {products.map((product, i) => (
          <li
            key={product.id}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/store/products/${product.slug}`} className="relative h-full w-full">
              <div className="group relative h-full w-full overflow-hidden rounded-lg bg-white">
                <Image
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                  src={product.images?.main || '/placeholder.jpg'}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <p className="text-xs">
                    {product.sale_price || product.price || '0'} CAD
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}