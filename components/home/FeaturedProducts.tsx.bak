"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  category: string
  price: string
  image: string
  description: string
  slug: string
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Premium Barn Door",
    category: "Barn Doors",
    price: "$499",
    image: "/images/products/barn-door-modern.jpg",
    description: "Sleek modern design with soft-close mechanism",
    slug: "barn-doors"
  },
  {
    id: "2",
    name: "Bifold Closet Door",
    category: "Bifold Doors",
    price: "$299",
    image: "/images/products/bifold-white.jpg",
    description: "Space-saving solution for any closet",
    slug: "bifold-doors"
  },
  {
    id: "3",
    name: "Sliding Door System",
    category: "Sliding Doors",
    price: "$599",
    image: "/images/products/sliding-modern.jpg",
    description: "Contemporary sliding system with premium hardware",
    slug: "sliding-doors"
  }
]

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-apple-gray-50 dark:bg-apple-dark-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-apple-gray-600 dark:text-apple-dark-text-secondary max-w-2xl mx-auto">
            Discover our curated collection of premium closet solutions
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className="group cursor-pointer">
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] rounded-apple-lg overflow-hidden mb-4 bg-apple-gray-100 dark:bg-apple-dark-bg-secondary">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
                      {product.category}
                    </p>
                    <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text group-hover:text-apple-blue-500 dark:group-hover:text-apple-blue-dark transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-apple-gray-600 dark:text-apple-dark-text-secondary">
                      {product.description}
                    </p>
                    <p className="text-2xl font-bold text-apple-gray-900 dark:text-apple-dark-text">
                      {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/products">
            <Button
              variant="primary"
              size="lg"
              className="group"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
