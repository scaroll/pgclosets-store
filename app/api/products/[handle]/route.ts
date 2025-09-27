import { NextResponse } from "next/server";
import { products } from "@/app/products/products-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    // Generate handle from name for lookup (same logic as in products route)
    const product = products.find(
      (p) =>
        p.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === handle
    );

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Transform to match the expected API response format
    const formattedProduct: any = {
      id: product.id,
      title: product.name,
      handle: product.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      description: product.description,
      thumbnail: product.image,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [{ url: product.image, altText: product.name }],
      variants: [
        {
          id: `${product.id}-variant`,
          title: "Default",
          sku: product.id,
          price: product.price,
          inventory_quantity: 100, // Assume in stock
        },
      ],
      tags: [product.category],
      collection: {
        id: product.category,
        title: product.category,
        handle: product.category.toLowerCase().replace(/\s+/g, "-"),
      },
    };

    return NextResponse.json({ product: formattedProduct });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
