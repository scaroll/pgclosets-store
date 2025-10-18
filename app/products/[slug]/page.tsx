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
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

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
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
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

  if (!product) {
    notFound();
  }

  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  // Get related products
  const relatedProducts = await prisma.product.findMany({
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
    },
    take: 4,
  });

  // Format product data for component
  const productData = {
    ...product,
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
}

// Generate static paths for known products
export async function generateStaticParams() {
  // Return empty array to skip static generation during build
  // Products will be generated on-demand
  return [];
}

// Enable ISR: Revalidate every hour
export const revalidate = 3600;