export interface ArcatProduct {
  id: number
  name: string
  slug: string
  category: string
  price: number
  homeDepotImage: string
  arcatImages: string[]
  description: string
  features: string[]
  specifications: {
    width?: string
    height?: string
    thickness?: string
    material?: string
    trackLength?: string
    weightCapacity?: string
    finish?: string
  }
  installationTime: string
  inStock: boolean
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  heroImage: string
}

export interface ArcatDatabase {
  products: ArcatProduct[]
  categories: ProductCategory[]
}

// Mock data for demonstration - replace with actual database import
const mockProducts: ArcatProduct[] = [
  {
    id: 1,
    name: "Gatsby Chevron Barn Door",
    slug: "gatsby-chevron-barn-door",
    category: "barn-doors",
    price: 849,
    homeDepotImage: "/images/doors/barn/gatsby-chevron.jpg",
    arcatImages: ["/images/doors/barn/gatsby-chevron.jpg"],
    description: "Modern chevron pattern barn door with sleek design",
    features: ["Modern design", "Easy installation", "Quality hardware included"],
    specifications: {
      width: "32\"",
      height: "84\"",
      thickness: "1.375\"",
      material: "Engineered wood",
      finish: "Natural"
    },
    installationTime: "2-3 hours",
    inStock: true
  },
  {
    id: 2,
    name: "Sherwood InvisiGlide Door",
    slug: "sherwood-invisiglide-door",
    category: "barn-doors",
    price: 1049,
    homeDepotImage: "/images/doors/barn/sherwood-invisiglide.jpg",
    arcatImages: ["/images/doors/barn/sherwood-invisiglide.jpg"],
    description: "Premium soft-close barn door with invisible hardware",
    features: ["Soft-close mechanism", "Invisible hardware", "Premium finish"],
    specifications: {
      width: "36\"",
      height: "84\"",
      thickness: "1.375\"",
      material: "Solid wood",
      finish: "Stained"
    },
    installationTime: "3-4 hours",
    inStock: true
  },
  {
    id: 3,
    name: "Metal Works Industrial Door",
    slug: "metal-works-industrial-door",
    category: "barn-doors",
    price: 679,
    homeDepotImage: "/images/doors/barn/metal-works.jpg",
    arcatImages: ["/images/doors/barn/metal-works.jpg"],
    description: "Industrial-style barn door with metal accents",
    features: ["Industrial design", "Metal accents", "Durable construction"],
    specifications: {
      width: "30\"",
      height: "84\"",
      thickness: "1.375\"",
      material: "Wood with metal",
      finish: "Weathered"
    },
    installationTime: "2-3 hours",
    inStock: true
  }
]

const mockCategories: ProductCategory[] = [
  {
    id: "barn-doors",
    name: "Barn Doors",
    description: "Stylish barn doors for modern homes",
    heroImage: "/images/doors/barn/hero.jpg"
  }
]

const database: ArcatDatabase = {
  products: mockProducts,
  categories: mockCategories
}

export const arcatProducts = database.products
export const productCategories = database.categories

// Utility functions
export function getProductById(id: number): ArcatProduct | undefined {
  return arcatProducts.find((product) => product.id === id)
}

export function getProductBySlug(slug: string): ArcatProduct | undefined {
  return arcatProducts.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): ArcatProduct[] {
  return arcatProducts.filter((product) => product.category === category)
}

export function getCategoryById(id: string): ProductCategory | undefined {
  return productCategories.find((category) => category.id === id)
}

export function searchProducts(query: string): ArcatProduct[] {
  const lowercaseQuery = query.toLowerCase()
  return arcatProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
  )
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-CA")} CAD`
}

export function calculateHST(price: number, hstRate = 0.13): number {
  return Math.round(price * hstRate * 100) / 100
}

export function calculateTotalWithHST(price: number, hstRate = 0.13): number {
  return Math.round(price * (1 + hstRate) * 100) / 100
}