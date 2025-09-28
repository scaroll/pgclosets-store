interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Product-specific FAQ schema
export function ProductFAQSchema({ productName, faqs }: { productName: string; faqs: FAQItem[] }) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': productName,
    'mainEntity': {
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Local Business schema with FAQ
export function LocalBusinessFAQSchema() {
  const businessFAQs = [
    {
      question: 'What areas does PG Closets serve in Ottawa?',
      answer: 'PG Closets serves all of Ottawa and surrounding areas including Kanata, Barrhaven, Orleans, Nepean, and the greater Ottawa region.'
    },
    {
      question: 'Do you offer free quotes for closet door installations?',
      answer: 'Yes, we offer free quotes for all closet door and storage system installations. Contact us to schedule your free consultation.'
    },
    {
      question: 'Are you an authorized Renin dealer?',
      answer: 'Yes, PG Closets is an official authorized dealer for Renin products in Ottawa, offering the full range of Renin closet doors and systems.'
    },
    {
      question: 'How long does installation typically take?',
      answer: 'Most closet door installations can be completed in 2-4 hours. Custom closet systems may take 1-2 days depending on complexity.'
    },
    {
      question: 'Do you offer warranty on installations?',
      answer: 'Yes, we provide a comprehensive warranty on all our installations, plus manufacturer warranties on all products.'
    }
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'PG Closets',
    'description': 'Ottawa\'s premier closet door and storage solution provider. Official Renin dealer.',
    'url': 'https://www.pgclosets.com',
    'telephone': '+1-613-555-0123',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Ottawa',
      'addressRegion': 'ON',
      'addressCountry': 'CA'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '45.4215',
      'longitude': '-75.6972'
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '08:00',
        'closes': '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': 'Saturday',
        'opens': '09:00',
        'closes': '17:00'
      }
    ],
    'mainEntity': {
      '@type': 'FAQPage',
      'mainEntity': businessFAQs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}