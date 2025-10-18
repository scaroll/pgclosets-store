'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * ScrollProgress Component
 *
 * Displays a fixed progress bar at the top of the page that fills as the user scrolls.
 * Uses Framer Motion for smooth, hardware-accelerated animations.
 *
 * Performance optimizations:
 * - Hardware-accelerated with transform-gpu
 * - Spring physics for natural movement
 * - Fixed positioning with high z-index
 *
 * @returns A horizontal progress bar that tracks scroll position
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  // Spring animation for smooth, natural progress bar movement
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 transform-gpu origin-left z-[60]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
