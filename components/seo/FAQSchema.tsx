/**
 * FAQSchema Component
 * Renders JSON-LD structured data for FAQ pages
 * Helps achieve featured snippets in search results
 */

import { getFAQSchema, renderSchema } from '@/lib/seo/schemas'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = getFAQSchema(faqs)

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD schema from trusted source via renderSchema
      dangerouslySetInnerHTML={renderSchema(schema)}
    />
  )
}
