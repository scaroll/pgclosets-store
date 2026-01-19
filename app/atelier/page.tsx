import { Metadata } from 'next'
import Image from 'next/image'
import { SectionWrapper } from '@/components/sections'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Atelier',
  description: 'The story of PG Closets. 15 years of quiet excellence.',
}

export default function AtelierPage() {
  const yearsInBusiness = new Date().getFullYear() - siteConfig.established

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-white">
        <div className="container-text text-center">
          <h1 className="text-display text-[var(--color-primary)]">
            {yearsInBusiness} years of quiet excellence
          </h1>
          <p className="mt-6 text-xl text-[var(--color-secondary)]">
            Since {siteConfig.established}, Ottawa
          </p>
        </div>
      </section>

      {/* Story */}
      <SectionWrapper background="surface">
        <div className="container-text">
          <div className="space-y-8 text-lg leading-relaxed text-[var(--color-secondary)]">
            <p>
              We started with a simple belief: the doors in your home should be
              as considered as the furniture you choose, as personal as the art
              you hang.
            </p>

            <p>
              What began as a small workshop has grown into an atelier where
              traditional craftsmanship meets contemporary design. Every door we
              create passes through the hands of artisans who have spent decades
              perfecting their craft.
            </p>

            <p>
              We work with homeowners, architects, and designers who understand
              that details matter. Who believe that even a closet door deserves
              attention. Who know that true luxury is often found in the things
              others overlook.
            </p>

            <p className="text-[var(--color-primary)] font-medium">
              Thousands of doors. One at a time.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid gap-16 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-xl font-light text-[var(--color-primary)]">
                Craft
              </h3>
              <p className="mt-4 text-[var(--color-secondary)]">
                Handwork that machines cannot replicate. Time invested where it
                matters.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-light text-[var(--color-primary)]">
                Materials
              </h3>
              <p className="mt-4 text-[var(--color-secondary)]">
                Sourced responsibly. Selected personally. Each piece tells its
                own story.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-light text-[var(--color-primary)]">
                Service
              </h3>
              <p className="mt-4 text-[var(--color-secondary)]">
                From first conversation to final installation. We are with you
                throughout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <SectionWrapper background="surface">
        <div className="container-text text-center">
          <h2 className="text-2xl font-light text-[var(--color-primary)]">
            Visit the Atelier
          </h2>
          <p className="mt-6 text-[var(--color-secondary)]">
            {siteConfig.address.street}
            <br />
            {siteConfig.address.city}, {siteConfig.address.province}{' '}
            {siteConfig.address.postal}
          </p>
          <p className="mt-4 text-sm text-[var(--color-secondary)]">
            By appointment only
          </p>
        </div>
      </SectionWrapper>
    </main>
  )
}
