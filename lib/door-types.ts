/**
 * Centralized door type metadata
 * Single source of truth for category tiles, product hub, and navigation
 */

export interface DoorType {
  name: string;
  slug: string;
  image: string;
  description: string;
  fromPrice: number; // in cents
  category: string;
}

export const DOOR_TYPES: DoorType[] = [
  {
    name: 'Barn Doors',
    slug: 'renin-barn-doors',
    image: 'https://www.renin.com/cdn/shop/files/BD006_Savannah_Rustic_Grey_wBH300_BHDM_Satin_Black_Vert_0064.jpg?v=1729095437&width=2048',
    description: 'Single-panel sliding doors with modern track systems',
    fromPrice: 89900, // $899
    category: 'Renin Barn Doors',
  },
  {
    name: 'Bypass Doors',
    slug: 'renin-bypass-doors',
    image: 'https://www.renin.com/cdn/shop/files/BY002_Ashbury_2_Panel_Design_in_Steel_Frame_wBH101_Classic_Square_Matte_Black_Horiz_0078_d6a6a53e-bda8-41ce-ae1f-2f3f76de28c0.jpg?v=1729097035&width=2048',
    description: 'Multi-panel sliding closet doors for maximum space efficiency',
    fromPrice: 129900, // $1,299
    category: 'Renin Bypass Doors',
  },
  {
    name: 'Bifold Doors',
    slug: 'renin-bifold-doors',
    image: 'https://www.renin.com/cdn/shop/files/BF002_Ashbury_2_Panel_Design_in_Steel_Frame_Horiz_0015_d9b94769-3b32-4f4b-ae7a-0d9c95bb0db1.jpg?v=1729096648&width=2048',
    description: 'Space-saving folding closet doors with elegant frames',
    fromPrice: 79900, // $799
    category: 'Renin Bifold Doors',
  },
  {
    name: 'Closet Doors',
    slug: 'renin-closet-doors',
    image: 'https://www.renin.com/cdn/shop/files/CL001_Shaker_White_0034.jpg?v=1729098234&width=2048',
    description: 'Traditional hinged closet doors in multiple styles',
    fromPrice: 49900, // $499
    category: 'Renin Closet Doors',
  },
  {
    name: 'Pivot Doors',
    slug: 'renin-pivot-doors',
    image: 'https://www.renin.com/cdn/shop/files/PV001_Modern_Flush_White_0023.jpg?v=1729100345&width=2048',
    description: 'Sophisticated hinged doors for walk-in closets',
    fromPrice: 109900, // $1,099
    category: 'Renin Pivot Doors',
  },
  {
    name: 'Room Dividers',
    slug: 'renin-room-dividers',
    image: 'https://www.renin.com/cdn/shop/files/RD001_Savannah_Rustic_Grey_wBH300_BHDM_Satin_Black_Horiz_0016.jpg?v=1729100839&width=2048',
    description: 'Large-scale sliding systems for open concept spaces',
    fromPrice: 179900, // $1,799
    category: 'Renin Room Dividers',
  },
  {
    name: 'Hardware',
    slug: 'hardware',
    image: 'https://www.renin.com/cdn/shop/files/BH101_Classic_Square_Matte_Black_Horiz_0120.jpg?v=1729099187&width=2048',
    description: 'Premium tracks, handles, and installation accessories',
    fromPrice: 4900, // $49
    category: 'Hardware',
  },
  {
    name: 'Mirrors',
    slug: 'mirrors',
    image: 'https://www.renin.com/cdn/shop/files/MI001_Standing_Mirror_Vert_0099.jpg?v=1729100048&width=2048',
    description: 'Full-length and decorative closet mirrors',
    fromPrice: 29900, // $299
    category: 'Mirrors',
  },
];

/**
 * Format price in cents to CAD currency string
 * @param cents - Price in cents (e.g., 89900 for $899)
 * @param showPlus - Add "+" suffix for "from" pricing
 */
export function formatPrice(cents: number, showPlus: boolean = false): string {
  const dollars = cents / 100;
  const formatted = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);

  return showPlus ? `${formatted}+` : formatted;
}

/**
 * Get door types that have configurator capability (excludes hardware/mirrors)
 */
export function getConfigurableDoorTypes(): DoorType[] {
  return DOOR_TYPES.filter(dt => dt.slug !== 'hardware' && dt.slug !== 'mirrors');
}

/**
 * Get a default "best seller" door type for the estimator
 */
export function getDefaultDoorType(): DoorType {
  // Default to Bypass Doors (most popular)
  return DOOR_TYPES.find(dt => dt.slug === 'renin-bypass-doors') || DOOR_TYPES[0];
}
