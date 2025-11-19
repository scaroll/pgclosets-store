'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface AppleProductCardProps {
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
  height?: string
}

export default function AppleProductCard({
  title,
  subtitle,
  description,
  imageMobile,
  imageDesktop,
  background = '#FBFBFD',
  textColor = 'dark',
  links = [],
  height = '440px'
}: AppleProductCardProps) {
  const isDark = background === '#000000' || background === 'black' || textColor === 'light'
  const titleColor = isDark ? 'text-apple-gray-100' : 'text-apple-gray-900'
  const subtitleColor = isDark ? 'text-red-500' : 'text-apple-gray-600'
  const descColor = isDark ? 'text-apple-gray-100' : 'text-apple-gray-900'

  return (
    <motion.div
      className="relative overflow-hidden mt-3 rounded-lg shadow-apple-md hover:shadow-apple-lg transition-shadow duration-300"
      style={{
        backgroundColor: background,
        minHeight: height
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Text Content */}
      <div className="relative z-10 pt-5 pb-4 px-4">
        <div className="flex flex-col items-center text-center">
          {/* Title and Subtitle */}
          <div className="flex flex-col">
            <h2 className={`text-3xl md:text-[40px] font-bold ${titleColor}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`${subtitleColor} font-bold text-sm md:text-base uppercase tracking-wide`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <p className={`mt-2 text-base md:text-[20px] ${descColor}`}>
            {description}
          </p>

          {/* Links */}
          {links.length > 0 && (
            <div className="flex gap-5 mt-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-apple-blue-500 hover:underline transition-all"
                >
                  {link.text} <span className="inline-block ml-1">›</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-full">
        {/* Mobile Image */}
        <div className="md:hidden w-full h-full">
          <Image
            src={imageMobile}
            alt={title}
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Desktop Image */}
        {imageDesktop && (
          <div className="hidden md:block w-full h-full">
            <Image
              src={imageDesktop}
              alt={title}
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
