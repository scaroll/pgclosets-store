/**
 * WebPageSchema Component
 * Renders JSON-LD structured data for web pages
 * General purpose page schema
 */

import { getWebPageSchema, renderSchema } from '@/lib/seo/schemas'

interface WebPageSchemaProps {
  page: {
    url: string
    name: string
    description: string
    datePublished?: string
    dateModified?: string
  }
}

export function WebPageSchema({ page }: WebPageSchemaProps) {
  const schema = getWebPageSchema(page)

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD schema from trusted source via renderSchema
      dangerouslySetInnerHTML={renderSchema(schema)}
    />
  )
}
