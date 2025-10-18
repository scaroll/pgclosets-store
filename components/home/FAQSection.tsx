"use client"

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faqs = [
  {
    question: "How much does a custom closet installation cost in Ottawa?",
    answer:
      "Custom closet costs vary based on size, materials, and features. Our reach-in closets typically start around $1,500-$3,000, while walk-in closets range from $3,000-$8,000+. We offer free online quotes where we measure your space and provide a detailed quote with no obligation. Professional installation, lifetime warranty, and design services are included in all our pricing.",
  },
  {
    question: "How long does closet installation take from consultation to completion?",
    answer:
      "The typical timeline is 2-3 weeks from initial consultation to installation. This includes: free online quote and measurement (same week), custom design and quote approval (2-3 days), manufacturing your custom closet (1-2 weeks), and professional installation (1 day for most projects). We guarantee your installation date and work around your schedule for minimal disruption.",
  },
  {
    question: "Do you offer a warranty on your closet systems?",
    answer:
      "Yes! We stand behind our work with a comprehensive lifetime warranty on all materials and hardware. Our closet systems are built with premium-grade materials designed to last for decades. We also provide a 1-year workmanship guarantee on all installations. If you experience any issues with your closet, we'll make it right at no additional cost.",
  },
  {
    question: "What areas do you service in the Ottawa region?",
    answer:
      "We proudly serve Ottawa and surrounding areas including Kanata, Barrhaven, Nepean, Orleans, Stittsville, Manotick, Rockland, and surrounding communities within a 50km radius of downtown Ottawa. We offer free online quotes throughout our entire service area. If you're outside this area, contact us – we may still be able to help with larger projects.",
  },
  {
    question: "Can you work with my existing closet space or do I need renovation work?",
    answer:
      "Our custom closet systems are designed to maximize your existing space without requiring major renovations. We work within your current closet dimensions and can adapt to unique layouts, sloped ceilings, awkward corners, and other challenges. In most cases, no structural changes are needed. During your free online quote, we'll assess your space and discuss all options.",
  },
  {
    question: "What materials and finishes are available for custom closets?",
    answer:
      "We offer a wide range of premium materials including thermally fused laminate (TFL) in various wood grains and solid colors, melamine finishes, and premium hardware options. Popular finishes include white, grey, natural wood tones, and contemporary colors. All materials are durable, easy to clean, and designed for daily use. We'll bring samples to your consultation to help you choose the perfect style.",
  },
  {
    question: "How is your consultation process structured?",
    answer:
      "Our free online quote typically takes 45-60 minutes. We'll visit your home at your convenience, measure your closet space, discuss your storage needs and lifestyle, show you material samples and design options, create a preliminary design, and provide a detailed quote on the spot. There's no pressure or obligation – we want you to make the right decision for your home.",
  },
  {
    question: "Can I install the closet system myself or is professional installation required?",
    answer:
      "While some DIY experience could handle installation, we strongly recommend professional installation to ensure proper fit, structural integrity, and warranty coverage. Our installation is included in all quotes at no extra charge. Our experienced installers complete most projects in one day with minimal disruption. Professional installation also ensures your closet is level, secure, and optimized for longevity.",
  },
  {
    question: "What makes your closet systems better than wire shelving or big-box store options?",
    answer:
      "Our custom systems are designed specifically for your space and needs, not generic one-size-fits-all solutions. Benefits include: superior materials that won't sag or bend, custom sizing for maximum storage efficiency, professional design consultation, lifetime warranty vs. limited warranties, and installation by experienced professionals. While the upfront cost is higher, the long-term value, durability, and functionality far exceed budget alternatives.",
  },
  {
    question: "Do you offer closet organization accessories and add-ons?",
    answer:
      "Absolutely! We offer a full range of closet accessories including jewelry drawers with velvet lining, pull-out hampers and laundry baskets, LED lighting systems, belt and tie racks, shoe shelving and storage, pull-out pants and skirt hangers, valet rods, decorative hardware, and custom drawer dividers. We can add accessories during initial installation or retrofit them later as your needs change.",
  },
]

export default function FAQSection() {
  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-slate-200 text-slate-600 px-4 py-2 text-xs font-medium tracking-[0.1em] uppercase"
          >
            Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
            Get answers to common questions about our custom closet design, installation, and pricing.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-slate-200 rounded-lg px-6 bg-white hover:border-slate-300 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-slate-900 pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl lg:text-3xl font-light mb-4 text-slate-900 tracking-tight">
            Still Have Questions?
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto font-light">
            Our team is here to help. Get in touch for a free online quote and personalized answers about your closet project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-medium text-base tracking-[0.1em] uppercase transition-all duration-300 hover:bg-slate-800 border-2 border-slate-900 group touch-target rounded"
            >
              <span className="relative z-10">Schedule Free Online Quote</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-slate-900 font-medium text-base tracking-[0.1em] uppercase transition-all duration-300 hover:bg-slate-900 hover:text-white border-2 border-slate-300 hover:border-slate-900 group touch-target rounded"
            >
              <span className="relative z-10">Contact Us</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Free Online Quote</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>No Obligation Quote</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Same-Week Service</span>
            </div>
          </div>
        </div>

        {/* SEO-friendly schema markup hint */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
