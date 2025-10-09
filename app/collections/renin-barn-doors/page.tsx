import { Metadata } from 'next';
import enhancedProducts from "@/data/enhanced-products.json";
import { QuickConfigureCard } from "@/components/products/QuickConfigureCard";
import StandardLayout from "@/components/layout/StandardLayout";

export const metadata: Metadata = {
  title: 'Renin Barn Doors Collection | PG Closets Ottawa',
  description: 'Premium Renin barn doors for modern and traditional homes in Ottawa. Complete barn door kits with hardware, installation guides, and professional support.',
  openGraph: {
    title: 'Renin Barn Doors Collection | PG Closets Ottawa',
    description: 'Premium Renin barn doors for modern and traditional homes in Ottawa. Complete barn door kits with hardware, installation guides, and professional support.',
    images: [{
      url: 'https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninBarnDoorsPage() {
  // Filter for Renin Barn Doors
  const barnDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Barn Doors'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renin Barn Doors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Transform your space with premium Renin barn doors. From modern minimalist to rustic farmhouse,
            our complete barn door kits include everything you need for professional installation.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{barnDoors.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Complete Kits</span>
              <span className="text-muted-foreground">Hardware Included</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Multiple Finishes</span>
              <span className="text-muted-foreground">Modern & Traditional</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {barnDoors.map((product) => (
            <QuickConfigureCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}
