import type { Metadata } from "next"
import { FAQContent } from "./faq-content"
import { faqCategories } from "./faq-data"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | PG Closets Ottawa",
  description:
    "Get answers to common questions about closet doors, installation services, warranty, shipping, and returns. Professional closet solutions in Ottawa and surrounding areas.",
  keywords:
    "closet doors FAQ, installation Ottawa, warranty information, shipping policy, returns policy, Renin doors questions",
  openGraph: {
    title: "FAQ | PG Closets Ottawa",
    description:
      "Find answers to all your closet door questions. Expert installation services in Ottawa.",
    url: "https://pgclosets.com/faq",
    type: "website",
  },
  alternates: {
    canonical: "/faq",
  },
}

// Generate JSON-LD structured data for FAQs
function generateFAQSchema() {
  const allFAQs = faqCategories.flatMap((category) => category.faqs)

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export default function FAQPage() {
  const faqSchema = generateFAQSchema()

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD structured data for SEO - static content only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <FAQContent />
        </div>
      </main>
    </>
  )
}
