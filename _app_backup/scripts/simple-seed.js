#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Simple database seeding...\n');

  try {
    // Create admin user
    const adminPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash('Admin123!', 12));

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

    // Create a simple product
    const product = await prisma.product.upsert({
      where: { slug: 'sample-barn-door' },
      update: {},
      create: {
        name: 'Sample Barn Door',
        slug: 'sample-barn-door',
        description: 'A beautiful sample barn door for testing purposes.',
        category: 'barn-doors',
        price: 49900, // $499.00
        inventory: 25,
        features: 'Soft-close mechanism,Premium hardware,Customizable finish',
        tags: 'bestseller,modern,sliding',
        status: 'active',
        featured: true,
        material: 'Engineered Wood',
        finish: 'Matte Black',
        dimensions: { width: 36, height: 80, depth: 1.75 },
        weight: 85,
        images: {
          create: [
            {
              url: '/images/products/barn-door-1.jpg',
              alt: 'Sample Barn Door',
              position: 0
            }
          ]
        },
        variants: {
          create: [
            {
              name: '36" x 80"',
              sku: 'SBD-36-80',
              price: 49900,
              attributes: JSON.stringify({ size: '36x80', width: 36, height: 80 }),
              inventory: 15
            }
          ]
        }
      },
    });
    console.log('✅ Sample product created');

    // Create a site setting
    const setting = await prisma.siteSetting.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: 'PG Closets - Premium Custom Closets',
      },
    });
    console.log('✅ Site setting created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Created:');
    console.log('   • Admin user: admin@pgclosets.com / Admin123!');
    console.log('   • Sample product: Sample Barn Door');
    console.log('   • Site configuration');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });