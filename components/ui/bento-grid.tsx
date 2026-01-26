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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group/bento ease-[cubic-bezier(0.16,1,0.3,1)] relative row-span-1 flex flex-col justify-between overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-apple-sm transition-all duration-700 dark:border-white/10 dark:bg-black hover:-translate-y-1 hover:shadow-apple-xl',
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
            className="duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] object-cover transition-transform group-hover/bento:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 transition-opacity duration-700 group-hover/bento:opacity-80" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-end p-10 transition duration-500">
        <div className="ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-4 transform font-sf-display text-[15px] font-medium text-white/80 opacity-0 transition-all duration-700 group-hover/bento:translate-y-0 group-hover/bento:opacity-100 md:opacity-100">
          {description}
        </div>
        <div className="mb-2 mt-3 font-sf-display text-3xl font-semibold tracking-tight text-white transition duration-700 group-hover/bento:-translate-y-1">
          {title}
        </div>

        <div className="ease-[cubic-bezier(0.16,1,0.3,1)] mt-6 flex translate-y-4 transform items-center justify-between border-t border-white/10 pt-6 opacity-0 transition-all duration-700 group-hover/bento:translate-y-0 group-hover/bento:opacity-100">
          {price && <span className="text-lg font-semibold text-white">{price}</span>}
          <span className="flex items-center text-[15px] font-semibold text-white/90">
            {cta}{' '}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/bento:translate-x-2" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}
