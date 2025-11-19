'use client'

import { motion } from 'framer-motion'
import AppleProductCard from './AppleProductCard'

interface Product {
  title: string
  subtitle?: string
  description: string
  imageMobile: string
  imageDesktop?: string
  background?: string
  textColor?: 'light' | 'dark'
  links?: {
    text: string
    href: string
  }[]
}

interface AppleProductGridProps {
  products: Product[]
  columns?: 2 | 3
}

export default function AppleProductGrid({ products, columns = 2 }: AppleProductGridProps) {
  const gridClass = columns === 3
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2'

  return (
    <div className={`w-full grid ${gridClass} gap-3 px-4 md:px-6 mt-6`}>
      {products.map((product, index) => (
        <AppleProductCard
          key={index}
          {...product}
        />
      ))}
    </div>
  )
}
