import { Metadata } from 'next';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Mirror Collection | PG Closets Ottawa',
  description: 'Premium mirrors for closets and dressing areas. Full-length standing mirrors, wall-mounted options, LED vanity mirrors, and sliding mirror panels.',
  openGraph: {
    title: 'Mirror Collection | PG Closets Ottawa',
    description: 'Premium mirrors for closets and dressing areas. Full-length standing mirrors, wall-mounted options, LED vanity mirrors, and sliding mirror panels.',
    images: [{
      url: 'https://www.renin.com/cdn/shop/files/MI001_Standing_Mirror_Vert_0099.jpg?v=1729100048&width=2048',
      width: 1200,
      height: 630,
    }],
  },
};

export default function MirrorsPage() {
  const mirrors = enhancedProducts.filter(p =>
    p.category === 'Mirrors'
  );

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mirrors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Essential mirrors for walk-in closets and dressing areas. From full-length standing mirrors
            to LED vanity mirrors, enhance your space with functional elegance.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{mirrors.length}</span>
              <span className="text-muted-foreground">Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Multiple Styles</span>
              <span className="text-muted-foreground">Standing & Wall-Mount</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">LED Options</span>
              <span className="text-muted-foreground">With Lighting</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mirrors.map((product) => (
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