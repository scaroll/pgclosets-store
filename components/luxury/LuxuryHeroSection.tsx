'use client'

"use client"

import { useState, useEffect } from "react"
import { LuxuryButton } from "@/components/ui/luxury-button"
import { HeroCard } from "@/components/ui/luxury-card"

interface LuxuryHeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  ctaPrimary?: {
    text: string
    href: string
  }
  ctaSecondary?: {
    text: string
    href: string
  }
  stats?: Array<{
    value: string
    label: string
  }>
  backgroundVideo?: string
  className?: string
}

export function LuxuryHeroSection({
  title = "Closet Doors",
  subtitle = "For Your Home",
  description = "We design and install closet doors in Ottawa with quality materials and reliable service.",
  ctaPrimary = { text: "Request Private Consultation", href: "/request-work" },
  ctaSecondary = { text: "Explore Collection", href: "/products" },
  stats = [
    { value: "500+", label: "Luxury Installations" },
    { value: "★★★★★", label: "Client Satisfaction" },
    { value: "15+", label: "Years Mastery" },
    { value: "Award", label: "Winning Design" }
  ],
  backgroundVideo,
  className
}: LuxuryHeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden luxury-hero-bg ${className || ''}`}>
      {/* Background Video */}
      {backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
      )}

      {/* Floating Elements */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
        {/* Status Badge */}
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center space-x-2 bg-slate-900/90 text-white px-6 py-3 rounded-full text-sm font-light tracking-wide backdrop-blur-sm luxury-badge">
            <span className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-pulse" />
            <span>Now scheduling in-home consultations</span>
          </div>
        </div>

        {/* Main Headlines */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="heading-luxury-display mb-4 text-white drop-shadow-2xl">
            <span className="luxury-text-gradient">{title}</span>
            <br />
            <span className="text-slate-300 text-5xl lg:text-6xl font-extralight">{subtitle}</span>
          </h1>

          <p className="text-luxury-lead text-slate-200 max-w-4xl mx-auto">
            {description}
          </p>
        </div>

        {/* Statistics */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center luxury-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}>
              <div className="text-3xl lg:text-4xl font-light mb-2 text-white luxury-text-gradient">
                {stat.value}
              </div>
              <div className="text-luxury-caps text-slate-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <LuxuryButton
            href={ctaPrimary.href}
            variant="primary"
            size="lg"
            shimmer
            glow
            className="luxury-gpu-accelerated"
          >
            {ctaPrimary.text}
          </LuxuryButton>

          <LuxuryButton
            href={ctaSecondary.href}
            variant="outline"
            size="lg"
            className="luxury-gpu-accelerated"
          >
            {ctaSecondary.text}
          </LuxuryButton>
        </div>
      </div>

      {/* Floating CTA Card (appears on scroll) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-500 z-30">
        <HeroCard className="p-6 max-w-sm backdrop-blur-md">
          <div className="text-center">
            <h3 className="text-lg font-light text-slate-900 mb-2">Ready to Transform Your Space?</h3>
            <p className="text-sm text-slate-600 mb-4">Get a free online quote with our design experts</p>
            <LuxuryButton variant="gold" size="sm" href="/contact">
              Schedule Now
            </LuxuryButton>
          </div>
        </HeroCard>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 z-30">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white text-xs uppercase tracking-widest opacity-60">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 z-30">
        <div className="text-luxury-caps text-slate-300">
          Est. 2009
        </div>
      </div>
    </section>
  )
}

export default LuxuryHeroSection