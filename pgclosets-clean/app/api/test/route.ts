import { NextResponse } from 'next/server';
import { reninProductLoader } from '@/lib/renin-product-loader';

export async function GET() {
  try {
    console.log('Testing product loader...');

    // Test basic loading
    const products = await reninProductLoader.loadProducts();
    console.log(`Loaded ${products.length} products`);

    // Test stats
    const stats = await reninProductLoader.getProductStats();
    console.log('Stats:', stats);

    return NextResponse.json({
      success: true,
      message: 'API endpoints are working',
      productCount: products.length,
      stats,
      sampleProduct: products[0] || null
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}