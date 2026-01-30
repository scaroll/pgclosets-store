import Link from 'next/link'

// Phase 0: Minimal static home page
// No database calls, no API calls, pure static content
export const dynamic = 'force-static'

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-secondary/50 to-background px-6">
        <div className="max-w-4xl text-center">
          <h1 className="animate-fade-up text-balance font-sf-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Premium Custom Storage Solutions for Ottawa Homes
          </h1>
          <p className="mt-6 animate-fade-up text-balance text-xl text-muted-foreground delay-100 md:text-2xl">
            Design your perfect closet. Delivered to your door.
          </p>
          <div className="mt-10 animate-fade-up delay-200">
            <Link
              href="/products"
              className="apple-ease inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y border-border/40 bg-secondary/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 text-center md:grid-cols-4">
            <TrustItem title="Lifetime Warranty" />
            <TrustItem title="5-Star Rated" />
            <TrustItem title="Ottawa Local" />
            <TrustItem title="Free Consultation" />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="text-balance text-center font-sf-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Transform Your Space
          </h2>
          <p className="mt-6 text-balance text-center text-lg leading-relaxed text-muted-foreground">
            Custom closet systems designed for your lifestyle. From walk-in wardrobes to reach-in
            organizers, we craft storage solutions that elevate your home and simplify your daily
            routine.
          </p>
        </div>
      </section>
    </div>
  )
}

function TrustItem({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
    </div>
  )
}
