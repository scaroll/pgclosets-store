/**
 * Mobile-Optimized Homepage Component
 *
 * Comprehensive mobile-first homepage design with:
 * - Touch-optimized hero section
 * - Swipeable product carousels
 * - Mobile performance optimizations
 * - Adaptive layouts for all screen sizes
 */

"use client"

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Star,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Heart,
  Share2,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResponsiveBreakpoints, useResponsiveStyles } from '@/hooks/use-responsive-breakpoints'
import { useTouchInteraction, TapArea, PullToRefresh } from '@/hooks/use-mobile-interactions'
import { MobileOptimizedImage, useMobilePerformance } from '@/components/performance/MobileOptimizer'

export function MobileHomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const { isMobile, isTablet, orientation } = useResponsiveBreakpoints()
  const { getFontSize, getSpacing, getGridCols } = useResponsiveStyles()
  const { enableAnimations, enableParallax } = useMobilePerformance()

  const heroRef = useRef<HTMLDivElement>(null)

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "Elegant Barn Doors",
      subtitle: "Transform Your Space",
      image: "/images/hero/barn-doors-mobile.webp",
      tabletImage: "/images/hero/barn-doors-tablet.webp",
      desktopImage: "/images/hero/barn-doors-desktop.webp",
      cta: "Explore Collection",
      ctaLink: "/products/barn-doors"
    },
    {
      id: 2,
      title: "Custom Closets",
      subtitle: "Premium Storage Solutions",
      image: "/images/hero/closets-mobile.webp",
      tabletImage: "/images/hero/closets-tablet.webp",
      desktopImage: "/images/hero/closets-desktop.webp",
      cta: "Design Yours",
      ctaLink: "/products/custom-closets"
    },
    {
      id: 3,
      title: "Professional Installation",
      subtitle: "Ottawa's Trusted Experts",
      image: "/images/hero/installation-mobile.webp",
      tabletImage: "/images/hero/installation-tablet.webp",
      desktopImage: "/images/hero/installation-desktop.webp",
      cta: "Book Consultation",
      ctaLink: "/consultation"
    }
  ]

  // Product categories
  const categories = [
    { id: 'all', label: 'All Products', count: 150 },
    { id: 'barn-doors', label: 'Barn Doors', count: 45 },
    { id: 'bifold-doors', label: 'Bifold Doors', count: 32 },
    { id: 'hardware', label: 'Hardware', count: 28 },
    { id: 'custom', label: 'Custom Solutions', count: 45 }
  ]

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Modern Barn Door',
      price: 1299,
      image: '/images/products/barn-door-1.webp',
      category: 'barn-doors',
      rating: 4.8,
      reviews: 124,
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Luxury Hardware Set',
      price: 189,
      image: '/images/products/hardware-1.webp',
      category: 'hardware',
      rating: 4.9,
      reviews: 89,
      badge: 'Premium'
    },
    {
      id: 3,
      name: 'Custom Walk-in Closet',
      price: 4999,
      image: '/images/products/custom-closet-1.webp',
      category: 'custom',
      rating: 5.0,
      reviews: 67,
      badge: 'Luxury'
    },
    {
      id: 4,
      name: 'Space-Saving Bifold',
      price: 899,
      image: '/images/products/bifold-1.webp',
      category: 'bifold-doors',
      rating: 4.7,
      reviews: 156,
      badge: null
    }
  ]

  // Handle hero slide navigation
  const nextSlide = useCallback(() => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
  }, [heroSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [heroSlides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentHeroSlide(index)
  }, [])

  // Handle swipe gestures for hero
  const handleHeroGesture = useCallback((gesture: any) => {
    if (gesture.type === 'swipe-left') {
      nextSlide()
    } else if (gesture.type === 'swipe-right') {
      prevSlide()
    }
  }, [nextSlide, prevSlide])

  useTouchInteraction(handleHeroGesture, {
    swipeThreshold: 50,
    hapticFeedback: true,
  })

  // Handle favorites
  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }, [])

  // Auto-play hero slides
  useState(() => {
    if (!isPlaying) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, nextSlide])

  const currentSlide = heroSlides[currentHeroSlide]

  return (
    <PullToRefresh onRefresh={async () => {
      // Simulate content refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
    }}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen max-h-[800px] overflow-hidden">
          <div className="absolute inset-0">
            <MobileOptimizedImage
              src={
                isMobile ? currentSlide.image :
                isTablet ? currentSlide.tabletImage :
                currentSlide.desktopImage
              }
              alt={currentSlide.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

          {/* Hero Content */}
          <div className="relative h-full flex flex-col justify-center px-6 py-8 safe-area-all">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-white max-w-4xl mx-auto"
            >
              <motion.h1
                className={cn(
                  "font-bold mb-4",
                  isMobile ? "text-4xl" : isTablet ? "text-5xl" : "text-6xl"
                )}
                style={{ fontSize: getFontSize('4xl') }}
              >
                {currentSlide.title}
              </motion.h1>

              <motion.p
                className={cn(
                  "mb-8 text-white/90",
                  isMobile ? "text-lg" : "text-xl"
                )}
                style={{ fontSize: getFontSize('xl') }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {currentSlide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href={currentSlide.ctaLink}
                  className={cn(
                    "touch-target bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors",
                    "inline-flex items-center gap-2"
                  )}
                >
                  {currentSlide.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <TapArea
                  onTap={() => setIsPlaying(!isPlaying)}
                  haptic={true}
                  className="touch-target bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors inline-flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </TapArea>
              </motion.div>
            </motion.div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentHeroSlide
                      ? "w-8 bg-white"
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <TapArea
              onTap={prevSlide}
              haptic={true}
              className="absolute left-4 top-1/2 -translate-y-1/2 touch-target bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </TapArea>

            <TapArea
              onTap={nextSlide}
              haptic={true}
              className="absolute right-4 top-1/2 -translate-y-1/2 touch-target bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </TapArea>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-6 safe-area-horizontal">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Shop by Category
            </h2>

            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "touch-target px-6 py-3 rounded-full font-medium whitespace-nowrap snap-center transition-all duration-200",
                    activeCategory === category.id
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {category.label}
                  <span className="ml-2 text-sm opacity-70">
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Featured Products */}
        <section className="py-12 px-6 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Link
                href="/products"
                className="touch-target text-black font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product Grid */}
            <div
              className={cn(
                "grid gap-6",
                getGridCols(1, 2, 3)
              )}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                    {/* Product Image */}
                    <div className="aspect-square relative">
                      <MobileOptimizedImage
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                          {product.badge}
                        </span>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <TapArea
                          onTap={() => toggleFavorite(product.id)}
                          haptic={true}
                          className="touch-target p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Heart
                            className={cn(
                              "w-5 h-5",
                              favorites.has(product.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            )}
                          />
                        </TapArea>

                        <TapArea
                          haptic={true}
                          className="touch-target p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </TapArea>

                        <TapArea
                          haptic={true}
                          className="touch-target p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Maximize2 className="w-5 h-5 text-gray-600" />
                        </TapArea>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          {product.category.replace('-', ' ')}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 group-hover:text-black transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            + Free shipping
                          </span>
                        </div>

                        <TapArea
                          haptic={true}
                          className="touch-target bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          View
                        </TapArea>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and quote from Ottawa's custom closet specialists.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="touch-target bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Free Consultation
              </Link>

              <a
                href="tel:+16137016393"
                className="touch-target bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </PullToRefresh>
  )
}