/**
 * Renin Product Import Utility
 *
 * This script helps import and manage product data from Renin catalog.
 * It creates properly formatted product data for the PG Closets website.
 *
 * Usage:
 *   npx ts-node scripts/import-renin-products.ts
 *
 * Note: This script generates product data based on Renin's catalog structure.
 * Images should be properly licensed and sourced from official Renin dealer materials.
 */

import * as fs from 'fs'
import * as path from 'path'

// Product type definitions
interface ProductSpec {
  [key: string]: string | number | boolean
}

interface ProductMedia {
  url: string
  alt: string
  role: 'hero' | 'detail' | 'installed' | 'dimension'
  width: number
  height: number
}

interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  subcategory: string
  tagline: string
  description: string
  features: string[]
  specifications: ProductSpec
  attributes: {
    type: string
    style: string
    material: string
    finish: string
    [key: string]: string
  }
  media: ProductMedia[]
  priceRange: {
    min: number
    max: number
  }
  msrp?: number
  inStock: boolean
  featured: boolean
  bestseller: boolean
  hardwareIncluded: boolean
  compatibleHardware: string[]
  createdAt: string
  updatedAt: string
}

// Renin product catalog structure
const RENIN_CATALOG = {
  barnDoors: {
    heritage: {
      name: 'Heritage Collection',
      styles: ['Panel', 'Plank', 'Z-Frame', 'K-Frame'],
      sizes: ['36"', '42"'],
      finishes: ['White', 'Gray', 'Espresso', 'Natural'],
      priceRange: { min: 399, max: 699 },
    },
    brownstone: {
      name: 'Brownstone Collection',
      styles: ['Modern', 'Contemporary', 'Industrial'],
      sizes: ['36"', '42"'],
      finishes: ['Matte Black', 'Brushed Nickel', 'White'],
      priceRange: { min: 449, max: 799 },
    },
  },
  closetDoors: {
    bypass: {
      name: 'Bypass Closet Doors',
      styles: ['Frosted Glass', 'Mirror', 'Panel', 'Louvered'],
      sizes: ['48" W', '60" W', '72" W', '96" W'],
      finishes: ['White', 'Espresso', 'Natural Oak'],
      priceRange: { min: 299, max: 699 },
    },
    bifold: {
      name: 'Bifold Closet Doors',
      styles: ['Panel', 'Louvered', 'Full Louvered', 'Colonial'],
      sizes: ['24"', '30"', '32"', '36"'],
      finishes: ['White', 'Primed', 'Natural'],
      priceRange: { min: 199, max: 449 },
    },
    pivot: {
      name: 'Pivot Closet Doors',
      styles: ['Glass', 'Mirror', 'Wood Panel'],
      sizes: ['24"', '30"', '36"'],
      finishes: ['Black Frame', 'White Frame', 'Natural'],
      priceRange: { min: 399, max: 799 },
    },
  },
  hardware: {
    bypassKits: {
      name: 'Bypass Hardware Kits',
      variants: ['Standard', 'Heavy Duty', 'Soft Close'],
      priceRange: { min: 49, max: 149 },
    },
    barnDoorHardware: {
      name: 'Barn Door Hardware',
      styles: ['Bent Strap', 'Straight Strap', 'J-Shape', 'Top Mount'],
      finishes: ['Matte Black', 'Brushed Nickel', 'Oil Rubbed Bronze'],
      priceRange: { min: 89, max: 299 },
    },
    softClose: {
      name: 'Soft Close Add-ons',
      priceRange: { min: 39, max: 79 },
    },
    handles: {
      name: 'Door Handles & Pulls',
      styles: ['Bar', 'Round', 'Square', 'Flush'],
      priceRange: { min: 19, max: 89 },
    },
  },
}

