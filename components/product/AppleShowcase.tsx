"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ShowcaseProduct {
  id: string
  name: string
  price: string
  image: string
  slug: string
  tagline?: string
  newProduct?: boolean
}

interface AppleShowcaseProps {
  products: ShowcaseProduct[]
  title?: string
  subtitle?: string
}

export function AppleShowcase({ products, title, subtitle }: AppleShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-white py-20 dark:bg-neutral-950"
    >
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="mx-auto mb-16 max-w-7xl px-6 text-center">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-5xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-6xl"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Horizontal Scroll Gallery */}
      <div className="relative">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-8 md:gap-12 md:px-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex-shrink-0 snap-center"
              style={{ width: "clamp(300px, 80vw, 600px)" }}
            >
              {/* New Badge */}
              {product.newProduct && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-[#0071e3] px-4 py-1 text-xs font-semibold text-white">
                  New
                </div>
              )}

              {/* Product Image Container */}
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 80vw, 600px"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>

                {/* Product Info */}
                <div className="space-y-2 px-2">
                  {product.tagline && (
                    <p className="text-sm font-semibold text-[#0071e3]">
                      {product.tagline}
                    </p>
                  )}

                  <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
                    {product.name}
                  </h3>

                  <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    Starting at {product.price}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <span className="inline-flex items-center gap-1 text-base font-semibold text-[#0071e3] transition-colors group-hover:text-[#0077ed]">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <Link
                      href={`/products/${product.slug}?action=buy`}
                      className="text-base font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator - Subtle gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent dark:from-neutral-950" />
      </div>

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xl font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
        >
          View all products
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </section>
  )
}
