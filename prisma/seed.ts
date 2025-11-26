import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Categories
  console.log('Creating categories...');

  const barnDoorsCategory = await prisma.category.upsert({
    where: { slug: 'barn-doors' },
    update: {},
    create: {
      name: 'Barn Doors',
      slug: 'barn-doors',
      description: 'Stylish sliding barn doors perfect for modern and rustic spaces',
      image: '/images/categories/barn-doors.jpg',
      sortOrder: 1,
    },
  });

  const bifoldDoorsCategory = await prisma.category.upsert({
    where: { slug: 'bifold-doors' },
    update: {},
    create: {
      name: 'Bifold Doors',
      slug: 'bifold-doors',
      description: 'Space-saving bifold closet doors ideal for any room',
      image: '/images/categories/bifold-doors.jpg',
      sortOrder: 2,
    },
  });

  const frenchDoorsCategory = await prisma.category.upsert({
    where: { slug: 'french-doors' },
    update: {},
    create: {
      name: 'French Doors',
      slug: 'french-doors',
      description: 'Elegant French doors for a classic, sophisticated look',
      image: '/images/categories/french-doors.jpg',
      sortOrder: 3,
    },
  });

  const glassDoorsCategory = await prisma.category.upsert({
    where: { slug: 'glass-doors' },
    update: {},
    create: {
      name: 'Glass Doors',
      slug: 'glass-doors',
      description: 'Contemporary glass panel doors for natural light',
      image: '/images/categories/glass-doors.jpg',
      sortOrder: 4,
    },
  });

  const hardwareCategory = await prisma.category.upsert({
    where: { slug: 'hardware' },
    update: {},
    create: {
      name: 'Door Hardware',
      slug: 'hardware',
      description: 'Quality hardware and accessories for all door types',
      image: '/images/categories/hardware.jpg',
      sortOrder: 5,
    },
  });

  console.log('✅ Categories created');

  // Create Admin User
  console.log('Creating admin user...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pgclosets.com' },
    update: {},
    create: {
      email: 'admin@pgclosets.com',
      name: 'Admin User',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7QK5xwrPJK', // password: Admin123!
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created');

  // Create Products
  console.log('Creating products...');

  const products = [
    {
      name: 'Renin Classic Barn Door',
      slug: 'renin-classic-barn-door',
      description: 'Premium sliding barn door with modern hardware. Perfect for contemporary spaces. Features soft-close mechanism and customizable finish options. This elegant door combines style and functionality, making it an ideal choice for separating rooms while maintaining an open, airy feel.',
      shortDesc: 'Premium sliding barn door with soft-close hardware',
      price: new Decimal('499.00'),
      salePrice: new Decimal('449.00'),
      sku: 'RBD-001',
      images: [
        '/images/products/barn-door-1.jpg',
        '/images/products/barn-door-2.jpg',
        '/images/products/barn-door-3.jpg',
      ],
      specifications: {
        material: 'Engineered Wood',
        finish: 'Multiple Options',
        dimensions: { width: 36, height: 80, depth: 1.75 },
        weight: 85,
      },
      features: [
        'Soft-close mechanism',
        'Premium hardware included',
        'Customizable finish options',
        'Easy installation',
        'Modern design',
      ],
      categoryId: barnDoorsCategory.id,
      featured: true,
      bestseller: true,
      inStock: true,
      stockCount: 25,
      variants: {
        create: [
          {
            name: '30" x 80"',
            sku: 'RBD-30-80',
            price: new Decimal('429.00'),
            attributes: { size: '30x80', width: 30, height: 80 },
            inStock: true,
          },
          {
            name: '36" x 80"',
            sku: 'RBD-36-80',
            price: new Decimal('499.00'),
            attributes: { size: '36x80', width: 36, height: 80 },
            inStock: true,
          },
          {
            name: '42" x 80"',
            sku: 'RBD-42-80',
            price: new Decimal('549.00'),
            attributes: { size: '42x80', width: 42, height: 80 },
            inStock: true,
          },
        ],
      },
    },
    {
      name: 'Rustic Barn Door - Reclaimed Wood',
      slug: 'rustic-barn-door-reclaimed',
      description: 'Authentic rustic barn door made from reclaimed wood. Each door is unique with natural weathering and character. Handcrafted with attention to detail, this eco-friendly option brings warmth and history to your space.',
      shortDesc: 'Handcrafted reclaimed wood barn door',
      price: new Decimal('799.00'),
      salePrice: new Decimal('699.00'),
      sku: 'RBD-002',
      images: [
        '/images/products/rustic-barn-1.jpg',
        '/images/products/rustic-barn-2.jpg',
      ],
      specifications: {
        material: 'Reclaimed Wood',
        finish: 'Natural/Weathered',
        dimensions: { width: 36, height: 84, depth: 2 },
        weight: 110,
      },
      features: [
        'Reclaimed wood construction',
        'Unique character and patina',
        'Hand-finished',
        'Eco-friendly and sustainable',
        'Hardware not included',
      ],
      categoryId: barnDoorsCategory.id,
      featured: true,
      bestseller: false,
      inStock: true,
      stockCount: 6,
    },
    {
      name: 'Renin Bifold Closet Door - White',
      slug: 'renin-bifold-closet-door-white',
      description: 'Space-saving bifold door ideal for closets and small spaces. Smooth operation guaranteed with durable hinges and quality construction. The classic white finish complements any decor style.',
      shortDesc: 'Classic white bifold closet door',
      price: new Decimal('299.00'),
      sku: 'BFD-001',
      images: [
        '/images/products/bifold-white-1.jpg',
        '/images/products/bifold-white-2.jpg',
      ],
      specifications: {
        material: 'MDF',
        finish: 'White Primed',
        dimensions: { width: 30, height: 80, depth: 1.375 },
        weight: 55,
      },
      features: [
        'Space-efficient design',
        'Easy installation',
        'Durable hinges',
        'Smooth operation',
        'Paint-ready finish',
      ],
      categoryId: bifoldDoorsCategory.id,
      featured: false,
      bestseller: true,
      inStock: true,
      stockCount: 40,
    },
    {
      name: 'Mirror Bifold Closet Door',
      slug: 'mirror-bifold-closet-door',
      description: 'Bifold closet door with full-length mirror panels. Maximizes space and functionality in bedrooms. Safety-backed mirrors ensure durability and peace of mind.',
      shortDesc: 'Full-length mirror bifold door',
      price: new Decimal('399.00'),
      sku: 'BFD-002',
      images: [
        '/images/products/mirror-bifold-1.jpg',
        '/images/products/mirror-bifold-2.jpg',
      ],
      specifications: {
        material: 'MDF with Safety-Backed Mirror',
        finish: 'White Frame',
        dimensions: { width: 30, height: 80, depth: 1.5 },
        weight: 70,
      },
      features: [
        'Full-length mirror panels',
        'Space-enhancing',
        'Safety-backed glass',
        'Smooth glide system',
        'White aluminum frame',
      ],
      categoryId: bifoldDoorsCategory.id,
      featured: false,
      bestseller: true,
      inStock: true,
      stockCount: 20,
    },
    {
      name: 'Modern Glass Panel Door',
      slug: 'modern-glass-panel-door',
      description: 'Contemporary glass panel door with aluminum frame. Frosted glass provides privacy while allowing natural light to flow through. Perfect for modern homes and offices.',
      shortDesc: 'Contemporary frosted glass panel door',
      price: new Decimal('699.00'),
      salePrice: new Decimal('599.00'),
      sku: 'GLS-001',
      images: [
        '/images/products/glass-door-1.jpg',
        '/images/products/glass-door-2.jpg',
        '/images/products/glass-door-3.jpg',
      ],
      specifications: {
        material: 'Tempered Glass and Aluminum',
        finish: 'Brushed Silver',
        dimensions: { width: 32, height: 80, depth: 1.75 },
        weight: 95,
      },
      features: [
        'Frosted tempered glass',
        'Brushed aluminum frame',
        'Natural light transmission',
        'Modern minimalist design',
        'Easy to clean',
      ],
      categoryId: glassDoorsCategory.id,
      featured: true,
      bestseller: false,
      inStock: true,
      stockCount: 12,
    },
    {
      name: 'French Door Set - Colonial Grid',
      slug: 'french-door-set-colonial',
      description: 'Elegant French door set with traditional colonial grid pattern. Perfect for separating living spaces while maintaining an open feel. Pre-hung for easy installation.',
      shortDesc: 'Traditional French doors with colonial grid',
      price: new Decimal('899.00'),
      sku: 'FRN-001',
      images: [
        '/images/products/french-door-1.jpg',
        '/images/products/french-door-2.jpg',
      ],
      specifications: {
        material: 'Solid Pine',
        finish: 'Primed White',
        dimensions: { width: 60, height: 80, depth: 1.75 },
        weight: 120,
      },
      features: [
        'Traditional colonial grid pattern',
        'Solid wood construction',
        'Pre-hung frame included',
        'Ball-bearing hinges',
        'Paint-ready finish',
      ],
      categoryId: frenchDoorsCategory.id,
      featured: true,
      bestseller: false,
      inStock: true,
      stockCount: 8,
    },
    {
      name: 'Premium Barn Door Hardware Kit',
      slug: 'premium-barn-door-hardware',
      description: 'Complete hardware kit for barn doors. Includes track, rollers, mounting hardware, and installation guide. Supports doors up to 200 lbs. Available in multiple finishes.',
      shortDesc: 'Complete barn door hardware system',
      price: new Decimal('149.00'),
      sku: 'HRD-001',
      images: [
        '/images/products/hardware-black-1.jpg',
        '/images/products/hardware-black-2.jpg',
      ],
      specifications: {
        material: 'Heavy-Duty Steel',
        finish: 'Matte Black',
        weight: 25,
        capacity: '200 lbs',
      },
      features: [
        'Soft-close mechanism',
        'Easy installation',
        'Lifetime warranty',
        'Supports up to 200 lbs',
        'Complete hardware set',
      ],
      categoryId: hardwareCategory.id,
      featured: false,
      bestseller: true,
      inStock: true,
      stockCount: 60,
      variants: {
        create: [
          {
            name: 'Matte Black',
            sku: 'HRD-001-BLK',
            price: new Decimal('149.00'),
            attributes: { finish: 'Matte Black', color: 'black' },
            inStock: true,
          },
          {
            name: 'Brushed Nickel',
            sku: 'HRD-001-BRN',
            price: new Decimal('169.00'),
            attributes: { finish: 'Brushed Nickel', color: 'silver' },
            inStock: true,
          },
          {
            name: 'Oil-Rubbed Bronze',
            sku: 'HRD-001-ORB',
            price: new Decimal('179.00'),
            attributes: { finish: 'Oil-Rubbed Bronze', color: 'bronze' },
            inStock: true,
          },
        ],
      },
    },
    {
      name: 'Pocket Door Frame Kit',
      slug: 'pocket-door-frame-kit',
      description: 'Complete pocket door frame kit for recessed installation. Saves space and adds functionality to any room. Universal fit for standard door sizes.',
      shortDesc: 'Space-saving pocket door frame system',
      price: new Decimal('249.00'),
      sku: 'HRD-002',
      images: [
        '/images/products/pocket-frame-1.jpg',
      ],
      specifications: {
        material: 'Steel Frame',
        weight: 35,
      },
      features: [
        'Space-saving design',
        'Universal fit',
        'Heavy-duty construction',
        'Smooth glide system',
        'Complete installation kit',
      ],
      categoryId: hardwareCategory.id,
      featured: false,
      bestseller: false,
      inStock: true,
      stockCount: 30,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData as any,
    });
  }

  console.log('✅ Products created');

  // Create Testimonials
  console.log('Creating testimonials...');

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Ottawa, ON',
      rating: 5,
      quote: 'The barn door from PG Closets completely transformed our living room. The quality is exceptional and the installation was straightforward. Highly recommend!',
      featured: true,
    },
    {
      name: 'Michael Chen',
      location: 'Kanata, ON',
      rating: 5,
      quote: 'Excellent customer service and beautiful products. The mirror bifold doors are perfect for our bedroom closet.',
      featured: true,
    },
    {
      name: 'Emily Rodriguez',
      location: 'Barrhaven, ON',
      rating: 5,
      quote: 'We ordered the French doors and they arrived quickly and in perfect condition. The quality exceeded our expectations.',
      featured: false,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log('✅ Testimonials created');

  // Create Blog Posts
  console.log('Creating blog posts...');

  const blogPosts = [
    {
      title: 'Choosing the Perfect Closet Door for Your Home',
      slug: 'choosing-perfect-closet-door',
      excerpt: 'A comprehensive guide to selecting the right closet door style for your space and needs.',
      content: 'When it comes to choosing closet doors, there are several factors to consider...',
      image: '/images/blog/closet-door-guide.jpg',
      author: 'PG Closets Team',
      published: true,
      publishedAt: new Date('2025-01-15'),
      tags: ['guides', 'closet-doors', 'home-improvement'],
    },
    {
      title: '5 Benefits of Barn Doors in Modern Homes',
      slug: 'benefits-barn-doors-modern-homes',
      excerpt: 'Discover why barn doors are becoming increasingly popular in contemporary home design.',
      content: 'Barn doors have evolved from rustic farmhouse staples to must-have modern design elements...',
      image: '/images/blog/barn-doors-modern.jpg',
      author: 'PG Closets Team',
      published: true,
      publishedAt: new Date('2025-02-01'),
      tags: ['barn-doors', 'design-trends', 'modern-homes'],
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post,
    });
  }

  console.log('✅ Blog posts created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Categories: 5`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Testimonials: ${testimonials.length}`);
  console.log(`- Blog Posts: ${blogPosts.length}`);
  console.log(`- Admin User: admin@pgclosets.com (password: Admin123!)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
