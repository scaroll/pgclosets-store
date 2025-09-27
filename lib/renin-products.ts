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

// Premium categories with luxury descriptions
export const categories: Category[] = [
  {
    id: "barn-doors",
    name: "Barn Door Systems",
    slug: "barn-doors",
    description: "Premium barn door solutions with whisper-quiet hardware and artisan craftsmanship",
    image: "/images/arcat/barn-door-hero.jpg",
    productCount: 20
  },
  {
    id: "interior-doors",
    name: "Interior Doors",
    slug: "interior-doors",
    description: "Sophisticated interior doors including sliding, French, bifold, and pocket styles",
    image: "/images/arcat/interior-doors-hero.jpg",
    productCount: 30
  },
  {
    id: "closet-systems",
    name: "Closet Systems",
    slug: "closet-systems",
    description: "Complete closet solutions with premium finishes and European-inspired hardware",
    image: "/images/arcat/closet-systems-hero.jpg",
    productCount: 25
  },
  {
    id: "room-dividers",
    name: "Room Dividers",
    slug: "room-dividers",
    description: "Elegant room dividers for flexible living spaces and modern open concepts",
    image: "/images/arcat/room-dividers-hero.jpg",
    productCount: 15
  },
  {
    id: "glass-mirrors",
    name: "Glass & Mirror Doors",
    slug: "glass-mirrors",
    description: "Designer glass doors and mirror systems for light-filled, spacious interiors",
    image: "/images/arcat/glass-mirrors-hero.jpg",
    productCount: 20
  },
  {
    id: "hardware",
    name: "Premium Hardware",
    slug: "hardware",
    description: "Professional-grade hardware and accessories for flawless installations",
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
    sku: `PG-${reninProduct.id}`,
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

// Generate premium description if missing
function generateDescription(product: any): string {
  const categoryDescriptions: Record<string, string> = {
    'barn': 'Premium barn door system with smooth-gliding hardware and artisan craftsmanship',
    'sliding': 'Elegant sliding door solution for seamless room transitions',
    'bifold': 'Space-saving bifold design with premium hardware and finishes',
    'closet': 'Complete closet door system for organized, beautiful storage',
    'glass': 'Designer glass door for light-filled, modern interiors',
    'mirror': 'Mirrored door system to enhance space and natural light'
  }
  return categoryDescriptions[product.category?.toLowerCase()] ||
    `Premium ${product.name} - Professional installation available in Ottawa`
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