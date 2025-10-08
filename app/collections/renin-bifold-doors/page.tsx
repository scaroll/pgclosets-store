import { Metadata } from 'next';
import simpleProducts from "@/data/simple-products.json";
import { SimpleProductCard } from "@/components/simple-product-card";
import StandardLayout from "@/components/layout/StandardLayout";

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
  const bifoldDoors = simpleProducts.filter(p =>
    p.category === 'Renin Bifold Doors' && p.id.startsWith('renin-')
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bifoldDoors.map((product) => (
            <SimpleProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}
