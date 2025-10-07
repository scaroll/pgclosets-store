import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import Section from '@/components/ui/Section-new'
import { Wrench, Shield, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Professional Installation Services | PG Closets',
  description: 'Certified installation technicians for closets and doors in Ottawa. Professional, efficient, and guaranteed workmanship.',
}

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section variant="dark" spacing="lg" className="bg-pg-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Heading level={1} className="text-white mb-6">
            Professional Installation
          </Heading>
          <Text size="lg" className="text-pg-primary-light mb-8">
            Certified technicians delivering flawless installation for your closet and door systems
          </Text>
        </div>
      </Section>

      {/* Features */}
      <Section spacing="lg">
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
              <Heading level={3} className="mb-3">
                {item.title}
              </Heading>
              <Text variant="secondary">{item.description}</Text>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="light" spacing="lg" className="bg-pg-secondary">
        <div className="text-center">
          <Heading level={2} className="mb-6">
            Schedule Your Installation
          </Heading>
          <Link href="/request-work">
            <Button size="lg" variant="primary">
              Get Started
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  )
}
