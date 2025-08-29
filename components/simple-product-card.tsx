import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  product: {
    id: string
    slug: string
    title: string
    description: string
    price: number
    image: string
    category: string
  }
}

export function SimpleProductCard({ product }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      <Link href={`/simple-products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3]">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</div>
          <h3 className="mt-1 text-lg font-semibold">{product.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="mt-3 font-semibold">${(product.price / 100).toFixed(2)}</div>
        </CardContent>
      </Link>
    </Card>
  )
}
