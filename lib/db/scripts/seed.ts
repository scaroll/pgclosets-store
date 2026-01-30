import { getDb, closeDb } from '../index'
import { categories, products, type NewCategory, type NewProduct } from '../schema'

/**
 * Seed data script
 * Run with: npx tsx lib/db/scripts/seed.ts
 */

const categoryData: NewCategory[] = [
  {
    name: 'Reach-In Closets',
    slug: 'reach-in-closets',
    description: 'Standard wall-to-wall closet configurations perfect for bedrooms and hallways.',
  },
  {
    name: 'Walk-In Closets',
    slug: 'walk-in-closets',
    description: 'Spacious closet systems designed for walk-in configurations with premium organization.',
  },
  {
    name: 'Garage Storage',
    slug: 'garage-storage',
    description: 'Heavy-duty storage solutions for garage organization and utility spaces.',
  },
]

const productData: NewProduct[] = [
  {
    name: 'Classic Reach-In Starter Kit',
    slug: 'classic-reach-in-starter',
    description: 'A complete reach-in closet organization system with adjustable shelving, double hanging rods, and premium hardware. Perfect for standard 6-8 foot wide closets.',
    price: 499.99,
    category: 'reach-in-closets',
    images: [],
    featured: true,
    inStock: true,
  },
  {
    name: 'Deluxe Walk-In Wardrobe',
    slug: 'deluxe-walk-in-wardrobe',
    description: 'Transform your walk-in closet with this premium wardrobe system featuring island storage, built-in dresser, shoe wall, and LED lighting integration.',
    price: 2499.99,
    category: 'walk-in-closets',
    images: [],
    featured: true,
    inStock: true,
  },
  {
    name: 'Compact Reach-In Organizer',
    slug: 'compact-reach-in-organizer',
    description: 'Space-saving reach-in solution ideal for smaller closets. Includes telescoping rods, pull-out baskets, and adjustable shelves.',
    price: 299.99,
    category: 'reach-in-closets',
    images: [],
    featured: false,
    inStock: true,
  },
  {
    name: 'Premium Walk-In Suite',
    slug: 'premium-walk-in-suite',
    description: 'Luxury walk-in closet system with floor-to-ceiling cabinetry, glass drawer fronts, valet rods, and integrated laundry hampers.',
    price: 3999.99,
    category: 'walk-in-closets',
    images: [],
    featured: true,
    inStock: true,
  },
  {
    name: 'Garage Wall Storage System',
    slug: 'garage-wall-storage',
    description: 'Heavy-duty garage wall organizer with slat wall panels, adjustable hooks, bins, and specialized racks for tools and sports equipment.',
    price: 699.99,
    category: 'garage-storage',
    images: [],
    featured: false,
    inStock: true,
  },
  {
    name: 'Ultimate Garage Workshop',
    slug: 'ultimate-garage-workshop',
    description: 'Complete garage transformation package with workbench, overhead storage racks, tool chests, and modular cabinetry system.',
    price: 1899.99,
    category: 'garage-storage',
    images: [],
    featured: true,
    inStock: true,
  },
]

async function seed() {
  const db = getDb()

  console.log('Starting database seed...')

  // Clear existing data
  await db.delete(products)
  await db.delete(categories)
  console.log('Cleared existing data')

  // Insert categories
  console.log('Inserting categories...')
  for (const category of categoryData) {
    await db.insert(categories).values(category)
  }
  console.log(`Inserted ${categoryData.length} categories`)

  // Insert products
  console.log('Inserting products...')
  for (const product of productData) {
    await db.insert(products).values(product)
  }
  console.log(`Inserted ${productData.length} products`)

  console.log('Seed completed successfully!')

  // Verify data
  const categoryCount = await db.select().from(categories)
  const productCount = await db.select().from(products)
  console.log(`Database now contains ${categoryCount.length} categories and ${productCount.length} products`)

  closeDb()
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
