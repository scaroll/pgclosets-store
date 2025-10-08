import { Metadata } from 'next';
import simpleProducts from "@/data/simple-products.json";
import { QuickConfigureCard } from "@/components/products/QuickConfigureCard";
import StandardLayout from "@/components/layout/StandardLayout";

export const metadata: Metadata = {
  title: 'Renin Bypass Doors Collection | PG Closets Ottawa',
  description: 'Premium Renin bypass closet doors with mirror and glass options. Smooth gliding systems with soft-close technology for Ottawa homes.',
  openGraph: {
    title: 'Renin Bypass Doors Collection | PG Closets Ottawa',
    description: 'Premium Renin bypass closet doors with mirror and glass options. Smooth gliding systems with soft-close technology for Ottawa homes.',
    images: [{
      url: 'https://www.renin.com/wp-content/uploads/2020/11/EU2450_Euro-1-Lite-Bypass_Iron-Age_Lifestyle-scaled.jpg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninBypassDoorsPage() {
  const bypassDoors = simpleProducts.filter(p =>
    p.category === 'Renin Bypass Doors' && p.id.startsWith('renin-')
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renin Bypass Doors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Space-efficient Renin bypass closet doors that slide smoothly on precision track systems.
            Available with mirrors for added functionality or frosted glass for modern elegance.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{bypassDoors.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Soft-Close</span>
              <span className="text-muted-foreground">Quiet Operation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Mirror Options</span>
              <span className="text-muted-foreground">Functional Design</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-3 gap-8">
          {bypassDoors.map((product) => (
            <QuickConfigureCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}
