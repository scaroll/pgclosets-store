import reninDatabase from './enhanced-renin-database.json'
import type { ArcatProduct } from "./enhanced-renin-products"
import {
  getEnhancedProductImages,
  getPrimaryImageForProduct,
  getAllImageVariantsForProduct,
  hasHDImages,
  getCategoryFallbackImage
} from './renin-image-mappings'

export interface Product {
  id: string | number
  name: string
  slug: string
  price: number
  category: string
  subcategory?: string
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  featured?: boolean
  // Enhanced commerce fields
  sku?: string
  image?: string // Primary image for cart compatibility
  variants?: ProductVariant[]
  installationTime?: string
  homeDepotImage?: string
  arcatImages?: string[]
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceModifier?: number
  size?: string
  sku?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount?: number
}

// Product categories with simple descriptions
export const categories: Category[] = [
  {
    id: "barn-doors",
    name: "Barn Door Systems",
    slug: "barn-doors",
    description: "Sliding barn doors with smooth hardware for easy installation",
    image: "/images/arcat/barn-door-hero.jpg",
    productCount: 20
  },
  {
    id: "interior-doors",
    name: "Interior Doors",
    slug: "interior-doors",
    description: "Interior doors including sliding, French, bifold, and pocket styles",
    image: "/images/arcat/interior-doors-hero.jpg",
    productCount: 30
  },
  {
    id: "closet-systems",
    name: "Closet Systems",
    slug: "closet-systems",
    description: "Complete closet door systems with quality hardware included",
    image: "/images/arcat/closet-systems-hero.jpg",
    productCount: 25
  },
  {
    id: "room-dividers",
    name: "Room Dividers",
    slug: "room-dividers",
    description: "Room dividers for creating separate spaces in open floor plans",
    image: "/images/arcat/room-dividers-hero.jpg",
    productCount: 15
  },
  {
    id: "glass-mirrors",
    name: "Glass & Mirror Doors",
    slug: "glass-mirrors",
    description: "Glass and mirror doors to brighten rooms and create space",
    image: "/images/arcat/glass-mirrors-hero.jpg",
    productCount: 20
  },
  {
    id: "hardware",
    name: "Door Hardware",
    slug: "hardware",
    description: "Quality door hardware and accessories for reliable installation",
    image: "/images/arcat/hardware-hero.jpg",
    productCount: 10
  }
]

// Transform Renin database products to match our interface
function transformReninProduct(reninProduct: any): Product {
  const enhancedImages = getEnhancedProductImages(reninProduct);
  const primaryImage = getPrimaryImageForProduct(reninProduct.id);

  return {
    id: reninProduct.id.toString(),
    name: reninProduct.name,
    slug: reninProduct.slug,
    price: reninProduct.price,
    category: mapCategory(reninProduct.category),
    subcategory: reninProduct.category,
    images: enhancedImages,
    description: reninProduct.description || generateDescription(reninProduct),
    features: reninProduct.features || [],
    specifications: reninProduct.specifications || {},
    inStock: reninProduct.inStock ?? true,
    featured: reninProduct.price > 500 || hasHDImages(reninProduct.id),
    sku: reninProduct.sku || `REN-${reninProduct.id.toString().padStart(4, '0')}`,  // Proper Renin SKU format
    image: primaryImage,
    installationTime: reninProduct.installationTime,
    variants: generateVariants(reninProduct),
    arcatImages: enhancedImages
  }
}

// Map Renin categories to our premium categories
function mapCategory(reninCategory: string): string {
  const categoryMap: Record<string, string> = {
    'barn': 'barn-doors',
    'barn-door': 'barn-doors',
    'sliding': 'interior-doors',
    'french': 'interior-doors',
    'bifold': 'interior-doors',
    'pocket': 'interior-doors',
    'interior': 'interior-doors',
    'closet': 'closet-systems',
    'wardrobe': 'closet-systems',
    'storage': 'closet-systems',
    'divider': 'room-dividers',
    'partition': 'room-dividers',
    'glass': 'glass-mirrors',
    'mirror': 'glass-mirrors',
    'mirrored': 'glass-mirrors',
    'hardware': 'hardware',
    'accessory': 'hardware',
    'handle': 'hardware',
    'track': 'hardware'
  }
  return categoryMap[reninCategory?.toLowerCase()] || 'interior-doors'
}

// Enhanced product images function with intelligent fallbacks
function getProductImages(product: any): string[] {
  // Use the enhanced mapping system for better image selection
  return getEnhancedProductImages(product);
}

// Generate simple description if missing with local SEO
function generateDescription(product: any): string {
  const categoryDescriptions: Record<string, string> = {
    'barn': 'Renin barn door with smooth hardware. Installation services available in Ottawa, Kanata, and Orleans. Comes with manufacturer warranty.',
    'sliding': 'Renin sliding door for saving space. Good for Ottawa homes and condos. Installation services available separately.',
    'bifold': 'Renin bifold door with quality hardware. Works well for closets and laundry rooms. Installation available in Ottawa area.',
    'closet': 'Renin closet door system for better organization. Popular with Ottawa homeowners. Measurement and installation services available.',
    'glass': 'Renin glass door to let in more light. Energy-efficient option. Available in Ottawa, Kanata, and Orleans.',
    'mirror': 'Renin mirror door to make rooms look bigger. Good for small spaces. Installation services available with warranty.'
  }
  return categoryDescriptions[product.category?.toLowerCase()] ||
    `Renin ${product.name} - Installation services available in Ottawa, Kanata, and Orleans. Authorized dealer with warranty support.`
}

