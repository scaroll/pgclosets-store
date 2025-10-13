import { Metadata } from 'next'
import { Shield, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Warranty & Support | PG Closets',
  description: 'Comprehensive warranty coverage for your closet and door investment. Industry-leading protection and dedicated support.',
}

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-pg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Warranty & Support
            </h1>
            <p className="text-xl text-pg-primary-light">
              Comprehensive protection for your investment
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Our Warranty Coverage</h2>

          <div className="space-y-6">
            {[
              {
                title: 'Limited Lifetime Warranty on Products',
                description: 'All Renin and PG Closets branded products include manufacturer warranty coverage against defects in materials and workmanship.'
              },
              {
                title: '2-Year Installation Warranty',
                description: 'Our professional installation is guaranteed for 5 years from completion date, covering all labor and adjustments.'
              },
              {
                title: 'Hardware Guarantee',
                description: 'All hardware components including tracks, rollers, and mounting systems are covered for 5 years.'
              },
              {
                title: 'Dedicated Support',
                description: 'Our customer service team is available to address any questions or concerns about your installation.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-gray-50 p-6 rounded-lg">
                <CheckCircle className="h-6 w-6 text-pg-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-pg-secondary p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Need Warranty Service?</h3>
            <p className="text-gray-700 mb-6">
              Contact our support team via email at{' '}
              <a href="mailto:info@pgclosets.ca" className="text-pg-accent hover:underline">
                info@pgclosets.ca
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
