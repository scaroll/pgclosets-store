"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useAnimation } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { trackCTAClick } from "@/lib/analytics/events"
import { ArrowRight, Calendar, Star, Sparkles, CheckCircle2, TrendingUp } from "lucide-react"

interface ElevatedHeroProps {
  videoUrl?: string
  fallbackImage?: string
}

export function ElevatedHero({
  videoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4",
  fallbackImage = "/images/elegant-barn-door-closet.png"
}: ElevatedHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const controls = useAnimation()

  // Detect touch devices
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouchDevice()
    window.addEventListener('touchstart', checkTouchDevice, { once: true })
    return () => window.removeEventListener('touchstart', checkTouchDevice)
  }, [])

  // Parallax scroll effects with smoother motion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  })

  // Enhanced parallax transforms
  const y = useTransform(smoothScrollProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(smoothScrollProgress, [0, 0.3, 0.7, 1], [1, 1, 0.8, 0])
  const scale = useTransform(smoothScrollProgress, [0, 1], [1, 1.1])
  const contentY = useTransform(smoothScrollProgress, [0, 1], ["0%", "-20%"])
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  // Floating animation for 3D card
  const floatY = useSpring(
    useMotionValue(0),
    {
      stiffness: 100,
      damping: 10
    }
  )

  // Mouse tracking for 3D effects (disabled on touch devices)
  useEffect(() => {
    if (isTouchDevice) return // Skip mouse tracking on touch devices

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
        setMousePosition({ x: e.clientX - centerX, y: e.clientY - centerY })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY, isTouchDevice])

  // Floating animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      floatY.set(Math.sin(Date.now() * 0.001) * 10)
    }, 50)
    return () => clearInterval(interval)
  }, [floatY])

  // Video autoplay
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const handleCanPlay = () => {
        setIsVideoLoaded(true)
        video.play().catch(() => {})
      }
      video.addEventListener("canplay", handleCanPlay)
      return () => video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  // Key metrics data
  const metrics = [
    { value: "500+", label: "Products", icon: "◆" },
    { value: "15", label: "Years", icon: "★" },
    { value: "2000+", label: "Projects", icon: "◇" },
    { value: "5.0", label: "Rating", icon: "✦" }
  ]

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  }

  const magneticVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            "radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.15), transparent 50%)",
            "radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.15), transparent 50%)",
            "radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.15), transparent 50%)",
            "radial-gradient(ellipse at bottom left, rgba(59, 130, 246, 0.15), transparent 50%)",
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(0,0,0,0.02)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Main Content Container */}
      <motion.div
        className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8"
        style={{ y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column - Text Content */}
          <motion.div className="space-y-8">

            {/* Premium Badge with glassmorphism */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Elevated Taste Without Pretense
              </span>
              <span className="text-xs text-gray-600 font-medium">Ottawa's Premium Choice</span>
            </motion.div>

            {/* Massive Headline with gradient - Mobile Optimized */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Transform
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Space
                </span>
                <span className="block text-gray-900">
                  Into Art.
                </span>
              </h1>

              <p className="text-lg xs:text-xl sm:text-2xl text-gray-600 font-light">
                Where premium closet solutions meet exceptional design.
                <span className="block text-sm xs:text-base sm:text-lg mt-2 text-gray-500">
                  Official Renin dealer serving Ottawa since 2009.
                </span>
              </p>
            </motion.div>

            {/* Magnetic CTA Buttons with enhanced hover - Mobile Optimized */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 xs:gap-4">
              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={magneticVariants}
              >
                <Link href="/instant-estimate">
                  <Button
                    className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 xs:px-6 sm:px-8 py-3 xs:py-4 sm:py-6 text-sm xs:text-base sm:text-base font-semibold rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden w-full sm:w-auto min-h-[44px] xs:min-h-[48px] sm:min-h-[52px]"
                    onClick={() => trackCTAClick({ location: 'elevated-hero', label: 'Get Started' })}
                  >
                    <span className="relative z-10 flex items-center gap-2 xs:gap-3 justify-center">
                      <span className="text-xs xs:text-sm sm:text-base">Get Instant</span>
                      <span className="text-sm xs:text-base sm:text-base font-bold">Estimate</span>
                      <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={magneticVariants}
              >
                <Link href="/book-measure">
                  <Button
                    className="group relative bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 px-4 xs:px-6 sm:px-8 py-3 xs:py-4 sm:py-6 text-sm xs:text-base sm:text-base font-semibold rounded-xl xs:rounded-2xl shadow-md xs:shadow-lg hover:shadow-xl hover:border-purple-200 transition-all duration-300 w-full sm:w-auto min-h-[44px] xs:min-h-[48px] sm:min-h-[52px]"
                    onClick={() => trackCTAClick({ location: 'elevated-hero', label: 'Book Consultation' })}
                  >
                    <span className="flex items-center gap-2 xs:gap-3 justify-center">
                      <Calendar className="w-4 xs:w-5 h-4 xs:h-5" />
                      <span className="text-xs xs:text-sm sm:text-base">Book Consultation</span>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust indicators with icons - Mobile Optimized */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 xs:gap-6 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 xs:w-5 h-4 xs:h-5 text-green-600" />
                <span className="text-xs xs:text-sm font-medium text-gray-700">BBB A+ Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 xs:w-5 h-4 xs:h-5 text-blue-600" />
                <span className="text-xs xs:text-sm font-medium text-gray-700">2-3 Week Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 xs:w-5 h-4 xs:h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs xs:text-sm font-medium text-gray-700">Lifetime Warranty</span>
              </div>
            </motion.div>

            {/* Key Metrics Grid with glassmorphism - Mobile Optimized */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-3 xs:gap-4 pt-6 xs:pt-8"
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{
                    scale: isTouchDevice ? 1 : 1.05,
                    boxShadow: isTouchDevice ? "0 4px 12px -4px rgba(0,0,0,0.15)" : "0 10px 30px -10px rgba(0,0,0,0.2)"
                  }}
                  className="relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl xs:rounded-2xl p-4 xs:p-6 text-center shadow-sm hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="text-2xl xs:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {metric.icon}
                  </div>
                  <div className="text-xl xs:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                  <div className="text-xs xs:text-sm text-gray-600 uppercase tracking-wider font-medium">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* Right Column - Floating 3D Photo Card */}
          <motion.div
            variants={itemVariants}
            className="relative"
            onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
            onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
          >
            <motion.div
              className="relative"
              style={{
                y: isTouchDevice ? 0 : floatY,
                rotateX: isTouchDevice ? 0 : rotateX,
                rotateY: isTouchDevice ? 0 : rotateY,
                transformPerspective: isTouchDevice ? 0 : 1000,
                transformStyle: isTouchDevice ? "flat" : "preserve-3d"
              }}
              whileHover={isTouchDevice ? {} : { scale: 1.02 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              {/* Main floating card with glassmorphism and shadows */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">

                {/* Premium video/image showcase */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        isVideoLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      poster={fallbackImage}
                    >
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={fallbackImage}
                      alt="Premium closet showcase"
                      fill
                      className="object-cover"
                      quality={95}
                      priority
                    />
                  )}

                  {/* Overlay gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg"
                  >
                    <span className="text-xs font-bold text-purple-600">FEATURED</span>
                  </motion.div>
                </div>

                {/* Card content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Premium Collection</h3>
                      <p className="text-sm text-gray-600 mt-1">Discover our curated designs</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                    <span className="text-sm text-gray-600">Starting from</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      $299
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />

              {/* Interactive particles on hover */}
              <AnimatePresence>
                {isHovered && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-600 rounded-full"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 0
                        }}
                        animate={{
                          x: Math.random() * 200 - 100,
                          y: Math.random() * 200 - 100,
                          opacity: [0, 1, 0]
                        }}
                        exit={{
                          opacity: 0
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                        style={{
                          left: "50%",
                          top: "50%"
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* Elegant scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Discover More</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-purple-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}