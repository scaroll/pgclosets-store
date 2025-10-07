import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench, Palette, Ruler } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Custom Solutions | Tailored Design | PG Closets',
  description: 'Custom closet and door solutions tailored to your specific needs. Unlimited design possibilities for your unique space.',
}

export default function CustomSolutionsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-6">Custom Solutions</h1>
        <p className="text-xl text-gray-700 mb-12">
          Every space is unique. Let us create a custom solution tailored specifically to your needs.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Ruler className="h-12 w-12 text-pg-accent" />,
              title: 'Precise Fit',
              description: 'Custom measurements ensure perfect integration with your space, regardless of size or shape.'
            },
            {
              icon: <Palette className="h-12 w-12 text-pg-accent" />,
              title: 'Unlimited Styles',
              description: 'Choose from countless finish options, door styles, and hardware to match your vision.'
            },
            {
              icon: <Wrench className="h-12 w-12 text-pg-accent" />,
              title: 'Expert Craftsmanship',
              description: 'Professional design and installation ensuring quality that lasts for years.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-pg-primary to-pg-accent text-white p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Custom Project</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Our design team will work with you to create a solution that perfectly fits your space,
            style, and budget.
          </p>
          <Link href="/request-work">
            <Button size="lg" variant="secondary">
              Get Free Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
