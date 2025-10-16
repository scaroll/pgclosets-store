"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
// TEMPORARILY DISABLED: OnceUI components cause build failure
// import { Flex, Grid, Column } from "@once-ui-system/core"
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
import { PremiumHero } from "@/components/home/PremiumHero"

export default function HomePage() {
  return (
    <StandardLayout>
      {/* Premium Hero Section */}
      <PremiumHero
        videoUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4"
        fallbackImage="/images/elegant-barn-door-closet.png"
        headline="Transform Your Space Into Art"
        subheadline="Where Function Meets Luxury"
      />

      {/* Featured Section - Replacing OnceUI with Tailwind */}
      <Section variant="light" spacing="xl">
        <div className="flex flex-col items-center gap-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl text-black mb-4">
              Crafted for Ottawa
            </Heading>
            <Text size="lg" className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
              Premium closet solutions designed to elevate your home
            </Text>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
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
              >
                <div className="flex flex-col items-center gap-4 p-6 border border-gray-300 rounded-lg text-center hover:border-black/30 transition-colors duration-500 group h-full">
                  <div className="text-4xl mb-4 text-black group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <Heading level={3} className="text-xl text-black mb-2">{feature.title}</Heading>
                  <Text className="text-black/70">{feature.description}</Text>
                </div>
              </motion.div>
            ))}
          </div>
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
            <Link href="/instant-estimate" aria-label="Get an instant closet estimate">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white min-w-[240px] min-h-[48px]"
                onClick={() => trackCTAClick({ location: 'footer', label: 'Get Instant Estimate' })}
              >
                <span className="relative z-10">Get Instant Estimate</span>
              </Button>
            </Link>
            <a href={getPhoneHref()} aria-label="Call PG Closets for a free consultation">
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black min-w-[240px] min-h-[48px]"
                onClick={() => trackCTAClick({ location: 'footer', label: 'Call Now' })}
              >
                <span className="relative z-10">Call {getPhoneDisplay()}</span>
              </Button>
            </a>
          </div>
        </motion.div>
      </Section>

    </StandardLayout>
  )
}
