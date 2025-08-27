import { notFound } from "next/navigation"
// import { generateBaseMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Phone, Clock, Star, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

// Enable ISR with 7 day revalidation for location pages
export const revalidate = 604800

const locationData = {
  ottawa: {
    name: 'Ottawa',
    region: 'Central Ottawa',
    description: 'Serving downtown Ottawa and surrounding core areas with premium barn door installation and custom closet solutions.',
    serviceAreas: ['Downtown', 'Centretown', 'The Glebe', 'Old Ottawa South', 'Westboro', 'Hintonburg'],
    landmarks: ['Parliament Hill', 'Byward Market', 'Rideau Centre', 'University of Ottawa'],
    driveTime: '15-30 minutes'
  },
  kanata: {
    name: 'Kanata',
    region: 'West Ottawa',
    description: 'Professional barn door installation serving Kanata\'s growing communities with expert craftsmanship and local knowledge.',
    serviceAreas: ['Kanata Lakes', 'Bridlewood', 'Glen Cairn', 'Katimavik', 'Morgan\'s Grant', 'Hazeldean'],
    landmarks: ['Tanger Outlets', 'Canadian Tire Centre', 'Kanata Town Centre'],
    driveTime: '20-40 minutes'
  },
  orleans: {
    name: 'Orleans',
    region: 'East Ottawa',
    description: 'Serving Orleans and eastern Ottawa communities with premium barn doors and professional installation services.',
    serviceAreas: ['Chapel Hill', 'Fallingbrook', 'Blackburn Hamlet', 'Avalon', 'Trim', 'Navan'],
    landmarks: ['Place d\'Orleans', 'Petrie Island', 'Orleans Recreation Complex'],
    driveTime: '25-45 minutes'
  },
  nepean: {
    name: 'Nepean',
    region: 'South Ottawa',
    description: 'Expert barn door installation throughout Nepean, bringing quality craftsmanship to established and new communities.',
    serviceAreas: ['Barrhaven', 'Riverside South', 'Manotick', 'Bells Corners', 'Centrepointe'],
    landmarks: ['Rideau Carleton Raceway', 'Nepean Sportsplex', 'South Keys Shopping'],
    driveTime: '20-35 minutes'
  },
  gloucester: {
    name: 'Gloucester',
    region: 'Southeast Ottawa',
    description: 'Professional barn door services for Gloucester communities, combining local expertise with premium Renin products.',
    serviceAreas: ['Hunt Club', 'South Gloucester', 'Leitrim', 'Riverside South', 'Findlay Creek'],
    landmarks: ['Gloucester Centre', 'Hunt Club Community Centre', 'South Gloucester Recreation Complex'],
    driveTime: '25-40 minutes'
  },
  barrhaven: {
    name: 'Barrhaven',
    region: 'Southwest Ottawa',
    description: 'Serving Barrhaven\'s family-friendly communities with custom barn doors and professional installation services.',
    serviceAreas: ['Stonebridge', 'Half Moon Bay', 'Chapman Mills', 'Riverside South', 'Greenbank'],
    landmarks: ['Barrhaven Town Centre', 'Walter Baker Sports Centre', 'Minto Recreation Complex'],
    driveTime: '30-45 minutes'
  }
}

// Generate static params for all locations
export async function generateStaticParams() {
  return Object.keys(locationData).map(city => ({ city }))
}

// Generate metadata for each location
export async function generateMetadata({
  params
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const location = locationData[city as keyof typeof locationData]
  
  if (!location) {
    return {
      title: 'Location Not Found | PG Closets',
      description: 'The requested location could not be found.'
    }
  }

  const title = `Barn Doors ${location.name} - Professional Installation | PG Closets Ottawa`
  const description = `${location.description} Premium Renin barn doors with expert installation in ${location.name}. Free consultation available.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/locations/${city}`,
      images: ['/renin_images/barn_doors/gatsby-chevron-white-main.jpg']
    }
  }
}

export default async function LocationPage({
  params
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const location = locationData[city as keyof typeof locationData]
  
  if (!location) {
    notFound()
  }

  // Generate schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_SITE_URL || '' },
      { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": `${process.env.NEXT_PUBLIC_SITE_URL}/locations` },
      { "@type": "ListItem", "position": 3, "name": location.name, "item": `${process.env.NEXT_PUBLIC_SITE_URL}/locations/${city}` }
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "PG Closets",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "telephone": "+1-613-555-0123",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/locations/${city}`
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Barn Door Installation in {location.name}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            {location.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <MapPin className="h-5 w-5" />
            <span>{location.region} • {location.driveTime} from our workshop</span>
          </div>
        </div>

        {/* Service Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Local Expertise
              </h3>
              <p className="text-slate-600">
                Deep knowledge of {location.name} homes and architectural styles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Fast Response
              </h3>
              <p className="text-slate-600">
                Same-day quotes and flexible scheduling for {location.name} residents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Local Support
              </h3>
              <p className="text-slate-600">
                Ongoing support and maintenance for {location.name} installations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Areas */}
        <div className="bg-slate-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Service Areas in {location.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {location.serviceAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">{area}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Popular Landmarks Near Our Service Area:</h3>
            <p className="text-slate-600">
              {location.landmarks.join(' • ')}
            </p>
          </div>
        </div>

        {/* Why Choose PG Closets in Location */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Why {location.name} Homeowners Choose PG Closets
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Local Knowledge & Experience
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Understanding of {location.name} home styles and architecture</li>
                <li>• Familiar with local building codes and requirements</li>
                <li>• Established relationships with {location.name} contractors</li>
                <li>• Quick response times throughout {location.region}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Premium Products & Service
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Authorized Renin dealer with full product warranty</li>
                <li>• Professional installation by certified technicians</li>
                <li>• Free in-home consultation and measurements</li>
                <li>• Comprehensive 2-year installation warranty</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg p-8 text-white mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl italic mb-4">
              "PG Closets transformed our {location.name} home with beautiful barn doors. The installation was professional and the quality is outstanding. Highly recommend to any {location.name} homeowner!"
            </blockquote>
            <p className="text-slate-300">
              - Sarah M., {location.name} Resident
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Transform Your {location.name} Home?
          </h3>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Get a free consultation and quote for your barn door project. 
            Same-day response for {location.name} area residents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Free Consultation
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/store">
              <Button size="lg" variant="outline">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-slate-500">
            Serving {location.name} • {location.driveTime} response time • Licensed & Insured
          </div>
        </div>
      </div>
    </>
  )
}