// Generate product slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Generate product description
function generateDescription(category: string, style: string, finish: string): string {
  const descriptions: Record<string, string> = {
    'barn-door': `Transform your space with this elegant ${style} barn door in ${finish} finish. Perfect for adding a rustic yet modern touch to bedrooms, bathrooms, and closets. Features premium construction and smooth-gliding hardware compatibility.`,
    bypass: `Create a seamless look with these ${style} bypass closet doors in ${finish} finish. Ideal for maximizing space while providing easy access to your closet. Features durable construction and quiet operation.`,
    bifold: `Space-saving ${style} bifold doors in ${finish} finish. Perfect for closets, laundry rooms, and pantries. Easy installation with included hardware and smooth folding action.`,
    pivot: `Modern ${style} pivot door in ${finish} finish. A contemporary alternative to traditional closet doors, featuring smooth pivoting action and minimalist design.`,
    hardware: `Premium quality hardware designed for durability and smooth operation. Compatible with most door styles and easy to install.`,
  }
  return descriptions[category] || descriptions.hardware
}

// Generate feature list
function generateFeatures(category: string, _style: string): string[] {
  const baseFeatures = [
    'Premium quality construction',
    'Easy DIY installation',
    'Complete hardware included',
    'Limited lifetime warranty',
  ]

  const categoryFeatures: Record<string, string[]> = {
    'barn-door': [
      'Smooth-gliding track system',
      'Pre-drilled mounting holes',
      'Compatible with standard barn door hardware',
      'Solid core construction for durability',
    ],
    bypass: [
      'Dual-track system for smooth operation',
      'Soft-close mechanism available',
      'Adjustable door alignment',
      'Floor guide included',
    ],
    bifold: [
      'Pre-hung for easy installation',
      'Bi-fold hardware included',
      'Smooth folding action',
      'Top and bottom pivot brackets',
    ],
    pivot: [
      '180-degree pivot action',
      'Concealed pivot hinges',
      'Self-closing option available',
      'Modern, minimalist design',
    ],
    hardware: [
      'Heavy-duty steel construction',
      'Rust-resistant finish',
      'Universal compatibility',
      'Mounting hardware included',
    ],
  }

  const categorySpecificFeatures: string[] = categoryFeatures[category] ?? categoryFeatures.hardware
  return [...categorySpecificFeatures, ...baseFeatures]
}

// Generate product specifications
function generateSpecifications(
  category: string,
  size: string,
  material: string,
  finish: string
): ProductSpec {
  const baseSpecs = {
    Warranty: '5 Year Limited',
    'Assembly Required': true,
    'Made In': 'Assembled in Canada with imported materials',
    Certifications: 'CARB Phase 2 Compliant',
  }

  const sizeSpecs: ProductSpec = {}
  if (size.includes('"')) {
    const width = parseInt(size)
    sizeSpecs['Door Width'] = `${width} inches`
    sizeSpecs['Door Height'] = '80 inches (standard)'
    sizeSpecs['Door Thickness'] = '1-3/8 inches'
  }

  return {
    Material: material,
    Finish: finish,
    ...sizeSpecs,
    Weight: category === 'barn-door' ? '45-65 lbs' : '25-40 lbs',
    ...baseSpecs,
  }
}

