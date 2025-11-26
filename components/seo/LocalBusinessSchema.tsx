/**
 * LocalBusinessSchema Component
 * Renders JSON-LD structured data for local business
 * Enhanced local SEO for Ottawa market
 */

import { getLocalBusinessSchema, renderSchema } from '@/lib/seo/schemas'

export function LocalBusinessSchema() {
  const schema = getLocalBusinessSchema()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={renderSchema(schema)}
    />
  )
}
