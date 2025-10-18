import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import StandardLayout from '@/components/layout/StandardLayout';
import { EnhancedProductDetailPage } from '@/components/product/EnhancedProductDetailPage';
import { Metadata } from 'next';
import { BUSINESS_INFO } from '@/lib/business-config';

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

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku || `PGC-${product.slug.toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "Renin",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Renin Corp",
      url: "https://www.renin.com",
    },
    offers: {
      "@type": "Offer",
      price: (product.salePrice || product.price) / 100,
      priceCurrency: "CAD",
      availability: product.inventory > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: BUSINESS_INFO.name,
        url: BUSINESS_INFO.urls.main,
        email: BUSINESS_INFO.email,
      },
    },
    image: product.images.map(img => img.url),
    category: product.category,
    ...(averageRating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: product.reviews.length,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };

  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
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
  const products = await prisma.product.findMany({
    where: { status: 'active' },
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Enable ISR: Revalidate every hour
export const revalidate = 3600;