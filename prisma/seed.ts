import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pgclosets.com' },
    update: {},
    create: {
      email: 'admin@pgclosets.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user created');

  // Create products
  const products = [
    {
      name: 'Renin Classic Barn Door',
      slug: 'renin-classic-barn-door',
      description: 'Premium sliding barn door with modern hardware. Perfect for contemporary spaces. Features soft-close mechanism and customizable finish options.',
      category: 'barn-doors',
      price: 49900, // $499.00
      compareAtPrice: 59900, // $599.00
      inventory: 25,
      features: ['Soft-close mechanism', 'Premium hardware', 'Customizable finish', 'Easy installation'],
      tags: ['bestseller', 'modern', 'sliding'],
      status: 'active',
      featured: true,
      material: 'Engineered Wood',
      finish: 'Multiple Options',
      dimensions: { width: 36, height: 80, depth: 1.75 },
      weight: 85,
      images: {
        create: [
          { url: '/images/products/barn-door-1.jpg', alt: 'Renin Classic Barn Door Front View', position: 0 },
          { url: '/images/products/barn-door-2.jpg', alt: 'Renin Classic Barn Door Side View', position: 1 },
          { url: '/images/products/barn-door-3.jpg', alt: 'Renin Classic Barn Door Hardware Detail', position: 2 },
        ]
      },
      variants: {
        create: [
          {
            name: '30" x 80"',
            sku: 'RBD-30-80',
            price: 44900,
            attributes: { size: '30x80', width: 30, height: 80 },
            inventory: 10
          },
          {
            name: '36" x 80"',
            sku: 'RBD-36-80',
            price: 49900,
            attributes: { size: '36x80', width: 36, height: 80 },
            inventory: 15
          },
        ]
      }
    },
    {
      name: 'Renin Bifold Closet Door',
      slug: 'renin-bifold-closet-door',
      description: 'Space-saving bifold door ideal for closets. Smooth operation guaranteed with durable hinges and quality construction.',
      category: 'bifold-doors',
      price: 29900, // $299.00
      compareAtPrice: 34900, // $349.00
      inventory: 40,
      features: ['Space-efficient', 'Easy installation', 'Durable hinges', 'Smooth operation'],
      tags: ['popular', 'closet', 'space-saving'],
      status: 'active',
      material: 'MDF',
      finish: 'White',
      dimensions: { width: 30, height: 80, depth: 1.375 },
      weight: 55,
      images: {
        create: [
          { url: '/images/products/bifold-1.jpg', alt: 'Renin Bifold Closet Door Closed', position: 0 },
          { url: '/images/products/bifold-2.jpg', alt: 'Renin Bifold Closet Door Open', position: 1 },
        ]
      }
    },
    {
      name: 'Premium Barn Door Hardware Kit',
      slug: 'premium-barn-door-hardware',
      description: 'Complete hardware kit for barn doors. Includes track, rollers, and mounting hardware. Supports doors up to 200 lbs.',
      category: 'hardware',
      price: 14900, // $149.00
      compareAtPrice: 19900, // $199.00
      inventory: 60,
      features: ['Soft-close', 'Easy installation', 'Lifetime warranty', 'Supports up to 200 lbs'],
      tags: ['hardware', 'essential', 'premium'],
      status: 'active',
      material: 'Steel',
      finish: 'Matte Black',
      weight: 25,
      images: {
        create: [
          { url: '/images/products/hardware-1.jpg', alt: 'Barn Door Hardware Kit Complete', position: 0 },
          { url: '/images/products/hardware-2.jpg', alt: 'Hardware Roller Detail', position: 1 },
        ]
      }
    },
    {
      name: 'Modern Glass Panel Door',
      slug: 'modern-glass-panel-door',
      description: 'Contemporary glass panel door with aluminum frame. Frosted glass provides privacy while allowing natural light.',
      category: 'glass-doors',
      price: 69900, // $699.00
      compareAtPrice: 79900, // $799.00
      salePrice: 59900, // $599.00 - On sale!
      inventory: 12,
      features: ['Frosted glass', 'Aluminum frame', 'Light transmission', 'Modern design'],
      tags: ['modern', 'glass', 'premium', 'sale'],
      status: 'active',
      featured: true,
      material: 'Glass and Aluminum',
      finish: 'Silver',
      dimensions: { width: 32, height: 80, depth: 1.75 },
      weight: 95,
      images: {
        create: [
          { url: '/images/products/glass-door-1.jpg', alt: 'Modern Glass Panel Door', position: 0 },
          { url: '/images/products/glass-door-2.jpg', alt: 'Glass Door Handle Detail', position: 1 },
        ]
      }
    },
    {
      name: 'French Door Set',
      slug: 'french-door-set',
      description: 'Elegant French door set with traditional grid pattern. Perfect for separating living spaces while maintaining an open feel.',
      category: 'french-doors',
      price: 89900, // $899.00
      compareAtPrice: 99900, // $999.00
      inventory: 8,
      features: ['Traditional grid pattern', 'Solid wood construction', 'Pre-hung frame', 'Ball-bearing hinges'],
      tags: ['elegant', 'traditional', 'premium'],
      status: 'active',
      material: 'Solid Pine',
      finish: 'Primed White',
      dimensions: { width: 60, height: 80, depth: 1.75 },
      weight: 120,
      images: {
        create: [
          { url: '/images/products/french-door-1.jpg', alt: 'French Door Set Closed', position: 0 },
          { url: '/images/products/french-door-2.jpg', alt: 'French Door Set Open', position: 1 },
        ]
      }
    },
    {
      name: 'Pocket Door Frame Kit',
      slug: 'pocket-door-frame-kit',
      description: 'Complete pocket door frame kit for recessed installation. Saves space and adds functionality to any room.',
      category: 'hardware',
      price: 24900, // $249.00
      inventory: 30,
      features: ['Space-saving design', 'Universal fit', 'Heavy-duty construction', 'Smooth glide system'],
      tags: ['hardware', 'pocket-door', 'space-saving'],
      status: 'active',
      material: 'Steel',
      weight: 35,
      images: {
        create: [
          { url: '/images/products/pocket-frame-1.jpg', alt: 'Pocket Door Frame Kit', position: 0 },
        ]
      }
    },
    {
      name: 'Rustic Barn Door - Reclaimed Wood',
      slug: 'rustic-barn-door-reclaimed',
      description: 'Authentic rustic barn door made from reclaimed wood. Each door is unique with natural weathering and character.',
      category: 'barn-doors',
      price: 79900, // $799.00
      compareAtPrice: 89900, // $899.00
      inventory: 6,
      features: ['Reclaimed wood', 'Unique character', 'Hand-finished', 'Eco-friendly'],
      tags: ['rustic', 'reclaimed', 'eco-friendly', 'unique'],
      status: 'active',
      featured: true,
      material: 'Reclaimed Wood',
      finish: 'Natural/Weathered',
      dimensions: { width: 36, height: 84, depth: 2 },
      weight: 110,
      images: {
        create: [
          { url: '/images/products/rustic-barn-1.jpg', alt: 'Rustic Reclaimed Barn Door', position: 0 },
          { url: '/images/products/rustic-barn-2.jpg', alt: 'Reclaimed Wood Texture Detail', position: 1 },
        ]
      }
    },
    {
      name: 'Mirror Bifold Closet Door',
      slug: 'mirror-bifold-closet-door',
      description: 'Bifold closet door with full-length mirror panels. Maximizes space and functionality in bedrooms.',
      category: 'bifold-doors',
      price: 39900, // $399.00
      inventory: 20,
      features: ['Full-length mirror', 'Space-enhancing', 'Safety backing', 'Smooth operation'],
      tags: ['mirror', 'closet', 'bedroom'],
      status: 'active',
      material: 'MDF with Mirror',
      finish: 'White Frame',
      dimensions: { width: 30, height: 80, depth: 1.5 },
      weight: 70,
      images: {
        create: [
          { url: '/images/products/mirror-bifold-1.jpg', alt: 'Mirror Bifold Door Closed', position: 0 },
        ]
      }
    }
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData as any,
    });
  }
  console.log('✅ Products created');

  // Create blocked dates (holidays)
  const blockedDates = [
    { date: new Date('2025-12-25'), reason: 'Christmas' },
    { date: new Date('2025-12-26'), reason: 'Boxing Day' },
    { date: new Date('2026-01-01'), reason: 'New Year' },
    { date: new Date('2025-07-01'), reason: 'Canada Day' },
    { date: new Date('2025-09-01'), reason: 'Labour Day' },
    { date: new Date('2025-10-13'), reason: 'Thanksgiving' },
  ];

  for (const blockedDate of blockedDates) {
    await prisma.blockedDate.upsert({
      where: { date: blockedDate.date },
      update: {},
      create: blockedDate,
    });
  }
  console.log('✅ Blocked dates created');

  // Create site settings
  const settings = [
    { key: 'business_hours_start', value: '9' },
    { key: 'business_hours_end', value: '17' },
    { key: 'business_timezone', value: 'America/Toronto' },
    { key: 'tax_rate', value: '0.13' }, // 13% HST Ontario
    { key: 'free_shipping_threshold', value: '10000' }, // $100.00 in cents
    { key: 'booking_duration_consultation', value: '60' }, // minutes
    { key: 'booking_duration_measurement', value: '45' }, // minutes
    { key: 'booking_duration_installation', value: '120' }, // minutes
    { key: 'booking_advance_days', value: '60' }, // Can book up to 60 days in advance
    { key: 'booking_buffer_minutes', value: '30' }, // Buffer between appointments
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Site settings created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });