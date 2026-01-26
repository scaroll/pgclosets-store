// Business configuration for PG Closets
export const BUSINESS_INFO = {
  name: "PG Closets",
  fullName: "PG Closets & Doors",
  tagline: "Ottawa's Premier Door Experts",
  phone: "(613) 422-5800",
  email: "info@pgclosets.com",
  urls: {
    main: "https://pgclosets.com",
    ogImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
  },
  address: {
    city: "Ottawa",
    province: "ON",
    country: "Canada",
    full: "Ottawa, ON, Canada"
  },
  coordinates: {
    latitude: 45.4215,
    longitude: -75.6972
  },
  hours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM"
  },
  social: {
    facebook: "https://facebook.com/pgclosets",
    instagram: "https://instagram.com/pgclosets"
  },
  serviceAreas: [
    "Ottawa", "Kanata", "Barrhaven", "Orleans", "Nepean", "Gloucester", "Stittsville"
  ],
  services: [
    "Custom Closet Design",
    "Door Installation",
    "Closet Organization",
    "Sliding Doors",
    "Bifold Doors"
  ]
}

// Helper functions for SEO schema
export function getSchemaAddress() {
  return {
    "@type": "PostalAddress",
    addressLocality: BUSINESS_INFO.address.city,
    addressRegion: BUSINESS_INFO.address.province,
    addressCountry: BUSINESS_INFO.address.country
  }
}

export function getSchemaGeo() {
  return {
    "@type": "GeoCoordinates",
    latitude: BUSINESS_INFO.coordinates.latitude,
    longitude: BUSINESS_INFO.coordinates.longitude
  }
}

export function getSchemaServiceAreas() {
  return BUSINESS_INFO.serviceAreas.map(area => ({
    "@type": "City",
    name: area
  }))
}

export function formatServiceAreas(): string {
  return BUSINESS_INFO.serviceAreas.join(", ")
}
