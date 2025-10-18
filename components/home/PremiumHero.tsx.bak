"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { trackCTAClick } from "@/lib/analytics/events"
import { getPhoneDisplay, getPhoneHref } from "@/lib/business-info"
import { ArrowRight, Play, Phone, Calendar, Star } from "lucide-react"

interface PremiumHeroProps {
  videoUrl?: string
  fallbackImage?: string
  headline?: string
  subheadline?: string
}

export function PremiumHero({
  videoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4",
  fallbackImage = "/images/elegant-barn-door-closet.png",
  headline = "Transform Your Space Into Art",
  subheadline = "Where Function Meets Luxury"
}: PremiumHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const y = useTransform(smoothScrollProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(smoothScrollProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(smoothScrollProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(smoothScrollProgress, [0, 1], ["0%", "30%"])

  // Intelligent video loading
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      if (typeof window !== 'undefined') {
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g')
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // Only show video on desktop with good connection and no motion preference
        if (!mobile && !slowConnection && !prefersReducedMotion) {
          setShowVideo(true)
        }
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Video autoplay with fallback
  useEffect(() => {
    if (!showVideo || !videoRef.current) return

    const video = videoRef.current

    const handleCanPlay = () => {
      setIsVideoLoaded(true)
      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch(() => {
            // Autoplay prevented - show play button
            setIsVideoPlaying(false)
          })
      }
    }

    const handlePlaying = () => setIsVideoPlaying(true)
    const handlePause = () => setIsVideoPlaying(false)

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("pause", handlePause)
    }
  }, [showVideo])

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Video/Image Background with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale, y }}
      >
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
              poster={fallbackImage}
              aria-hidden="true"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Video Loading State */}
            {!isVideoLoaded && (
              <Image
                src={fallbackImage}
                alt="Premium closet doors showcase"
                fill
                className="object-cover"
                priority
                quality={90}
                sizes="100vw"
              />
            )}
          </>
        ) : (
          <Image
            src={fallbackImage}
            alt="Premium closet doors showcase"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        )}
      </motion.div>

      {/* Sophisticated Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
      }} />

      {/* Play Button Overlay for Manual Video Start */}
      {showVideo && isVideoLoaded && !isVideoPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handlePlayVideo}
          className="absolute inset-0 z-20 flex items-center justify-center group cursor-pointer"
          aria-label="Play hero video"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full animate-pulse" />
            <div className="relative bg-white/30 backdrop-blur-md rounded-full p-8 group-hover:bg-white/40 transition-all duration-300 group-hover:scale-110">
              <Play className="w-12 h-12 text-white" fill="white" />
            </div>
          </div>
        </motion.button>
      )}

      {/* Premium Content */}
      <motion.div
        className="relative z-30 text-center px-6 max-w-6xl mx-auto"
        style={{ y: contentY, opacity }}
      >
        {/* Eyebrow - Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white/90 text-sm font-medium tracking-wide">
            500+ Ottawa Installations | Lifetime Warranty
          </span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight"
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-light tracking-wide"
        >
          {subheadline}
        </motion.p>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-white/80 mb-12 max-w-2xl mx-auto"
        >
          Expert installation in 2-3 weeks • Official Renin dealer • BBB A+ rated
        </motion.p>

        {/* Premium CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA - Most Prominent */}
          <Link href="/instant-estimate" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-white text-black border-2 border-white hover:bg-white/90 hover:scale-105 min-w-[220px] min-h-[56px] text-base font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
              onClick={() => trackCTAClick({ location: 'hero', label: 'Get Instant Estimate' })}
            >
              <span className="flex items-center gap-3">
                Get Instant Estimate
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>

          {/* Secondary CTA - Call */}
          <a href={getPhoneHref()} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-transparent text-white border-2 border-white/70 hover:bg-white hover:text-black hover:border-white backdrop-blur-sm min-w-[220px] min-h-[56px] text-base font-semibold transition-all duration-300"
              onClick={() => trackCTAClick({ location: 'hero', label: 'Call Now' })}
            >
              <span className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                {getPhoneDisplay()}
              </span>
            </Button>
          </a>

          {/* Tertiary CTA - Book Measure */}
          <Link href="/book-measure" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-white/10 text-white border-2 border-white/50 hover:bg-white/20 hover:border-white/70 backdrop-blur-sm min-w-[220px] min-h-[56px] text-base font-semibold transition-all duration-300"
              onClick={() => trackCTAClick({ location: 'hero', label: 'Book Free Measure' })}
            >
              <span className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                Book Free Measure
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 pt-8 border-t border-white/20"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-white/90">
            <div className="flex items-center gap-2 group">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-medium group-hover:text-white transition-colors">BBB A+ Rated</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 group">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="font-medium group-hover:text-white transition-colors">5.0 Reviews</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 group">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="font-medium group-hover:text-white transition-colors">Lifetime Warranty</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 group">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="font-medium group-hover:text-white transition-colors">Official Renin Dealer</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 hidden md:flex"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] h-16 bg-gradient-to-b from-white/60 via-white/40 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  )
}
