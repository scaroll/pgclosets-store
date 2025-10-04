"use client"

import { FeaturedProducts } from "@/components/store/featured-products"
import { HeroSection } from "@/components/store/hero-section"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts, productCategories } from "@/lib/enhanced-renin-products"
import Image from "next/image"
import StandardLayout from "@/components/layout/StandardLayout"
import { motion } from "framer-motion"

// Metadata moved to parent layout or will be set via generateMetadata

export default function StorePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <StandardLayout>
      <main>
        <HeroSection />

        <CategoriesSection />
        <FeaturedProducts products={featuredProducts} />

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-pg-navy via-pg-navy to-pg-sky py-24 relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob" />
            <div className="absolute top-0 right-10 w-64 h-64 bg-pg-sky rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Need Help Choosing?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Our Ottawa experts are here to help you find the perfect closet door solution for your home
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  href="/contact"
                  className="bg-white text-pg-navy hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold"
                >
                  Free Consultation
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href="mailto:spencer@peoplesgrp.com"
                  className="border-2 border-white text-white hover:bg-white hover:text-pg-navy hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 font-semibold"
                >
                  Email Us
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </StandardLayout>
  )
}

function CategoriesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">Shop by Category</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover our complete range of premium Renin closet doors and hardware
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((category, index) => (
            <motion.a
              key={category.id}
              href={`/store/products?category=${category.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src={category.heroImage || "/placeholder.svg"}
                  alt={`${category.name} - Premium closet doors by Renin`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  priority={index < 3}
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-pg-navy transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{category.description}</p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="group-hover:bg-pg-navy group-hover:text-white group-hover:border-pg-navy transition-all duration-300"
                >
                  Explore {category.name}
                </Button>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
