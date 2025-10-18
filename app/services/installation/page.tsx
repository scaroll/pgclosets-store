import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
      {/* Hero Section with Image */}
      <Section variant="dark" spacing="lg" className="bg-pg-primary text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/installation-team-at-work.png"
            alt="Professional closet installation team at work"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-pg-primary/80 to-pg-primary/90" />

        {/* Content */}
        <div className="max-w-3xl mx-auto text-center relative z-10">
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
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
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

        {/* Installation Process Images */}
        <Heading level={2} className="text-center mb-8">Our Installation Process</Heading>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/installation-measuring-space.png"
              alt="Precise measurement during installation"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <Text className="text-white font-semibold">1. Precise Measurement</Text>
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/installation-door-mounting.png"
              alt="Professional door mounting and installation"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <Text className="text-white font-semibold">2. Expert Installation</Text>
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/installation-quality-check.png"
              alt="Final quality inspection and walkthrough"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <Text className="text-white font-semibold">3. Quality Inspection</Text>
            </div>
          </div>
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
