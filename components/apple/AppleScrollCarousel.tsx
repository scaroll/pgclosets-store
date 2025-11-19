'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface CarouselItem {
  id: string
  thumbnail: string
  genre?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

interface AppleScrollCarouselProps {
  items: CarouselItem[]
  title?: string
}

export default function AppleScrollCarousel({ items, title }: AppleScrollCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full py-12 bg-apple-gray-100">
      {title && (
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 text-apple-gray-900">
          {title}
        </h2>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide overscroll-auto snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="min-w-[350px] md:min-w-[400px] snap-center px-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative">
              <div className="relative h-[495px] w-full overflow-hidden rounded-lg">
                <Image
                  src={item.thumbnail}
                  alt={item.description || ''}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
                {item.genre && (
                  <p className="text-[#DAD7D8] font-bold text-sm mb-1">
                    {item.genre}
                  </p>
                )}
                {item.description && (
                  <p className="text-[#DAD7D8] font-bold mb-3">
                    {item.description}
                  </p>
                )}
                {item.buttonText && (
                  <a
                    href={item.buttonLink || '#'}
                    className="inline-block bg-white text-black px-6 py-2 rounded-[4px] font-bold hover:bg-gray-100 transition-colors"
                  >
                    {item.buttonText} ▷
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
