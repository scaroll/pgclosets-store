// Product data for the store

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  subcategory?: string;
  price: number; // in cents
  compareAtPrice?: number;
  images: string[];
  features: string[];
  specifications?: Record<string, string>;
  materials?: string[];
  colors?: string[];
  dimensions?: {
    width?: string;
    height?: string;
    depth?: string;
  };
  inStock: boolean;
  stockQuantity?: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  // Barn Doors
  {
    id: 'barn-modern-pine',
    slug: 'modern-pine-barn-door',
    name: 'Modern Pine Barn Door',
    description: 'Contemporary barn door with natural pine finish and soft-close mechanism.',
    longDescription: 'This stunning modern barn door brings rustic charm with contemporary functionality. Crafted from premium pine wood with a natural finish, it features a built-in soft-close mechanism for quiet, gentle operation. Pre-drilled holes ensure easy installation.',
    category: 'Barn Doors',
    subcategory: 'Modern',
    price: 89900,
    compareAtPrice: 109900,
    images: ['/images/products/barn-door-pine-1.jpg', '/images/products/barn-door-pine-2.jpg'],
    features: ['Soft-close mechanism', 'Pre-drilled', 'Easy installation', 'Weather-resistant finish'],
    specifications: {
      'Material': 'Premium Pine Wood',
      'Finish': 'Natural Clear Coat',
      'Weight Capacity': '150 lbs',
      'Warranty': '5 Years',
    },
    materials: ['Pine Wood', 'Steel Hardware'],
    colors: ['Natural', 'Walnut', 'Gray Wash'],
    dimensions: { width: '36"', height: '84"', depth: '1.5"' },
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 127,
    tags: ['barn door', 'modern', 'pine', 'soft-close'],
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'barn-classic-white',
    slug: 'classic-white-barn-door',
    name: 'Classic White Barn Door',
    description: 'Timeless white barn door perfect for modern farmhouses.',
    longDescription: 'Achieve the perfect farmhouse aesthetic with this classic white barn door. Its clean lines and premium white finish complement any interior style, from traditional to contemporary.',
    category: 'Barn Doors',
    subcategory: 'Classic',
    price: 129900,
    images: ['/images/products/barn-door-white-1.jpg', '/images/products/barn-door-white-2.jpg'],
    features: ['Pre-finished', 'Soft-close', 'Hardware included', 'Moisture resistant'],
    specifications: {
      'Material': 'MDF Core with Pine Frame',
      'Finish': 'Premium White Lacquer',
      'Weight Capacity': '200 lbs',
      'Warranty': '10 Years',
    },
    materials: ['MDF', 'Pine Frame', 'Steel Hardware'],
    colors: ['White', 'Off-White', 'Cream'],
    dimensions: { width: '36"', height: '84"', depth: '1.75"' },
    inStock: true,
    stockQuantity: 18,
    rating: 4.8,
    reviewCount: 89,
    tags: ['barn door', 'white', 'classic', 'farmhouse'],
    isNew: true,
    isFeatured: true,
  },
  // Bifold Doors
  {
    id: 'bifold-space-saver',
    slug: 'space-saving-bifold-doors',
    name: 'Space-Saving Bifold Doors',
    description: 'Perfect for closets and tight spaces with smooth folding action.',
    longDescription: 'Maximize your space with these elegant bifold doors. Ideal for closets, laundry rooms, and pantries, they feature a smooth folding mechanism and come in multiple finish options.',
    category: 'Bifold Doors',
    price: 74900,
    images: ['/images/products/bifold-1.jpg', '/images/products/bifold-2.jpg'],
    features: ['Space-saving design', 'Smooth folding action', 'Multiple finishes', 'Easy DIY installation'],
    specifications: {
      'Material': 'Engineered Wood',
      'Operation': 'Top-mounted track',
      'Max Opening': '72"',
      'Warranty': '3 Years',
    },
    materials: ['Engineered Wood', 'Aluminum Track'],
    colors: ['White', 'Natural Oak', 'Espresso', 'Gray'],
    dimensions: { width: '24-36"', height: '80"' },
    inStock: true,
    stockQuantity: 42,
    rating: 4.3,
    reviewCount: 67,
    tags: ['bifold', 'closet', 'space-saving'],
    isBestSeller: true,
  },
  // Hardware
  {
    id: 'hardware-deluxe-kit',
    slug: 'deluxe-barn-door-hardware-kit',
    name: 'Deluxe Barn Door Hardware Kit',
    description: 'Complete hardware kit with 6ft track, rollers, and handles.',
    longDescription: 'Everything you need to install your barn door. This premium kit includes a 6ft track, smooth-rolling wheels, floor guide, and matching handle. The soft-close feature ensures quiet, gentle operation.',
    category: 'Hardware',
    price: 39900,
    compareAtPrice: 49900,
    images: ['/images/products/hardware-kit-1.jpg', '/images/products/hardware-kit-2.jpg'],
    features: ['6ft track included', 'Soft-close mechanism', '200lb capacity', 'Black matte finish'],
    specifications: {
      'Track Length': '6 feet',
      'Weight Capacity': '200 lbs',
      'Material': 'Heavy-duty Steel',
      'Finish': 'Black Matte Powder Coat',
    },
    materials: ['Steel', 'Nylon Wheels'],
    colors: ['Matte Black', 'Brushed Nickel', 'Bronze'],
    inStock: true,
    stockQuantity: 65,
    rating: 4.6,
    reviewCount: 203,
    tags: ['hardware', 'barn door', 'installation kit'],
    isBestSeller: true,
  },
  // Closet Systems
  {
    id: 'closet-modular-system',
    slug: 'modular-closet-organizer',
    name: 'Modular Closet Organizer System',
    description: 'Customizable modular closet system with adjustable shelving.',
    longDescription: 'Transform your closet into an organized haven with this modular system. Features adjustable shelves, hanging rods at multiple heights, and integrated shoe storage. Expandable design grows with your needs.',
    category: 'Closet Systems',
    price: 159900,
    images: ['/images/products/closet-system-1.jpg', '/images/products/closet-system-2.jpg'],
    features: ['Modular & expandable', 'Adjustable shelving', 'Double hanging rods', 'Shoe storage included'],
    specifications: {
      'Width Range': '48" - 96"',
      'Material': 'Melamine & Steel',
      'Shelf Capacity': '40 lbs each',
      'Warranty': '10 Years',
    },
    materials: ['Melamine', 'Steel Hardware', 'Chrome Rods'],
    colors: ['White', 'Gray', 'Cherry', 'Espresso'],
    dimensions: { width: '48-96"', height: '84"', depth: '14"' },
    inStock: true,
    stockQuantity: 12,
    rating: 4.7,
    reviewCount: 156,
    tags: ['closet', 'organizer', 'modular', 'storage'],
    isFeatured: true,
  },
  // Mirrors
  {
    id: 'mirror-full-length',
    slug: 'full-length-wall-mirror',
    name: 'Full-Length Wall Mirror',
    description: 'Elegant full-length mirror with slim aluminum frame.',
    category: 'Mirrors',
    price: 29900,
    images: ['/images/products/mirror-1.jpg', '/images/products/mirror-2.jpg'],
    features: ['Full-length design', 'Slim frame', 'Shatter-resistant', 'Multiple mounting options'],
    specifications: {
      'Mirror Type': 'HD Float Glass',
      'Frame': 'Aluminum',
      'Safety': 'Shatter-resistant backing',
    },
    materials: ['HD Glass', 'Aluminum Frame'],
    colors: ['Black', 'Silver', 'Gold', 'White'],
    dimensions: { width: '24"', height: '65"' },
    inStock: true,
    stockQuantity: 30,
    rating: 4.4,
    reviewCount: 92,
    tags: ['mirror', 'full-length', 'wall mount'],
  },
  // Sliding Doors
  {
    id: 'sliding-bypass-mirror',
    slug: 'bypass-mirror-sliding-doors',
    name: 'Bypass Mirror Sliding Doors',
    description: 'Space-efficient bypass doors with full-length mirrors.',
    category: 'Sliding Doors',
    subcategory: 'Bypass',
    price: 119900,
    images: ['/images/products/sliding-mirror-1.jpg', '/images/products/sliding-mirror-2.jpg'],
    features: ['Full mirrors', 'Bypass system', 'Space-efficient', 'Soft-close optional'],
    specifications: {
      'Door Panels': '2 or 3',
      'Mirror': 'Safety-backed',
      'Track': 'Top-hung system',
    },
    materials: ['Aluminum Frame', 'Safety Mirror Glass'],
    colors: ['Silver', 'Bronze', 'White', 'Black'],
    dimensions: { width: '48-96"', height: '80"' },
    inStock: true,
    stockQuantity: 8,
    rating: 4.5,
    reviewCount: 45,
    tags: ['sliding', 'bypass', 'mirror', 'closet'],
    isNew: true,
  },
];

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

/**
 * Get best sellers
 */
export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

/**
 * Get new arrivals
 */
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

/**
 * Search products
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}
