import { Metadata } from 'next';
import enhancedProducts from "@/data/enhanced-products.json";
import { QuickConfigureCard } from "@/components/products/QuickConfigureCard";
import StandardLayout from "@/components/layout/StandardLayout";

export const metadata: Metadata = {
  title: 'Renin Closet Doors Collection | PG Closets Ottawa',
  description: 'Complete collection of Renin closet doors including bypass, bifold, and pivot styles. Modern glass designs, traditional panels, and mirror options for Ottawa homes.',
  openGraph: {
    title: 'Renin Closet Doors Collection | PG Closets Ottawa',
    description: 'Complete collection of Renin closet doors including bypass, bifold, and pivot styles. Modern glass designs, traditional panels, and mirror options for Ottawa homes.',
    images: [{
      url: 'https://www.renin.com/wp-content/uploads/2020/11/EU3210-Harmony-Closet-Doors-White-Mirror-Bypass_Beauty-1-scaled.jpg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninClosetDoorsPage() {
  const closetDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Closet Doors'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renin Closet Doors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Complete selection of Renin closet doors for every style and space. From Euro-inspired
            glass designs to traditional panel doors, find the perfect closet door solution for your home.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{closetDoors.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">All Styles</span>
              <span className="text-muted-foreground">Bypass, Bifold & Pivot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Premium Quality</span>
              <span className="text-muted-foreground">Engineered Wood</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-3 gap-8">
          {closetDoors.map((product) => (
            <QuickConfigureCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}
