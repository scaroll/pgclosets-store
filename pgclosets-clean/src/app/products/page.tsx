import { Suspense } from "react";
import ProductsClient from "./products-client";
import { ProductsLoading } from "@/components/products/products-loading";

export const metadata = {
  title: "Closet Door Collection | Quality Doors by Renin | PG Closets Ottawa",
  description: "Browse our complete collection of quality closet doors. Barn doors, bypass doors, and bifold doors from Renin. Professional installation in Ottawa and surrounding areas.",
};

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient />
      </Suspense>
    </div>
  );
}