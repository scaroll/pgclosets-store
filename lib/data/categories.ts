/**
 * Category data for collections pages
 * Contains metadata, descriptions, and hero images for each category
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
}

export const CATEGORY_DATA: Record<string, CategoryData> = {
  'barn-doors': {
    slug: 'barn-doors',
    name: 'Barn Doors',
    title: 'Barn Doors',
    description: 'Transform your space with our stunning collection of barn doors. Perfect for closets, pantries, and room dividers, our barn doors combine rustic charm with modern functionality. Available in various styles, finishes, and hardware options to match any decor.',
    heroImage: '/images/arcat/renin_176729_Continental_Hall_3_Lite.jpg',
    metaTitle: 'Barn Doors - Sliding Barn Door Hardware & Closet Doors | PG Closets',
    metaDescription: 'Shop premium barn doors and hardware from PG Closets. Discover rustic and modern sliding barn doors for closets, pantries, and room dividers. Custom sizes available.',
    keywords: ['barn doors', 'sliding barn doors', 'barn door hardware', 'rustic doors', 'closet barn doors', 'interior barn doors']
  },

  'bifold-doors': {
    slug: 'bifold-doors',
    name: 'Bifold Doors',
    title: 'Bifold Doors',
    description: 'Maximize space efficiency with our premium bifold closet doors. Designed for smooth operation and long-lasting durability, our bifold doors are perfect for closets, laundry rooms, and tight spaces. Choose from a variety of styles including paneled, louvered, and contemporary glass designs.',
    heroImage: '/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite.jpg',
    metaTitle: 'Bifold Closet Doors - Space-Saving Folding Doors | PG Closets',
    metaDescription: 'Browse our collection of bifold closet doors. Space-saving designs with smooth operation, available in wood, glass, and composite materials. Perfect for any closet.',
    keywords: ['bifold doors', 'bifold closet doors', 'folding doors', 'space-saving doors', 'closet doors', 'bi-fold doors']
  },

  'glass-doors': {
    slug: 'glass-doors',
    name: 'Glass Doors',
    title: 'Glass Doors',
    description: 'Elevate your interior design with our elegant glass closet doors. Our collection features frosted, clear, and decorative glass options that add sophistication and natural light to any space. Perfect for modern homes and contemporary offices, these doors combine style with functionality.',
    heroImage: '/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg',
    metaTitle: 'Glass Closet Doors - Frosted & Clear Glass Door Designs | PG Closets',
    metaDescription: 'Explore premium glass closet doors from PG Closets. Choose from frosted, clear, and decorative glass designs. Add elegance and light to your space.',
    keywords: ['glass doors', 'glass closet doors', 'frosted glass doors', 'clear glass doors', 'contemporary doors', 'modern closet doors']
  },

  'hardware': {
    slug: 'hardware',
    name: 'Hardware',
    title: 'Door Hardware & Accessories',
    description: 'Complete your closet door installation with our premium hardware collection. From smooth-gliding tracks and rollers to stylish handles and hinges, we offer everything you need for a professional finish. All hardware is designed for durability and easy installation.',
    heroImage: '/images/abstract-geometric-shapes.png',
    metaTitle: 'Closet Door Hardware & Accessories - Tracks, Handles & More | PG Closets',
    metaDescription: 'Shop quality closet door hardware and accessories. Find tracks, rollers, handles, hinges, and installation hardware for barn doors, bifold, and bypass doors.',
    keywords: ['door hardware', 'closet hardware', 'barn door hardware', 'door tracks', 'door handles', 'sliding door hardware', 'door accessories']
  },

  'bypass-doors': {
    slug: 'bypass-doors',
    name: 'Bypass Doors',
    title: 'Bypass Doors',
    description: 'Discover our versatile collection of bypass sliding closet doors. These classic space-savers feature smooth-rolling mechanisms and come in various materials and finishes. Ideal for bedrooms, walk-in closets, and storage spaces where you need maximum accessibility without door swing clearance.',
    heroImage: '/images/arcat/renin_155706_Bypass_Closet_Doors_Parsons_Flush_Panel_Design.jpg',
    metaTitle: 'Bypass Closet Doors - Sliding Bypass Doors for Closets | PG Closets',
    metaDescription: 'Shop bypass sliding closet doors from PG Closets. Space-efficient designs with smooth rolling action. Available in multiple styles and finishes.',
    keywords: ['bypass doors', 'bypass closet doors', 'sliding closet doors', 'sliding doors', 'space-saving doors', 'mirrored bypass doors']
  }
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
