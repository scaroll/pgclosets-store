/**
 * AGENT 16: Local SEO Specialist - Voice Search Optimization
 * Optimized for "near me" searches and conversational queries
 */

/**
 * Voice search question patterns for natural language queries
 */
export const VOICE_SEARCH_PATTERNS = {
  nearMe: [
    'closet doors near me',
    'barn doors near me',
    'closet door installation near me',
    'custom closets near me',
    'Renin dealer near me',
    'closet door store near me'
  ],

  howMuch: [
    'how much do closet doors cost',
    'how much are barn doors',
    'closet door prices Ottawa',
    'cost of bypass doors',
    'average price for closet doors'
  ],

  where: [
    'where can I buy closet doors in Ottawa',
    'where to get barn doors installed',
    'Renin dealer in Ottawa',
    'closet door stores in Kanata'
  ],

  what: [
    'what are the best closet doors',
    'what type of closet door should I get',
    'what is a Renin door',
    'what are bypass doors'
  ],

  who: [
    'who installs closet doors in Ottawa',
    'who sells Renin doors',
    'best closet door installer Ottawa'
  ],

  when: [
    'when can I get closet doors installed',
    'how long does installation take',
    'how soon can you install doors'
  ],

  best: [
    'best closet doors Ottawa',
    'best barn door company',
    'top rated closet door installer',
    'best Renin dealer'
  ]
}

/**
 * Conversational answers optimized for featured snippets
 */
export const VOICE_SEARCH_ANSWERS = {
  nearMe: {
    question: 'Where can I find closet doors near me in Ottawa?',
    answer: 'PG Closets is Ottawa\'s official Renin dealer with showroom access and installation services throughout Ottawa, Kanata, Nepean, Orleans, and Barrhaven. We offer same-day consultations and free online quotes with a 2-week installation guarantee.',
    wordCount: 37
  },

  cost: {
    question: 'How much do closet doors cost in Ottawa?',
    answer: 'Closet door prices in Ottawa range from $259 for bifold doors to $1,115+ for premium barn door systems. Pricing depends on style, size, and materials. PG Closets offers transparent Canadian pricing with no hidden fees.',
    wordCount: 38
  },

  installation: {
    question: 'How long does closet door installation take?',
    answer: 'Professional closet door installation typically takes 2-4 hours per door. PG Closets completes most Ottawa installations within 2 weeks of order confirmation, including measurement, ordering, and installation.',
    wordCount: 30
  },

  renin: {
    question: 'What is a Renin closet door?',
    answer: 'Renin is Canada\'s leading manufacturer of custom closet doors and storage solutions. Renin doors feature premium materials, modern designs, and innovative hardware systems with lifetime warranties.',
    wordCount: 28
  },

  types: {
    question: 'What types of closet doors are available?',
    answer: 'Common closet door types include barn doors (sliding on exterior rail), bifold doors (folding panels), bypass doors (sliding on interior track), and pivot doors (single swinging panel). Each style offers unique benefits.',
    wordCount: 35
  },

  barnDoors: {
    question: 'What are barn doors?',
    answer: 'Barn doors are sliding doors mounted on an exposed rail above the doorway. They save space, add rustic or modern style, and are popular for closets, bathrooms, and room dividers.',
    wordCount: 31
  },

  bypassDoors: {
    question: 'What are bypass doors?',
    answer: 'Bypass doors, also called sliding closet doors, feature two or more panels that slide past each other on a track. They\'re ideal for wide closet openings and save floor space.',
    wordCount: 32
  },

  warranty: {
    question: 'Do closet doors come with a warranty?',
    answer: 'PG Closets provides a lifetime warranty on all Renin door installations in Ottawa. This covers both product defects and installation workmanship with local warranty support.',
    wordCount: 28
  },

  measurement: {
    question: 'Do you provide free measurements?',
    answer: 'Yes, PG Closets offers free professional measurements throughout Ottawa and surrounding areas. We provide accurate quotes with transparent pricing and expert installation recommendations.',
    wordCount: 25
  },

  timeline: {
    question: 'When can I get closet doors installed?',
    answer: 'PG Closets typically completes Ottawa installations within 2 weeks of order confirmation. Same-day consultations are available, with expedited service for urgent projects.',
    wordCount: 25
  }
}

/**
 * Generate FAQ schema optimized for voice search
 */
export function generateVoiceSearchFAQ() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Object.values(VOICE_SEARCH_ANSWERS).map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  }
}

/**
 * Location-specific voice search queries
 */
