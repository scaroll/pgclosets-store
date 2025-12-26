// @ts-nocheck - Hero with video ref type issues
"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, ChevronDown, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoHeroProps {
  videoSrc: string
  posterSrc: string
  headline: string
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
}

export function VideoHero({
  videoSrc,
  posterSrc,
  headline,
  subheadline,
  ctaText = "Shop Now",
  ctaHref = "/products",
  secondaryCtaText,
  secondaryCtaHref,
}: VideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          onCanPlay={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover motion-reduce:hidden"
        >
           {/* Mobile optimized video source could go here if we had one.
               For now we use the main source but rely on poster for immediate visual.
               We could add a media query if we had a smaller file.
           */}
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="hidden motion-reduce:block w-full h-full">
            <Image
                src={posterSrc}
                alt={headline}
                fill
                className="object-cover"
            />
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        style={{ opacity }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight max-w-5xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl">
            {subheadline}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href={ctaHref}>
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  )
}

interface ImageHeroProps {
  imageSrc: string
  imageAlt: string
  headline: string
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  blurDataURL?: string
}

export function ImageHero({
  imageSrc,
  imageAlt,
  headline,
  subheadline,
  ctaText = "Shop Now",
  ctaHref = "/products",
  secondaryCtaText,
  secondaryCtaHref,
  blurDataURL,
}: ImageHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Image Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          quality={90}
          className="object-cover"
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        style={{ opacity }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight max-w-5xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl">
            {subheadline}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href={ctaHref}>
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  )
}

interface SplitHeroProps {
  headline: string
  description: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  imageSrc: string
  imageAlt: string
  floatingImages?: {
    src: string
    alt: string
    className?: string
  }[]
  reversed?: boolean
}

export function SplitHero({
  headline,
  description,
  ctaText = "Shop Now",
  ctaHref = "/products",
  secondaryCtaText,
  secondaryCtaHref,
  imageSrc,
  imageAlt,
  floatingImages = [],
  reversed = false,
}: SplitHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const contentVariants = {
    hidden: { opacity: 0, x: reversed ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: reversed ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const floatingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-20 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            reversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text Content */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={reversed ? "lg:order-2" : ""}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              {headline}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
              {description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {secondaryCtaText && secondaryCtaHref && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`relative ${reversed ? "lg:order-1" : ""}`}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Floating Images */}
            {floatingImages.map((image, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={floatingVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className={`absolute rounded-xl overflow-hidden shadow-2xl ${image.className || ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
