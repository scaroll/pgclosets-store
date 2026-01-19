'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { fadeInUp, imageReveal, viewportOnce } from '@/lib/animations'
import type { Product } from '@/lib/products'

interface ProductRevealProps {
  product: Product
}

export function ProductReveal({ product }: ProductRevealProps) {
  return (
    <section className="section-padding bg-[var(--color-surface)]">
      <div className="container-content">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={imageReveal}
            className="relative aspect-[4/5] overflow-hidden rounded-lg"
          >
            <Image
              src={product.images.hero}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={fadeInUp}
            className="text-center lg:text-left"
          >
            <h2 className="text-display text-[var(--color-primary)]">
              {product.name}
            </h2>

            <p className="mt-4 text-xl text-[var(--color-secondary)]">
              {product.tagline}
            </p>

            <p className="mt-8 text-lg font-light text-[var(--color-accent)]">
              {product.craftHours} hours of handcraft per door
            </p>

            <Link
              href={`/product/${product.slug}`}
              className="mt-8 inline-block text-sm font-medium uppercase tracking-wider text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
            >
              Explore
              <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
