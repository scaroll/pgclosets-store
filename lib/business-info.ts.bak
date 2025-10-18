/**
 * Centralized Business Information
 *
 * Single source of truth for all business contact info, service details,
 * and company metadata. Update once to change everywhere.
 */

export const BUSINESS_INFO = {
  // Company Details
  name: 'PG Closets',
  legalName: 'PG Closets Inc.',
  tagline: 'Elevated Taste Without Pretense',
  description: 'Ottawa\'s premier Renin dealer offering custom closet doors and sliding door systems',

  // Contact Information
  phone: {
    raw: '6137016393',
    formatted: '(613) 701-6393',
    href: 'tel:+16137016393',
    display: '613-701-6393'
  },
  email: {
    general: 'info@pgclosets.com',
    sales: 'sales@pgclosets.com',
    support: 'support@pgclosets.com'
  },

  // Physical Address
  address: {
    street: '',  // Not publicly listed - service-based
    city: 'Ottawa',
    province: 'Ontario',
    postalCode: 'K1P 5M8',
    country: 'Canada',
    formatted: 'Ottawa, Ontario, Canada'
  },

  // Service Area
  serviceArea: {
    primaryCity: 'Ottawa',
    radius: 30, // km
    neighborhoods: [
      'Kanata',
      'Orleans',
      'Barrhaven',
      'Nepean',
      'Gloucester',
      'Vanier',
      'Rockcliffe',
      'Westboro',
      'The Glebe',
      'Old Ottawa South'
    ],
    coverage: 'Ottawa and surrounding areas within 30km'
  },

  // Business Hours
  hours: {
    showroom: 'By appointment only',
    consultations: {
      weekdays: '9:00 AM - 7:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  },

  // Social Media
  social: {
    facebook: 'https://facebook.com/pgclosets',
    instagram: 'https://instagram.com/pgclosets',
    pinterest: 'https://pinterest.com/pgclosets',
    linkedin: 'https://linkedin.com/company/pgclosets',
    youtube: 'https://youtube.com/@pgclosets'
  },

  // Business Metrics (for social proof)
  metrics: {
    yearsInBusiness: 8,
    projectsCompleted: '500+',
    rating: 5.0,
    ratingCount: 127,
    bbbRating: 'A+',
    warrantyYears: 'Lifetime'
  },

  // Service Details
  service: {
    freeConsultation: true,
    freeMeasurement: {
      within: 30, // km
      fee: 50 // CAD outside radius
    },
    leadTime: {
      typical: '2-3 weeks',
      min: 1,
      max: 4,
      unit: 'weeks'
    },
    warranty: {
      materials: 'Lifetime',
      installation: '5 years',
      satisfaction: '30 days'
    },
    paymentMethods: ['Credit Card', 'Debit', 'E-Transfer', 'Cheque', 'Financing Available']
  },

  // Brand Partnerships
  partnerships: {
    primary: 'Renin',
    status: 'Official Authorized Dealer',
    certifications: ['Renin Certified Installer', 'BBB Accredited Business']
  },

  // URLs
  urls: {
    website: 'https://www.pgclosets.com',
    bookMeasure: 'https://www.pgclosets.com/book-measure',
    instantEstimate: 'https://www.pgclosets.com/instant-estimate',
    products: 'https://www.pgclosets.com/products',
    gallery: 'https://www.pgclosets.com/gallery',
    contact: 'https://www.pgclosets.com/contact'
  },

  // SEO Metadata
  seo: {
    keywords: [
      'closet doors Ottawa',
      'sliding doors Ottawa',
      'Renin dealer Ottawa',
      'custom closet doors',
      'barn doors Ottawa',
      'bypass doors',
      'closet renovation Ottawa'
    ],
    geo: {
      region: 'CA-ON',
      placename: 'Ottawa',
      position: '45.4215;-75.6972'
    }
  }
};

/**
 * Helper Functions
 */

// Get formatted phone number for display
export function getPhoneDisplay(): string {
  return BUSINESS_INFO.phone.formatted;
}

// Get phone href for tel: links
export function getPhoneHref(): string {
  return BUSINESS_INFO.phone.href;
}

// Get main email
export function getEmail(type: 'general' | 'sales' | 'support' = 'general'): string {
  return BUSINESS_INFO.email[type];
}

// Get social media link
export function getSocialLink(platform: keyof typeof BUSINESS_INFO.social): string {
  return BUSINESS_INFO.social[platform];
}

// Get service area description
export function getServiceAreaText(): string {
  return `${BUSINESS_INFO.serviceArea.primaryCity} and surrounding areas within ${BUSINESS_INFO.serviceArea.radius}km`;
}

// Get warranty summary
export function getWarrantyText(): string {
  return `${BUSINESS_INFO.service.warranty.materials} warranty on materials, ${BUSINESS_INFO.service.warranty.installation} on installation`;
}

// Get social proof summary
export function getSocialProofText(): string {
  return `${BUSINESS_INFO.metrics.projectsCompleted} Ottawa homes transformed | ${BUSINESS_INFO.metrics.rating} ★ rating | ${BUSINESS_INFO.metrics.bbbRating} BBB rated`;
}

// Get complete business schema.org JSON-LD
export function getBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_INFO.urls.website,
    "name": BUSINESS_INFO.name,
    "description": BUSINESS_INFO.description,
    "url": BUSINESS_INFO.urls.website,
    "telephone": BUSINESS_INFO.phone.formatted,
    "email": BUSINESS_INFO.email.general,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": BUSINESS_INFO.address.city,
      "addressRegion": BUSINESS_INFO.address.province,
      "postalCode": BUSINESS_INFO.address.postalCode,
      "addressCountry": BUSINESS_INFO.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "45.4215",
      "longitude": "-75.6972"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "45.4215",
        "longitude": "-75.6972"
      },
      "geoRadius": `${BUSINESS_INFO.serviceArea.radius}000`  // meters
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": BUSINESS_INFO.metrics.rating,
      "reviewCount": BUSINESS_INFO.metrics.ratingCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "$$",
    "paymentAccepted": BUSINESS_INFO.service.paymentMethods.join(', '),
    "openingHours": "Mo-Fr 09:00-19:00 Sa 10:00-16:00",
    "sameAs": Object.values(BUSINESS_INFO.social),
    "logo": `${BUSINESS_INFO.urls.website}/logo.png`,
    "image": `${BUSINESS_INFO.urls.website}/og-image.jpg`
  };
}
