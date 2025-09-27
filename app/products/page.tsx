import { getProducts } from '@/lib/actions/commerce';
import { unstable_noStore as noStore } from 'next/cache';
import StandardLayout from '@/components/layout/StandardLayout';
import ProductsClient from './ProductsClient';

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
      <main className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">Premium Door Collection</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">Browse our complete selection of luxury closet doors with instant pricing and professional installation</p>
          </div>

          <ProductsClient initialProducts={products} />
        </div>
      </main>
    </StandardLayout>
  );
}
