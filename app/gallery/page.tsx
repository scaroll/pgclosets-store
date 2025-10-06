import { MediaGallery } from "../../components/MediaGallery"
import PgHeader from "../../PgHeader"
import Link from "next/link"
import Button from '@/components/ui/Button-new'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import Section from '@/components/ui/Section-new'

export const metadata = {
  title: "Project Gallery | PG Closets Ottawa",
  description: "Browse our installed closet and door projects across Ottawa. Real homes, premium workmanship.",
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <PgHeader />

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Heading level={1} className="mb-4 text-[#1B4A9C]">
              Project Gallery
            </Heading>
            <Text size="lg" variant="secondary" className="max-w-3xl mx-auto">
              See how we've transformed Ottawa homes with premium closet doors. Over 500 successful installations
              showcasing our craftsmanship and attention to detail.
            </Text>
          </div>

          <Section variant="light" spacing="md" className="bg-gray-50 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">500+</div>
                <Text size="sm" variant="secondary">Completed Projects</Text>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">15+</div>
                <Text size="sm" variant="secondary">Years Experience</Text>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">5.0★</div>
                <Text size="sm" variant="secondary">Google Rating</Text>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">98%</div>
                <Text size="sm" variant="secondary">Satisfaction Rate</Text>
              </div>
            </div>
          </Section>

          <MediaGallery />

          <Section variant="dark" spacing="lg" className="bg-[#1B4A9C] text-white mt-12">
            <div className="text-center">
              <Heading level={2} className="text-white mb-4">
                Ready to Transform Your Space?
              </Heading>
              <Text size="lg" className="mb-6 text-[#9BC4E2]">
                Join 500+ satisfied Ottawa homeowners who chose PG Closets for their premium door solutions.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="primary" size="lg" className="bg-[#9BC4E2] text-[#1B4A9C] hover:bg-white">
                    Get Free Quote
                  </Button>
                </Link>
                <Link href="tel:6134225800">
                  <Button variant="secondary" size="lg" className="text-[#9BC4E2]">
                    Call (613) 422-5800
                  </Button>
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <footer className="bg-[#1B4A9C] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#9BC4E2] flex items-center justify-center text-[#1B4A9C] font-bold text-lg">
                  PG
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PG CLOSETS</h3>
                  <p className="text-[#9BC4E2]">Premium Solutions</p>
                </div>
              </Link>
              <Text variant="secondary" className="text-gray-300 mb-6">
                Ottawa&apos;s premier closet door specialists, transforming homes with premium solutions.
              </Text>
            </div>

            <div>
              <Heading level={4} className="text-lg mb-4 text-[#9BC4E2]">
                Sitemap
              </Heading>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-300 hover:text-white">
                  Home
                </Link>
                <Link href="/products" className="block text-gray-300 hover:text-white">
                  Products
                </Link>
                <Link href="/about" className="block text-gray-300 hover:text-white">
                  About
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-white">
                  Services
                </Link>
                <Link href="/contact" className="block text-gray-300 hover:text-white">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <Heading level={4} className="text-lg mb-4 text-[#9BC4E2]">
                Contact
              </Heading>
              <div className="space-y-2 text-gray-300">
                <div>(613) 422-5800</div>
                <div>info@pgclosets.com</div>
                <div>Ottawa & Surrounding Areas</div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <Text size="sm" variant="secondary">
                    <div className="font-semibold text-[#9BC4E2] mb-2">Business Hours:</div>
                    <div>Mon-Fri: 8:00 AM - 6:00 PM</div>
                    <div>Sat: 9:00 AM - 4:00 PM</div>
                    <div>Sun: By Appointment</div>
                  </Text>
                </div>
                <div className="mt-2">Licensed & Insured</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400">
            <Text size="sm" variant="muted">&copy; 2025 PG Closets. All rights reserved.</Text>
          </div>
        </div>
      </footer>
    </div>
  )
}
