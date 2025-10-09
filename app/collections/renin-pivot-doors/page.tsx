import { Metadata } from 'next';
import enhancedProducts from "@/data/enhanced-products.json";
import { QuickConfigureCard } from "@/components/products/QuickConfigureCard";
import StandardLayout from "@/components/layout/StandardLayout";

export const metadata: Metadata = {
  title: 'Renin Pivot Doors Collection | PG Closets Ottawa',
  description: 'Premium Renin pivot doors for walk-in closets. Modern flush designs, glass panels, and double door systems with concealed hinges.',
  openGraph: {
    title: 'Renin Pivot Doors Collection | PG Closets Ottawa',
    description: 'Premium Renin pivot doors for walk-in closets. Modern flush designs, glass panels, and double door systems with concealed hinges.',
    images: [{
      url: 'https://www.renin.com/cdn/shop/files/PV001_Modern_Flush_White_0023.jpg?v=1729100345&width=2048',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninPivotDoorsPage() {
  const pivotDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Pivot Doors'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renin Pivot Doors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Elegant pivot doors for walk-in closets and dressing rooms. From minimalist flush designs
            to glass panel options, create a sophisticated entrance to your personal space.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{pivotDoors.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Concealed Hinges</span>
              <span className="text-muted-foreground">Clean Look</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Premium Finish</span>
              <span className="text-muted-foreground">Multiple Options</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pivotDoors.map((product) => (
            <QuickConfigureCard key={product.id} product={product as any} />
          ))}
        </div>

      </div>
    </StandardLayout>
  );
}