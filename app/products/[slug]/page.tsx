import { notFound } from 'next/navigation';
import { getReninProductBySlug } from '@/lib/renin-catalog';
import StandardLayout from '@/components/layout/StandardLayout';
import { Metadata } from 'next';
import { BUSINESS_INFO } from '@/lib/business-config';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/comprehensive-schema';
import { EnhancedProductDetail } from '@/components/products/EnhancedProductDetail';
import type { ReninProduct, ProductVariant } from '@/lib/types/renin-products';

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
  }).format(price);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = getReninProductBySlug(slug);

    if (!product) {
      return {
        title: 'Product Not Found | PG Closets',
      };
    }

    const title = product.seo?.title || `${product.name} | PG Closets Ottawa`;
    const lowestPrice = product.variants?.length > 0
      ? Math.min(...product.variants.map(v => v.priceCAD))
      : 0;
    const description = product.seo?.description ||
      `${product.description.substring(0, 120)}... Starting from ${formatPrice(lowestPrice)} with professional installation.`;

    return {
      title,
      description,
      keywords: product.seo?.keywords?.join(', '),
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'en_CA',
        images: product.media?.map(m => ({
          url: m.url,
          width: m.width,
          height: m.height,
          alt: m.alt,
        })) || [],
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
    const product = getReninProductBySlug(slug);

    if (!product) {
      notFound();
    }

    // Generate comprehensive structured data
    const productUrl = `${BUSINESS_INFO.urls.main}/products/${product.slug}`;
    const lowestPrice = product.variants?.length > 0
      ? Math.min(...product.variants.map(v => v.priceCAD))
      : 0;

    const productSchema = generateProductSchema({
      name: product.name,
      description: product.description,
      sku: product.variants?.[0]?.sku || `PGC-${product.slug.toUpperCase()}`,
      price: lowestPrice,
      images: product.media?.map(m => m.url) || [],
      category: product.category,
      availability: product.variants?.some(v => v.availability === 'InStock') ? 'InStock' : 'OutOfStock',
      url: productUrl
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: BUSINESS_INFO.urls.main },
      { name: 'Products', url: `${BUSINESS_INFO.urls.main}/products` },
      { name: product.category?.replace('-', ' ') || 'Products', url: `${BUSINESS_INFO.urls.main}/products?category=${product.category}` },
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
        <EnhancedProductDetail product={product} />
      </StandardLayout>
    );

  } catch (error) {
    console.error('Error loading product page:', error);
    notFound();
  }
}

// Generate static paths for known products
// Temporarily disabled - export async function generateStaticParams() {
  // Return empty array to skip static generation during build
  // Products will be generated on-demand
  return [];
}

// Enable ISR: Revalidate every hour
export const revalidate = 3600;