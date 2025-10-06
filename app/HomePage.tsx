"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import Button from "@/components/ui/Button-new"
import Heading from "@/components/ui/Heading-new"
import Text from "@/components/ui/Text-new"
import Section from "@/components/ui/Section-new"
import StandardLayout from "@/components/layout/StandardLayout"

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Safe scroll hook with null check
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  useEffect(() => {
    setIsMounted(true)
    // Preload video safely
    if (typeof window !== 'undefined') {
      const video = document.createElement('video')
      video.src = '/hero-video.mp4'
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true))
    }
  }, [])

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
              className="w-full h-full object-cover"
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
              Elevated Taste
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl opacity-90">
                Without Pretense
              </span>
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Text size="lg" className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your space with premium closet solutions
            </Text>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/request-work">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white min-w-[240px] group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get a Free Quote
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

            <Link href="/products">
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black hover:border-white min-w-[240px]"
              >
                <span className="relative z-10">Explore Collection</span>
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

      {/* Full-Width Image Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src="/images/before-after-closet-transformation.png"
          alt="PG Closets Lifestyle"
          fill
          className="object-cover"
          quality={90}
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
              >
                <span className="relative z-10">View Our Work</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <Section variant="dark" spacing="xl" className="bg-black text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl mb-6">
            Ready to Transform Your Space?
          </Heading>
          <Text size="lg" className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Book a free consultation with our design specialists today
          </Text>
          <Link href="/request-work">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white min-w-[280px]"
            >
              <span className="relative z-10">Schedule Consultation</span>
            </Button>
          </Link>
        </motion.div>
      </Section>
    </StandardLayout>
  )
}
