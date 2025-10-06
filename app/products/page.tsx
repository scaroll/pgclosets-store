import { getProducts } from '@/lib/actions/commerce';
import { unstable_noStore as noStore } from 'next/cache';
import StandardLayout from '@/components/layout/StandardLayout';
import ProductsClient from './ProductsClient';
import Heading from '@/components/ui/Heading-new';
import Text from '@/components/ui/Text-new';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  noStore();
  const params = await searchParams;
  const collection = typeof params?.collection === 'string' ? params.collection : undefined;
  const products = await getProducts({ collection });

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={1} balance className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-[0.95] text-white">
              Curated
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl opacity-90">
                Collection
              </span>
            </Heading>
            <Text size="lg" className="text-white/80 leading-relaxed md:text-xl">
              Discover premium closet solutions crafted for discerning homeowners.
              Each piece selected for exceptional quality and timeless design.
            </Text>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ProductsClient initialProducts={products} />
        </div>
      </main>
    </StandardLayout>
  );
}
