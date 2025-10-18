/**
 * PG Closets Content Library - Central Export
 *
 * Complete content library with elegant, professional copy for all site sections.
 * Tone: Elegant, not pretentious. Sophisticated without being stuffy.
 *
 * Usage:
 * import { homepageContent, productCategories, aboutContent } from '@/lib/content'
 */

export { homepageContent } from './homepage-content'
export { productCategories, productDescriptionTemplates, seoDescriptions } from './product-descriptions'
export { aboutContent } from './about-content'
export { installationGuide } from './installation-guide'
export { faqContent } from './faq-content'

// Re-export types
export type { HomepageContent } from './homepage-content'
export type { ProductCategories, ProductDescriptionTemplates, SEODescriptions } from './product-descriptions'
export type { AboutContent } from './about-content'
export type { InstallationGuide } from './installation-guide'
export type { FAQContent } from './faq-content'

/**
 * Content Library Overview
 * ========================
 *
 * HOMEPAGE CONTENT (homepage-content.ts)
 * - Hero section copy
 * - Value proposition messaging
 * - Featured product collections
 * - Process overview
 * - Social proof and statistics
 * - Call-to-action sections
 *
 * PRODUCT DESCRIPTIONS (product-descriptions.ts)
 * - Barn doors: Modern, rustic, transitional styles
 * - Closet systems: Components, configurations, benefits
 * - Bifold doors: Materials, applications, advantages
 * - Hardware & accessories: Track systems, handles, finishes
 * - SEO-optimized descriptions
 * - Template functions for dynamic content
 *
 * ABOUT PAGE (about-content.ts)
 * - Company story and journey
 * - Core values and principles
 * - Team information
 * - Differentiators and competitive advantages
 * - Customer commitments
 *
 * INSTALLATION GUIDE (installation-guide.ts)
 * - Complete 5-phase process breakdown
 * - Preparation guidelines
 * - What to expect during installation
 * - Warranty information
 * - Post-installation support
 * - Comprehensive FAQ
 *
 * FAQ CONTENT (faq-content.ts)
 * - 7 organized categories
 * - 40+ detailed Q&A pairs
 * - Quote process
 * - Consultation details
 * - Timeline and installation
 * - Payment and pricing
 * - Warranty and service
 * - Service areas
 * - Product information
 * - Why choose PG Closets
 *
 * TONE & STYLE GUIDELINES
 * =======================
 *
 * ✓ Elegant without pretense
 * ✓ Professional but approachable
 * ✓ Confident without arrogance
 * ✓ Informative without overwhelming
 * ✓ Sophisticated without exclusivity
 * ✓ Warm without being overly casual
 *
 * WRITING PRINCIPLES
 * ==================
 *
 * 1. Clarity First
 *    - Direct, concise language
 *    - Avoid industry jargon
 *    - Explain technical concepts simply
 *
 * 2. Customer-Centric
 *    - Focus on benefits, not just features
 *    - Address customer concerns proactively
 *    - Emphasize value and outcomes
 *
 * 3. Transparent
 *    - Honest about processes and timelines
 *    - Clear pricing and warranty information
 *    - No hidden agendas or pressure tactics
 *
 * 4. Quality-Focused
 *    - Emphasize craftsmanship and materials
 *    - Highlight professional expertise
 *    - Communicate lasting value
 *
 * 5. Locally Rooted
 *    - Ottawa-specific references
 *    - Community commitment
 *    - Family-owned authenticity
 *
 * IMPLEMENTATION EXAMPLES
 * =======================
 *
 * // Homepage Hero
 * import { homepageContent } from '@/lib/content'
 *
 * <h1>{homepageContent.hero.headline}</h1>
 * <p>{homepageContent.hero.subheadline}</p>
 *
 * // Product Category
 * import { productCategories } from '@/lib/content'
 *
 * <h2>{productCategories.barnDoors.categoryName}</h2>
 * <p>{productCategories.barnDoors.tagline}</p>
 * <ul>
 *   {productCategories.barnDoors.benefits.map(benefit => (
 *     <li key={benefit}>{benefit}</li>
 *   ))}
 * </ul>
 *
 * // About Page Values
 * import { aboutContent } from '@/lib/content'
 *
 * {aboutContent.values.core.map(value => (
 *   <div key={value.title}>
 *     <span>{value.icon}</span>
 *     <h3>{value.title}</h3>
 *     <p>{value.description}</p>
 *   </div>
 * ))}
 *
 * // FAQ Section
 * import { faqContent } from '@/lib/content'
 *
 * {faqContent.categories.map(category => (
 *   <section key={category.id}>
 *     <h2>{category.name}</h2>
 *     {category.questions.map(q => (
 *       <div key={q.id}>
 *         <h3>{q.question}</h3>
 *         <p>{q.answer}</p>
 *       </div>
 *     ))}
 *   </section>
 * ))}
 *
 * SEO OPTIMIZATION
 * ================
 *
 * All content includes:
 * - Keyword-rich copy (natural integration)
 * - Location-specific references (Ottawa, surrounding areas)
 * - Structured data-friendly Q&A format
 * - Meta description templates
 * - Heading hierarchy optimization
 *
 * ACCESSIBILITY CONSIDERATIONS
 * ============================
 *
 * - Clear, descriptive headings
 * - Logical content hierarchy
 * - Concise, scannable paragraphs
 * - Bulleted lists for readability
 * - Plain language throughout
 *
 * CONTENT MAINTENANCE
 * ===================
 *
 * Update frequency:
 * - Statistics: Quarterly review
 * - Pricing references: As needed
 * - Service areas: As expanded
 * - Product offerings: When updated
 * - Contact information: Immediately when changed
 *
 * Version tracking:
 * - Major content overhauls: Update version number
 * - Minor edits: Document in comments
 * - A/B test variations: Create separate exports
 */

