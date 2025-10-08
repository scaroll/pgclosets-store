import StandardLayout from '@/components/layout/StandardLayout';
import { ProductsHub } from '@/components/products/ProductsHub';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Closet & Sliding Doors | PG Closets Ottawa',
  description: 'Pick a door type to configure size, panels, and finish. Get an instant installed estimate. Barn doors, bypass doors, bifold doors, and more.',
  openGraph: {
    title: 'Shop Closet & Sliding Doors | PG Closets Ottawa',
    description: 'Pick a door type to configure size, panels, and finish. Get an instant installed estimate.',
    url: 'https://www.pgclosets.com/products',
    type: 'website',
  },
};

export default function ProductsPage() {
  return (
    <StandardLayout>
      <ProductsHub />
    </StandardLayout>
  );
}
