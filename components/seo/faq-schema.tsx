"use client"

import Script from 'next/script'
import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
  category?: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
  title?: string
}

/**
 * FAQ Schema Component
 * Generates structured data for FAQ sections
 */
export function FAQSchema({ faqs, title }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": title || "Frequently Asked Questions",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

/**
 * Visual FAQ Component
 * Renders accessible FAQ accordion with schema markup
 */
interface FAQComponentProps {
  faqs: FAQItem[]
  title?: string
  className?: string
  showSchema?: boolean
}

export function FAQComponent({
  faqs,
  title = "Frequently Asked Questions",
  className = '',
  showSchema = true
}: FAQComponentProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className={`faq-section ${className}`} aria-labelledby="faq-title">
      {showSchema && <FAQSchema faqs={faqs} title={title} />}

      <h2 id="faq-title" className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {title}
      </h2>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, index) => {
          const isOpen = openItems.has(index)
          const questionId = `faq-question-${index}`
          const answerId = `faq-answer-${index}`

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset transition-colors duration-200"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={answerId}
                id={questionId}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <span className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    )}
                  </span>
                </div>
              </button>

              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/**
 * Pre-defined FAQ data for PG Closets
 */
export const pgClosetsFAQs: FAQItem[] = [
  {
    question: "How long does closet door installation take?",
    answer: "Professional installation typically takes 2-4 hours per door, depending on the complexity of the installation. Our team works efficiently while ensuring perfect alignment and finish quality.",
    category: "Installation"
  },
  {
    question: "What areas do you serve in Ottawa?",
    answer: "We provide closet door installation services throughout Ottawa and surrounding areas including Kanata, Barrhaven, Orleans, Nepean, Gloucester, and Stittsville. Contact us to confirm service availability in your specific location.",
    category: "Service Area"
  },
  {
    question: "What warranty do you offer on your closet doors?",
    answer: "We offer a lifetime warranty on all Renin closet door products and professional installation services. This covers manufacturing defects and installation workmanship for complete peace of mind.",
    category: "Warranty"
  },
  {
    question: "How much do custom closet doors cost?",
    answer: "Closet door pricing varies based on size, style, and hardware selection. Our doors typically range from $200-$800 per door including professional installation. Contact us for a free in-home consultation and accurate quote.",
    category: "Pricing"
  },
  {
    question: "Can you match existing doors in my home?",
    answer: "Yes! As an official Renin dealer, we have access to a wide variety of door styles, finishes, and hardware options. We can often match or complement your existing interior doors for a cohesive look throughout your home.",
    category: "Customization"
  },
  {
    question: "Do you offer free consultations?",
    answer: "Absolutely! We provide free in-home consultations where we'll measure your spaces, discuss your style preferences, and provide detailed quotes. There's no obligation and we'll help you explore all available options.",
    category: "Consultation"
  },
  {
    question: "What's the delivery timeframe for custom doors?",
    answer: "We guarantee 2-week delivery on most standard door configurations. Custom sizes or special finishes may require additional time. We'll provide exact timing during your consultation and keep you updated throughout the process.",
    category: "Delivery"
  },
  {
    question: "Are your installers licensed and insured?",
    answer: "Yes, all our installation technicians are fully licensed, insured, and experienced in closet door installation. We maintain comprehensive liability insurance and workers' compensation coverage for your protection.",
    category: "Installation"
  },
  {
    question: "Can you install doors on existing closet frames?",
    answer: "In most cases, yes! Our team can assess your existing frames and recommend the best door solutions. If frame modifications are needed, we can handle those as well to ensure proper fit and function.",
    category: "Installation"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, credit cards, debit cards, bank transfers, and checks. Payment is typically required upon completion of installation, and we provide detailed invoices for all services.",
    category: "Payment"
  }
]

/**
 * Ready-to-use FAQ component with PG Closets data
 */
export function PGClosetsFAQ({ className }: { className?: string }) {
  return (
    <FAQComponent
      faqs={pgClosetsFAQs}
      title="Frequently Asked Questions"
      className={className}
      showSchema={true}
    />
  )
}