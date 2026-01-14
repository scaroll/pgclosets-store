"use client"
// Removed shadcn import - using native HTML
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/useCart"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function SimpleCartContent() {
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
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Shop products</button>
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
                  <div className="text-sm text-gray-500">${(i.price / 100).toFixed(2)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-gray-500">Qty</label>
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
            <button onClick={clear} className="text-sm text-gray-500 hover:underline">
              Clear cart
            </button>
          </div>
          <aside className="border rounded-2xl p-6 h-fit space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (13%)</span>
              <span>${(tax / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="w-full mt-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Checkout
            </button>
            <p className="text-xs text-gray-500">
              Replace checkout logic in <code>/app/api/simple-checkout/route.ts</code> with your provider.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

export default function SimpleCartPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading cart...</p>
          </div>
        </div>
      }
    >
      <SimpleCartContent />
    </Suspense>
  )
}
