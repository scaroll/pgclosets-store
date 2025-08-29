interface OrganizationSchemaProps {
  name: string
  url: string
  logo: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    telephone: string
    email: string
    contactType: string
    availableLanguage: string
  }
  sameAs: string[]
}

interface ProductSchemaProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    originalPrice?: number
    rating: number
    reviews: number
    category: string
    images: string[]
    inStock: boolean
    brand: string
    sku?: string
  }
}

interface ReviewSchemaProps {
  reviews: Array<{
    id: number
    name: string
    rating: number
    date: string
    title: string
    comment: string
    verified: boolean
  }>
  product: {
    name: string
    rating: number
    reviewCount: number
  }
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
  sameAs,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactPoint.telephone,
      email: contactPoint.email,
      contactType: contactPoint.contactType,
      availableLanguage: contactPoint.availableLanguage,
    },
    sameAs,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function LocalBusinessSchema({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
  sameAs,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "456 Sparks Street",
      addressLocality: "Ottawa",
      addressRegion: "ON",
      postalCode: "K1P 5E9",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "45.4215",
      longitude: "-75.6972",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-742-5673",
      email: "hello@pgclosets.com",
      contactType: "customer service",
      availableLanguage: ["English", "French"],
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$$",
    serviceType: "Custom Closets and Home Organization",
    areaServed: [
      {
        "@type": "City",
        name: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      {
        "@type": "State",
        name: "Eastern Ontario",
        addressCountry: "CA",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Custom Closet Door Solutions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Renin Closet Doors",
            description: "Official Renin dealer offering Georgian, Euro, and Twilight door series",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Door Installation",
            description: "Professional installation with 2-week delivery in Ottawa",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Door Configurator",
            description: "Online door design tool with real-time Canadian pricing",
          },
        },
      ],
    },
    sameAs,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://pgclosets.com/products/${product.id}`,
    name: product.name,
    description: product.description,
    image: product.images.map((img) => `https://pgclosets.com${img}`),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    sku: product.sku || `PG-${product.id}`,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://pgclosets.com/products/${product.id}`,
      priceCurrency: "CAD",
      price: product.price,
      priceValidUntil: "2025-12-31",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "PG Closets",
      },
      ...(product.originalPrice && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: product.originalPrice,
          priceCurrency: "CAD",
          valueAddedTaxIncluded: true,
        },
      }),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ReviewSchema({ reviews, product }: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      author: {
        "@type": "Person",
        name: review.name,
      },
      datePublished: review.date,
      name: review.title,
      reviewBody: review.comment,
      publisher: {
        "@type": "Organization",
        name: "PG Closets",
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://pgclosets.com/#website",
    url: "https://pgclosets.com",
    name: "PG Closets - Premium Custom Closets & Home Organization | Ottawa & Eastern Ontario",
    description:
      "Ottawa's leading luxury closet specialists offering premium custom closets, wardrobe solutions, and professional organization systems. Serving Ottawa and Eastern Ontario with expert design and installation.",
    publisher: {
      "@id": "https://pgclosets.com/#organization",
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://pgclosets.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
    inLanguage: "en-CA",
    copyrightYear: "2025",
    copyrightHolder: {
      "@type": "Organization",
      name: "PG Closets",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
