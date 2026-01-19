/**
 * Site Configuration Constants
 */

export const SITE_CONFIG = {
  name: 'PG Closets',
  description: 'Premium custom closets and storage solutions',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pgclosets.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/pgclosets',
    facebook: 'https://facebook.com/pgclosets',
    instagram: 'https://instagram.com/pgclosets',
  },
  contact: {
    email: 'info@pgclosets.com',
    phone: '(555) 123-4567',
  },
} as const

/**
 * Navigation Links
 */
export const NAV_LINKS = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
] as const

/**
 * Product Categories
 */
export const PRODUCT_CATEGORIES = [
  {
    id: 'walk-in-closets',
    name: 'Walk-In Closets',
    slug: 'walk-in-closets',
    description: 'Luxurious walk-in closet systems',
  },
  {
    id: 'reach-in-closets',
    name: 'Reach-In Closets',
    slug: 'reach-in-closets',
    description: 'Efficient reach-in closet solutions',
  },
  {
    id: 'garage-storage',
    name: 'Garage Storage',
    slug: 'garage-storage',
    description: 'Organize your garage space',
  },
  {
    id: 'pantry-systems',
    name: 'Pantry Systems',
    slug: 'pantry-systems',
    description: 'Custom pantry organization',
  },
  {
    id: 'home-office',
    name: 'Home Office',
    slug: 'home-office',
    description: 'Professional home office solutions',
  },
] as const

/**
 * Footer Links
 */
export const FOOTER_LINKS = {
  company: [
    { title: 'About Us', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Careers', href: '/careers' },
  ],
  products: [
    { title: 'All Products', href: '/products' },
    { title: 'Walk-In Closets', href: '/products?category=walk-in-closets' },
    { title: 'Reach-In Closets', href: '/products?category=reach-in-closets' },
    { title: 'Garage Storage', href: '/products?category=garage-storage' },
  ],
  support: [
    { title: 'FAQ', href: '/faq' },
    { title: 'Shipping', href: '/shipping' },
    { title: 'Returns', href: '/returns' },
    { title: 'Warranty', href: '/warranty' },
  ],
  legal: [
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Terms of Service', href: '/terms' },
    { title: 'Cookie Policy', href: '/cookies' },
  ],
} as const

/**
 * API Routes
 */
export const API_ROUTES = {
  products: '/api/products',
  cart: '/api/cart',
  checkout: '/api/checkout',
  auth: '/api/auth',
  user: '/api/user',
} as const

/**
 * App Routes
 */
export const APP_ROUTES = {
  home: '/',
  products: '/products',
  product: (slug: string) => `/products/${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  about: '/about',
  contact: '/contact',
} as const

/**
 * Pagination Constants
 */
export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48, 96],
} as const

/**
 * Image Sizes
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 1080 },
} as const

/**
 * Breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
