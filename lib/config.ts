// PG Closets Site Configuration
// Centralized brand and business information

export const siteConfig = {
  name: 'PG Closets',
  tagline: 'Doors that disappear. Until you need them.',
  description: 'Custom closet doors handcrafted in Ottawa since 2009.',
  url: 'https://pgclosets.com',

  // Contact
  phone: '(613) 701-6393',
  email: 'info@pgclosets.com',

  // Address
  address: {
    street: '456 Sparks Street',
    city: 'Ottawa',
    province: 'ON',
    postal: 'K1P 5E9',
    country: 'Canada',
  },

  // Business
  established: 2009,
  hours: {
    weekday: '9AM - 6PM',
    saturday: '10AM - 4PM',
    sunday: 'Closed',
  },

  // Social
  social: {
    instagram: 'https://instagram.com/pgclosets',
  },

  // Navigation
  navigation: [
    { name: 'Collection', href: '/collection' },
    { name: 'Process', href: '/#process' },
    { name: 'Atelier', href: '/atelier' },
    { name: 'Contact', href: '/contact' },
  ],

  // Footer links
  footerLinks: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
}

export type SiteConfig = typeof siteConfig
