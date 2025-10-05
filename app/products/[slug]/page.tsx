import { notFound } from "next/navigation";
import { getProductByHandle, getProducts } from "@/lib/actions/commerce";
import { formatPrice } from "@/lib/utils";
import StandardLayout from "@/components/layout/StandardLayout";
import { EnhancedProductDetailPage } from "@/components/product/EnhancedProductDetailPage";

// Enable ISR: Revalidate every hour instead of force-static
export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts({});
  return products.map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return { title: "Product Not Found | PG Closets" };

  const title = `${product.title} | PG Closets Ottawa`;
  const productPrice = product.variants[0]?.price ?? 0;
  const description = `Premium closet solutions in Ottawa. ${product.description}. Starting from ${formatPrice(productPrice)} CAD with professional installation.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.thumbnail || "/placeholder.svg",
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return notFound();

  const relatedProducts = (
    await getProducts({ collection: product.collection?.handle })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

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
            sku: `PGC-${product.title.replace(/\s+/g, "-").toUpperCase()}`,
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
              price: product.variants[0]?.price || 0,
              priceCurrency: "CAD",
              availability: "https://schema.org/InStock",
              priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: "PG Closets",
                url: "https://pgclosets.com",
                telephone: "(613) 422-5800",
                email: "info@pgclosets.com",
              },
            },
            image: product.thumbnail ? [product.thumbnail] : [],
            category: product.collection?.title || "Closet Doors",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "127",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
      <EnhancedProductDetailPage
        product={{
          id: product.id,
          title: product.title,
          description: product.description,
          thumbnail: product.thumbnail,
          images: product.images || [],
          variants: product.variants,
          collection: product.collection,
        }}
        relatedProducts={relatedProducts.map((p) => ({
          id: p.handle,
          title: p.title,
          description: p.description,
          thumbnail: p.thumbnail,
          images: p.images || [],
          variants: p.variants,
          collection: p.collection,
        }))}
      />
    </StandardLayout>
  );
}
