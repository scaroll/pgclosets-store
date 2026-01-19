import simpleProducts from "@/data/simple-products.json"
import { SimpleProductCard } from "@/components/simple-product-card"

export const dynamic = "force-static"

export default function SimpleProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Simple Products</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {simpleProducts.map((p) => (
          <SimpleProductCard key={p.id} product={p as any} />
        ))}
      </div>
    </div>
  )
}
