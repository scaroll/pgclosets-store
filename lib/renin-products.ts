import productsData from "./renin-products-database.json"

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  category: "barn" | "bypass" | "bifold" | "pivot" | "hardware"
  subcategory: string
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  featured: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export const products: Product[] = productsData.products as Product[]
export const categories: Category[] = productsData.categories

// Legacy export for compatibility
export const reninProducts = {
  getBarnDoors: () => products.filter(p => p.category === "barn"),
  getBypassDoors: () => products.filter(p => p.category === "bypass"),
  getBifoldDoors: () => products.filter(p => p.category === "bifold"),
  getHardware: () => products.filter(p => p.category === "hardware"),
  getAllProducts: () => products,
  searchProducts: (query: string) => searchProducts(query),
  getFeaturedProducts: () => getFeaturedProducts(),
  getProductBySlug: (slug: string) => getProductBySlug(slug),
  formatPrice: (price: number) => formatPrice(price),
  calculateTax: (price: number, province?: string) => calculateTax(price, province),
  calculatePriceWithTax: (price: number, province?: string) => calculatePriceWithTax(price, province),
  getRecommendations: (productId: string, limit: number = 4) => {
    const currentProduct = products.find(p => p.id === productId)
    if (!currentProduct) return products.slice(0, limit)
    
    // Get products from same category first, then others
    const sameCategory = products.filter(p => p.id !== productId && p.category === currentProduct.category)
    const otherProducts = products.filter(p => p.id !== productId && p.category !== currentProduct.category)
    
    return [...sameCategory, ...otherProducts].slice(0, limit)
  },
  filterBarnDoors: (filters: Record<string, string>) => {
    let barnDoors = products.filter(p => p.category === "barn")
    
    // Apply filters based on the filters object
    if (filters.style) {
      barnDoors = barnDoors.filter(p => 
        p.name.toLowerCase().includes(filters.style.toLowerCase()) ||
        p.features.some(f => f.toLowerCase().includes(filters.style.toLowerCase()))
      )
    }
    
    if (filters.material) {
      barnDoors = barnDoors.filter(p => 
        p.specifications?.Material?.toLowerCase().includes(filters.material.toLowerCase()) ||
        p.name.toLowerCase().includes(filters.material.toLowerCase())
      )
    }
    
    return barnDoors
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
  )
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(price)
}

export function calculateTax(price: number, province = "ON"): number {
  // Canadian tax rates by province
  const taxRates: Record<string, number> = {
    ON: 0.13, // HST
    QC: 0.14975, // GST + QST
    BC: 0.12, // GST + PST
    AB: 0.05, // GST only
    SK: 0.11, // GST + PST
    MB: 0.12, // GST + PST
    NB: 0.15, // HST
    NS: 0.15, // HST
    PE: 0.15, // HST
    NL: 0.15, // HST
    NT: 0.05, // GST only
    NU: 0.05, // GST only
    YT: 0.05, // GST only
  }

  return price * (taxRates[province] || 0.13)
}

export function calculatePriceWithTax(price: number, province = "ON"): { subtotal: number; tax: number; total: number } {
  const subtotal = price
  const tax = calculateTax(price, province)
  const total = subtotal + tax
  
  return {
    subtotal,
    tax,
    total
  }
}
