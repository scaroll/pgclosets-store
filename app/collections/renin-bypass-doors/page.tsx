import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";

// Dynamically import QuickConfigureCard (heavy due to configurator logic)
const QuickConfigureCard = dynamic(
  () => import("@/components/products/QuickConfigureCard").then(mod => ({ default: mod.QuickConfigureCard })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg mb-4" />
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }
);

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
  const bypassDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Bypass Doors'
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bypassDoors.map((product) => (
            <QuickConfigureCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}
