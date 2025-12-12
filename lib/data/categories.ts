/**
 * Category data for collections pages
 * Renin product categories with Ottawa-focused SEO
 */

export interface CategoryData {
  slug: string
  name: string
  title: string
  description: string
  heroImage: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  featured?: boolean
}

export const CATEGORY_DATA: Record<string, CategoryData> = {
  'barn-doors': {
    slug: 'barn-doors',
    name: 'Barn Doors',
    title: 'Renin Barn Doors',
    description:
      'Transform your Ottawa home with our stunning collection of Renin barn doors. Modern sliding designs perfect for closets, pantries, and room dividers. Available in Continental, Gatsby, and Rockport series with professional installation.',
    heroImage: '/images/arcat/renin_176729_Continental_Hall_3_Lite.jpg',
    metaTitle: 'Barn Doors Ottawa | Renin Sliding Barn Doors | PG Closets',
    metaDescription:
      'Shop premium Renin barn doors in Ottawa. Modern sliding barn doors for closets, pantries, and room dividers. Professional installation available. Free consultation.',
    keywords: [
      'barn doors Ottawa',
      'sliding barn doors',
      'Renin barn doors',
      'interior barn doors',
      'closet barn doors Ottawa',
      'modern barn doors',
    ],
    featured: true,
  },

  'bypass-doors': {
    slug: 'bypass-doors',
    name: 'Bypass Doors',
    title: 'Renin Bypass Doors',
    description:
      'Space-saving Renin bypass closet doors for Ottawa homes. Smooth-rolling mechanisms in Elan, Paris, and Colonial styles. Perfect for bedrooms, walk-in closets, and storage spaces where you need maximum accessibility.',
    heroImage: '/images/arcat/renin_155706_Bypass_Closet_Doors_Parsons_Flush_Panel_Design.jpg',
    metaTitle: 'Bypass Closet Doors Ottawa | Renin Sliding Doors | PG Closets',
    metaDescription:
      'Shop Renin bypass sliding closet doors in Ottawa. Space-efficient designs with smooth rolling action. Multiple styles and finishes. Professional installation.',
    keywords: [
      'bypass doors Ottawa',
      'bypass closet doors',
      'sliding closet doors Ottawa',
      'Renin bypass doors',
      'space-saving doors',
      'mirrored bypass doors',
    ],
    featured: true,
  },

  'bifold-doors': {
    slug: 'bifold-doors',
    name: 'Bifold Doors',
    title: 'Renin Bifold Doors',
    description:
      'Classic Renin bifold closet doors for Ottawa homes. Space-efficient folding designs in Euro, Laredo, Plantation, and Cambridge series. Perfect for closets, laundry rooms, and tight spaces.',
    heroImage: '/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite.jpg',
    metaTitle: 'Bifold Closet Doors Ottawa | Renin Folding Doors | PG Closets',
    metaDescription:
      'Browse Renin bifold closet doors in Ottawa. Space-saving folding designs with smooth operation. Wood, glass, and composite options. Professional installation.',
    keywords: [
      'bifold doors Ottawa',
      'bifold closet doors',
      'folding closet doors Ottawa',
      'Renin bifold doors',
      'space-saving doors',
      'louvered bifold doors',
    ],
    featured: true,
  },

  'sliding-doors': {
    slug: 'sliding-doors',
    name: 'Sliding Doors',
    title: 'Renin Sliding Doors',
    description:
      'Premium Renin sliding closet door systems for Ottawa homes. Smooth-gliding tracks with contemporary designs. Available in framed and frameless options with mirror and panel configurations.',
    heroImage: '/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg',
    metaTitle: 'Sliding Closet Doors Ottawa | Renin Sliding Systems | PG Closets',
    metaDescription:
      'Shop Renin sliding closet doors in Ottawa. Contemporary sliding door systems with smooth-gliding tracks. Framed and frameless options. Professional installation.',
    keywords: [
      'sliding doors Ottawa',
      'sliding closet doors',
      'Renin sliding doors',
      'contemporary closet doors',
      'frameless sliding doors',
      'modern sliding doors',
    ],
    featured: false,
  },

  mirrors: {
    slug: 'mirrors',
    name: 'Mirrors',
    title: 'Renin Mirror Doors',
    description:
      'Elegant Renin mirrored closet doors for Ottawa homes. Full-length mirror options that brighten spaces and add functionality. Available in bypass, sliding, and bifold configurations.',
    heroImage: '/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg',
    metaTitle: 'Mirror Closet Doors Ottawa | Renin Mirrored Doors | PG Closets',
    metaDescription:
      'Shop Renin mirrored closet doors in Ottawa. Full-length mirror doors that brighten spaces. Bypass, sliding, and bifold options. Professional installation.',
    keywords: [
      'mirror doors Ottawa',
      'mirrored closet doors',
      'Renin mirror doors',
      'full-length mirror doors',
      'bypass mirror doors',
      'bedroom mirror doors',
    ],
    featured: false,
  },

  hardware: {
    slug: 'hardware',
    name: 'Hardware',
    title: 'Renin Door Hardware',
    description:
      'Premium Renin door hardware and accessories. Complete your closet door installation with smooth-gliding tracks, rollers, handles, and mounting systems. All hardware designed for durability and easy installation.',
    heroImage: '/images/abstract-geometric-shapes.png',
    metaTitle: 'Closet Door Hardware Ottawa | Renin Tracks & Accessories | PG Closets',
    metaDescription:
      'Shop Renin closet door hardware in Ottawa. Tracks, rollers, handles, and installation hardware for barn doors, bifold, and bypass doors. Professional installation.',
    keywords: [
      'door hardware Ottawa',
      'closet door hardware',
      'barn door hardware',
      'Renin hardware',
      'sliding door tracks',
      'door handles Ottawa',
    ],
    featured: false,
  },
}

/**
 * Get category data by slug
 */
export function getCategoryData(slug: string): CategoryData | null {
  return CATEGORY_DATA[slug] || null
}

/**
 * Get all category slugs for static generation
 */
export function getAllCategorySlugs(): string[] {
  return Object.keys(CATEGORY_DATA)
}

/**
 * Check if category slug is valid
 */
export function isValidCategory(slug: string): boolean {
  return slug in CATEGORY_DATA
}

/**
 * Get featured categories for homepage display
 */
export function getFeaturedCategories(): CategoryData[] {
  return Object.values(CATEGORY_DATA).filter((cat) => cat.featured)
}

/**
 * Get all categories for navigation
 */
export function getAllCategories(): CategoryData[] {
  return Object.values(CATEGORY_DATA)
}
