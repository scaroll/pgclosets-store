import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import Section from '@/components/ui/Section-new'
import { Calendar, CheckCircle2, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Design Consultation Services | PG Closets',
  description: 'Expert design consultation for your custom closet and door project in Ottawa. Free in-home measurements and design advice.',
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Image */}
      <Section variant="dark" spacing="lg" className="bg-pg-primary text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/professional-closet-consultation.png"
            alt="Professional closet design consultation"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-pg-primary/80 to-pg-primary/90" />

        {/* Content */}
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Heading level={1} className="text-white mb-6">
            Expert Design Consultation
          </Heading>
          <Text size="lg" className="text-pg-primary-light mb-8">
            Transform your space with personalized design guidance from our experienced team
          </Text>
          <Link href="/request-work">
            <Button size="lg" variant="secondary">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Free Online Quote
            </Button>
          </Link>
        </div>
      </Section>

      {/* What's Included */}
      <Section spacing="lg">
        <Heading level={2} className="text-center mb-12">
          What's Included
        </Heading>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
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
              <Heading level={3} className="mb-3">
                {item.title}
              </Heading>
              <Text variant="secondary">{item.description}</Text>
            </div>
          ))}
        </div>

        {/* Process Images */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/team-consultation-meeting.png"
              alt="Design team meeting with client during consultation"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/team-design-planning.png"
              alt="Professional design planning and space assessment"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="light" spacing="lg" className="bg-pg-secondary">
        <div className="text-center">
          <Heading level={2} className="mb-6">
            Ready to Get Started?
          </Heading>
          <Text size="lg" variant="secondary" className="mb-8 max-w-2xl mx-auto">
            Book your free online quote today and let's bring your vision to life
          </Text>
          <Link href="/request-work">
            <Button size="lg" variant="primary">
              Request Consultation
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  )
}
