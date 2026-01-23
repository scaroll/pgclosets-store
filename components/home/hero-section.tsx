'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Cinematic Background with Overlay */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Modern luxury closet"
          fill
          className="duration-[20s] object-cover transition-transform ease-linear hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <div className="animate-fade-down opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            New Collection
          </span>
        </div>

        <h1 className="animate-fade-up font-sf-display text-5xl font-semibold tracking-tight opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] md:text-7xl lg:text-8xl">
          Closets. <br className="md:hidden" />
          <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
            Redefined.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-up text-lg text-gray-300 opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] md:text-2xl">
          Experience the titanium standard of custom storage. Designed in Ottawa, built for life.
        </p>

        <div className="mt-10 flex animate-fade-up flex-col gap-4 opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards] sm:flex-row">
          <Button
            size="lg"
            asChild
            className="h-12 rounded-full bg-white px-8 text-lg text-black hover:bg-gray-100"
          >
            <Link href="/book">Book Consultation</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-12 rounded-full border-white/30 bg-white/5 px-8 text-lg text-white backdrop-blur-sm hover:bg-white/10"
          >
            <Link href="/products">View Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
