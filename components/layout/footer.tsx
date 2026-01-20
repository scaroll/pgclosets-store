'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react'
import { NewsletterSignup } from '@/features/newsletter-signup'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: 'Barn Doors', href: '/collections/barn-doors' },
    { name: 'Bifold Doors', href: '/collections/bifold-doors' },
    { name: 'Bypass Doors', href: '/collections/bypass-doors' },
    { name: 'Glass Doors', href: '/collections/glass-doors' },
    { name: 'Pivot Doors', href: '/collections/pivot-doors' },
    { name: 'All Products', href: '/products' },
  ]

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Warranty', href: '/warranty' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  const serviceLinks = [
    { name: 'Free Consultation', href: '/book-measure' },
    { name: 'Get a Quote', href: '/quote' },
    { name: 'Installation', href: '/services/installation' },
    { name: 'Custom Designs', href: '/services/custom' },
  ]

  const serviceAreas = [
    'Ottawa Downtown',
    'Kanata',
    'Barrhaven',
    'Orleans',
    'Nepean',
    'Gloucester',
    'Stittsville',
    'Manotick',
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold">PG Closets</span>
              <span className="block text-sm text-gray-400 mt-1">Premium Door Solutions</span>
            </Link>

            <p className="text-gray-400 mb-6 max-w-md">
              Ottawa&apos;s trusted source for premium closet doors, barn doors, and custom storage solutions.
              Transform your space with our expert design and professional installation services.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+16137016393"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-semibold">(613) 701-6393</span>
              </a>
              <a
                href="mailto:info@pgclosets.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>info@pgclosets.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Ottawa, ON, Canada</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="h-5 w-5 text-primary" />
                <span>Mon-Fri: 9AM-6PM | Sat: 10AM-4PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com/pgclosets"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/pgclosets"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/pgclosets"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-4 mt-8">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2 mb-8">
              {serviceAreas.map((area) => (
                <li key={area} className="text-gray-400 text-sm">
                  {area}
                </li>
              ))}
            </ul>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get design tips & exclusive offers
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} PG Closets. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
