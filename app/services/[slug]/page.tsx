import { BookingCalendar } from '@/components/booking/booking-calendar'
import { getServiceBySlug } from '@/lib/services'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}

  return {
    title: `${service.title} | PG Closets`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Column: Service Details */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{service.title}</h1>
          <p className="mt-4 text-xl text-gray-600">{service.description}</p>

          <div className="mt-8 overflow-hidden rounded-lg bg-gray-100">
            <div className="relative aspect-video">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Booking */}
        <div className="lg:pl-8">
          <div className="sticky top-8">
            <h3 className="mb-6 text-2xl font-semibold">Schedule a Consultation</h3>
            <p className="mb-6 text-gray-600">
              Ready to design your {service.title.toLowerCase()}? Book a free in-home consultation
              with our design experts efficiently.
            </p>
            <BookingCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
