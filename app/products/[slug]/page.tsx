import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import StandardLayout from '@/components/layout/StandardLayout';
import { EnhancedProductDetailPage } from '@/components/product/EnhancedProductDetailPage';
import { Metadata } from 'next';
import { BUSINESS_INFO } from '@/lib/business-config';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/comprehensive-schema';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Format price helper
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price / 100); // Convert cents to dollars
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    let product;

    try {
      product = await prisma.product.findUnique({
        where: { slug },
      });
    } catch (dbError) {
      console.error('Database error in generateMetadata, using fallback:', dbError);
      // Return fallback metadata without database
      const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return {
        title: `${name} | PG Closets Ottawa`,
        description: 'Premium closet doors and organization solutions in Ottawa. Contact us for more information.',
        openGraph: {
          title: `${name} | PG Closets Ottawa`,
          description: 'Premium closet doors and organization solutions in Ottawa.',
          type: 'website',
          locale: 'en_CA',
        },
      };
    }

    if (!product) {
      return {
        title: 'Product Not Found | PG Closets',
      };
    }

    const title = `${product.name} | PG Closets Ottawa`;
    const description = product.metaDescription ||
      `${product.description.substring(0, 120)}... Starting from ${formatPrice(product.price)} with professional installation.`;

    return {
      title: product.metaTitle || title,
      description,
      openGraph: {
        title: product.metaTitle || title,
        description,
        type: 'website',
        locale: 'en_CA',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | PG Closets',
      description: 'Premium closet doors and organization solutions in Ottawa',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params;

    // Try to fetch from database, but catch connection errors
    let product;
    try {
      product = await prisma.product.findUnique({
        where: {
          slug,
          status: 'active',
        },
        include: {
          images: {
            orderBy: { position: 'asc' },
          },
          variants: {
            orderBy: { createdAt: 'asc' },
          },
          reviews: {
            where: { status: 'approved' },
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch (dbError) {
      // Database connection failed - use fallback mock data for demo
      console.error('Database connection failed, using fallback data:', dbError);

      // Determine product category and images based on slug
      const determineCategory = (slug: string): { category: string; images: string[]; description: string } => {
        if (slug.includes('barn')) {
          return {
            category: 'Barn Doors',
            images: [
              '/images/products/barn-door-main.jpg',
              '/images/products/barn-door-detail.jpg',
              '/images/products/barn-door-hardware.jpg',
              '/images/products/barn-door-lifestyle.jpg'
            ],
            description: 'Premium barn door with modern design. Features smooth sliding hardware, durable construction, and timeless aesthetic. Perfect for adding style and functionality to any space.'
          };
        } else if (slug.includes('bifold')) {
          return {
            category: 'Bifold Doors',
            images: [
              '/images/products/bifold-door-main.jpg',
              '/images/products/bifold-door-open.jpg',
              '/images/products/bifold-door-detail.jpg',
              '/images/products/bifold-door-installation.jpg'
            ],
            description: 'Space-saving bifold door system with premium hardware. Smooth operation, elegant design, and maximum accessibility. Ideal for closets and tight spaces.'
          };
        } else if (slug.includes('bypass')) {
          return {
            category: 'Bypass Doors',
            images: [
              '/images/products/bypass-door-main.jpg',
              '/images/products/bypass-door-system.jpg',
              '/images/products/bypass-door-detail.jpg',
              '/images/products/bypass-door-lifestyle.jpg'
            ],
            description: 'Sliding bypass door system with sleek track design. Efficient space utilization, smooth gliding action, and contemporary styling. Perfect for modern closets.'
          };
        } else if (slug.includes('pivot')) {
          return {
            category: 'Pivot Doors',
            images: [
              '/images/products/pivot-door-main.jpg',
              '/images/products/pivot-door-hardware.jpg',
              '/images/products/pivot-door-detail.jpg',
              '/images/products/pivot-door-open.jpg'
            ],
            description: 'Innovative pivot door with center-hung hardware. Unique rotating mechanism, architectural appeal, and premium construction. Statement piece for any room.'
          };
        } else if (slug.includes('hardware')) {
          return {
            category: 'Hardware',
            images: [
              '/images/products/hardware-main.jpg',
              '/images/products/hardware-detail.jpg',
              '/images/products/hardware-finish.jpg',
              '/images/products/hardware-installation.jpg'
            ],
            description: 'Premium door hardware with superior craftsmanship. Multiple finish options, heavy-duty construction, and smooth operation. Complete your door system with style.'
          };
        } else if (slug.includes('mirror')) {
          return {
            category: 'Mirror Doors',
            images: [
              '/images/products/mirror-door-main.jpg',
              '/images/products/mirror-door-reflection.jpg',
              '/images/products/mirror-door-frame.jpg',
              '/images/products/mirror-door-lifestyle.jpg'
            ],
            description: 'Elegant mirror door system that expands visual space. High-quality mirror, sturdy frame, and smooth operation. Perfect for bedrooms and dressing areas.'
          };
        } else {
          return {
            category: 'Doors',
            images: [
              '/images/products/door-main.jpg',
              '/images/products/door-detail.jpg',
              '/images/products/door-hardware.jpg',
              '/images/products/door-lifestyle.jpg'
            ],
            description: 'Premium door system with quality construction and modern design. Durable materials, smooth operation, and timeless appeal. Transform your space today.'
          };
        }
      };

      const productInfo = determineCategory(slug);
      const productName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      // Create mock product data based on slug
      const mockProduct = {
        id: `mock-${slug}`,
        name: productName,
        slug,
        description: productInfo.description,
        status: 'active' as const,
        category: productInfo.category,
        price: 49999, // $499.99
        compareAtPrice: 59999, // $599.99
        salePrice: null,
        inventory: 10,
        sku: `PGC-${slug.toUpperCase()}`,
        metaTitle: null,
        metaDescription: null,
        images: productInfo.images.map((url, index) => ({
          url,
          altText: `${productName} - Image ${index + 1}`,
          position: index,
          id: `mock-img-${index + 1}`,
          productId: `mock-${slug}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        variants: [{
          id: 'mock-variant-1',
          productId: `mock-${slug}`,
          price: 49999,
          sku: `PGC-${slug.toUpperCase()}-01`,
          name: 'Standard',
          inventory: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      product = mockProduct;
    }

    if (!product) {
      notFound();
    }

  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  // Get related products with fallback
  let relatedProductsRaw = [];
  try {
    relatedProductsRaw = await prisma.product.findMany({
      where: {
        status: 'active',
        category: product.category,
        id: { not: product.id },
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        variants: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      take: 4,
    });
  } catch (dbError) {
    console.error('Error fetching related products, using empty array:', dbError);
    // Fallback to empty related products array
    relatedProductsRaw = [];
  }

  // Map related products to expected interface
  const relatedProducts = relatedProductsRaw.map(p => ({
    id: p.id,
    title: p.name,
    description: p.description,
    thumbnail: p.images[0]?.url || null,
    images: p.images.map(img => img.url),
    variants: p.variants.map(v => ({
      price: v.price,
    })),
    collection: {
      title: p.category,
      handle: p.category.toLowerCase().replace(/\s+/g, '-'),
    },
  }));

  // Format product data for component - map Prisma fields to component interface
  const productData = {
    id: product.id,
    title: product.name, // Map 'name' from Prisma to 'title' expected by component
    description: product.description,
    thumbnail: product.images[0]?.url || null, // Map first image as thumbnail
    images: product.images.map(img => img.url), // Extract image URLs
    variants: product.variants.map(v => ({
      price: v.price,
    })),
    collection: {
      title: product.category,
      handle: product.category.toLowerCase().replace(/\s+/g, '-'),
    },
    averageRating,
    reviewCount: product.reviews.length,
    // Determine current price (sale price or regular price)
    currentPrice: product.salePrice || product.price,
    originalPrice: product.salePrice ? product.price : product.compareAtPrice,
    isOnSale: !!product.salePrice,
  };

  // Generate comprehensive structured data
  const productUrl = `${BUSINESS_INFO.urls.main}/products/${product.slug}`;

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    sku: product.sku || `PGC-${product.slug.toUpperCase()}`,
    price: product.price,
    salePrice: product.salePrice,
    images: product.images.map(img => img.url),
    category: product.category,
    availability: product.inventory > 0 ? 'InStock' : 'OutOfStock',
    rating: averageRating > 0 ? averageRating : undefined,
    reviewCount: product.reviews.length > 0 ? product.reviews.length : undefined,
    url: productUrl
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BUSINESS_INFO.urls.main },
    { name: 'Products', url: `${BUSINESS_INFO.urls.main}/products` },
    { name: product.category, url: `${BUSINESS_INFO.urls.main}/products?category=${product.category}` },
    { name: product.name, url: productUrl }
  ]);

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [productSchema, breadcrumbSchema]
  };

    return (
      <StandardLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graphSchema),
          }}
        />
        <EnhancedProductDetailPage
          product={productData}
          relatedProducts={relatedProducts}
        />
      </StandardLayout>
    );
  } catch (error) {
    console.error('Error loading product page:', error);
    // Re-throw to trigger Next.js error boundary
    throw new Error(`Failed to load product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate static paths for known products
export async function generateStaticParams() {
  // Return empty array to skip static generation during build
  // Products will be generated on-demand
  return [];
}

// Enable ISR: Revalidate every hour
export const revalidate = 3600;