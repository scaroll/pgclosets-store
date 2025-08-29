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

export const products: Product[] = productsData.products
export const categories: Category[] = productsData.categories

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
