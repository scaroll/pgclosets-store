"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, ShoppingCart, Heart, Shield, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackCTAClick } from "@/lib/analytics/events"
import { Float, ANIMATION_CONFIG } from "@/lib/fancy-components"

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
    originalPrice: "$699",
    image: "/images/products/barn-door-modern.jpg",
    description: "Sleek modern design with soft-close mechanism",
    slug: "barn-doors",
    rating: 4.9,
    reviews: 127,
    isBestseller: true,
    discount: 28
  },
  {
    id: "2",
    name: "Bifold Closet Door",
    category: "Bifold Doors",
    price: "$299",
    originalPrice: "$399",
    image: "/images/products/bifold-white.jpg",
    description: "Space-saving solution for any closet",
    slug: "bifold-doors",
    rating: 4.8,
    reviews: 89,
    isBestseller: false,
    discount: 25
  },
  {
    id: "3",
    name: "Sliding Door System",
    category: "Sliding Doors",
    price: "$599",
    originalPrice: "$799",
    image: "/images/products/sliding-modern.jpg",
    description: "Contemporary sliding system with premium hardware",
    slug: "sliding-doors",
    rating: 5.0,
    reviews: 156,
    isBestseller: true,
    discount: 25
  }
]

export function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = React.useState<string | null>(null)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Bestselling Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Premium Closets,
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Unbeatable Prices
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your space with our most sought-after closet solutions.
            <span className="block text-purple-600 font-semibold">Limited time: Save up to 28% + Free Installation</span>
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Lifetime Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>500+ 5-Star Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-600" />
              <span>Free Installation</span>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Float {...ANIMATION_CONFIG.PRODUCT_FLOAT}>
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                {/* Bestseller badge */}
                {product.isBestseller && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 left-4 z-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  >
                    🔥 BESTSELLER
                  </motion.div>
                )}

                {/* Discount badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute top-4 right-4 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  -{product.discount}%
                </motion.div>

                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay with quick actions */}
                  <AnimatePresence>
                    {hoveredProduct === product.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6"
                      >
                        <div className="flex gap-2 w-full">
                          <Link href={`/products/${product.slug}`} className="flex-1">
                            <Button
                              size="sm"
                              className="bg-white text-gray-900 hover:bg-gray-100 w-full text-sm font-semibold"
                              onClick={() => trackCTAClick({ location: 'featured-products', label: `View ${product.name}` })}
                            >
                              View Details
                            </Button>
                          </Link>
                          <Link href="/instant-estimate" className="flex-1">
                            <Button
                              size="sm"
                              className="bg-purple-600 text-white hover:bg-purple-700 w-full text-sm font-semibold"
                              onClick={() => trackCTAClick({ location: 'featured-products', label: `Get Quote ${product.name}` })}
                            >
                              Get Quote
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">{product.category}</p>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                        <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                      </div>
                      <p className="text-xs text-green-600 font-semibold">Save {product.discount}% today!</p>
                    </div>
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
              </Float>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Space?
              </h3>
              <p className="text-lg mb-8 text-white/90">
                Get a free, no-obligation consultation and personalized design recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={() => trackCTAClick({ location: 'featured-products-cta', label: 'Shop All Products' })}
                  >
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Shop All Products
                  </Button>
                </Link>
                <Link href="/instant-estimate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4 text-base transform hover:scale-105 transition-all duration-300"
                    onClick={() => trackCTAClick({ location: 'featured-products-cta', label: 'Get Free Quote' })}
                  >
                    Get Free Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
