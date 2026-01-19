'use client'

import { motion } from 'motion/react'
import { fadeInUp, viewportOnce } from '@/lib/animations'

interface PhilosophyProps {
  text: string
}

export function Philosophy({ text }: PhilosophyProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-text text-center">
        <motion.p
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-display text-[var(--color-primary)]"
        >
          {text}
        </motion.p>
      </div>
    </section>
  )
}
