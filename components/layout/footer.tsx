'use client'

import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BUSINESS_INFO } from '@/lib/business-config'
import { useState } from 'react'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Barn Doors', href: '/collections/barn-doors' },
    { name: 'Bifold Doors', href: '/collections/bifold-doors' },
    { name: 'Hardware', href: '/collections/hardware' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ],
  support: [
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Installation', href: '/installation' },
    { name: 'Book Consultation', href: '/book-consultation' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000))

    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-2xl font-semibold">Stay Inspired</h3>
            <p className="mb-6 text-gray-400">
              Get design tips, exclusive offers, and product updates delivered to your inbox.
            </p>
            <form
              onSubmit={e => void handleNewsletterSubmit(e)}
              className="mx-auto flex max-w-md gap-3"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 px-6 text-white hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-2xl font-bold">{BUSINESS_INFO.name}</h3>
              <p className="text-sm text-gray-400">{BUSINESS_INFO.tagline}</p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Ottawa&apos;s premier Renin closet door specialists. Transforming homes with premium
              door solutions, professional installation, and exceptional service since 2010.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-blue-500"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-pink-500"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">Products</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mb-6 mt-8 text-lg font-semibold">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">Customer Service</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="group flex items-start gap-3 text-gray-400 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                  <div>
                    <div className="mb-1 text-xs text-gray-500">Email</div>
                    <div className="text-sm">{BUSINESS_INFO.email}</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="mt-0.5 h-5 w-5 text-blue-500" />
                  <div>
                    <div className="mb-1 text-xs text-gray-500">Location</div>
                    <div className="text-sm leading-relaxed">
                      {BUSINESS_INFO.address.street}
                      <br />
                      {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.province}{' '}
                      {BUSINESS_INFO.address.postalCode}
                    </div>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <div className="mb-2 text-xs text-gray-500">Service Areas</div>
                <div className="text-sm leading-relaxed text-gray-400">
                  {BUSINESS_INFO.serviceAreas.slice(0, 4).join(', ')}
                  {BUSINESS_INFO.serviceAreas.length > 4 && ' & more'}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {footerLinks.legal.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
