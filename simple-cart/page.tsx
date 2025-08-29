"use client"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/useCart"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function SimpleCartPage() {
  const { items, remove, clear, setQty } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0)
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + tax

  async function handleCheckout() {
    alert("Checkout is stubbed. Implement in /app/api/simple-checkout/route.ts")
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p>Your cart is empty.</p>
          <Link href="/simple-products" className="inline-flex mt-4">
            <Button>Shop products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 border rounded-2xl p-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border shrink-0">
                  <Image src={i.image || "/placeholder.svg"} alt={i.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-muted-foreground">${(i.price / 100).toFixed(2)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={i.qty}
                      onChange={(e) => setQty(i.id, Math.max(1, Number.parseInt(e.target.value || "1", 10)))}
                      className="w-20 rounded-xl border px-3 py-2"
                    />
                  </div>
                </div>
                <button onClick={() => remove(i.id)} className="text-sm text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-muted-foreground hover:underline">
              Clear cart
            </button>
          </div>
          <aside className="border rounded-2xl p-6 h-fit space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (13%)</span>
              <span>${(tax / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full mt-2">
              Checkout
            </Button>
            <p className="text-xs text-muted-foreground">
              Replace checkout logic in <code>/app/api/simple-checkout/route.ts</code> with your provider.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
