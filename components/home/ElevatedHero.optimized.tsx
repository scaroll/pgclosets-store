"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { trackCTAClick } from "@/lib/analytics/events"
import { ArrowRight, Calendar, Star, Sparkles, CheckCircle2, TrendingUp } from "lucide-react"

// Lazy load heavy components
const BreathingText = dynamic(() => import("@/lib/fancy-components").then(mod => ({ default: mod.BreathingText })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-8 w-32 rounded" />
})

interface ElevatedHeroProps {
  videoUrl?: string
  fallbackImage?: string
}

// Optimized metrics data - moved outside component to prevent re-creation
const METRICS = [
  { value: "500+", label: "Products", icon: "◆" },
  { value: "15", label: "Years", icon: "★" },
  { value: "2000+", label: "Projects", icon: "◇" },
  { value: "5.0", label: "Rating", icon: "✦" }
] as const

// Performance-optimized animation variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2, // Reduced delay for faster perception
      duration: 0.3 // Shorter duration
    }
  }
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 }, // Reduced distance
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100, // Increased for snappier feel
      damping: 15,
      duration: 0.4 // Shorter duration
    }
  }
}

export function OptimizedElevatedHero({
  videoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4",
  fallbackImage = "/images/optimized/elegant-barn-door-closet/desktop.webp"
}: ElevatedHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [videoError, setVideoError] = useState(false)

  // Respect user's motion preferences
  const shouldReduceMotion = useReducedMotion()

  // Performance optimization: Only enable 3D effects on desktop
  const enable3DEffects = useMemo(() => {
    if (typeof window === 'undefined') return false
    return !isTouchDevice && !shouldReduceMotion && window.innerWidth > 1024
  }, [isTouchDevice, shouldReduceMotion])

  // Touch device detection - optimized
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouchDevice()
    // No need for event listener if we're only checking once
  }, [])

  // Parallax scroll effects - disabled on mobile/reduced motion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: shouldReduceMotion ? 100 : 50,
    damping: shouldReduceMotion ? 30 : 20,
    restDelta: 0.001
  })

  // Optimized parallax transforms - only apply when not reducing motion
  const y = useTransform(smoothScrollProgress, shouldReduceMotion ? [0, 1] : [0, 0.3],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "30%"])
  const opacity = useTransform(smoothScrollProgress, [0, 0.3, 0.7, 1], [1, 1, 0.8, 0])
  const contentY = useTransform(smoothScrollProgress, shouldReduceMotion ? [0, 1] : [0, 0.3],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "-20%"])

  // 3D effects only on desktop
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], enable3DEffects ? [10, -10] : [0, 0])
  const rotateY = useTransform(mouseX, [-300, 300], enable3DEffects ? [-10, 10] : [0, 0])

  // Optimized mouse tracking with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enable3DEffects) return

    const rect = heroRef.current?.getBoundingClientRect()
    if (rect) {
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
      setMousePosition({ x: e.clientX - centerX, y: e.clientY - centerY })
    }
  }, [enable3DEffects, mouseX, mouseY])

  // Mouse tracking effect - only on desktop
  useEffect(() => {
    if (!enable3DEffects) return

    let timeoutId: NodeJS.Timeout
    const throttledHandleMouseMove = (e: MouseEvent) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => handleMouseMove(e), 16) // ~60fps
    }

    window.addEventListener("mousemove", throttledHandleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", throttledHandleMouseMove)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [enable3DEffects, handleMouseMove])

  // Optimized video loading with fallback
  useEffect(() => {
    if (!videoRef.current || videoError) return

    const video = videoRef.current

    // Set video attributes for performance
    video.playsInline = true
    video.muted = true
    video.loop = true
    video.preload = 'metadata' // Only load metadata initially

    const handleCanPlay = () => {
      setIsVideoLoaded(true)
      video.play().catch(() => {
        // Fallback to image if video fails to play
        setVideoError(true)
      })
    }

    const handleError = () => {
      console.warn('Video failed to load, using image fallback')
      setVideoError(true)
    }

    // Only start loading video when in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.load() // Start loading video
          video.addEventListener("canplay", handleCanPlay, { once: true })
          video.addEventListener("error", handleError, { once: true })
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
    }
  }, [videoError])

  // Optimized CTA click handler
  const handleCTAClick = useCallback((location: string, label: string) => {
    trackCTAClick({ location, label })
  }, [])

  return (
    <div
      ref={heroRef}
      className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      style={{ perspective: enable3DEffects ? '1000px' : 'none' }}
    >
      {/* Video Background with Fallback */}
      <div className="absolute inset-0">
        {!videoError ? (
          <>
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
              loading="lazy"
            />
            {/* Fallback image shows until video loads */}
            {!isVideoLoaded && (
              <Image
                src={fallbackImage}
                alt="Custom closet solutions"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="100vw"
              />
            )}
          </>
        ) : (
          <Image
            src={fallbackImage}
            alt="Custom closet solutions"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        )}

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Animated floating elements - reduced for performance */}
      {enable3DEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center px-4"
        initial="hidden"
        animate="visible"
        variants={CONTAINER_VARIANTS}
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            variants={ITEM_VARIANTS}
            style={{
              transform: enable3DEffects ? `rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)` : 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            <span className="block">Transform Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Living Space
            </span>
          </motion.h1>

          {/* Subheadline with BreathingText - conditionally loaded */}
          <motion.div
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            variants={ITEM_VARIANTS}
          >
            {enable3DEffects ? (
              <BreathingText text="Premium custom closets and barn doors designed for your Ottawa home" />
            ) : (
              <p>Premium custom closets and barn doors designed for your Ottawa home</p>
            )}
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 max-w-4xl mx-auto"
            variants={ITEM_VARIANTS}
          >
            {METRICS.map((metric, index) => (
              <motion.div
                key={metric.label}
                className="text-center"
                whileHover={enable3DEffects ? { scale: 1.05 } : {}}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm md:text-base text-gray-300 flex items-center justify-center gap-1">
                  <span>{metric.icon}</span>
                  <span>{metric.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={ITEM_VARIANTS}
          >
            <Link href="/instant-estimate">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
                onClick={() => handleCTAClick('hero-primary', 'Get Free Quote')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Get Your Free Quote
                <ArrowRight className={`ml-2 transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : ''
                }`} />
              </Button>
            </Link>

            <Link href="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 backdrop-blur-sm"
                onClick={() => handleCTAClick('hero-secondary', 'View Gallery')}
              >
                View Our Work
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm"
            variants={ITEM_VARIANTS}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Quick Installation</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>5-Star Rated</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - only on desktop */}
      {enable3DEffects && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Export default for consistency
export default OptimizedElevatedHero