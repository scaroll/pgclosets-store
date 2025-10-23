'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Sparkles,
  ArrowDown
} from 'lucide-react'
import { fadeIn, slideUp, slideLeft, slideRight, scaleIn, staggerContainer } from '@/lib/animations/variants'

export default function AnimatedHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  const slides = [
    {
      id: 1,
      title: "Transform Your Space",
      subtitle: "Premium Custom Closets & Storage Solutions",
      description: "Elevate your home with bespoke storage solutions designed for your lifestyle. Professional installation in Ottawa.",
      image: "/images/hero/closet-transform.jpg",
      cta: "Get Free Quote",
      secondaryCta: "View Gallery",
      badge: "Limited Time: 25% Off",
      features: ["Free Design Consultation", "Lifetime Warranty", "Made in Canada"]
    },
    {
      id: 2,
      title: "Modern Barn Doors",
      subtitle: "Stylish Space-Saving Solutions",
      description: "Discover our collection of premium barn doors that combine functionality with elegant design.",
      image: "/images/hero/barn-doors.jpg",
      cta: "Explore Collection",
      secondaryCta: "Book Consultation",
      badge: "New Arrivals",
      features: ["Renin Authorized", "Custom Finishes", "Quiet Operation"]
    },
    {
      id: 3,
      title: "Smart Organization",
      subtitle: "Intelligent Storage Systems",
      description: "Maximize every inch of your space with our innovative storage solutions and accessories.",
      image: "/images/hero/smart-storage.jpg",
      cta: "Design Your System",
      secondaryCta: "3D Planner",
      badge: "Best Seller",
      features: ["3D Design Tool", "Modular System", "Eco-Friendly Materials"]
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [slides.length])

  const currentSlideData = slides[currentSlide]

  return (
    <motion.section
      style={{ opacity, y }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentSlideData.image}
            alt={currentSlideData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex"
          >
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-white/30 animate-pulse">
              <Sparkles className="w-3 h-3 mr-2" />
              {currentSlideData.badge}
            </Badge>
          </motion.div>

          {/* Main Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlideData.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              {currentSlideData.title}
            </motion.h1>
          </AnimatePresence>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlideData.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl md:text-2xl text-white/90"
            >
              {currentSlideData.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlideData.description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-white/80 max-w-2xl mx-auto"
            >
              {currentSlideData.description}
            </motion.p>
          </AnimatePresence>

          {/* Features */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-6"
          >
            {currentSlideData.features.map((feature, index) => (
              <motion.div
                key={feature}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex items-center gap-2 text-white/90"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg group">
                {currentSlideData.cta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex"
            >
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                {currentSlideData.secondaryCta}
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white/80">
              4.9/5 from 500+ happy customers in Ottawa
            </span>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="w-6 h-6 text-white/60" />
      </motion.div>

      {/* Side Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 to-transparent z-10" />
    </motion.section>
  )
}

// Animated Hero Cards Component
export function AnimatedHeroCards() {
  const cards = [
    {
      icon: '🏠',
      title: 'Custom Design',
      description: 'Tailored storage solutions for your unique space and needs',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: '⚡',
      title: 'Quick Installation',
      description: 'Professional team ensures minimal disruption to your home',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'High-quality materials backed by our lifetime warranty',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.8 }}
          whileHover={{ y: -10 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className={`p-8 rounded-2xl bg-gradient-to-br ${card.color} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
            <motion.div
              className="text-5xl mb-4"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {card.icon}
            </motion.div>
            <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
            <p className="text-white/90 leading-relaxed">{card.description}</p>
            <motion.div
              className="mt-6 inline-flex items-center text-white font-semibold"
              whileHover={{ x: 5 }}
            >
              Learn more
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}