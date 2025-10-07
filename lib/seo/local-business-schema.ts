import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo, getSchemaServiceAreas } from '../business-config'

/**
 * Generate LocalBusiness Schema.org structured data for Ottawa market dominance
 * Optimized for local SEO and Google My Business integration
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeImprovementBusiness"],
    "@id": `${BUSINESS_INFO.urls.main}#business`,
    "name": BUSINESS_INFO.name,
    "alternateName": BUSINESS_INFO.fullName,
    "description": "Official Renin dealer providing custom closet doors, storage solutions, and professional installation services throughout Ottawa and surrounding areas. Specializing in barn doors, bifold doors, bypass doors, and custom storage systems.",
    "url": BUSINESS_INFO.urls.main,
    "logo": {
      "@type": "ImageObject",
      "url": `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
      "width": 400,
      "height": 400
    },
    "image": [
      `${BUSINESS_INFO.urls.main}/images/pg-closets-showroom.jpg`,
      `${BUSINESS_INFO.urls.main}/images/renin-products-display.jpg`,
      `${BUSINESS_INFO.urls.main}/images/custom-closets-ottawa.jpg`
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": BUSINESS_INFO.address.city,
      "addressRegion": BUSINESS_INFO.address.province,
      "postalCode": BUSINESS_INFO.address.postalCode,
      "addressCountry": BUSINESS_INFO.address.country,
      "streetAddress": BUSINESS_INFO.address.street
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_INFO.coordinates.latitude,
      "longitude": BUSINESS_INFO.coordinates.longitude
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": BUSINESS_INFO.email,
      "contactType": "customer service",
      "availableLanguage": ["English", "French"],
      "areaServed": BUSINESS_INFO.serviceAreas
    },
    "openingHoursSpecification": [
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
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "00:00",
        "closes": "00:00",
        "validFrom": "2024-01-01",
        "validThrough": "2025-12-31"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "CAD",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Check"],
    "areaServed": [
      {
        "@type": "City",
        "name": "Ottawa",
        "@id": "https://www.wikidata.org/wiki/Q1930"
      },
      {
        "@type": "City",
        "name": "Kanata"
      },
      {
        "@type": "City",
        "name": "Barrhaven"
      },
      {
        "@type": "City",
        "name": "Orleans"
      },
      {
        "@type": "City",
        "name": "Nepean"
      },
      {
        "@type": "City",
        "name": "Gloucester"
      },
      {
        "@type": "City",
        "name": "Stittsville"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": BUSINESS_INFO.coordinates.latitude,
        "longitude": BUSINESS_INFO.coordinates.longitude
      },
      "geoRadius": "50000" // 50km radius from Ottawa center
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Renin Closet Doors & Storage Solutions",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Barn Doors",
          "description": "Custom barn door installations with premium Renin hardware"
        },
        {
          "@type": "OfferCatalog",
          "name": "Bifold Doors",
          "description": "Space-saving bifold closet doors with modern designs"
        },
        {
          "@type": "OfferCatalog",
          "name": "Bypass Doors",
          "description": "Sliding bypass doors for maximum closet access"
        },
        {
          "@type": "OfferCatalog",
          "name": "Pivot Doors",
          "description": "Elegant pivot doors for sophisticated closet entrances"
        },
        {
          "@type": "OfferCatalog",
          "name": "Storage Solutions",
          "description": "Complete custom storage and organization systems"
        }
      ]
    },
    "award": [
      "Official Renin Dealer",
      "Lifetime Warranty Provider",
      "Local Ottawa Business"
    ],
    "foundingDate": "2020",
    "slogan": "Official Renin Dealer - Professional Installation, Lifetime Warranty, 2-Week Delivery",
    "knowsAbout": [
      "Custom Closets",
      "Barn Doors",
      "Storage Solutions",
      "Renin Products",
      "Home Organization",
      "Interior Design",
      "Door Installation",
      "Ottawa Home Improvement"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Renin Dealer Network"
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Peoples Group"
    },
    "owns": [
      {
        "@type": "Product",
        "name": "Renin Closet Door Inventory",
        "description": "Complete inventory of Renin closet doors and hardware"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Free Online Quote",
          "description": "Professional consultation and measurement service"
        },
        "price": "0",
        "priceCurrency": "CAD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Professional Installation",
          "description": "Expert installation with lifetime warranty"
        },
        "warranty": {
          "@type": "WarrantyPromise",
          "durationOfWarranty": "P999Y", // Lifetime warranty
          "warrantyScope": "Full product and installation warranty"
        }
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Excellent service from PG Closets! Professional installation of our Renin barn doors and the quality is outstanding. Highly recommend for anyone in Ottawa looking for custom closet solutions."
      }
    ],
    "sameAs": [
      `${BUSINESS_INFO.urls.main}/about`,
      `${BUSINESS_INFO.urls.main}/services`,
      `${BUSINESS_INFO.urls.main}/contact`
    ]
  }
}

/**
 * Generate WebSite Schema for enhanced search features
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS_INFO.urls.main}#website`,
    "url": BUSINESS_INFO.urls.main,
    "name": `${BUSINESS_INFO.name} - Custom Closets & Storage Solutions Ottawa`,
    "description": "Official Renin dealer in Ottawa providing custom closet doors, storage solutions, and professional installation. Browse our complete collection of barn doors, bifold doors, and storage systems.",
    "publisher": {
      "@id": `${BUSINESS_INFO.urls.main}#business`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BUSINESS_INFO.urls.main}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-CA",
    "copyrightYear": 2024,
    "copyrightHolder": {
      "@id": `${BUSINESS_INFO.urls.main}#business`
    }
  }
}

/**
 * Generate Organization Schema for brand authority
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BUSINESS_INFO.urls.main}#organization`,
    "name": BUSINESS_INFO.name,
    "alternateName": BUSINESS_INFO.fullName,
    "url": BUSINESS_INFO.urls.main,
    "logo": `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": BUSINESS_INFO.email,
      "contactType": "customer service"
    },
    "address": getSchemaAddress(),
    "geo": getSchemaGeo(),
    "areaServed": getSchemaServiceAreas(),
    "founder": {
      "@type": "Person",
      "name": "Spencer Carroll"
    },
    "foundingDate": "2020",
    "slogan": "Official Renin Dealer",
    "knowsAbout": [
      "Custom Closets Ottawa",
      "Renin Doors",
      "Storage Solutions",
      "Home Organization"
    ]
  }
}