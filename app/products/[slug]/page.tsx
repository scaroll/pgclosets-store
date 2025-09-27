import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductByHandle, getProducts } from "@/lib/actions/commerce";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StandardLayout from "@/components/layout/StandardLayout";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const products = await getProducts({});
  return products.map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return { title: "Product Not Found | PG Closets" };

  const title = `${product.title} | PG Closets Ottawa`;
  const description = `Premium closet solutions in Ottawa. ${product.description}. Starting from ${formatPrice(product.variants[0]?.price)} CAD with professional installation.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.thumbnail || '/placeholder.svg',
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: "website",
      locale: "en_CA",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return notFound();

  const priceText = `From ${formatPrice(product.variants[0]?.price)} CAD`;
  const relatedProducts = (await getProducts({ collection: product.collection?.handle })).filter(p => p.id !== product.id).slice(0, 3);

  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            sku: `PGC-${product.title.replace(/\s+/g, '-').toUpperCase()}`,
            brand: {
              "@type": "Brand",
              name: "Renin",
            },
            manufacturer: {
              "@type": "Organization",
              name: "Renin Corp",
              url: "https://www.renin.com"
            },
            offers: {
              "@type": "Offer",
              price: product.variants[0]?.price || 0,
              priceCurrency: "CAD",
              availability: "https://schema.org/InStock",
              priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: "PG Closets",
                url: "https://pgclosets.com",
                telephone: "(613) 422-5800",
                email: "info@pgclosets.com"
              }
            },
            image: product.thumbnail ? [product.thumbnail] : [],
            category: product.collection?.title || "Closet Doors",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "127",
              bestRating: "5",
              worstRating: "1"
            }
          })
        }}
      />
      <main className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <section className="grid lg:grid-cols-2 gap-10 mb-12">
            <div className="bg-white shadow-xl overflow-hidden min-h-[320px] lg:min-h-[480px] relative">
              <Image
                src={product.thumbnail || '/placeholder.svg'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={true}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900">
                  {product.title}
                </h1>
                <div className="text-sm text-slate-600 font-light uppercase tracking-widest">
                  {product.collection?.title || 'General'}
                </div>
                <div className="text-3xl font-extralight text-slate-900 tracking-tight">
                  {priceText}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Request Installation Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div className="bg-white shadow-lg p-6">
                  <h2 className="text-xl font-extralight text-slate-900 mb-3 tracking-wide">Overview</h2>
                  <p className="text-slate-600 font-light">
                    {product.description}
                  </p>
                </div>
                <div className="bg-white shadow-lg p-6">
                  <h2 className="text-xl font-extralight text-slate-900 mb-3 tracking-wide">What&apos;s Included</h2>
                  <ul className="text-slate-600 font-light space-y-1">
                    <li>• Track & soft-close hardware</li>
                    <li>• Professional installation (Ottawa)</li>
                    <li>• Removal/disposal of old doors</li>
                    <li>• 2-year workmanship warranty</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">Related Products</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map(related => (
                  <Link href={`/products/${related.handle}`} key={related.id} passHref>
                    <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
                      <CardHeader className="p-0">
                        <div className="relative h-64 w-full">
                          <Image
                            src={related.thumbnail || '/placeholder.svg'}
                            alt={related.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg font-light">{related.title}</CardTitle>
                        <p className="mt-4 text-lg font-extralight text-slate-800">
                          {formatPrice(related.variants[0]?.price)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </StandardLayout>
  );
}
