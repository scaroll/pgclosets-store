'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { fadeInUp, viewportOnce } from '@/lib/animations'

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'We listen. You share your vision for the space.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Together, we craft the perfect solution.',
  },
  {
    number: '03',
    title: 'Craft',
    description: 'Skilled hands bring your doors to life.',
  },
  {
    number: '04',
    title: 'Installation',
    description: 'Precision placement. Perfect finish.',
  },
]

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])

  return (
    <section
      id="process"
      ref={containerRef}
      className="section-padding overflow-hidden bg-white"
    >
      <div className="container-content mb-16">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-display text-center text-[var(--color-primary)]"
        >
          The Process
        </motion.h2>
      </div>

      {/* Horizontal scroll section */}
      <motion.div style={{ x }} className="flex gap-8 pl-[10%]">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={fadeInUp}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-80 rounded-lg bg-[var(--color-surface)] p-12"
          >
            <span className="text-sm font-medium text-[var(--color-accent)]">
              {step.number}
            </span>
            <h3 className="mt-4 text-2xl font-light text-[var(--color-primary)]">
              {step.title}
            </h3>
            <p className="mt-4 text-[var(--color-secondary)]">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
