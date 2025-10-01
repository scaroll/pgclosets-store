"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import StandardLayout from "@/components/layout/StandardLayout";

// Dynamically import the contact form to reduce initial bundle size
const ContactForm = dynamic(
  () =>
    import("@/components/contact/ContactForm").then((mod) => ({
      default: mod.ContactForm,
    })),
  {
    loading: () => (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function ContactClientPage() {
  return (
    <StandardLayout className="bg-white font-sans">
      <div className="pt-20 pb-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>{" "}
            / <span className="text-slate-900 font-medium">Contact</span>
          </nav>
        </div>
      </div>

      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B4A9C] mb-4">
          Request Work
        </h1>
        <p className="mt-2 text-slate-600 mb-8">
          Use the form below to tell us about your project. Prefer email?{" "}
          <a
            className="underline text-[#1B4A9C] hover:text-[#9BC4E2]"
            href="mailto:info@pgclosets.com"
          >
            info@pgclosets.com
          </a>
        </p>

        <div className="mt-8 border border-slate-200 bg-white p-6 shadow-sm">
          <ContactForm />
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="mt-16 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                    alt="PG Closets Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PG CLOSETS</h3>
                  <p className="text-[#9BC4E2]">Premium Solutions</p>
                </div>
              </Link>
              <p className="text-gray-600 mb-6">
                Ottawa&apos;s premier closet door specialists, transforming
                homes with premium solutions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#1B4A9C]">
                Sitemap
              </h4>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-gray-600 hover:text-[#1B4A9C]"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="block text-gray-600 hover:text-[#1B4A9C]"
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-600 hover:text-[#1B4A9C]"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="block text-gray-600 hover:text-[#1B4A9C]"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 hover:text-[#1B4A9C]"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#1B4A9C]">
                Contact
              </h4>
              <div className="space-y-2 text-gray-600">
                <div>(613) 422-5800</div>
                <div>info@pgclosets.com</div>
                <div>Ottawa & Surrounding Areas</div>
                {/* Added business hours section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <div className="font-semibold text-[#1B4A9C] mb-2">
                      Business Hours:
                    </div>
                    <div>Mon-Fri: 8:00 AM - 6:00 PM</div>
                    <div>Sat: 9:00 AM - 4:00 PM</div>
                    <div>Sun: By Appointment</div>
                  </div>
                </div>
                <div className="mt-2">Licensed & Insured</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600 text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Link href="/privacy-policy" className="hover:text-[#1B4A9C]">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms-of-service" className="hover:text-[#1B4A9C]">
                Terms of Service
              </Link>
              <span>|</span>
              <Link href="/return-policy" className="hover:text-[#1B4A9C]">
                Return Policy
              </Link>
            </div>
            <p className="mb-2">&copy; 2024 PG Closets. All rights reserved.</p>
            <p className="text-xs text-gray-500">
              Premium closet door solutions for Ottawa homes and businesses.
            </p>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}
