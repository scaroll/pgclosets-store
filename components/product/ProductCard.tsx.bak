"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ProductCardProps {
  name: string
  price: string
  image: string
  slug: string
  tagline?: string
  newProduct?: boolean
}

export function ProductCard({
  name,
  price,
  image,
  slug,
  tagline,
  newProduct,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/products/${slug}`} className="block">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          {newProduct && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-[#0071e3] px-3 py-1 text-xs font-semibold text-white">
              New
            </div>
          )}

          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>

        <div className="space-y-2">
          {tagline && (
            <p className="text-sm font-semibold text-[#0071e3]">{tagline}</p>
          )}

          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {name}
          </h3>

          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Starting at {price}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <span className="inline-flex items-center gap-1 text-base font-semibold text-[#0071e3] transition-colors group-hover:text-[#0077ed]">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-base font-semibold text-[#0071e3]">Buy</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
