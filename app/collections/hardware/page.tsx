import { Metadata } from 'next';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Door Hardware Collection | PG Closets Ottawa',
  description: 'Complete hardware kits for barn doors, bypass doors, and bifold doors. Soft-close mechanisms, track systems, handles, and installation accessories.',
  openGraph: {
    title: 'Door Hardware Collection | PG Closets Ottawa',
    description: 'Complete hardware kits for barn doors, bypass doors, and bifold doors. Soft-close mechanisms, track systems, handles, and installation accessories.',
    images: [{
      url: 'https://www.renin.com/cdn/shop/files/HW002_Track_System_Black_0056.jpg?v=1729099145&width=2048',
      width: 1200,
      height: 630,
    }],
  },
};

export default function HardwarePage() {
  const hardware = enhancedProducts.filter(p =>
    p.category === 'Hardware'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Door Hardware</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Professional-grade hardware for all door types. From soft-close mechanisms to heavy-duty
            track systems, we have everything needed for a smooth, quiet door operation.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{hardware.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Complete Kits</span>
              <span className="text-muted-foreground">All-in-One Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Professional Grade</span>
              <span className="text-muted-foreground">Built to Last</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hardware.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <a
                    href={`tel:6137016393`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Call to Order
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}