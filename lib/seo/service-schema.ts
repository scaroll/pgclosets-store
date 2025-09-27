import { BUSINESS_INFO } from '../business-config'

/**
 * Generate Service Schema.org structured data for installation and consultation services
 * Optimized for local service searches in Ottawa market
 */
export function generateInstallationServiceSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services#installation`,
    "name": "Professional Closet Door Installation",
    "description": "Expert installation of Renin closet doors including barn doors, bifold doors, bypass doors, and pivot doors throughout Ottawa and surrounding areas. Lifetime warranty included.",
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#business`,
      "name": BUSINESS_INFO.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": BUSINESS_INFO.address.city,
        "addressRegion": BUSINESS_INFO.address.province,
        "addressCountry": BUSINESS_INFO.address.country
      }
    },
    "areaServed": BUSINESS_INFO.serviceAreas.map(area => ({
      "@type": "City",
      "name": area,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": "Ontario",
        "containedInPlace": {
          "@type": "Country",
          "name": "Canada"
        }
      }
    })),
    "serviceType": "Home Improvement Installation",
    "category": "Closet Door Installation",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CAD",
      "price": "150",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": "150",
        "priceCurrency": "CAD",
        "valueAddedTaxIncluded": true,
        "unitText": "per door"
      },
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": "P999Y", // Lifetime warranty
        "warrantyScope": "Full installation warranty including labor and workmanship"
      },
      "deliveryLeadTime": {
        "@type": "QuantitativeValue",
        "value": 7,
        "unitCode": "DAY",
        "description": "Typical installation scheduling within 1 week"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Installation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Barn Door Installation",
            "description": "Professional installation of sliding barn doors with premium hardware"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bifold Door Installation",
            "description": "Expert bifold closet door installation with trackless systems"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bypass Door Installation",
            "description": "Sliding bypass door installation with smooth-glide systems"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pivot Door Installation",
            "description": "Pivot door installation with spring-loaded connectors"
          }
        }
      ]
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": BUSINESS_INFO.coordinates.latitude,
        "longitude": BUSINESS_INFO.coordinates.longitude
      },
      "geoRadius": "50000" // 50km radius
    },
    "hoursAvailable": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "potentialAction": {
      "@type": "ScheduleAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/request-work`,
        "actionPlatform": [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
        ]
      }
    }
  }
}

/**
 * Generate Consultation Service Schema
 */
export function generateConsultationServiceSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services#consultation`,
    "name": "Free In-Home Closet Consultation",
    "description": "Complimentary in-home consultation and measurement service for custom closet solutions. Expert advice on Renin products and design options for your space.",
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#business`
    },
    "areaServed": BUSINESS_INFO.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    })),
    "serviceType": "Design Consultation",
    "category": "Home Design Consultation",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CAD",
      "price": "0",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": "0",
        "priceCurrency": "CAD",
        "description": "Complimentary consultation service"
      },
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "deliveryLeadTime": {
        "@type": "QuantitativeValue",
        "value": 3,
        "unitCode": "DAY",
        "description": "Consultation scheduled within 3 business days"
      }
    },
    "serviceArea": BUSINESS_INFO.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    })),
    "potentialAction": {
      "@type": "ScheduleAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/contact`,
        "actionPlatform": [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
        ]
      }
    },
    "additionalType": "https://schema.org/ProfessionalService"
  }
}

/**
 * Generate Custom Design Service Schema
 */
export function generateCustomDesignServiceSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services#custom-design`,
    "name": "Custom Storage Solution Design",
    "description": "Professional design service for custom closets, pantries, and storage solutions using premium Renin products. Tailored to your space and lifestyle needs.",
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#business`
    },
    "areaServed": BUSINESS_INFO.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    })),
    "serviceType": "Interior Design",
    "category": "Custom Storage Design",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CAD",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": "500",
        "maxPrice": "5000",
        "priceCurrency": "CAD",
        "valueAddedTaxIncluded": true,
        "description": "Design fee credited toward purchase"
      },
      "availability": "https://schema.org/InStock",
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": "P5Y",
        "warrantyScope": "Design accuracy and functionality guarantee"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Design Software",
        "value": "3D CAD Rendering"
      },
      {
        "@type": "PropertyValue",
        "name": "Revision Rounds",
        "value": "Up to 3 revisions included"
      },
      {
        "@type": "PropertyValue",
        "name": "Material Specifications",
        "value": "Detailed material and hardware lists"
      }
    ]
  }
}

/**
 * Generate Service Collection Schema for main services page
 */
export function generateServiceCollectionSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/services#collection`,
    "name": `Professional Closet Services - ${BUSINESS_INFO.name}`,
    "description": "Complete range of professional closet and storage services in Ottawa including consultation, design, installation, and maintenance. Official Renin dealer with lifetime warranties.",
    "url": `${baseUrl}/services`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Professional Services",
      "description": "Comprehensive closet and storage services",
      "numberOfItems": 3,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Service",
            "@id": `${baseUrl}/services#consultation`,
            "name": "Free In-Home Consultation",
            "description": "Complimentary consultation and measurement"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Service",
            "@id": `${baseUrl}/services#custom-design`,
            "name": "Custom Design Service",
            "description": "Professional 3D design and planning"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Service",
            "@id": `${baseUrl}/services#installation`,
            "name": "Professional Installation",
            "description": "Expert installation with lifetime warranty"
          }
        }
      ]
    },
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#business`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": `${baseUrl}/services`
        }
      ]
    }
  }
}

/**
 * Generate FAQ Schema for services
 */
export function generateServiceFAQSchema() {
  const serviceFAQs = [
    {
      question: "What areas do you serve for installation?",
      answer: `We provide professional installation services throughout Ottawa and surrounding areas including ${BUSINESS_INFO.serviceAreas.join(', ')}. Contact us for service availability in your specific location.`
    },
    {
      question: "How long does installation take?",
      answer: "Most standard closet door installations take 2-4 hours depending on the number of doors and complexity. Barn door installations typically take 3-5 hours including track mounting."
    },
    {
      question: "Do you offer same-day installation?",
      answer: "Installation is typically scheduled within one week of product delivery. Same-day installation may be available for emergency situations - please contact us to discuss your timeline."
    },
    {
      question: "What warranty do you provide on installation?",
      answer: "All PG Closets installations come with a lifetime warranty covering labor and workmanship. This is in addition to the manufacturer warranty on Renin products."
    },
    {
      question: "Is the consultation really free?",
      answer: "Yes, we provide complimentary in-home consultations including measurement and design recommendations. There's no obligation to purchase, and the consultation includes expert advice on the best Renin products for your space."
    },
    {
      question: "Can you work with existing closet systems?",
      answer: "Absolutely! We can integrate Renin doors with many existing closet systems or recommend modifications to optimize your storage space. Our consultation will assess your current setup and recommend the best approach."
    }
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BUSINESS_INFO.urls.main}/services#faq`,
    "mainEntity": serviceFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}