import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Products',
      links: [
        { label: 'Barn Doors', href: '/products?type=barn' },
        { label: 'Bifold Doors', href: '/products?type=bifold' },
        { label: 'Bypass Doors', href: '/products?type=bypass' },
        { label: 'Hardware', href: '/products?category=hardware' },
        { label: 'All Products', href: '/products' }
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Design Consultation', href: '/services/consultation' },
        { label: 'Professional Installation', href: '/services/installation' },
        { label: 'Custom Solutions', href: '/services/custom' },
        { label: 'Warranty Support', href: '/services/warranty' },
        { label: 'Maintenance', href: '/services/maintenance' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Story', href: '/about/story' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Reviews', href: '/reviews' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Installation Guide', href: '/guides/installation' },
        { label: 'Care Instructions', href: '/guides/care' },
        { label: 'Returns', href: '/returns' }
      ]
    }
  ]

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/pgclosets',
      icon: Facebook
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/pgclosets',
      icon: Instagram
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/pgclosets',
      icon: Linkedin
    }
  ]

  return (
    <footer className="bg-pg-navy text-white" role="contentinfo">
      <div className="container-apple">

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link
                  href="/"
                  className="group flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:ring-offset-pg-navy rounded-lg p-1 w-fit"
                  aria-label="PG Closets - Home"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-white to-pg-sky rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                    <span className="text-pg-navy font-bold text-lg">PG</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">PG Closets</h2>
                    <p className="text-sm text-pg-sky -mt-1">Premium Doors</p>
                  </div>
                </Link>
              </div>

              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Ottawa's trusted closet door specialists since 2010. We transform homes with premium Renin closet doors,
                professional installation, and exceptional customer service.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-pg-sky flex-shrink-0" />
                  <span>(613) 555-0123</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-pg-sky flex-shrink-0" />
                  <span>info@pgclosets.com</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-pg-sky flex-shrink-0 mt-0.5" />
                  <span>123 Business St<br />Ottawa, ON K1A 0A1</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-pg-sky flex-shrink-0" />
                  <span>Mon-Fri 9AM-5PM, Sat 10AM-4PM</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:ring-offset-pg-navy"
                        aria-label={`Follow us on ${social.label}`}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold mb-4 text-white">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

            {/* Copyright */}
            <div className="text-sm text-gray-300">
              <p>© {currentYear} PG Closets. All rights reserved.</p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:underline"
              >
                Accessibility
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:underline"
              >
                Sitemap
              </Link>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-400">
                <p>Licensed • Insured • Bonded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schema.org structured data for footer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PG Closets",
              "url": "https://pgclosets.com",
              "logo": "https://pgclosets.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-613-555-0123",
                "contactType": "customer service",
                "email": "info@pgclosets.com",
                "availableLanguage": ["English", "French"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Business St",
                "addressLocality": "Ottawa",
                "addressRegion": "ON",
                "postalCode": "K1A 0A1",
                "addressCountry": "CA"
              },
              "sameAs": [
                "https://www.facebook.com/pgclosets",
                "https://www.instagram.com/pgclosets",
                "https://www.linkedin.com/company/pgclosets"
              ]
            })
          }}
        />
      </div>
    </footer>
  )
}

export default Footer