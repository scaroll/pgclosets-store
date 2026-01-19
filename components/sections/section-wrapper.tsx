'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { fadeInUp, viewportOnce } from '@/lib/animations'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  background?: 'surface' | 'white' | 'primary'
  padding?: 'default' | 'large' | 'none'
}

export function SectionWrapper({
  children,
  className,
  id,
  background = 'surface',
  padding = 'default',
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      variants={fadeInUp}
      className={cn(
        // Background variants
        background === 'surface' && 'bg-[var(--color-surface)]',
        background === 'white' && 'bg-white',
        background === 'primary' && 'bg-[var(--color-primary)] text-white',
        // Padding variants
        padding === 'default' && 'section-padding',
        padding === 'large' && 'py-40 md:py-60',
        padding === 'none' && '',
        className
      )}
    >
      {children}
    </motion.section>
  )
}