export function generateLocationVoiceQueries(locationName: string) {
  return {
    nearMe: [
      `closet doors in ${locationName}`,
      `barn doors ${locationName}`,
      `closet door installation ${locationName}`,
      `Renin dealer ${locationName}`,
      `custom closets ${locationName}`
    ],

    directions: [
      `directions to closet door store ${locationName}`,
      `how to get to PG Closets ${locationName}`,
      `closet door showroom ${locationName}`
    ],

    hours: [
      `PG Closets hours ${locationName}`,
      `when is PG Closets open ${locationName}`,
      `closet door store hours ${locationName}`
    ],

    contact: [
      `PG Closets phone number ${locationName}`,
      `call closet door installer ${locationName}`,
      `contact PG Closets ${locationName}`
    ]
  }
}

/**
 * Featured snippet optimization content
 */
export const FEATURED_SNIPPET_CONTENT = {
  definition: {
    keyword: 'closet doors Ottawa',
    content: 'Closet doors in Ottawa are available in four main styles: barn doors (sliding on exterior rail), bifold doors (folding panels), bypass doors (sliding interior track), and pivot doors (swinging panel). Professional installation typically costs $259-$1,115+ depending on style and size.',
    format: 'paragraph',
    wordCount: 46
  },

  list: {
    keyword: 'types of closet doors',
    content: [
      'Barn Doors - Sliding on exposed rail, rustic or modern style',
      'Bifold Doors - Folding panels, space-saving design',
      'Bypass Doors - Sliding on interior track, wide openings',
      'Pivot Doors - Single swinging panel, contemporary look',
      'French Doors - Double hinged panels, elegant style'
    ],
    format: 'list'
  },

  table: {
    keyword: 'closet door prices Ottawa',
    content: {
      headers: ['Door Type', 'Price Range', 'Installation Time'],
      rows: [
        ['Bifold Doors', '$259 - $489', '2-3 hours'],
        ['Bypass Doors', '$399 - $699', '3-4 hours'],
        ['Barn Doors', '$599 - $1,115+', '2-4 hours'],
        ['Pivot Doors', '$499 - $899', '2-3 hours']
      ]
    },
    format: 'table'
  },

  steps: {
    keyword: 'how to install closet doors',
    content: [
      'Measure the closet opening width, height, and depth accurately',
      'Choose door style (barn, bifold, bypass, or pivot)',
      'Select door design, material, and hardware finish',
      'Schedule professional measurement for exact specifications',
      'Order custom doors from authorized Renin dealer',
      'Professional installation within 2 weeks'
    ],
    format: 'steps'
  }
}

/**
 * Generate conversational content for AI assistants
 */
export function generateConversationalContent(location: string) {
  return {
    introduction: `PG Closets is ${location}'s trusted Renin dealer for custom closet doors and storage solutions. We provide professional installation with lifetime warranty and transparent pricing.`,

    services: `We offer barn doors, bifold doors, bypass doors, and custom storage systems. All installations include free consultation, professional measurement, and 2-week delivery.`,

    coverage: `We serve all of ${location} with same-day quotes and fast installation. Our experienced team handles everything from heritage homes to modern condos.`,

    pricing: `Transparent Canadian pricing starts at $259 for bifold doors. Premium barn door systems range from $599 to $1,115+. We provide detailed quotes with no hidden fees.`,

    warranty: `Every installation includes a lifetime warranty covering both products and workmanship. Local ${location} support ensures fast warranty service.`,

    booking: `Book your free consultation online or by phone. We offer same-day appointments throughout ${location} with flexible scheduling including evenings and weekends.`
  }
}

/**
 * Natural language query optimization
 */
export const NATURAL_LANGUAGE_QUERIES = [
  // Question words
  'what', 'when', 'where', 'who', 'why', 'how',

  // Action verbs
  'find', 'get', 'buy', 'install', 'replace', 'upgrade', 'renovate',

  // Modifiers
  'best', 'top', 'cheap', 'affordable', 'premium', 'luxury', 'custom',

  // Intent
  'near me', 'open now', 'same day', 'emergency', 'fast', 'local',

  // Service-related
  'consultation', 'quote', 'estimate', 'price', 'cost', 'installation'
]

/**
 * Long-tail keyword opportunities for voice search
 */
export const LONG_TAIL_KEYWORDS = [
  'affordable closet doors for small spaces Ottawa',
  'best barn door company in Kanata',
  'custom closet doors for heritage homes',
  'luxury bypass doors Barrhaven',
  'modern bifold doors Orleans',
  'professional closet door installation Nepean',
  'Renin dealer near Parliament Hill',
  'same day closet door quote Ottawa',
  'sliding closet doors for condos downtown',
  'space saving closet solutions Ottawa'
]