// Generate product variants based on common sizes
function generateVariants(product: any): ProductVariant[] {
  if (product.variants) return product.variants

  const basePrice = product.price
  const commonSizes = [
    { size: '24"', modifier: 0.9 },
    { size: '30"', modifier: 1 },
    { size: '36"', modifier: 1.1 },
    { size: '48"', modifier: 1.3 },
    { size: '60"', modifier: 1.5 },
    { size: '72"', modifier: 1.7 }
  ]

  return commonSizes.map((size, index) => ({
    id: `${product.id}-v${index}`,
    name: 'Width',
    value: size.size,
    priceModifier: Math.round(basePrice * size.modifier - basePrice),
    size: size.size,
    sku: `PG-${product.id}-${size.size.replace('"', '')}`
  }))
}

// Get all products from enhanced Renin database
export const products: Product[] = reninDatabase.products.map(transformReninProduct)

// Product getter functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured).slice(0, 8)
}

export function getRelatedProducts(productId: string | number, limit: number = 4): Product[] {
  const currentProduct = products.find(p => p.id.toString() === productId.toString())
  if (!currentProduct) return []

  return products
    .filter(p =>
      p.id !== currentProduct.id &&
      p.category === currentProduct.category &&
      p.inStock
    )
    .slice(0, limit)
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase()
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.features.some(f => f.toLowerCase().includes(searchTerm))
  )
}

// Format price with luxury styling
export function formatProductPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Get contractor pricing (15% discount)
export function getContractorPrice(price: number): string {
  const contractorPrice = price * 0.85
  return formatProductPrice(contractorPrice)
}

// Check if product qualifies for bundle discount
export function getBundlePrice(product: Product, includeHardware: boolean = false): number {
  if (includeHardware && product.category !== 'hardware') {
    // 10% discount when buying door with hardware
    return Math.round(product.price * 0.9)
  }
  return product.price
}

// Get installation information
export function getInstallationInfo(product: Product): {
  time: string
  price: number
  included: string[]
} {
  const baseInstallation = 299
  const complexityMultiplier = product.category === 'barn-doors' ? 1.5 : 1

  return {
    time: product.installationTime || '2-4 hours',
    price: Math.round(baseInstallation * complexityMultiplier),
    included: [
      'Professional measurement',
      'Expert installation',
      'Hardware adjustment',
      'Clean-up and disposal',
      'Lifetime warranty'
    ]
  }
}

// Generate breadcrumbs for product pages
export function getProductBreadcrumbs(product: Product) {
  const category = categories.find(cat => cat.slug === product.category)

  return [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    category ? { label: category.name, href: `/products?category=${category.slug}` } : null,
    { label: product.name, href: `/products/${product.slug}` }
  ].filter(Boolean)
}

// Convert product to cart-compatible format
export function toCartProduct(product: any) {
  // If it's already in the right format, return as is
  if (product.id && product.name && product.price !== undefined) {
    return {
      id: product.id.toString(),
      name: product.name,
      slug: product.slug || '',
      price: product.price,
      image: product.image || product.images?.[0] || '/images/placeholder-product.jpg',
      inStock: product.inStock !== undefined ? product.inStock : true
    }
  }

  // Handle other product formats
  return {
    id: product.id?.toString() || '',
    name: product.title || product.name || 'Unknown Product',
    slug: product.slug || '',
    price: product.price || 0,
    image: product.image || product.images?.[0] || '/images/placeholder-product.jpg',
    inStock: product.inStock !== undefined ? product.inStock : true
  }
}

// Image utility functions for product display
export function getProductImageGallery(productId: string | number): {
  primary: string
  gallery: string[]
  hasHD: boolean
  variants: {
    hd: string[]
    regular: string[]
    variants: string[]
  }
} {
  const imageVariants = getAllImageVariantsForProduct(productId);
  const primary = getPrimaryImageForProduct(productId);

  return {
    primary,
    gallery: imageVariants.all,
    hasHD: hasHDImages(productId),
    variants: {
      hd: imageVariants.hd,
      regular: imageVariants.regular,
      variants: imageVariants.variants
    }
  };
}

// Get optimized image for different display contexts
export function getOptimizedProductImage(
  productId: string | number,
  context: 'thumbnail' | 'hero' | 'gallery' | 'cart' = 'hero'
): string {
  switch (context) {
    case 'thumbnail':
    case 'cart':
      // For small displays, regular images are sufficient
      return getPrimaryImageForProduct(productId);

    case 'hero':
    case 'gallery':
      // For large displays, prefer HD images
      const variants = getAllImageVariantsForProduct(productId);
      return variants.hd[0] || variants.regular[0] || getPrimaryImageForProduct(productId);

    default:
      return getPrimaryImageForProduct(productId);
  }
}

// Enhanced product search with image availability consideration
export function searchProductsWithImages(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.features.some(f => f.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => {
      // Prioritize products with HD images
      const aHasHD = hasHDImages(a.id);
      const bHasHD = hasHDImages(b.id);

      if (aHasHD && !bHasHD) return -1;
      if (!aHasHD && bHasHD) return 1;

      // Then sort by price (descending for featured items)
      return Number(b.price) - Number(a.price);
    });
}

// Export for backward compatibility
export type { ArcatProduct }