// Generate products from catalog
function generateProducts(): Product[] {
  const products: Product[] = []
  const timestamp = new Date().toISOString()

  // Generate Barn Doors
  Object.entries(RENIN_CATALOG.barnDoors).forEach(([collectionKey, collection]) => {
    collection.styles.forEach(style => {
      collection.sizes.forEach(size => {
        collection.finishes.forEach(finish => {
          const name = `${collection.name} ${style} Barn Door - ${size} ${finish}`
          const slug = generateSlug(name)

          products.push({
            id: `bd-${collectionKey}-${generateSlug(style)}-${size.replace('"', '')}-${generateSlug(finish)}`,
            slug,
            name,
            brand: 'Renin',
            category: 'barn-doors',
            subcategory: collectionKey,
            tagline: `Premium ${style} barn door for modern living`,
            description: generateDescription('barn-door', style, finish),
            features: generateFeatures('barn-door', style),
            specifications: generateSpecifications('barn-door', size, 'Engineered Wood', finish),
            attributes: {
              type: 'barn-door',
              style: style.toLowerCase(),
              material: 'engineered-wood',
              finish: generateSlug(finish),
              collection: collectionKey,
              size: size.replace('"', ''),
            },
            media: [
              {
                url: `/images/products/barn-doors/${slug}-main.webp`,
                alt: `${name} - Main View`,
                role: 'hero',
                width: 1200,
                height: 900,
              },
            ],
            priceRange: collection.priceRange,
            inStock: true,
            featured: collectionKey === 'heritage' && style === 'Panel',
            bestseller: finish === 'White' || finish === 'Espresso',
            hardwareIncluded: false,
            compatibleHardware: [
              'bent-strap-hardware',
              'straight-strap-hardware',
              'soft-close-kit',
            ],
            createdAt: timestamp,
            updatedAt: timestamp,
          })
        })
      })
    })
  })

  // Generate Closet Doors
  Object.entries(RENIN_CATALOG.closetDoors).forEach(([typeKey, doorType]) => {
    doorType.styles.forEach(style => {
      doorType.sizes.forEach(size => {
        doorType.finishes.forEach(finish => {
          const name = `${doorType.name} - ${style} ${size} ${finish}`
          const slug = generateSlug(name)

          products.push({
            id: `cd-${typeKey}-${generateSlug(style)}-${size.replace(/[" W]/g, '')}-${generateSlug(finish)}`,
            slug,
            name,
            brand: 'Renin',
            category: 'closet-doors',
            subcategory: typeKey,
            tagline: `Quality ${style.toLowerCase()} closet doors`,
            description: generateDescription(typeKey, style, finish),
            features: generateFeatures(typeKey, style),
            specifications: generateSpecifications(
              typeKey,
              size,
              style.includes('Glass') ? 'Tempered Glass' : 'MDF',
              finish
            ),
            attributes: {
              type: typeKey,
              style: generateSlug(style),
              material: style.includes('Glass') ? 'glass' : 'mdf',
              finish: generateSlug(finish),
              size: size.replace(/[" W]/g, ''),
            },
            media: [
              {
                url: `/images/products/closet-doors/${slug}-main.webp`,
                alt: `${name} - Main View`,
                role: 'hero',
                width: 1200,
                height: 900,
              },
            ],
            priceRange: doorType.priceRange,
            inStock: true,
            featured: typeKey === 'bypass' && style === 'Frosted Glass',
            bestseller: style === 'Mirror' || finish === 'White',
            hardwareIncluded: true,
            compatibleHardware: [],
            createdAt: timestamp,
            updatedAt: timestamp,
          })
        })
      })
    })
  })

  // Generate Hardware Products
  const { hardware } = RENIN_CATALOG

  // Barn Door Hardware
  hardware.barnDoorHardware.styles.forEach(style => {
    hardware.barnDoorHardware.finishes.forEach(finish => {
      const name = `${style} Barn Door Hardware Kit - ${finish}`
      const slug = generateSlug(name)

      products.push({
        id: `hw-bd-${generateSlug(style)}-${generateSlug(finish)}`,
        slug,
        name,
        brand: 'Renin',
        category: 'hardware',
        subcategory: 'barn-door-hardware',
        tagline: `Premium ${style.toLowerCase()} hardware for barn doors`,
        description: generateDescription('hardware', style, finish),
        features: generateFeatures('hardware', style),
        specifications: {
          Style: style,
          Finish: finish,
          'Track Length': '78 inches (fits up to 42" door)',
          'Weight Capacity': '200 lbs',
          Material: 'Cold-rolled steel',
          Includes: 'Track, hangers, spacers, stops, floor guide, mounting hardware',
          Warranty: '5 Year Limited',
        },
        attributes: {
          type: 'hardware',
          style: generateSlug(style),
          material: 'steel',
          finish: generateSlug(finish),
        },
        media: [
          {
            url: `/images/products/hardware/${slug}-main.webp`,
            alt: `${name} - Main View`,
            role: 'hero',
            width: 1200,
            height: 900,
          },
        ],
        priceRange: hardware.barnDoorHardware.priceRange,
        inStock: true,
        featured: style === 'Bent Strap' && finish === 'Matte Black',
        bestseller: finish === 'Matte Black',
        hardwareIncluded: true,
        compatibleHardware: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    })
  })

  // Soft Close Kits
  products.push({
    id: 'hw-soft-close-kit',
    slug: 'soft-close-kit-barn-doors',
    name: 'Soft Close Kit for Barn Doors',
    brand: 'Renin',
    category: 'hardware',
    subcategory: 'accessories',
    tagline: 'Add soft-close functionality to any barn door',
    description:
      'Upgrade your barn door with smooth, quiet closing action. This soft-close kit prevents slamming and provides a gentle close every time. Easy to install on most barn door hardware systems.',
    features: [
      'Quiet, gentle closing action',
      'Prevents door slamming',
      'Easy retrofit installation',
      'Compatible with most barn door hardware',
      'Adjustable closing speed',
      'Heavy-duty construction',
    ],
    specifications: {
      'Compatible With': 'Most barn door hardware systems',
      Installation: 'Retrofit - no drilling required',
      'Closing Speed': 'Adjustable',
      Material: 'Steel and rubber',
      Warranty: '2 Year Limited',
    },
    attributes: {
      type: 'accessory',
      style: 'soft-close',
      material: 'steel',
      finish: 'universal',
    },
    media: [
      {
        url: '/images/products/hardware/soft-close-kit-main.webp',
        alt: 'Soft Close Kit for Barn Doors',
        role: 'hero',
        width: 1200,
        height: 900,
      },
    ],
    priceRange: hardware.softClose.priceRange,
    inStock: true,
    featured: true,
    bestseller: true,
    hardwareIncluded: true,
    compatibleHardware: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return products
}

// Main function
/* eslint-disable no-console */
function main(): void {
  console.log('Generating Renin product catalog...\n')

  const products = generateProducts()

  console.log(`Generated ${products.length} products:\n`)
  console.log(`- Barn Doors: ${products.filter(p => p.category === 'barn-doors').length}`)
  console.log(`- Closet Doors: ${products.filter(p => p.category === 'closet-doors').length}`)
  console.log(`- Hardware: ${products.filter(p => p.category === 'hardware').length}`)

  // Save to data directory
  const outputPath = path.join(__dirname, '../data/renin-catalog.json')
  const outputData = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'Renin Official Dealer Catalog',
    disclaimer: 'Prices are MSRP and subject to change. Contact PG Closets for current pricing.',
    products,
  }

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2))
  console.log(`\nCatalog saved to: ${outputPath}`)

  // Generate summary by category
  const summary = {
    totalProducts: products.length,
    categories: {
      'barn-doors': {
        count: products.filter(p => p.category === 'barn-doors').length,
        subcategories: [
          ...new Set(products.filter(p => p.category === 'barn-doors').map(p => p.subcategory)),
        ],
      },
      'closet-doors': {
        count: products.filter(p => p.category === 'closet-doors').length,
        subcategories: [
          ...new Set(products.filter(p => p.category === 'closet-doors').map(p => p.subcategory)),
        ],
      },
      hardware: {
        count: products.filter(p => p.category === 'hardware').length,
        subcategories: [
          ...new Set(products.filter(p => p.category === 'hardware').map(p => p.subcategory)),
        ],
      },
    },
    featuredProducts: products.filter(p => p.featured).map(p => p.name),
    bestsellers: products.filter(p => p.bestseller).map(p => p.name),
  }

  const summaryPath = path.join(__dirname, '../data/renin-catalog-summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  console.log(`Summary saved to: ${summaryPath}`)

  console.log('\nDone!')
}
/* eslint-enable no-console */

// Run the script
main()
