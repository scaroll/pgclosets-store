'use client'

import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, Send, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BUSINESS_INFO } from '@/lib/business-config'
import { useState } from 'react'

const footerLinks = {
  products: [
    { name: 'All Products', href: '/products' },
    { name: 'Barn Doors', href: '/collections/barn-doors' },
    { name: 'Bypass Doors', href: '/collections/bypass-doors' },
    { name: 'Bifold Doors', href: '/collections/bifold-doors' },
    { name: 'Hardware', href: '/collections/hardware' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
    <footer className="bg-slate-900 text-slate-100">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-xl text-center">
            <Mail className="mx-auto mb-4 h-10 w-10 text-bronze-400" />
            <h3 className="mb-3 text-xl font-light tracking-tight">Stay Inspired</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Get design tips, exclusive offers, and product updates delivered to your inbox.
            </p>
            <form
              onSubmit={e => void handleNewsletterSubmit(e)}
              className="mx-auto flex max-w-md gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="rounded border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-bronze-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-bronze-500 px-5 text-white hover:bg-bronze-600"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">{isSubmitting ? 'Sending...' : 'Subscribe'}</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="space-y-5 lg:col-span-2">
            <div>
              <h3 className="mb-1 text-lg font-medium text-white">{BUSINESS_INFO.name}</h3>
              <p className="text-sm text-slate-400">{BUSINESS_INFO.tagline}</p>
            </div>

            {/* Renin Dealer Badge */}
            <div className="inline-flex items-center gap-2 rounded border border-bronze-700 bg-bronze-900/30 px-3 py-2">
              <Award className="h-5 w-5 text-bronze-400" />
              <div>
                <div className="text-xs font-medium text-bronze-300">Official Renin Dealer</div>
                <div className="text-xs text-slate-500">Authorized Sales &amp; Installation</div>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Ottawa&apos;s premier Renin closet door specialists. Professional installation and
              exceptional service.
            </p>

            <div className="flex gap-3 pt-1">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-bronze-400"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-bronze-400"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-5 text-sm font-medium uppercase tracking-wide text-white">
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 text-sm font-medium uppercase tracking-wide text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mb-5 mt-8 text-sm font-medium uppercase tracking-wide text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-5 text-sm font-medium uppercase tracking-wide text-white">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="group flex items-start gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 text-bronze-500 group-hover:text-bronze-400" />
                  <span className="text-sm">{BUSINESS_INFO.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-slate-400">
                  <MapPin className="mt-0.5 h-4 w-4 text-bronze-500" />
                  <div className="text-sm leading-relaxed">
                    {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.province}
                  </div>
                </div>
              </li>
              <li className="pt-3">
                <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                  Service Areas
                </div>
                <div className="text-sm text-slate-400">
                  {BUSINESS_INFO.serviceAreas.slice(0, 4).join(', ')}
                  {BUSINESS_INFO.serviceAreas.length > 4 && ' & more'}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-5 text-xs">
              {footerLinks.legal.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-500 transition-colors hover:text-white"
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
