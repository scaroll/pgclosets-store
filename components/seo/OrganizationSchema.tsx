/**
 * OrganizationSchema Component
 * Renders JSON-LD structured data for organization
 * Use on homepage and about pages
 */

import { getOrganizationSchema, renderSchema } from '@/lib/seo/schemas'

export function OrganizationSchema() {
  const schema = getOrganizationSchema()

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD schema from trusted source via renderSchema
      dangerouslySetInnerHTML={renderSchema(schema)}
    />
  )
}
