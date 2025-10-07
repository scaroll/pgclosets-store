/**
 * FAQ Schema Generator
 * Creates structured data for FAQ pages to appear in Google's rich results
 */

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQPageSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQPageSchema(faqs: FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate JSON-LD script tag for FAQ
 */
export function generateFAQScriptTag(faqs: FAQItem[]): string {
  const schema = generateFAQPageSchema(faqs)
  return JSON.stringify(schema)
}

/**
 * Default FAQ items for PG Closets
 */
export const defaultFAQs: FAQItem[] = [
  {
    question: 'How long does closet door installation take?',
    answer:
      'Most closet door installations are completed within 2-4 hours, depending on the complexity and number of doors. Our professional installers ensure minimal disruption to your home.',
  },
  {
    question: 'What areas do you serve in Ottawa?',
    answer:
      'We proudly serve all of Ottawa and surrounding areas including Kanata, Barrhaven, Orleans, Nepean, Gloucester, and Stittsville. Contact us to confirm service in your specific area.',
  },
  {
    question: 'Do you offer a warranty on your products?',
    answer:
      'Yes! All Renin products come with a manufacturer\'s lifetime warranty. Our installation work is also guaranteed to ensure your complete satisfaction.',
  },
  {
    question: 'How much do custom closet doors cost?',
    answer:
      'Pricing varies based on door type, size, materials, and features. Bypass doors typically start from $300-$600, bifold doors from $250-$500, and barn doors from $400-$800. Contact us for a free, accurate quote tailored to your needs.',
  },
  {
    question: 'What is your delivery timeline?',
    answer:
      'Standard delivery is 2 weeks from order confirmation. Custom orders may take 3-4 weeks. We\'ll provide a specific timeline when you place your order and keep you updated throughout the process.',
  },
  {
    question: 'Can you match existing doors or decor?',
    answer:
      'Absolutely! We offer a wide range of styles, colours, and finishes to complement your existing decor. Our design consultants can help you select the perfect match or create a cohesive new look.',
  },
  {
    question: 'Do you remove and dispose of old closet doors?',
    answer:
      'Yes, our installation service includes removal and responsible disposal of your old closet doors at no additional charge. We leave your space clean and ready to enjoy.',
  },
  {
    question: 'What makes Renin doors a good choice?',
    answer:
      'Renin is a trusted Canadian manufacturer known for quality, innovation, and reliability. Their doors feature superior materials, modern designs, smooth operation, and excellent warranties backed by decades of experience.',
  },
  {
    question: 'Do you offer free consultations?',
    answer:
      'Yes! We provide free in-home consultations where we measure your space, discuss your needs and preferences, and provide expert recommendations and accurate pricing.',
  },
  {
    question: 'How do I maintain my new closet doors?',
    answer:
      'Closet doors require minimal maintenance. Regular dusting, occasional cleaning with a mild soap solution, and lubricating tracks annually will keep them operating smoothly for years. We provide detailed care instructions with every installation.',
  },
]