// Content version for tracking
export const CONTENT_VERSION = '1.0.0'
export const LAST_UPDATED = '2025-10-04'

// Common reusable content snippets
export const commonContent = {
  business: {
    name: 'PG Closets',
    tagline: 'Elevated Taste Without Pretense',
    established: '2010',
    location: 'Ottawa, Ontario',
    email: 'info@pgclosets.com',
    serviceArea: 'Ottawa and surrounding communities',

    hours: {
      weekday: 'Monday-Friday: 8:00 AM - 6:00 PM',
      saturday: 'Saturday: 9:00 AM - 4:00 PM',
      sunday: 'Sunday: By Appointment',
      formatted: 'Mon-Fri: 8AM-6PM | Sat: 9AM-4PM | Sun: By Appointment'
    }
  },

  social: {
    facebook: 'https://facebook.com/pgclosets',
    instagram: 'https://instagram.com/pgclosets',
    // Add other social profiles as needed
  },

  legal: {
    businessName: 'PG Closets',
    registeredName: 'People\'s Group Inc.',
    licenseNumber: 'Licensed & Insured',
    warranty: '2-Year Workmanship Warranty',
    certifications: ['Official Renin Dealer', 'Certified Installers']
  },

  stats: {
    installations: '500+',
    satisfactionRate: '98%',
    yearsInBusiness: '15+',
    warrantyYears: '2',
    serviceArea: 'Ottawa & 20+ surrounding communities'
  },

  cta: {
    primary: 'Get Free Online Quote',
    secondary: 'Browse Collections',
    contact: 'Contact Us',
    email: 'Email Us',
    quote: 'Get Your Quote',
    schedule: 'Schedule Appointment',
    learn: 'Learn More'
  },

  features: [
    'Free Online Quote',
    '2-Year Workmanship Warranty',
    'Professional Installation',
    'Transparent Pricing',
    'Licensed & Insured',
    'Official Renin Dealer',
    'Family-Owned & Operated',
    'Flexible Scheduling'
  ],

  serviceAreas: [
    'Ottawa',
    'Kanata',
    'Nepean',
    'Orleans',
    'Barrhaven',
    'Stittsville',
    'Gloucester',
    'Vanier',
    'Rockland',
    'Manotick',
    'And surrounding areas'
  ]
} as const

export type CommonContent = typeof commonContent
