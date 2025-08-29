import type { CartItem } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/renin-products"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface CartSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  installationFee: number
  total: number
  province: string
}

const TAX_NAMES: Record<string, string> = {
  ON: "HST (13%)",
  QC: "GST + QST (14.975%)",
  BC: "GST + PST (12%)",
  AB: "GST (5%)",
  SK: "GST + PST (11%)",
  MB: "GST + PST (12%)",
  NB: "HST (15%)",
  NS: "HST (15%)",
  PE: "HST (15%)",
  NL: "HST (15%)",
  NT: "GST (5%)",
  NU: "GST (5%)",
  YT: "GST (5%)",
}

export function CartSummary({ items, subtotal, tax, installationFee, total, province }: CartSummaryProps) {
  return (
    <div className="card-apple p-6 sticky top-8">
      <h3 className="text-h3 mb-6">Order Summary</h3>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.selectedSize}-${item.selectedFinish}`} className="flex gap-3">
            <OptimizedImage
              src={item.product.images[0]}
              alt={`${item.product.name} - Cart item - PG Closets`}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded"
              sizes="48px"
              quality={90}
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.product.name}</h4>
              {item.selectedSize && <p className="text-xs text-pg-gray">Size: {item.selectedSize}</p>}
              {item.selectedFinish && <p className="text-xs text-pg-gray">Finish: {item.selectedFinish}</p>}
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-pg-gray">Qty: {item.quantity}</span>
                <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm">{TAX_NAMES[province] || "Tax"}</span>
          <span className="text-sm">{formatPrice(tax)}</span>
        </div>

        {installationFee > 0 && (
          <div className="flex justify-between">
            <span className="text-sm">Professional Installation</span>
            <span className="text-sm">{formatPrice(installationFee)}</span>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold text-pg-navy">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Free shipping in Ottawa area</span>
        </div>
        <p className="text-xs text-green-600 mt-1">Lifetime warranty included</p>
      </div>
    </div>
  )
}
