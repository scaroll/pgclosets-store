"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading-new"
import Text from "@/components/ui/Text-new"
import Section from "@/components/ui/Section-new"
import StandardLayout from "@/components/layout/StandardLayout"
import { trackCTAClick } from "@/lib/analytics/events"
import { getPhoneDisplay, getPhoneHref } from "@/lib/business-info"
import { CategoryTiles } from "@/components/home/CategoryTiles"
import { WhyPGSection } from "@/components/home/WhyPGSection"
import { FeaturedProjects } from "@/components/home/FeaturedProjects"
import { ConversionCTA } from "@/components/conversion/ConversionCTA"

// Dynamic import for wizard - only loads when needed (reduces initial bundle by ~60KB)
const InstantEstimatorWizard = dynamic(
  () => import("@/components/configurator/InstantEstimatorWizard").then(mod => ({ default: mod.InstantEstimatorWizard })),
  { ssr: false }
)

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showScrollEstimator, setShowScrollEstimator] = useState(false)
  const [hasTriggeredScrollEstimator, setHasTriggeredScrollEstimator] = useState(false)

  // Safe scroll hook with null check
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  useEffect(() => {
    setIsMounted(true)

    // Optimized video preloading - only on desktop/good connection
    if (typeof window !== 'undefined') {
      // Check connection quality (avoid preloading on slow connections)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      const isMobile = window.innerWidth < 768

      // Only preload video on desktop with good connection
      if (!slowConnection && !isMobile) {
        const video = document.createElement('video')
        video.preload = 'metadata' // Load only metadata, not full video
        video.src = '/hero-video.mp4'
        video.addEventListener('loadedmetadata', () => setIsVideoLoaded(true))
      } else {
        // On mobile/slow connection, use static image only
        setIsVideoLoaded(false)
      }
    }
  }, [])

  // Scroll-triggered estimator at 40% page depth (simulation winner strategy)
  useEffect(() => {
    if (typeof window === 'undefined' || hasTriggeredScrollEstimator) return

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      // Trigger at 40% scroll depth (optimal engagement point per simulation)
      if (scrollPercentage >= 40 && !hasTriggeredScrollEstimator) {
        setShowScrollEstimator(true)
        setHasTriggeredScrollEstimator(true)
        trackCTAClick({
          location: 'scroll_trigger',
          label: 'Estimator Modal Triggered at 40% Depth'
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasTriggeredScrollEstimator])

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Video/Image Background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale }}
        >
          {isVideoLoaded ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              loading="lazy"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/images/elegant-barn-door-closet.png"
              alt="PG Closets Hero"
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
            />
          )}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />

        {/* Content */}
        <motion.div
          className="relative z-20 text-center px-6 max-w-5xl mx-auto"
          style={{ opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Heading level={1} className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
              Transform Your Closet in 2-3 Weeks
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Text size="lg" className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Lifetime Warranty | Expert Installation | 500+ Ottawa Projects
            </Text>
          </motion.div>

          {/* Multi-CTA Strategy - Optimized for Different User Readiness Levels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/instant-estimate">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white min-w-[200px] group"
                onClick={() => trackCTAClick({ location: 'hero', label: 'Get Instant Estimate' })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Instant Estimate
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Button>
            </Link>

            <a href={getPhoneHref()}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black hover:border-white min-w-[200px]"
                onClick={() => trackCTAClick({ location: 'hero', label: 'Call Now' })}
              >
                <span className="relative z-10">Call {getPhoneDisplay()}</span>
              </Button>
            </a>

            <Link href="/book-measure">
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black hover:border-white min-w-[200px]"
                onClick={() => trackCTAClick({ location: 'hero', label: 'Book Free Measure' })}
              >
                <span className="relative z-10">Book Free Measure</span>
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16 pt-8 border-t border-white/20"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>BBB A+ Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span>5.0 ★★★★★ Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Official Renin Dealer</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-xs uppercase tracking-wider">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <Section variant="light" spacing="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl text-black mb-4">
            Crafted for Ottawa
          </Heading>
          <Text size="lg" className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            Premium closet solutions designed to elevate your home
          </Text>
        </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                description: "Official Renin dealer offering the finest materials and craftsmanship",
                icon: "★"
              },
              {
                title: "Expert Installation",
                description: "Professional installation by certified specialists",
                icon: "◆"
              },
              {
                title: "Lifetime Warranty",
                description: "Complete peace of mind with our comprehensive warranty",
                icon: "◇"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true }}
                className="text-center p-8 border border-black/10 hover:border-black/30 transition-colors duration-500 group"
              >
                <div className="text-4xl mb-4 text-black group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <Heading level={3} className="text-xl text-black mb-2">{feature.title}</Heading>
                <Text className="text-black/70">{feature.description}</Text>
              </motion.div>
            ))}
          </div>
      </Section>

      {/* Category Tiles - Shop by Door Type */}
      <CategoryTiles />

      {/* Why Choose PG Closets */}
      <WhyPGSection />

      {/* Featured Ottawa Projects */}
      <FeaturedProjects />

      {/* Full-Width Image Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src="/images/before-after-closet-transformation.png"
          alt="PG Closets Lifestyle"
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="absolute inset-0 flex items-center justify-center text-center px-6"
        >
          <div className="max-w-3xl">
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Designed to Inspire
            </Heading>
            <Text size="lg" className="text-lg md:text-xl text-white/90 mb-8">
              Every detail considered, every space transformed
            </Text>
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white"
                onClick={() => trackCTAClick({ location: 'mid-page-image', label: 'View Our Work' })}
              >
                <span className="relative z-10">View Our Work</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Conversion-Optimized CTA Section */}
      <ConversionCTA />

      {/* Final CTA Section - Kept for brand consistency */}
      <Section variant="dark" spacing="xl" className="bg-black text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl mb-6">
            Start Your Project Today
          </Heading>
          <Text size="lg" className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join 500+ satisfied Ottawa homeowners. Free quote, no obligation.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/instant-estimate">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white min-w-[240px]"
                onClick={() => trackCTAClick({ location: 'footer', label: 'Get Instant Estimate' })}
              >
                <span className="relative z-10">Get Instant Estimate</span>
              </Button>
            </Link>
            <a href={getPhoneHref()}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black min-w-[240px]"
                onClick={() => trackCTAClick({ location: 'footer', label: 'Call Now' })}
              >
                <span className="relative z-10">Call {getPhoneDisplay()}</span>
              </Button>
            </a>
          </div>
        </motion.div>
      </Section>

      {/* Scroll-Triggered Estimator Wizard (40% depth) */}
      {showScrollEstimator && (
        <InstantEstimatorWizard
          isOpen={showScrollEstimator}
          onClose={() => setShowScrollEstimator(false)}
          entryPoint="scroll_trigger"
        />
      )}
    </StandardLayout>
  )
}
