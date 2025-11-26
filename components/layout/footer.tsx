"use client"

import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BUSINESS_INFO } from "@/lib/business-config"
import { useState } from "react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Barn Doors", href: "/collections/barn-doors" },
    { name: "Bifold Doors", href: "/collections/bifold-doors" },
    { name: "Hardware", href: "/collections/hardware" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ],
  support: [
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Warranty", href: "/warranty" },
    { name: "Installation", href: "/installation" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Accessibility", href: "/accessibility" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-semibold mb-2">Stay Inspired</h3>
            <p className="text-gray-400 mb-6">
              Get design tips, exclusive offers, and product updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{BUSINESS_INFO.name}</h3>
              <p className="text-sm text-gray-400">{BUSINESS_INFO.tagline}</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ottawa&apos;s premier Renin closet door specialists. Transforming homes with premium
              door solutions, professional installation, and exceptional service since 2010.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold mb-6 mt-8">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Phone className="h-5 w-5 mt-0.5 text-blue-500 group-hover:text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <div className="text-sm">{BUSINESS_INFO.phone}</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Mail className="h-5 w-5 mt-0.5 text-blue-500 group-hover:text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-sm">{BUSINESS_INFO.email}</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 mt-0.5 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Location</div>
                    <div className="text-sm leading-relaxed">
                      {BUSINESS_INFO.address.street}
                      <br />
                      {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.province}{" "}
                      {BUSINESS_INFO.address.postalCode}
                    </div>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <div className="text-xs text-gray-500 mb-2">Service Areas</div>
                <div className="text-sm text-gray-400 leading-relaxed">
                  {BUSINESS_INFO.serviceAreas.slice(0, 4).join(", ")}
                  {BUSINESS_INFO.serviceAreas.length > 4 && " & more"}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
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
