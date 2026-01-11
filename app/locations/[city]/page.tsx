import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface LocationPageProps {
  params: Promise<{
    city: string
  }>
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city } = await params
  if (!city) return {}

  const cityName = city.charAt(0).toUpperCase() + city.slice(1)
  return {
    title: `Custom Closets in ${cityName} | PG Closets`,
    description: `Expert custom closet design and installation services in ${cityName}. Book your free consultation today for premium storage solutions.`,
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { city } = await params

  if (!city) notFound()

  const cityName = city.charAt(0).toUpperCase() + city.slice(1)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `PG Closets ${cityName}`,
    description: `Custom closet design services in ${cityName}`,
    url: `https://pgclosets.com/locations/${city}`,
    telephone: '(555) 123-4567',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: 'State',
      addressCountry: 'US',
    },
    areaServed: cityName,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Custom Closets in {cityName}</h1>
        <p className="mt-4 text-xl text-gray-600">
          Serving {cityName} and surrounding areas with premium custom storage solutions.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center rounded-lg bg-gray-50 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">Book Your Consultation in {cityName}</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>Our expert designers in {cityName} are ready to help you transform your space.</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: {city}@pgclosets.com</p>
          </div>
          <div className="mt-8">
            <Button size="lg">Schedule Free Consultation</Button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="min-h-[300px] overflow-hidden rounded-lg bg-gray-200">
          <div className="flex h-full items-center justify-center text-gray-500">
            Map of {cityName} (Placeholder)
          </div>
        </div>
      </div>
    </div>
  )
}
