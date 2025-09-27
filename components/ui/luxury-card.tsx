"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface LuxuryCardProps {
  title: string
  description?: string
  image?: string
  imageAlt?: string
  price?: string
  badge?: string
  href?: string
  onClick?: () => void
  children?: ReactNode
  className?: string
  variant?: "default" | "featured" | "minimal"
}

export function LuxuryCard({
  title,
  description,
  image,
  imageAlt,
  price,
  badge,
  href,
  onClick,
  children,
  className,
  variant = "default"
}: LuxuryCardProps) {
  const baseStyles = cn(
    "bg-white overflow-hidden transition-all duration-500",
    "border border-gray-100 shadow-lg",
    "hover:shadow-2xl hover:-translate-y-2",
    "group relative"
  )

  const variantStyles = {
    default: "",
    featured: "ring-2 ring-amber-400 ring-offset-2",
    minimal: "border-0 shadow-md hover:shadow-lg"
  }

  const cardContent = (
    <>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Image Section */}
      {image && (
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />

          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-1 text-xs font-light tracking-[0.2em] uppercase backdrop-blur-sm">
                {badge}
              </span>
            </div>
          )}

          {/* Hover indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 relative z-20">
        {/* Title */}
        <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide group-hover:text-slate-800 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-slate-600 text-sm mb-4 font-light leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        {price && (
          <div className="text-3xl font-extralight text-slate-900 mb-4 tracking-tight">
            {price}
          </div>
        )}

        {/* Children or default action */}
        {children || (
          <div className="flex items-center justify-between">
            <span className="text-sm font-light uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
              View Details
            </span>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-all duration-300 transform group-hover:translate-x-1"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 to-slate-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </>
  )

  const cardStyles = cn(
    baseStyles,
    variantStyles[variant],
    className
  )

  if (href) {
    return (
      <Link href={href} className={cardStyles}>
        {cardContent}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(cardStyles, "w-full text-left")}>
        {cardContent}
      </button>
    )
  }

  return (
    <div className={cardStyles}>
      {cardContent}
    </div>
  )
}

// Grid wrapper for cards
export function LuxuryCardGrid({
  children,
  columns = 3,
  className
}: {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}) {
  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={cn(
      "grid gap-8",
      columnStyles[columns],
      className
    )}>
      {children}
    </div>
  )
}