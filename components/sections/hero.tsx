'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { fadeIn, fadeInUp, scrollIndicator } from '@/lib/animations'

interface HeroProps {
  title: string
  subtitle?: string
  image?: string
}

export function Hero({ title, subtitle, image }: HeroProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Background Image */}
      {image && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/40" />
        </motion.div>
      )}

      {/* Content */}
      <div className="container-content relative z-10 text-center">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-hero text-[var(--color-primary)]"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-secondary)]"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.button
        variants={scrollIndicator}
        initial="initial"
        animate="animate"
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll to content"
      >
        <ChevronDown
          className="h-8 w-8 text-[var(--color-primary)]"
          strokeWidth={1}
        />
      </motion.button>
    </section>
  )
}
