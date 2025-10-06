import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StandardLayout from "@/components/layout/StandardLayout";
import Button from '@/components/ui/Button-new';
import Heading from '@/components/ui/Heading-new';
import Text from '@/components/ui/Text-new';
import Section from '@/components/ui/Section-new';

export const metadata: Metadata = {
  title:
    "Professional Closet Door Services Ottawa | Installation & Consultation | PG Closets",
  description:
    "Expert closet door installation, consultation, and custom solutions in Ottawa. Free in-home consultation, professional installation, lifetime warranty. Serving Ottawa, Kanata, Nepean, Orleans, Barrhaven.",
  keywords:
    "closet door installation Ottawa, professional door installation, custom closet solutions, home consultation Ottawa, door repair services, closet renovation Ottawa",
  openGraph: {
    title: "Professional Closet Door Services Ottawa | PG Closets",
    description:
      "Expert closet door installation and consultation services in Ottawa. Free consultation, professional installation, lifetime warranty.",
    images: [
      {
        url: "/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <StandardLayout>
      <main className="bg-gray-50">
        {/* Hero Section with Luxury Design */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg"
              alt="Professional closet door installation showcase"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-6">
              <Text size="xs" variant="secondary" className="inline-block uppercase tracking-widest mb-4">
                Professional Excellence
              </Text>
              <Heading level={1} className="text-white mb-6">
                Luxury Closet Door
                <br />
                <span className="text-slate-200">Services</span>
              </Heading>
              <Text size="lg" variant="secondary" className="max-w-2xl mx-auto mb-8">
                Expert installation • Custom solutions • Lifetime warranty
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" className="bg-slate-900 hover:opacity-90">
                  <Link href="/contact">Get Free Consultation</Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link href="/products">Browse Collection</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid with Luxury Styling */}
        <Section spacing="lg">
          <div className="text-center mb-16">
            <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
              Our Services
            </Text>
            <Heading level={2} className="mb-4" balance>
              Our Services
            </Heading>
            <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
              Comprehensive closet door solutions from consultation to
              installation
            </Text>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Installation Service */}
              <div className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg"
                    alt="Professional closet door installation"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900 text-white px-3 py-1 text-xs font-light tracking-widest uppercase">
                    Premium
                  </div>
                </div>
                <div className="p-6">
                  <Heading level={3} className="mb-3 uppercase">
                    Professional Installation
                  </Heading>
                  <Text variant="secondary" className="mb-4">
                    Expert installation of all Renin closet door systems with
                    precision and care. Our certified installers ensure perfect
                    fit and function.
                  </Text>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6 font-light">
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Certified installers
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Lifetime warranty
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Clean-up included
                    </li>
                  </ul>
                  <Link href="/contact" className="w-full">
                    <Button variant="primary" className="w-full" size="md">
                      Schedule Installation
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Consultation Service */}
              <div className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg"
                    alt="Free home consultation service"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900 text-white px-3 py-1 text-xs font-light tracking-widest uppercase">
                    Free
                  </div>
                </div>
                <div className="p-6">
                  <Heading level={3} className="mb-3 uppercase">
                    Free Consultation
                  </Heading>
                  <Text variant="secondary" className="mb-4">
                    In-home consultation to assess your space, discuss options,
                    and provide instant CAD pricing for your project.
                  </Text>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6 font-light">
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      No obligation
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Instant pricing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Design recommendations
                    </li>
                  </ul>
                  <Link href="/contact" className="w-full">
                    <Button variant="secondary" className="w-full" size="md">
                      Book Consultation
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Custom Solutions */}
              <div className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="/images/arcat/renin_176732_hd.jpg"
                    alt="Custom closet door solutions"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900 text-white px-3 py-1 text-xs font-light tracking-widest uppercase">
                    Custom
                  </div>
                </div>
                <div className="p-6">
                  <Heading level={3} className="mb-3 uppercase">
                    Custom Solutions
                  </Heading>
                  <Text variant="secondary" className="mb-4">
                    Tailored closet door solutions for unique spaces, including
                    custom sizing, finishes, and hardware configurations.
                  </Text>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6 font-light">
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Custom sizing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Unique finishes
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Special hardware
                    </li>
                  </ul>
                  <Link href="/contact" className="w-full">
                    <Button variant="primary" className="w-full" size="md">
                      Discuss Custom Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
        </Section>

        {/* Process Section with Luxury Typography */}
        <Section spacing="lg" variant="light">
          <div className="text-center mb-16">
            <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
              Our Process
            </Text>
            <Heading level={2} className="mb-4" balance>
              Our Process
            </Heading>
            <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
              Simple, transparent process from consultation to completion
            </Text>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Consultation",
                  description: "Free in-home consultation and measurement",
                  image: "/images/arcat/renin_176733_hd.jpg",
                },
                {
                  step: "2",
                  title: "Design",
                  description: "Product selection and instant CAD pricing",
                  image: "/images/arcat/renin_176737_hd.jpg",
                },
                {
                  step: "3",
                  title: "Manufacturing",
                  description: "Custom manufacturing and quality control",
                  image: "/images/arcat/renin_192861_hd.jpg",
                },
                {
                  step: "4",
                  title: "Installation",
                  description: "Professional installation and final inspection",
                  image: "/images/arcat/renin_205723_hd.jpg",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-lg border border-slate-200">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-light text-sm">
                      {item.step}
                    </div>
                  </div>
                  <Heading level={3} className="mb-2 uppercase text-center">
                    {item.title}
                  </Heading>
                  <Text variant="secondary" className="text-center">
                    {item.description}
                  </Text>
                </div>
              ))}
            </div>
        </Section>

        {/* CTA Section with Luxury Styling */}
        <Section spacing="lg" variant="dark" className="bg-slate-900">
          <div className="text-center">
            <Heading level={2} className="text-white mb-6" balance>
              Ready to Get Started?
            </Heading>
            <Text size="lg" className="mb-8 max-w-2xl mx-auto text-slate-200">
              Transform your space with premium Renin closet doors. Free
              consultation, transparent pricing, lifetime warranty.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                  Schedule Free Consultation
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" size="lg" className="text-white">
                  Browse Collection
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-300 font-light">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5 Rating</span>
              </div>
              <div className="text-slate-500">•</div>
              <div>500+ Happy Customers</div>
              <div className="text-slate-500">•</div>
              <div>Lifetime Warranty</div>
            </div>
          </div>
        </Section>
      </main>
    </StandardLayout>
  );
}
