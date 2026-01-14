import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductDetails from '@/components/products/ProductDetails';
import { reninProductLoader } from '@/lib/renin-product-loader';

interface ProductPageProps {
  params: { id: string };
}

// Generate metadata for the product page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = params;
    const product = await getProduct(id);

    if (!product) {
      return {
        title: 'Product Not Found | PG Closets Ottawa',
        description: 'The requested product could not be found.',
      };
    }

    // Extract description from description or use title
    const description = product.description
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
      : `${product.title} - Premium closet door from Ottawa's trusted Renin dealer.`;

    // Get price range for meta
    const prices = product.variants.map(v => v.price).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      title: `${product.title} | PG Closets Ottawa`,
      description,
      keywords: [
        product.title,
        product.product_type,
        ...product.tags,
        'closet doors ottawa',
        'custom doors',
        'renin dealer'
      ].join(', '),
      openGraph: {
        title: `${product.title} | PG Closets Ottawa`,
        description,
        type: 'website',
        images: product.images.map(img => ({
          url: img.src,
          alt: img.alt || product.title,
        })),
        locale: 'en_CA',
      },
      other: {
        'product:price:amount': minPrice.toString(),
        'product:price:currency': 'CAD',
        'product:availability': product.variants.some(v => (v.inventory_quantity || 0) > 0) ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': 'Renin',
        'product:category': product.product_type,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | PG Closets Ottawa',
      description: 'Premium closet doors from Ottawa\'s trusted Renin dealer.',
    };
  }
}

// Get product data
async function getProduct(id: string) {
  try {
    // Try to get by ID first
    let product = await reninProductLoader.getProductById(id);

    // If not found by ID, try by handle
    if (!product) {
      product = await reninProductLoader.getProductByHandle(id);
    }

    // If still not found, try by SKU
    if (!product) {
      product = await reninProductLoader.getProductsBySku(id);
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get related products
async function getRelatedProducts(productId: string, productType?: string) {
  try {
    if (!productType) return [];

    const relatedProducts = await reninProductLoader.getProductsByType(productType);
    return relatedProducts
      .filter(p => p.id !== productId)
      .filter(p => p.images.length > 0 && p.variants.some(v => v.price > 0))
      .slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.product_type);

  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="container-apple section-apple">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 shimmer rounded-lg"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 shimmer rounded"></div>
                  ))}
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 shimmer rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 shimmer rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 shimmer rounded w-1/3"></div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 shimmer rounded"></div>
                  <div className="h-4 bg-gray-200 shimmer rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 shimmer rounded w-4/6"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 shimmer rounded w-1/4"></div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 shimmer rounded"></div>
                    ))}
                  </div>
                </div>

                <div className="h-12 bg-gray-200 shimmer rounded"></div>
              </div>
            </div>
          </div>
        }
      >
        <ProductDetails
          product={product}
          relatedProducts={relatedProducts}
        />
      </Suspense>
    </div>
  );
}

// Disable static generation for now to fix production deployment
export const dynamic = 'force-dynamic';

// Optional: Re-enable static generation after product data is stable
// export async function generateStaticParams() {
//   try {
//     const featuredProducts = await reninProductLoader.getFeaturedProducts(10);
//     return featuredProducts.map((product) => ({
//       id: product.handle || product.id,
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }