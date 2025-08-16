import type { Metadata } from 'next'
import { reninProducts } from './renin-products'

const siteConfig = {
  name: 'PG Closets',
  description: 'Premium barn doors and closet systems in Ottawa. Authorized Renin dealer offering professional installation, custom solutions, and quality craftsmanship.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://paddle-payments-nl5k9vde7-peoples-group.vercel.app',
  ogImage: '/images/og-image.jpg',
  business: {
    name: 'PG Closets',
    legalName: 'People\'s Group Inc.',
    phone: '+1-613-555-0123',
    email: 'info@pgclosets.ca',
    address: {
      streetAddress: '123 Business Street',
      addressLocality: 'Ottawa',
      addressRegion: 'Ontario',
      postalCode: 'K1A 0A6',
      addressCountry: 'CA'
    },
    geo: {
      latitude: 45.4215,
      longitude: -75.6972
    },
    serviceArea: [
      'Ottawa, ON',
      'Kanata, ON',
      'Orleans, ON',
      'Nepean, ON',
      'Gloucester, ON',
      'Barrhaven, ON',
      'Stittsville, ON',
      'Manotick, ON'
    ]
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.business.name,
    legalName: siteConfig.business.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: `${siteConfig.url}/images/storefront.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.business.address.streetAddress,
      addressLocality: siteConfig.business.address.addressLocality,
      addressRegion: siteConfig.business.address.addressRegion,
      postalCode: siteConfig.business.address.postalCode,
      addressCountry: siteConfig.business.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude
    },
    areaServed: siteConfig.business.serviceArea.map(area => ({
      '@type': 'City',
      name: area
    })),
    openingHours: [
      'Mo-Fr 08:00-17:00',
      'Sa 09:00-16:00'
    ],
    priceRange: '$$-$$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'],
    currenciesAccepted: 'CAD',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Barn Doors and Hardware',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Custom Barn Doors',
            category: 'Home Improvement'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Professional Installation',
            category: 'Installation Services'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Sarah Johnson'
        },
        reviewBody: 'Exceptional quality barn doors and professional installation. The team was knowledgeable and efficient.',
        datePublished: '2024-01-15'
      }
    ],
    sameAs: [
      'https://www.facebook.com/pgclosets',
      'https://www.instagram.com/pgclosets',
      'https://www.linkedin.com/company/pgclosets'
    ]
  }
}

export function generateProductSchema(productSlug: string) {
  const product = reninProducts.getProductBySlug(productSlug)
  if (!product) return null

  const isHardware = !('style' in product)
  const pricing = reninProducts.calculatePriceWithTax(('sale_price' in product && product.sale_price) || product.price)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteConfig.url}/store/products/${product.slug}#product`,
    name: product.name,
    description: `Premium ${isHardware ? 'hardware' : 'barn door'} - ${product.name}. Professional installation available in Ottawa area.`,
    brand: {
      '@type': 'Brand',
      name: 'Renin'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Renin Corp.'
    },
    image: product.images.main,
    sku: product.id,
    mpn: product.id,
    category: isHardware ? 'Hardware' : 'Barn Doors',
    material: product.material,
    offers: {
      '@type': 'Offer',
      '@id': `${siteConfig.url}/store/products/${product.slug}#offer`,
      url: `${siteConfig.url}/store/products/${product.slug}`,
      priceCurrency: 'CAD',
      price: pricing.total.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}#organization`
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'CAD'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          cutoffTime: '14:00',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      }
    },
    ...(isHardware ? {} : {
      width: {
        '@type': 'QuantitativeValue',
        value: (product as any).width,
        unitCode: 'CMT'
      },
      height: {
        '@type': 'QuantitativeValue',
        value: (product as any).height,
        unitCode: 'CMT'
      },
      depth: {
        '@type': 'QuantitativeValue',
        value: (product as any).thickness,
        unitCode: 'CMT'
      }
    }),
    additionalProperty: product.features.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '23',
      bestRating: '5',
      worstRating: '1'
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.url}/services/installation#service`,
    name: 'Professional Barn Door Installation',
    description: 'Expert installation of barn doors and hardware throughout the Ottawa area. Licensed, insured, and experienced professionals.',
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${siteConfig.url}#organization`
    },
    areaServed: siteConfig.business.serviceArea.map(area => ({
      '@type': 'City',
      name: area
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Installation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Standard Installation',
          description: 'Professional installation of barn door and track system',
          price: '299.00',
          priceCurrency: 'CAD'
        },
        {
          '@type': 'Offer',
          name: 'Premium Installation',
          description: 'Installation with custom adjustments and finishing touches',
          price: '449.00',
          priceCurrency: 'CAD'
        }
      ]
    },
    serviceType: 'Installation',
    category: 'Home Improvement',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '89',
      bestRating: '5'
    }
  }
}

export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteConfig.url}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does barn door installation take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most barn door installations are completed within 2-4 hours, depending on the complexity of the installation and any custom modifications required.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you service the entire Ottawa area?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide delivery and installation services throughout Ottawa and surrounding areas including Kanata, Orleans, Nepean, Gloucester, Barrhaven, Stittsville, and Manotick.'
        }
      },
      {
        '@type': 'Question',
        name: 'What warranty do you offer on barn doors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a comprehensive 2-year warranty on all barn doors and a 5-year warranty on hardware components. Installation work is covered for 1 year.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can barn doors be customized?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer extensive customization options including size modifications, finish changes, and hardware upgrades to match your specific design requirements.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the price range for barn doors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our barn doors range from $289 to $1,345 CAD depending on size, material, and finish. Hardware packages range from $169 to $399 CAD. Installation starts at $299 CAD.'
        }
      }
    ]
  }
}

export function generateBaseMetadata({
  title,
  description,
  path = '',
  images,
  noIndex = false
}: {
  title: string
  description: string
  path?: string
  images?: string[]
  noIndex?: boolean
}): Metadata {
  const url = `${siteConfig.url}${path}`
  const defaultImages = [siteConfig.ogImage]
  
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: images || defaultImages
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images || defaultImages,
      creator: '@pgclosets'
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export { siteConfig }