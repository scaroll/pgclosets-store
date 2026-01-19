/**
 * Centralized business information configuration
 * Single source of truth for all business details across the site
 */

export const BUSINESS_INFO = {
  // Core Business Identity
  name: "PG Closets",
  tagline: "Official Renin Dealer",
  fullName: "PG Closets - Official Renin Dealer",
  
  // Contact Information
  phone: "(613) 701-6393",
  email: "info@pgclosets.com",

  // Business Address
  address: {
    street: "456 Sparks Street",
    city: "Ottawa",
    province: "ON",
    postalCode: "K1P 5E9",
    country: "CA",
    full: "456 Sparks Street, Ottawa, ON K1P 5E9"
  },
  
  // Geographic Coordinates (Ottawa city center)
  coordinates: {
    latitude: "45.4215",
    longitude: "-75.6972"
  },
  
  // Service Areas (Core Ottawa regions)
  serviceAreas: [
    "Ottawa",
    "Kanata", 
    "Barrhaven",
    "Orleans",
    "Nepean",
    "Gloucester",
    "Stittsville"
  ],
  
  // Business Hours
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM", 
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  
  // Services
  services: [
    "Custom Closet Design",
    "Closet Door Installation", 
    "Storage Solutions",
    "Pantry Organization",
    "Renin Product Sales"
  ],
  
  // Brand Values
  values: [
    "Professional Installation",
    "Lifetime Warranty", 
    "2-Week Delivery",
    "Local Ottawa Service",
    "Official Renin Partnership"
  ],
  
  // Website URLs
  urls: {
    main: "https://www.pgclosets.com",
    logo: "/logo.png",
    ogImage: "/og-image.jpg"
  },
  
  // Social Media (when available)
  social: {
    facebook: "",
    instagram: "",
    linkedin: ""
  }
} as const

// Helper functions for consistent formatting
export const formatBusinessName = (includeTagline: boolean = false) => {
  return includeTagline ? BUSINESS_INFO.fullName : BUSINESS_INFO.name
}

export const formatAddress = (multiline: boolean = false) => {
  const separator = multiline ? '\n' : ', '
  return `${BUSINESS_INFO.address.city}${separator}${BUSINESS_INFO.address.province} ${BUSINESS_INFO.address.postalCode}`
}

export const formatServiceAreas = (limit?: number) => {
  const areas = limit ? BUSINESS_INFO.serviceAreas.slice(0, limit) : BUSINESS_INFO.serviceAreas
  return areas.join(', ')
}

// Schema.org helpers
export const getSchemaAddress = () => ({
  "@type": "PostalAddress",
  streetAddress: BUSINESS_INFO.address.street,
  addressLocality: BUSINESS_INFO.address.city,
  addressRegion: BUSINESS_INFO.address.province,
  postalCode: BUSINESS_INFO.address.postalCode,
  addressCountry: BUSINESS_INFO.address.country
})

export const getSchemaGeo = () => ({
  "@type": "GeoCoordinates", 
  latitude: BUSINESS_INFO.coordinates.latitude,
  longitude: BUSINESS_INFO.coordinates.longitude
})

export const getSchemaServiceAreas = () => 
  BUSINESS_INFO.serviceAreas.map(area => ({
    "@type": "City",
    name: area
  }))