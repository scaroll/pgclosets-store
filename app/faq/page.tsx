import type { Metadata } from "next"
import StandardLayout from "@/components/layout/StandardLayout"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | PG Closets Ottawa",
  description:
    "Get answers to common questions about Renin door systems, pricing, installation, and design services in Ottawa and surrounding areas.",
  keywords: "Renin doors FAQ, closet installation Ottawa, door system questions, pricing Ottawa, installation process",
  openGraph: {
    title: "FAQ | PG Closets Ottawa",
    description: "Find answers to all your Renin door system questions. Serving Ottawa and surrounding areas.",
    url: "https://pgclosets.com/faq",
    type: "website",
  },
  alternates: {
    canonical: "/faq",
  },
}

export default function FAQ() {
  const items = [
    [
      "What door types do you offer?",
      "We specialize in Renin bypass, bifold, pivot, and premium barn doors—plus custom closet systems tailored to your Ottawa home.",
    ],
    [
      "Do prices include HST?",
      "We show transparent CAD pricing upfront. HST (13%) is calculated separately and displayed clearly in your estimate.",
    ],
    [
      "How long is lead time?",
      "Most Ottawa installations are completed within 2 weeks after order confirmation, with flexible scheduling to fit your needs.",
    ],
    [
      "Do you do custom sizes?",
  "Absolutely—we measure and size doors to your exact opening. We&apos;ll confirm all dimensions during our complimentary measure visit.",
    ],
    [
      "What's included with installation?",
      "Licensed & insured Ottawa installers, complete floor protection, clean worksite maintenance, and disposal of your old doors.",
    ],
    [
      "Is there a workmanship warranty?",
      "Yes: comprehensive 2‑year workmanship warranty on all installations, plus manufacturer warranty per door model.",
    ],
    [
      "Do you service my area?",
      "We proudly serve Ottawa, Kanata, Nepean, Orleans, Barrhaven, Stittsville, Gloucester, and Vanier with professional installation.",
    ],
    [
      "Do you install on weekends?",
      "We offer flexible scheduling including evenings and weekends when possible—just ask for availability when you book your consultation.",
    ],
    [
      "How do I get started?",
  "Use our online Configurator to design your door and request a quote—we&apos;ll follow up within one business day with next steps.",
    ],
    [
      "Are you an official Renin dealer?",
  "Yes—we&apos;re an authorized Renin dealer offering authentic products with professional Ottawa installation and dedicated local support.",
    ],
  ]

  return (
    <StandardLayout>
      <main className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900 mb-12">
          Frequently Asked Questions
        </h1>

        <div className="divide-y divide-slate-200">
          {items.map(([q, a], i) => (
            <details key={i} className="py-8 group">
              <summary className="cursor-pointer text-xl font-light text-slate-900 hover:text-slate-700 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 list-none flex items-center justify-between tracking-wide">
                <span>{q}</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-slate-600 font-light tracking-wide mt-6 leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </main>
    </StandardLayout>
  )
}
