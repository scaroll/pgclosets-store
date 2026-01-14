import { NextRequest, NextResponse } from 'next/server';
import { reninProductLoader } from '@/lib/renin-product-loader';

interface ExportFormat {
  format: 'csv' | 'json';
  includeImages: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportFormat = await request.json();
    const { format = 'csv', includeImages = true } = body;

    const products = await reninProductLoader.loadProducts();

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No products found to export' },
        { status: 404 }
      );
    }

    let exportData: string;
    let contentType: string;
    let filename: string;

    if (format === 'json') {
      // JSON Export
      const jsonData = {
        exported_at: new Date().toISOString(),
        total_products: products.length,
        total_variants: products.reduce((sum, p) => sum + p.variants.length, 0),
        products: products.map(product => ({
          id: product.id,
          handle: product.handle,
          title: product.title,
          description: product.description,
          vendor: product.vendor || 'Renin',
          product_type: product.product_type || 'Door',
          tags: product.tags || [],
          status: product.status || 'active',
          options: product.options || [],
          variants: product.variants.map(variant => ({
            id: variant.id,
            sku: variant.sku,
            title: variant.title || variant.option1,
            price: variant.price,
            compare_at_price: variant.compare_at_price,
            weight: variant.weight,
            weight_unit: 'kg',
            inventory_quantity: variant.inventory_quantity || 50,
            requires_shipping: variant.requires_shipping !== false,
            taxable: variant.taxable !== false,
            option1: variant.option1,
            option2: variant.option2,
            option3: variant.option3,
            image: variant.image
          })),
          images: includeImages ? product.images || [] : [],
          metafields: product.metafields || [],
          seo: product.seo || {}
        }))
      };

      exportData = JSON.stringify(jsonData, null, 2);
      contentType = 'application/json';
      filename = `renin_products_${new Date().toISOString().split('T')[0]}.json`;

    } else {
      // CSV Export
      const csvRows: string[][] = [];

      // Headers
      const headers = [
        'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
        'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
        'Option3 Name', 'Option3 Value', 'Variant SKU', 'Variant Grams',
        'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
        'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price',
        'Variant Requires Shipping', 'Variant Taxable', 'Variant Barcode',
        'Image Src', 'Image Position', 'Image Alt Text', 'Gift Card',
        'SEO Title', 'SEO Description', 'Google Shopping / Google Product Category',
        'Google Shopping / AdWords Grouping', 'Google Shopping / AdWords Labels',
        'Google Shopping / Condition', 'Google Shopping / Custom Product',
        'Google Shopping / Custom Label 0', 'Google Shopping / Custom Label 1',
        'Google Shopping / Custom Label 2', 'Google Shopping / Custom Label 3',
        'Google Shopping / Custom Label 4', 'Variant Image', 'Variant Weight Unit',
        'Variant Tax Code', 'Cost per item', 'Status'
      ];

      csvRows.push(headers);

      // Process each product
      products.forEach(product => {
        const variants = product.variants || [];
        const images = product.images || [];

        variants.forEach((variant, index) => {
          const row = [
            product.handle,
            index === 0 ? product.title : '', // Only show title on first variant
            index === 0 ? `<p>${product.description || ''}</p>` : '',
            product.vendor || 'Renin',
            product.product_type || 'Door',
            product.product_type || 'Door',
            (product.tags || []).join(', '),
            product.status === 'active' ? 'TRUE' : 'FALSE',
            product.options?.[0]?.name || 'Size',
            variant.option1 || '',
            product.options?.[1]?.name || 'Finish',
            variant.option2 || '',
            product.options?.[2]?.name || 'Hardware',
            variant.option3 || '',
            variant.sku,
            Math.round((variant.weight || 20) * 1000).toString(), // Convert kg to grams
            'shopify',
            (variant.inventory_quantity || 50).toString(),
            'deny',
            'manual',
            variant.price.toString(),
            variant.compare_at_price?.toString() || '',
            variant.requires_shipping !== false ? 'TRUE' : 'FALSE',
            variant.taxable !== false ? 'TRUE' : 'FALSE',
            variant.sku, // Use SKU as barcode
            includeImages && images[0]?.src || '',
            '1',
            includeImages && images[0]?.alt || product.title,
            'FALSE',
            product.seo?.title || product.title,
            product.seo?.description || product.description?.substring(0, 160) || '',
            'Home & Garden > Decor > Window Treatments',
            'Closet Doors',
            (product.tags || []).join(', '),
            'New',
            'TRUE',
            product.product_type || 'Door',
            variant.option1 || '',
            variant.option2 || '',
            variant.option3 || '',
            'CAD',
            variant.image?.src || '',
            'kg',
            '',
            '', // Cost per item
            product.status || 'active'
          ];

          csvRows.push(row);
        });
      });

      // Convert to CSV string
      exportData = csvRows.map(row =>
        row.map(cell => {
          const stringValue = String(cell || '');
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      ).join('\n');

      contentType = 'text/csv';
      filename = `renin_products_${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Return file as download
    return new NextResponse(exportData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': Buffer.byteLength(exportData, 'utf8').toString()
      }
    });

  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}