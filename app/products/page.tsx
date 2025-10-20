import { Metadata } from 'next';
import EnhancedProductsPage from './enhanced-page';

export const metadata: Metadata = {
  title: 'Shop Premium Doors & Hardware | PG Closets Ottawa',
  description: 'Discover our collection of premium barn doors, bifold doors, bypass doors, pivot doors, hardware, and mirrors. Canadian-made quality with modern designs.',
  openGraph: {
    title: 'Shop Premium Doors & Hardware | PG Closets Ottawa',
    description: 'Discover our collection of premium barn doors, bifold doors, bypass doors, pivot doors, hardware, and mirrors.',
    url: 'https://www.pgclosets.com/products',
    type: 'website',
  },
};

export default function ProductsPage() {
  return <EnhancedProductsPage />;
}