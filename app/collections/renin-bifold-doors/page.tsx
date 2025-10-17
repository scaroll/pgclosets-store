import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";

// Dynamically import QuickConfigureCard
const QuickConfigureCard = dynamic(
  () => import("@/components/products/QuickConfigureCard").then(mod => ({ default: mod.QuickConfigureCard })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg mb-4" />
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: 'Renin Bifold Doors Collection | PG Closets Ottawa',
  description: 'Space-saving Renin bifold closet doors with modern glass designs. Easy-Roll hardware, steel frames, and contemporary styling for Ottawa homes.',
  openGraph: {
    title: 'Renin Bifold Doors Collection | PG Closets Ottawa',
    description: 'Space-saving Renin bifold closet doors with modern glass designs. Easy-Roll hardware, steel frames, and contemporary styling for Ottawa homes.',
    images: [{
      url: 'https://www.renin.com/wp-content/uploads/2020/11/EU3110_Euro-1-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninBifoldDoorsPage() {
  const bifoldDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Bifold Doors'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renin Bifold Doors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Maximize closet access with Renin bifold doors. Featuring Easy-Roll hardware and
            low-profile bottom tracks, these space-saving doors provide an additional 4 inches
            of complete closet access compared to traditional swing doors.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{bifoldDoors.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Easy-Roll</span>
              <span className="text-muted-foreground">Smooth Operation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Steel Frames</span>
              <span className="text-muted-foreground">Durable Construction</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bifoldDoors.map((product) => (
            <QuickConfigureCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}
