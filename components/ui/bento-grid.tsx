'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  image,
  href,
  price,
  cta = 'Learn More',
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  _header?: React.ReactNode
  _icon?: React.ReactNode
  image?: string
  href?: string
  price?: string
  cta?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'group/bento relative row-span-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white shadow-apple-sm transition duration-500 ease-in-out dark:border-white/10 dark:bg-black hover:shadow-apple-xl',
        className
      )}
    >
      <Link href={href || '#'} className="absolute inset-0 z-20" />

      {image && (
        <div className="absolute inset-0 z-0 select-none">
          <Image
            src={
              image.startsWith('http')
                ? image
                : `https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1000&auto=format&fit=crop`
            }
            alt={typeof title === 'string' ? title : 'Product Image'}
            fill
            className="object-cover transition-transform duration-700 group-hover/bento:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover/bento:opacity-70" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-end p-8 transition duration-200 group-hover/bento:translate-x-2">
        <div className="translate-y-4 transform font-sf-display font-medium text-white/90 opacity-0 transition-all duration-500 group-hover/bento:translate-y-0 group-hover/bento:opacity-100 dark:text-neutral-300 md:opacity-100">
          {description}
        </div>
        <div className="mb-2 mt-2 font-sf-display text-2xl font-bold tracking-tight text-white transition duration-500 group-hover/bento:-translate-y-1">
          {title}
        </div>

        <div className="mt-4 flex translate-y-4 transform items-center justify-between border-t border-white/20 pt-4 opacity-0 transition-all duration-500 group-hover/bento:translate-y-0 group-hover/bento:opacity-100">
          {price && <span className="font-semibold text-white">{price}</span>}
          <span className="flex items-center text-sm font-semibold text-white">
            {cta}{' '}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/bento:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}
