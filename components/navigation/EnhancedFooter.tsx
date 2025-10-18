"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  CheckCircle2,
  Shield,
  Award,
  Users,
  Calendar,
  ArrowUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PGLogo } from "../ui/pg-logo"

const footerSections = [
  {
    title: "Products",
    links: [
      { label: "Barn Doors", href: "/collections/renin-barn-doors" },
      { label: "Bypass Doors", href: "/collections/renin-bypass-doors" },
      { label: "Bifold Doors", href: "/collections/renin-bifold-doors" },
      { label: "Closet Doors", href: "/collections/renin-closet-doors" },
      { label: "Hardware", href: "/collections/hardware" },
      { label: "All Products", href: "/products" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Design Consultation", href: "/services/consultation" },
      { label: "Custom Design", href: "/services/custom-design" },
      { label: "Installation", href: "/services/installation" },
      { label: "Warranty Info", href: "/services/warranty" },
      { label: "Maintenance Tips", href: "/services/maintenance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Get Free Quote", href: "/request-work" },
      { label: "Track Order", href: "/track-order" },
      { label: "Returns", href: "/returns" },
      { label: "Shipping Info", href: "/shipping" },
    ],
  },
]

const trustBadges = [
  { icon: Shield, text: "BBB A+ Rated", color: "text-green-400" },
  { icon: Award, text: "Licensed & Insured", color: "text-yellow-400" },
  { icon: Users, text: "500+ Happy Customers", color: "text-blue-400" },
  { icon: Calendar, text: "15+ Years Experience", color: "text-purple-400" },
]

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/sitemap" },
]

export function EnhancedFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubscribed(true)
    setIsLoading(false)
    setEmail("")

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden" role="contentinfo">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8">
            {/* Company Info - Spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Link href="/" className="inline-flex items-center gap-2 group">
                  <PGLogo
                    width={40}
                    height={40}
                    withWordmark={false}
                    className="text-white group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-[0.2em] bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      PG CLOSETS
                    </span>
                    <span className="text-[10px] text-amber-400/60 font-medium uppercase tracking-widest">
                      Ottawa's Premier Closet Specialists
                    </span>
                  </div>
                </Link>
              </div>

              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Transforming Ottawa homes with premium closet solutions since 2010. Quality craftsmanship, expert
                design, and exceptional service.
              </p>

              {/* Trust Badges */}
              <div className="space-y-2">
                {trustBadges.map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 text-xs text-slate-300">
                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Contact Quick Links */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <a
                  href="tel:+16137016393"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (613) 701-6393
                </a>
                <a
                  href="mailto:info@pgclosets.com"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@pgclosets.com
                </a>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  Ottawa & Surrounding Areas
                </div>
              </div>
            </div>

            {/* Navigation Sections - Each spans 1 column */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                  {section.title}
                </h4>
                <nav className="space-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-slate-400 font-light hover:text-white transition-all duration-300 hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Newsletter & Social - Full Width Section */}
          <div className="mt-12 pt-12 border-t border-slate-800">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Newsletter */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">
                  Stay Updated
                </h4>
                <p className="text-slate-400 font-light text-sm mb-4 leading-relaxed">
                  Subscribe for design inspiration, exclusive offers, and the latest updates.
                </p>

                {!subscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20"
                      aria-label="Email for newsletter"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-amber-400 text-black hover:bg-amber-500 font-medium whitespace-nowrap"
                    >
                      {isLoading ? (
                        "..."
                      ) : (
                        <>
                          Subscribe <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-3 rounded-md border border-green-400/20">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">Successfully subscribed!</span>
                  </div>
                )}
              </div>

              {/* Social & Hours */}
              <div className="space-y-6">
                {/* Business Hours */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-3 text-white">
                    <Clock className="w-4 h-4" />
                    Business Hours
                  </div>
                  <div className="space-y-1 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Mon-Fri:</span>
                      <span className="text-slate-300">8AM - 6PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="text-slate-300">9AM - 4PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-slate-500">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300 hover:scale-110"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 font-light text-sm text-center md:text-left">
              © {currentYear} PG Closets. All rights reserved. Quality closet solutions for Ottawa homeowners.
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Legal navigation">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-500 font-light text-sm hover:text-white transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 z-30 lg:bottom-6"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  )
}
