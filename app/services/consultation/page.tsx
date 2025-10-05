import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Design Consultation Services | PG Closets',
  description: 'Expert design consultation for your custom closet and door project in Ottawa. Free in-home measurements and design advice.',
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-pg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expert Design Consultation
            </h1>
            <p className="text-xl text-pg-primary-light mb-8">
              Transform your space with personalized design guidance from our experienced team
            </p>
            <Link href="/request-work">
              <Button size="lg" variant="secondary" className="font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <MessageSquare className="h-12 w-12 text-pg-accent" />,
                title: 'Design Discussion',
                description: 'One-on-one meeting to understand your vision, style preferences, and functional needs'
              },
              {
                icon: <CheckCircle2 className="h-12 w-12 text-pg-accent" />,
                title: 'Space Assessment',
                description: 'Professional measurements and evaluation of your space, including structural considerations'
              },
              {
                icon: <Calendar className="h-12 w-12 text-pg-accent" />,
                title: 'Custom Proposal',
                description: 'Detailed quote with product recommendations, timeline, and 3D renderings of your project'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your free consultation today and let's bring your vision to life
          </p>
          <Link href="/request-work">
            <Button size="lg" variant="default">
              Request Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
