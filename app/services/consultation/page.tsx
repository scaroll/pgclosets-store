import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button-new'
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
      {/* Hero Section */}
      <Section variant="dark" spacing="lg" className="bg-pg-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Heading level={1} className="text-white mb-6">
            Expert Design Consultation
          </Heading>
          <Text size="lg" className="text-pg-primary-light mb-8">
            Transform your space with personalized design guidance from our experienced team
          </Text>
          <Link href="/request-work">
            <Button size="lg" variant="secondary">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Free Consultation
            </Button>
          </Link>
        </div>
      </Section>

      {/* What's Included */}
      <Section spacing="lg">
        <Heading level={2} className="text-center mb-12">
          What's Included
        </Heading>
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
            Ready to Get Started?
          </Heading>
          <Text size="lg" variant="secondary" className="mb-8 max-w-2xl mx-auto">
            Book your free consultation today and let's bring your vision to life
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
