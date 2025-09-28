'use client'

"use client"

import { useState } from "react"
import Image from "next/image"
import { LuxuryCard, ProductCard } from "@/components/ui/luxury-card"
import { LuxuryButton } from "@/components/ui/luxury-button"
import { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"

interface LuxuryProductShowcaseProps {
  products: Product[]
  title?: string
  subtitle?: string
  onProductSelect?: (product: Product) => void
  className?: string
}

export function LuxuryProductShowcase({
  products,
  title = "Premium Door Collection",
  subtitle = "Browse our complete selection of premium closet doors with instant pricing",
  onProductSelect,
  className
}: LuxuryProductShowcaseProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  return (
    <section className={`py-20 luxury-gradient-bg ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="luxury-divider w-24 mx-auto mb-8" />
          <h2 className="heading-luxury-premium mb-6">{title}</h2>
          <p className="text-luxury-lead max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Featured Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.slice(0, 4).map((product, index) => (
            <div
              key={product.id}
              className="luxury-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <LuxuryCard
                title={product.title}
                description={product.description}
                image={product.thumbnail || "/placeholder.svg"}
                imageAlt={product.title}
                price={formatPrice(product.variants[0]?.price)}
                badge="Premium"
                variant="premium"
                shimmer={hoveredProduct === product.id}
                glow={true}
                overlay={true}
                onClick={() => onProductSelect?.(product)}
                className="luxury-gpu-accelerated"
              >
                <div className="flex gap-2">
                  <LuxuryButton
                    variant="gold"
                    size="sm"
                    onClick={() => onProductSelect?.(product)}
                    className="flex-1"
                  >
                    Get Quote
                  </LuxuryButton>
                  <LuxuryButton
                    variant="outline"
                    size="sm"
                    href={`/products/${product.handle}`}
                    className="px-3"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </LuxuryButton>
                </div>
              </LuxuryCard>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center luxury-glow-effect">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-light text-slate-900 mb-2">Professional Installation</h3>
            <p className="text-slate-600 font-light">Expert craftsmen ensure perfect fit and finish</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center luxury-glow-effect">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-lg font-light text-slate-900 mb-2">Lifetime Warranty</h3>
            <p className="text-slate-600 font-light">Comprehensive coverage for peace of mind</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center luxury-glow-effect">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-light text-slate-900 mb-2">Fast Delivery</h3>
            <p className="text-slate-600 font-light">2-week delivery guarantee on all orders</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <LuxuryButton
            variant="primary"
            size="lg"
            href="/products"
            shimmer
            className="luxury-gpu-accelerated"
          >
            View Complete Collection
          </LuxuryButton>
        </div>
      </div>
    </section>
  )
}

// Specialized Product Comparison Component
export function LuxuryProductComparison({
  products,
  className
}: {
  products: Product[]
  className?: string
}) {
  return (
    <section className={`py-20 bg-white ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-luxury-premium mb-6">Compare Our Premium Collections</h2>
          <p className="text-luxury-lead max-w-3xl mx-auto">
            Each collection is thoughtfully curated for different aesthetic preferences and functional requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, index) => (
            <div key={product.id} className="luxury-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <LuxuryCard
                title={product.title}
                description={product.description}
                image={product.thumbnail || "/placeholder.svg"}
                imageAlt={product.title}
                price={formatPrice(product.variants[0]?.price)}
                variant={index === 1 ? "featured" : "premium"}
                badge={index === 1 ? "Most Popular" : "Premium"}
                href={`/products/${product.handle}`}
                shimmer={index === 1}
                glow={index === 1}
                className="h-full"
              >
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional Installation
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Lifetime Warranty
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free Design Consultation
                  </div>
                </div>
              </LuxuryCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LuxuryProductShowcase