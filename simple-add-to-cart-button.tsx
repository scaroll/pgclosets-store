"use client"
import { useCart } from "@/lib/useCart"
import { Button } from "@/components/ui/button"

type Props = { product: { id: string; slug?: string; title: string; price: number; image: string } }

export function SimpleAddToCartButton({ product }: Props) {
  const { add } = useCart()
  return (
    <Button onClick={() => add(product, 1)} className="w-full">
      Add to cart
    </Button>
  )
}
