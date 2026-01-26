'use client'

interface HeroProps {
  headline?: string
  subheadline?: string
  videoSrc?: string
  posterSrc?: string
  title?: string
}

import { Button } from '@/components/ui/button'

export function VideoHero({
  headline = 'Organization. Elevated.',
  subheadline = 'Precision-engineered storage systems designed for the way you live. Ottawa’s hallmark of luxury architecture.',
}: HeroProps) {
  return (
    <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video/Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="h-full w-full bg-[url('/images/hero-fallback.jpg')] bg-cover bg-center opacity-80" />
      </div>

      <div className="container relative z-20 mx-auto px-6 text-center lg:px-8">
        <div className="mx-auto max-w-[980px]">
          <h1 className="animate-fade-up text-balance font-sf-display text-5xl font-semibold tracking-[-0.03em] md:text-7xl lg:text-8xl">
            {headline}
          </h1>
          <p className="mx-auto mt-6 animate-fade-up text-balance text-lg font-medium leading-relaxed text-white/90 delay-100 md:text-xl lg:max-w-3xl lg:text-2xl">
            {subheadline}
          </p>
          <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 delay-200 sm:flex-row">
            <Button size="lg" className="h-[52px] px-10 text-base font-semibold">
              Design Your Space
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-[52px] text-base font-semibold text-white hover:bg-white/10"
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - subtle Apple detail */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="h-10 w-[2px] bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}

export function ImageHero({ headline = 'Space. Redefined.' }: { headline?: string }) {
  return (
    <section className="relative flex h-[70vh] items-center bg-apple-gray-100 dark:bg-black">
      <div className="container mx-auto px-6">
        <h2 className="animate-fade-up font-sf-display text-4xl font-semibold md:text-6xl">
          {headline}
        </h2>
      </div>
    </section>
  )
}

export function SplitHero({ headline = 'Form Meets Function' }: { headline?: string }) {
  return (
    <section className="grid min-h-[60vh] md:grid-cols-2">
      <div className="flex flex-col justify-center bg-white p-12 dark:bg-black">
        <h2 className="animate-fade-up font-sf-display text-4xl font-semibold">{headline}</h2>
      </div>
      <div className="bg-apple-gray-200 dark:bg-apple-dark-bg" />
    </section>
  )
}
