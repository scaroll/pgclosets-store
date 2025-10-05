import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench, Shield, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Professional Installation Services | PG Closets',
  description: 'Certified installation technicians for closets and doors in Ottawa. Professional, efficient, and guaranteed workmanship.',
}

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-pg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Installation
            </h1>
            <p className="text-xl text-pg-primary-light mb-8">
              Certified technicians delivering flawless installation for your closet and door systems
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Wrench className="h-12 w-12 text-pg-accent" />,
                title: 'Expert Technicians',
                description: 'Fully certified installers with years of experience in custom closets and door systems'
              },
              {
                icon: <Clock className="h-12 w-12 text-pg-accent" />,
                title: 'Timely Completion',
                description: 'Efficient installation process completed on schedule with minimal disruption'
              },
              {
                icon: <Shield className="h-12 w-12 text-pg-accent" />,
                title: 'Quality Guaranteed',
                description: 'Comprehensive warranty coverage on both products and installation workmanship'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Schedule Your Installation</h2>
          <Link href="/request-work">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
