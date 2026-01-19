'use client'

import { motion } from 'motion/react'
import { fadeInUp, viewportOnce } from '@/lib/animations'

interface TestimonialProps {
  quote: string
  author: string
  location?: string
}

export function Testimonial({ quote, author, location }: TestimonialProps) {
  return (
    <section className="section-padding bg-[var(--color-primary)]">
      <div className="container-text text-center">
        <motion.blockquote
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <p className="text-display text-white">"{quote}"</p>

          <footer className="mt-12">
            <cite className="not-italic">
              <span className="block text-lg text-white/80">{author}</span>
              {location && (
                <span className="mt-1 block text-sm text-white/60">
                  {location}
                </span>
              )}
            </cite>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
