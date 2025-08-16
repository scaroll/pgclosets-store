import reninDatabase from './renin-products-database.json'

export interface ReninProduct {
  id: string
  name: string
  slug: string
  price: number
  sale_price?: number
  currency: string
  style: string
  material: string
  finish: string
  size: string
  width: number
  height: number
  thickness: number
  hardware_included: boolean
  track_length: string
  features: string[]
  images: {
    main: string
    lifestyle?: string
    detail?: string
  }
}

export interface ReninHardware {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  material: string
  finish: string
  length?: number
  weight_capacity?: number
  features: string[]
  images: {
    main: string
    detail?: string
  }
}

export interface ReninDatabase {
  metadata: {
    source: string
    currency: string
    tax_rate: number
    updated: string
    note: string
  }
  categories: {
    barn_doors: {
      name: string
      description: string
      products: ReninProduct[]
    }
    hardware: {
      name: string
      description: string
      products: ReninHardware[]
    }
  }
  installation: {
    services: Record<string, {
      name: string
      price: number
      description: string
      includes: string[]
      time_estimate: string
    }>
    warranty: Record<string, string>
  }
  shipping: Record<string, Record<string, {
    price: number
    description: string
    time: string
  }>>
}

// Type the imported database
const database = reninDatabase as ReninDatabase

export class ReninProductService {
  private database: ReninDatabase

  constructor() {
    this.database = database
  }

  // Get all barn doors
  getBarnDoors(): ReninProduct[] {
    return this.database.categories.barn_doors.products
  }

  // Get all hardware
  getHardware(): ReninHardware[] {
    return this.database.categories.hardware.products
  }

  // Get product by ID
  getProductById(id: string): ReninProduct | ReninHardware | null {
    const barnDoors = this.getBarnDoors()
    const hardware = this.getHardware()
    
    return [...barnDoors, ...hardware].find(product => product.id === id) || null
  }

  // Get product by slug
  getProductBySlug(slug: string): ReninProduct | ReninHardware | null {
    const barnDoors = this.getBarnDoors()
    const hardware = this.getHardware()
    
    return [...barnDoors, ...hardware].find(product => product.slug === slug) || null
  }

  // Filter barn doors by criteria
  filterBarnDoors(filters: {
    style?: string
    material?: string
    finish?: string
    size?: string
    priceRange?: { min: number; max: number }
  }): ReninProduct[] {
    let products = this.getBarnDoors()

    if (filters.style) {
      products = products.filter(p => p.style.toLowerCase() === filters.style!.toLowerCase())
    }

    if (filters.material) {
      products = products.filter(p => p.material.toLowerCase() === filters.material!.toLowerCase())
    }

    if (filters.finish) {
      products = products.filter(p => p.finish.toLowerCase().includes(filters.finish!.toLowerCase()))
    }

    if (filters.size) {
      products = products.filter(p => p.size.includes(filters.size!))
    }

    if (filters.priceRange) {
      products = products.filter(p => {
        const price = p.sale_price || p.price
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max
      })
    }

    return products
  }

  // Get featured/sale products
  getFeaturedProducts(): ReninProduct[] {
    return this.getBarnDoors().filter(product => product.sale_price !== undefined)
  }

  // Calculate price with tax
  calculatePriceWithTax(price: number): {
    subtotal: number
    tax: number
    total: number
    taxRate: number
  } {
    const taxRate = this.database.metadata.tax_rate
    const subtotal = price
    const tax = price * taxRate
    const total = price + tax

    return {
      subtotal,
      tax,
      total,
      taxRate
    }
  }

  // Format price for display
  formatPrice(price: number, showCurrency = true): string {
    const formatted = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)

    return showCurrency ? formatted : formatted.replace('CA$', '$')
  }

  // Get installation services
  getInstallationServices() {
    return this.database.installation.services
  }

  // Get shipping options for location
  getShippingOptions(location: 'ottawa_area' | 'ontario' = 'ottawa_area') {
    return this.database.shipping[location] || this.database.shipping.ontario
  }

  // Get product recommendations based on current product
  getRecommendations(currentProductId: string, limit = 3): (ReninProduct | ReninHardware)[] {
    const currentProduct = this.getProductById(currentProductId)
    if (!currentProduct) return []

    // For barn doors, recommend similar style or complementary hardware
    if ('style' in currentProduct) {
      const similarDoors = this.filterBarnDoors({ 
        style: currentProduct.style 
      }).filter(p => p.id !== currentProductId)

      const complementaryHardware = this.getHardware().filter(h => {
        // Recommend premium hardware for premium doors
        if (currentProduct.price > 800) {
          return h.price > 200
        }
        return h.price <= 200
      })

      return [...similarDoors.slice(0, 2), ...complementaryHardware.slice(0, 1)].slice(0, limit)
    }

    // For hardware, recommend doors that work well with it
    const compatibleDoors = this.getBarnDoors().filter(door => {
      // Match finish compatibility
      if (currentProduct.finish.toLowerCase().includes('black')) {
        return door.style === 'Industrial' || door.style === 'Modern'
      }
      if (currentProduct.finish.toLowerCase().includes('nickel')) {
        return door.style === 'Modern' || door.finish.toLowerCase().includes('white')
      }
      return true
    })

    return compatibleDoors.slice(0, limit)
  }

  // Search products
  searchProducts(query: string): (ReninProduct | ReninHardware)[] {
    const searchTerm = query.toLowerCase()
    const allProducts = [...this.getBarnDoors(), ...this.getHardware()]

    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      ('style' in product && product.style.toLowerCase().includes(searchTerm)) ||
      product.material.toLowerCase().includes(searchTerm) ||
      product.finish.toLowerCase().includes(searchTerm)
    )
  }

  // Get metadata
  getMetadata() {
    return this.database.metadata
  }
}

// Export singleton instance
export const reninProducts = new ReninProductService()

// Export types for external use
export type { ReninDatabase }