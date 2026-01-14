import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "@/components/ui/icons";
import { reninProductLoader, ReninProduct } from "@/lib/renin-product-loader";

// Loading component matching design language
function ProductPageLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-24 mb-8"></div>
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="aspect-square bg-slate-200 rounded-lg"></div>
            <div className="space-y-6">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product details component
async function ProductDetails({ slug }: { slug: string }) {
  const product = await reninProductLoader.getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  // Get price information
  const prices = product.variants
    ?.map((v) => v.price)
    .filter((price) => price > 0) || [];

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Format price display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const priceDisplay = () => {
    if (minPrice === 0) return "Contact for Price";
    if (minPrice === maxPrice) return formatPrice(minPrice);
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  // Check if product is on sale
  const compareAtPrices = product.variants
    ?.map((v) => v.compare_at_price)
    .filter((price) => price && price > 0) || [];
  const isOnSale = compareAtPrices.length > 0 && compareAtPrices.some((price, index) => price && prices[index] && price > prices[index]);

  // Primary image
  const primaryImage = product.images?.[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/products" className="hover:text-slate-900 transition-colors flex items-center">
            <ArrowLeft className="mr-1" size={16} />
            All Products
          </Link>
          <span>/</span>
          <span className="text-slate-900">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage.src}
                  alt={primaryImage.alt || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Sale badge */}
              {isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded">
                  Sale
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.title} view ${index + 2}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Category */}
            <div className="text-xs uppercase tracking-widest text-slate-500 font-light">
              {product.product_type}
            </div>

            {/* Title and Price */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900">
                {product.title}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="text-3xl font-medium text-slate-900">
                  {priceDisplay()}
                </div>
                {isOnSale && compareAtPrices[0] && (
                  <div className="text-xl text-slate-500 line-through">
                    {formatPrice(compareAtPrices[0])}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none">
              <p className="text-lg font-light text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900">Available Options</h3>
                <div className="grid gap-4">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      <div>
                        <div className="font-medium text-slate-900">{variant.title}</div>
                        <div className="text-sm text-slate-600">
                          {variant.option1 && `${variant.option1}`}
                          {variant.option2 && ` • ${variant.option2}`}
                          {variant.option3 && ` • ${variant.option3}`}
                        </div>
                      </div>
                      <div className="text-lg font-medium text-slate-900">
                        {variant.price > 0 ? formatPrice(variant.price) : "Contact for Price"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900">Features</h3>
                <div className="space-y-2">
                  {product.options.map((option) => (
                    <div key={option.name} className="flex items-start">
                      <Check className="text-green-600 mr-3 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <div className="font-medium text-slate-900">{option.name}</div>
                        <div className="text-sm text-slate-600">
                          {option.values.join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900">Product Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-light rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link
                href="/contact"
                className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Get Your Free Quote
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/products"
                className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-900 font-medium hover:border-slate-900 transition-colors"
              >
                View All Products
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0 text-sm text-slate-600 pt-8 border-t border-slate-200">
              <div className="flex items-center">
                <Check className="text-green-600 mr-2" size={16} />
                Professional Installation
              </div>
              <div className="flex items-center">
                <Check className="text-green-600 mr-2" size={16} />
                5-Year Warranty
              </div>
              <div className="flex items-center">
                <Check className="text-green-600 mr-2" size={16} />
                Ottawa Local
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24 pt-24 border-t border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extralight tracking-tight text-slate-900 mb-4">
              You Might Also Like
            </h2>
            <p className="text-lg font-light text-slate-600">
              Other popular doors from our collection
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-900 font-medium hover:border-slate-900 transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await reninProductLoader.getProductByHandle(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | PG Closets Ottawa",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.title} | ${product.product_type} | PG Closets Ottawa`,
    description: product.seo?.description || product.description || `${product.title} - ${product.product_type} from PG Closets. Professional installation in Ottawa and surrounding areas.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  };
}

// Main page component
export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<ProductPageLoading />}>
      <ProductDetails slug={params.slug} />
    </Suspense>
  );
}

// Disable static generation for now to fix production deployment
export const dynamic = 'force-dynamic';