"use client"

import { Button } from "../ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30"
        aria-hidden="true"
      />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      <div className="container-default relative z-10 section-lg">
        <div className="max-w-3xl mx-auto text-center">
          {/* Overline */}
          <p className="text-overline text-accent mb-4">
            Official Renin Dealer
          </p>

          {/* Main headline */}
          <h1 className="text-display mb-6">
            Premium Closet Doors
            <span className="block text-accent">Made in Canada</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
            Shop our complete collection of Renin closet doors with professional
            installation and lifetime warranty in Ottawa
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              href="/store/products"
            >
              Shop All Products
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/contact"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Free Consultation
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/10">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Professional Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Free Ottawa Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
