/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@pgclosets.com' },
    update: {},
    create: {
      email: 'admin@pgclosets.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created')

  // Create products
  const products = [
    {
      name: 'Renin Classic Barn Door',
      slug: 'renin-classic-barn-door',
      description:
        'Premium sliding barn door with modern hardware. Perfect for contemporary spaces.',
      category: 'barn-doors',
      price: 49900, // $499.00
      inventory: 25,
      features: ['Soft-close mechanism', 'Premium hardware', 'Customizable finish'],
      tags: ['bestseller', 'modern'],
      status: 'active',
      featured: true,
      images: {
        create: [
          { url: '/products/barn-door-1.jpg', alt: 'Renin Barn Door Front View', position: 0 },
          { url: '/products/barn-door-2.jpg', alt: 'Renin Barn Door Side View', position: 1 },
        ],
      },
    },
    {
      name: 'Renin Bifold Closet Door',
      slug: 'renin-bifold-closet-door',
      description: 'Space-saving bifold door ideal for closets. Smooth operation guaranteed.',
      category: 'bifold-doors',
      price: 29900, // $299.00
      inventory: 40,
      features: ['Space-efficient', 'Easy installation', 'Durable hinges'],
      tags: ['popular', 'closet'],
      status: 'active',
      featured: false,
    },
    {
      name: 'Premium Barn Door Hardware Kit',
      slug: 'premium-barn-door-hardware',
      description:
        'Complete hardware kit for barn doors. Includes track, rollers, and mounting hardware.',
      category: 'hardware',
      price: 14900, // $149.00
      inventory: 60,
      features: ['Soft-close', 'Easy installation', 'Lifetime warranty'],
      tags: ['hardware', 'essential'],
      status: 'active',
      featured: false,
    },
  ]

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })
  }
  console.log('✅ Products created')

  // Create blocked dates (holidays)
  const blockedDates = [
    { date: new Date('2025-12-25'), reason: 'Christmas' },
    { date: new Date('2025-12-26'), reason: 'Boxing Day' },
    { date: new Date('2025-01-01'), reason: 'New Year' },
  ]

  for (const blockedDate of blockedDates) {
    await prisma.blockedDate.upsert({
      where: { date: blockedDate.date },
      update: {},
      create: blockedDate,
    })
  }
  console.log('✅ Blocked dates created')

  // Create site settings
  const settings = [
    { key: 'business_hours_start', value: '9' },
    { key: 'business_hours_end', value: '17' },
    { key: 'business_timezone', value: 'America/Toronto' },
    { key: 'tax_rate', value: '0.13' }, // 13% HST Ontario
    { key: 'free_shipping_threshold', value: '5000' }, // $50.00
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('✅ Site settings created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
