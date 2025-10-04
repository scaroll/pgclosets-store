"use client"

import { Button } from "../ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-pg-navy via-pg-navy to-pg-sky text-white py-32 overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pg-sky rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="container-apple relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Premium Closet Doors
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="block text-pg-sky/90 mt-2"
            >
              Made in Canada
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl lg:text-2xl mb-10 text-white/90 leading-relaxed max-w-2xl mx-auto"
          >
            Shop our complete collection of Renin closet doors with professional installation and lifetime warranty
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              href="/store/products"
              className="bg-white text-pg-navy hover:bg-gray-100 hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl"
            >
              Shop All Products
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-pg-navy hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10"
            >
              Free Consultation
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
