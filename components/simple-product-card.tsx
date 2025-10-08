import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "../ui/card"
import { AddToCartButton } from "./ui/add-to-cart-button"
import { BadgeChip } from "../ui/badge-chip"
import { QuickConfigure } from "./configurator/QuickConfigure"
import type { ProductConfiguratorData } from "@/types/configurator"

type Props = {
  product: {
    id: string
    slug: string
    title: string
    description: string
    price: number
    image: string
    category: string
    configurator_data?: ProductConfiguratorData
  }
}

export function SimpleProductCard({ product }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      <div className="relative aspect-square">
        <Link href={`/simple-products/${product.slug}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</div>
        <Link href={`/simple-products/${product.slug}`}>
          <h3 className="mt-1 text-lg font-semibold hover:text-pg-navy transition-colors">{product.title}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-3 font-semibold">${(product.price / 100).toFixed(2)}</div>

        {/* Quick Configure - if product has configurator data */}
        {product.configurator_data && (
          <QuickConfigure
            product={{
              id: product.id,
              title: product.title,
              configuratorData: product.configurator_data
            }}
          />
        )}

        {/* Legacy Add to Cart - keep for backward compatibility */}
        {!product.configurator_data && (
          <div className="mt-4">
            <AddToCartButton
              product={{
                ...product,
                name: product.title,
                inStock: true,
              }}
              size="sm"
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
