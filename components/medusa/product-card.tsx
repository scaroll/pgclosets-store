"use client"

import Image from "next/image"
import Link from "next/link"
import { HttpTypes } from "@/lib/medusa"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
  className?: string
}

export function MedusaProductCard({ product, region, className }: ProductCardProps) {
  const productImage = product.images?.[0]?.url || "/placeholder.svg"
  const productPrice = product.variants?.[0]?.calculated_price || null
  
  // Format price based on region currency
  const formattedPrice = productPrice && region 
    ? formatPrice(productPrice.calculated_amount, region.currency_code)
    : null

  return (
    <div className={`group relative ${className}`}>
      <Link href={`/store/products/${product.handle}`}>
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
          <Image
            src={productImage}
            alt={product.title || "Product"}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            {formattedPrice && (
              <p className="text-lg font-semibold text-gray-900">
                {formattedPrice}
              </p>
            )}
            
            {product.status && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

// Grid component for multiple products
interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  region?: HttpTypes.StoreRegion
  className?: string
}

export function MedusaProductGrid({ products, region, className }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {products.map((product) => (
        <MedusaProductCard 
          key={product.id} 
          product={product} 
          region={region}
        />
      ))}
    </div>
  )
}