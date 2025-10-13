import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";

// Dynamically import QuickConfigureCard
const QuickConfigureCard = dynamic(
  () => import("@/components/products/QuickConfigureCard").then(mod => ({ default: mod.QuickConfigureCard })),
  { loading: () => <div className="animate-pulse"><div className="aspect-square bg-gray-200 rounded-t-lg mb-4"></div><div className="p-6 space-y-3"><div className="h-6 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div></div> }
);

export const metadata: Metadata = {
  title: 'Renin Room Dividers Collection | PG Closets Ottawa',
  description: 'Premium Renin room dividers and partition systems. Double barn doors, glass partitions, accordion dividers, and Japanese shoji screens for Ottawa homes.',
  openGraph: {
    title: 'Renin Room Dividers Collection | PG Closets Ottawa',
    description: 'Premium Renin room dividers and partition systems. Double barn doors, glass partitions, accordion dividers, and Japanese shoji screens for Ottawa homes.',
    images: [{
      url: 'https://www.renin.com/cdn/shop/files/RD001_Savannah_Rustic_Grey_wBH300_BHDM_Satin_Black_Horiz_0016.jpg?v=1729100839&width=2048',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninRoomDividersPage() {
  const roomDividers = enhancedProducts.filter(p =>
    p.category === 'Renin Room Dividers'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renin Room Dividers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Transform open spaces with sophisticated room dividers. From double barn door systems to
            glass partitions and accordion dividers, create flexible living spaces with style.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{roomDividers.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Large Scale</span>
              <span className="text-muted-foreground">Up to 16ft Wide</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Multiple Styles</span>
              <span className="text-muted-foreground">Glass & Wood</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomDividers.map((product) => (
            <QuickConfigureCard key={product.id} product={product as any} />
          ))}
        </div>

      </div>
    </StandardLayout>
  );
}