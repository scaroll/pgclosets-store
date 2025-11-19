'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface AppleHeroProps {
  title: string
  subtitle: string
  background?: string
  textColor?: 'light' | 'dark'
  imageMobile?: string
  imageDesktop?: string
  links?: {
    text: string
    href: string
  }[]
}

export default function AppleHero({
  title,
  subtitle,
  background = '#FBFBFD',
  textColor = 'dark',
  imageMobile,
  imageDesktop,
  links = []
}: AppleHeroProps) {
  const textColorClass = textColor === 'light' ? 'text-apple-gray-100' : 'text-apple-gray-900'

  return (
    <section
      className="relative pt-12 overflow-hidden"
      style={{ backgroundColor: background }}
    >
      <div className="flex flex-col items-center justify-center text-center pt-5 px-4">
        {/* Title */}
        <motion.h1
          className={`text-[32px] md:text-[56px] font-bold ${textColorClass} tracking-tight`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={`text-[19px] md:text-[28px] mt-2 ${textColorClass === 'text-apple-gray-900' ? 'text-apple-gray-600' : 'text-apple-gray-300'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          {subtitle}
        </motion.p>

        {/* Links */}
        {links.length > 0 && (
          <motion.div
            className="flex gap-6 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[19px] text-apple-blue-500 hover:underline transition-all"
              >
                {link.text} <span className="inline-block ml-1">›</span>
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      {/* Hero Image */}
      {(imageMobile || imageDesktop) && (
        <motion.div
          className="mt-8 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Mobile Image */}
          {imageMobile && (
            <img
              src={imageMobile}
              alt={title}
              className="w-full h-auto md:hidden"
            />
          )}

          {/* Desktop Image */}
          {imageDesktop && (
            <img
              src={imageDesktop}
              alt={title}
              className="w-full h-auto hidden md:block"
            />
          )}
        </motion.div>
      )}
    </section>
  )
}
