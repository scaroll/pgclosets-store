"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Clock, Phone, Facebook, Instagram, Linkedin, Send, CheckCircle2, Shield, Award, Users, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Comprehensive Footer Component for PG Closets
 *
 * Features:
 * - Site map navigation
 * - Contact information
 * - Trust badges and certifications
 * - Social media links
 * - Newsletter signup
 * - Minimal, professional design
 */
export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubscribed(true);
    setIsLoading(false);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Company Info Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  PG CLOSETS
                </h3>
                <p className="text-xs text-amber-400/60 font-medium uppercase tracking-widest">
                  Quality Closets for Ottawa
                </p>
              </div>

              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Ottawa's premier closet door specialists, transforming homes with quality solutions since 2010.
              </p>

              {/* Trust Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>BBB A+ Rated</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>500+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>15+ Years Experience</span>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-white">
                Quick Links
              </h4>
              <nav className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "Products" },
                  { href: "/services", label: "Services" },
                  { href: "/about", label: "About Us" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/contact", label: "Contact" },
                  { href: "/request-work", label: "Get a Quote" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group text-sm"
                  >
                    <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                      →
                    </span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info Column */}
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-white">
                Get In Touch
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <a
                      href="mailto:info@pgclosets.com"
                      className="hover:text-white transition-colors duration-300 block"
                    >
                      info@pgclosets.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <a
                      href="tel:+16134225800"
                      className="hover:text-white transition-colors duration-300 block"
                    >
                      (613) 422-5800
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>Ottawa & Surrounding Areas</span>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Business Hours
                    </p>
                    <p>Mon-Fri: 8AM - 6PM</p>
                    <p>Sat: 9AM - 4PM</p>
                    <p className="text-slate-500">Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup Column */}
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-white">
                Stay Updated
              </h4>
              <p className="text-slate-400 font-light text-sm mb-4 leading-relaxed">
                Subscribe to our newsletter for design tips, exclusive offers, and the latest updates.
              </p>

              {!subscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-400 text-black hover:bg-amber-500 border-amber-400 hover:border-amber-500 font-medium"
                  >
                    {isLoading ? (
                      "Subscribing..."
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

              {/* Social Media Links */}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
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

            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/privacy-policy"
                className="text-slate-500 font-light text-sm hover:text-white transition-all duration-300 relative group"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/terms-of-service"
                className="text-slate-500 font-light text-sm hover:text-white transition-all duration-300 relative group"
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/accessibility"
                className="text-slate-500 font-light text-sm hover:text-white transition-all duration-300 relative group"
              >
                Accessibility
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/sitemap"
                className="text-slate-500 font-light text-sm hover:text-white transition-all duration-300 relative group"
              >
                Sitemap
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
