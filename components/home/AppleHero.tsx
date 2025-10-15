"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

interface AppleHeroProps {
  videoUrl?: string
  posterImage?: string
  headline: string
  subheadline?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}

export function AppleHero({
  videoUrl,
  posterImage = "/images/hero-poster.jpg",
  headline,
  subheadline,
  ctaText = "Learn more",
  ctaLink = "#showcase",
  secondaryCtaText,
  secondaryCtaLink,
}: AppleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Parallax scrolling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const y = useTransform(smoothProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0])
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.1])

  // Video loading
  useEffect(() => {
    if (!videoRef.current) return

    const handleCanPlay = () => setIsVideoLoaded(true)
    videoRef.current.addEventListener("canplay", handleCanPlay)

    return () => {
      videoRef.current?.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Media with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ scale, y }}
      >
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className={`h-full w-full object-cover transition-opacity duration-1000 ${
                isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
              poster={posterImage}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
            </video>
            {!isVideoLoaded && (
              <Image
                src={posterImage}
                alt=""
                fill
                className="object-cover"
                priority
                quality={90}
              />
            )}
          </>
        ) : (
          <Image
            src={posterImage}
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
        )}
      </motion.div>

      {/* Gradient Overlays - Apple Style */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Content Container */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity }}
      >
        {/* Headline - SF Pro Display Style */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-6xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ fontFamily: 'var(--font-display), system-ui' }}
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 max-w-3xl text-2xl font-light text-white/90 sm:text-3xl md:text-4xl"
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs - Apple Blue Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link
            href={ctaLink}
            className="group inline-flex items-center gap-2 text-xl font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
          >
            {ctaText}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {secondaryCtaText && secondaryCtaLink && (
            <>
              <span className="text-white/40">or</span>
              <Link
                href={secondaryCtaLink}
                className="group inline-flex items-center gap-2 text-xl font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
              >
                {secondaryCtaText}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-8 w-8 text-white/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
