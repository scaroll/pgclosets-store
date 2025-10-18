"use client"

import type { ArcatProduct } from "@/lib/enhanced-renin-products"
import { ProductCard } from "./product-card"
import { motion } from "framer-motion"

interface FeaturedProductsProps {
  products: ArcatProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-apple bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pg-sky/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pg-navy/5 rounded-full blur-3xl" />

      <div className="container-apple relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="inline-block bg-pg-navy/10 text-pg-navy px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              Best Sellers
            </span>
          </motion.div>
          <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Featured Products
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our most popular closet door solutions, trusted by hundreds of Ottawa homeowners
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3} // Priority loading for first 3 products (above-the-fold)
            />
          ))}
        </div>
      </div>
    </section>
  )
}
