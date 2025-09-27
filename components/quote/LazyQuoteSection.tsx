"use client"

import { RequestQuoteButton } from "@/components/ui/request-quote-button"
import { Product } from "@/types/commerce"

interface LazyQuoteSectionProps {
  quoteStep: number
  selectedProduct: Product | null
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export default function LazyQuoteSection({
  quoteStep,
  selectedProduct,
  products,
  onSelectProduct,
}: LazyQuoteSectionProps) {
  if (quoteStep === 1) {
    return (
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-light mb-8 text-center">Select a Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectProduct(product)}
            >
              <h3 className="font-medium mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (quoteStep === 2 && selectedProduct) {
    return (
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-light mb-8 text-center">Request Quote</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-medium mb-4">{selectedProduct.title}</h3>
          <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
          <div className="flex justify-center">
            <RequestQuoteButton
              product={selectedProduct}
              size="lg"
              variant="brand-primary"
            />
          </div>
        </div>
      </section>
    )
  }

  return null
}