import Grid from '@/components/commerce/grid';
import { GridTileImage } from '@/components/commerce/grid/tile';
import { PGProduct } from '@/lib/pgclosets/types';
import Link from 'next/link';

export default function ProductGrid({ products }: { products: PGProduct[] }) {
  return (
    <>
      {products.length === 0 ? (
        <div className="mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-600">No products found</h2>
          <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Grid.Item key={product.handle} className="animate-fadeIn">
              <Link
                className="relative inline-block h-full w-full"
                href={`/store/products/${product.handle}`}
                prefetch={true}
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode: product.priceRange.minVariantPrice.currencyCode
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Link>
            </Grid.Item>
          ))}
        </Grid>
      )}
    </>
  );
}