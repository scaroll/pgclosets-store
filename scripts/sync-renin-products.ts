#!/usr/bin/env npx tsx
/**
 * Renin Product Sync CLI Script
 *
 * Usage:
 *   npx tsx scripts/sync-renin-products.ts         # Sync products (skip if exists)
 *   npx tsx scripts/sync-renin-products.ts --force # Force re-sync all products
 *   npx tsx scripts/sync-renin-products.ts --dry-run # Preview without making changes
 *
 * @module scripts/sync-renin-products
 */

import { PrismaClient } from '@prisma/client'
import { syncReninProducts } from '../lib/renin-sync'

const prisma = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const dryRun = args.includes('--dry-run')

  console.log('🚀 Renin Product Sync')
  console.log('====================')
  console.log('')

  if (dryRun) {
    console.log('📋 DRY RUN MODE - No changes will be made')
    console.log('')

    // Just show what would be synced
    const fs = await import('fs')
    const path = await import('path')
    const dataPath = path.join(process.cwd(), 'data', 'transformed-renin-products.json')
    const rawData = fs.readFileSync(dataPath, 'utf-8')
    const data = JSON.parse(rawData) as { products: Array<{ id: string; title: string; tags: string[] }>, metadata: { totalProducts: number; categories: string[] } }

    console.log(`📦 Products to sync: ${data.metadata.totalProducts}`)
    console.log(`📁 Categories: ${data.metadata.categories.join(', ')}`)
    console.log('')

    // Show first 5 products
    console.log('First 5 products:')
    data.products.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} (${p.tags[0]})`)
    })
    console.log('  ...')
    console.log('')

    // Check existing count
    let existingCount = 0
    try {
      existingCount = await prisma.product.count()
      console.log(`📊 Existing products in database: ${existingCount}`)
    } catch {
      console.log(`📊 Database not available (DATABASE_URL not set)`)
    }

    if (existingCount > 0 && !force) {
      console.log('⚠️  Would skip sync (use --force to overwrite)')
    } else {
      console.log('✅ Would sync all products')
    }

    return
  }

  console.log(`Options: force=${force}`)
  console.log('')

  // Get existing count first
  const existingCount = await prisma.product.count()
  console.log(`📊 Existing products in database: ${existingCount}`)

  if (existingCount > 0 && !force) {
    console.log('')
    console.log('⚠️  Products already exist. Use --force to overwrite.')
    return
  }

  console.log('')
  console.log('⏳ Syncing Renin products...')

  const result = await syncReninProducts(prisma, { force })

  console.log('')
  if (result.success) {
    if (result.skipped) {
      console.log(`⏭️  ${result.message}`)
    } else {
      console.log('✅ Sync completed successfully!')
      console.log('')
      console.log(`   📦 Products created: ${result.productsCreated}`)
      console.log(`   🖼️  Images created: ${result.imagesCreated}`)
      console.log(`   📐 Variants created: ${result.variantsCreated}`)
    }
  } else {
    console.error('❌ Sync failed!')
    console.error(`   Error: ${result.error}`)
    process.exit(1)
  }

  // Show category breakdown
  console.log('')
  console.log('📁 Products by category:')

  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } },
  })

  for (const cat of categories) {
    console.log(`   ${cat.category}: ${cat._count.category}`)
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
