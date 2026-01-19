'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { productCard } from '@/lib/animations'
import { formatPrice, type Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.article
      variants={productCard}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/product/${product.slug}`}
        className="block"
        style={{ viewTransitionName: `product-${product.slug}` }}
      >
        {/* Image */}
        <div
          className={cn(
            'relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100',
            'transition-shadow duration-500',
            'group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]'
          )}
        >
          <Image
            src={product.images.hero}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              'group-hover:scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-light text-[var(--color-primary)]">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-[var(--color-secondary)]">
            {product.tagline}
          </p>

          <p className="mt-3 text-lg font-medium text-[var(--color-primary)]">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
