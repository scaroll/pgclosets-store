import { CommerceNavbar } from '@/components/commerce/navbar';
import ProductGrid from '@/components/commerce/product-grid';
import FilterList from '@/components/commerce/filter-list';
import { searchProducts } from '@/lib/pgclosets';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { q: searchValue, category, sort, min, max } = params as {
    [key: string]: string;
  };

  const filters = {
    category: category ? [category] : undefined,
    priceRange: min && max ? { min: parseInt(min), max: parseInt(max) } : undefined
  };

  const searchResult = await searchProducts(searchValue || '', filters);

  if (!searchResult) {
    notFound();
  }

  const resultsText = searchResult.products.length > 1 ? 'results' : 'result';

  return (
    <>
      <CommerceNavbar />
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <FilterList list={searchResult.filters} />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          {searchValue ? (
            <p className="mb-4">
              {searchResult.totalCount === 0
                ? 'There are no products that match '
                : `Showing ${searchResult.totalCount} ${resultsText} for `}
              <span className="font-bold">&quot;{searchValue}&quot;</span>
            </p>
          ) : null}
          {searchResult.totalCount > 0 ? (
            <ProductGrid products={searchResult.products} />
          ) : null}
        </div>
      </div>
    </>
  );
}