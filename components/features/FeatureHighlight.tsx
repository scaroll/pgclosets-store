"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Feature {
  id: string
  headline: string
  description: string
  image: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}

interface FeatureHighlightProps {
  features: Feature[]
}

export function FeatureHighlight({ features }: FeatureHighlightProps) {
  return (
    <section className="bg-white dark:bg-neutral-950">
      {features.map((feature, index) => (
        <FeatureSection
          key={feature.id}
          feature={feature}
          isEven={index % 2 === 0}
        />
      ))}
    </section>
  )
}

interface FeatureSectionProps {
  feature: Feature
  isEven: boolean
}

function FeatureSection({ feature, isEven }: FeatureSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div
          className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24 ${
            isEven ? "" : "md:grid-flow-dense"
          }`}
        >
          {/* Text Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className={`space-y-6 ${isEven ? "" : "md:col-start-2"}`}
          >
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl lg:text-6xl"
            >
              {feature.headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-neutral-600 dark:text-neutral-400 md:text-xl lg:text-2xl"
            >
              {feature.description}
            </motion.p>

            {/* CTAs */}
            {(feature.ctaText || feature.secondaryCtaText) && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-6 pt-4"
              >
                {feature.ctaText && feature.ctaLink && (
                  <Link
                    href={feature.ctaLink}
                    className="group inline-flex items-center gap-2 text-lg font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
                  >
                    {feature.ctaText}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                {feature.secondaryCtaText && feature.secondaryCtaLink && (
                  <Link
                    href={feature.secondaryCtaLink}
                    className="text-lg font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
                  >
                    {feature.secondaryCtaText}
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Image */}
          <motion.div
            style={{ y: imageY, scale: imageScale, opacity }}
            className={isEven ? "" : "md:col-start-1 md:row-start-1"}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src={feature.image}
                alt={feature.headline}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
