import { cn } from '@/lib/utils'
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
  _header,
  _icon,
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
    <Link
      href={href || '#'}
      className={cn(
        'group/bento relative row-span-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white shadow-apple-sm transition duration-500 ease-in-out dark:border-white/10 dark:bg-black hover:shadow-apple-xl',
        className
      )}
    >
      {image && (
        <div className="absolute inset-0 z-0 select-none">
          <Image
            src={image}
            alt={typeof title === 'string' ? title : 'Product Image'}
            fill
            className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-end p-6 transition duration-200 group-hover/bento:translate-x-2">
        <div className="translate-y-4 transform font-sf-display font-medium text-white/80 opacity-0 transition-all duration-500 group-hover/bento:translate-y-0 group-hover/bento:opacity-100 dark:text-neutral-300 md:opacity-100">
          {description}
        </div>
        <div className="mb-2 mt-2 font-sf-display text-xl font-bold text-neutral-100 transition duration-500 group-hover/bento:-translate-y-1 dark:text-neutral-100 md:text-2xl">
          {title}
        </div>

        <div className="mt-2 flex translate-y-2 transform items-center justify-between border-t border-white/20 pt-4 opacity-0 transition-opacity duration-300 group-hover/bento:translate-y-0 group-hover/bento:opacity-100">
          {price && <span className="font-medium text-white">{price}</span>}
          <span className="flex items-center text-sm font-medium text-white">
            {cta}{' '}
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/bento:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}
