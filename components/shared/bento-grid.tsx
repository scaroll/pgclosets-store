import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

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
  header: _header,
  icon,
  href,
  image,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  href?: string
  image?: string
}) => {
  return (
    <Link
      href={href || '#'}
      className={cn(
        'group/bento relative row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-transparent bg-white p-4 shadow-input transition duration-200 dark:border-white/[0.2] dark:bg-black dark:shadow-none hover:shadow-xl',
        className
      )}
    >
      {image && (
        <Image
          src={image}
          alt={typeof title === 'string' ? title : ''}
          fill
          className="absolute inset-0 z-0 object-cover transition-transform duration-500 group-hover/bento:scale-105"
        />
      )}

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/40 to-black/80 transition-opacity duration-300" />

      <div className="relative z-20 flex h-full flex-col justify-end transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mb-2 mt-2 font-sans text-2xl font-bold text-neutral-100">{title}</div>
        <div className="font-sans text-sm font-normal text-neutral-300">{description}</div>
        <div className="mt-4 flex items-center text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100">
          Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}
