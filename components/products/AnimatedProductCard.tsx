'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, ZoomIn, Star } from 'lucide-react'
import { productCard, buttonHover } from '@/lib/animations/variants'

interface AnimatedProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    category: string
    rating?: number
    badge?: string
    colors?: string[]
    description?: string
  }
  className?: string
}

export default function AnimatedProductCard({ product, className }: AnimatedProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(x, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / 10)
    y.set((e.clientY - centerY) / 10)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      variants={productCard}
      whileHover="hover"
      onHoverStart={() => {}}
      onHoverEnd={() => {}}
      className={className}
    >
      <Card
        className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Badge */}
        {product.badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute top-4 left-4 z-10"
          >
            <Badge variant="destructive" className="animate-pulse">
              {product.badge}
            </Badge>
          </motion.div>
        )}

        {/* Like Button */}
        <motion.button
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </motion.button>

        {/* Product Image with 3D effect */}
        <div className="relative overflow-hidden bg-gray-50">
          <motion.div
            className="relative h-64"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Image loading shimmer */}
            {!imageLoaded && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}

            {/* Quick actions overlay */}
            <motion.div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="flex gap-2">
                <motion.div whileHover={buttonHover.hover} whileTap={buttonHover.tap}>
                  <Button size="sm" variant="secondary" className="bg-white/90">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={buttonHover.hover} whileTap={buttonHover.tap}>
                  <Button size="sm" variant="secondary" className="bg-white/90">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.colors.slice(0, 4).map((color, index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-2 h-2 rounded-full bg-gray-300 border-2 border-white shadow-md flex items-center justify-center">
                  <span className="text-xs">+</span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <CardContent className="p-6 space-y-3">
          {/* Category */}
          <motion.p
            className="text-sm text-muted-foreground uppercase tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.category}
          </motion.p>

          {/* Product Name */}
          <motion.h3
            className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href={`/products/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </motion.h3>

          {/* Rating */}
          {product.rating && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating})
              </span>
            </motion.div>
          )}

          {/* Price and Actions */}
          <motion.div
            className="flex items-center justify-between pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                ${product.price}
              </span>
            </div>

            <motion.div whileHover={buttonHover.hover} whileTap={buttonHover.tap}>
              <Button
                size="sm"
                className="group-hover:scale-105 transition-transform"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Hover effect gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </Card>
    </motion.div>
  )
}