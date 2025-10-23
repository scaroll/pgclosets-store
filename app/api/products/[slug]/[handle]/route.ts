import { products } from "@/app/products/products-data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;

  try {
    // Find product by handle (name transformed to handle format)
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
    const formattedProduct = {
      id: product.id,
      title: product.name,
      handle: handle,
      description: product.description,
      thumbnail: product.image,
      created_at: new Date().toISOString(), // Mock date
      updated_at: new Date().toISOString(), // Mock date
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
    console.error("[PRODUCT_HANDLE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}