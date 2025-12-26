export function ProductJSONLD({ product }: { product: { title: string, priceMin: number, priceMax: number, description?: string, images?: string[] } }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description || `Premium ${product.title} from PG Closets.`,
        image: product.images,
        offers: {
            '@type': 'AggregateOffer',
            lowPrice: product.priceMin,
            highPrice: product.priceMax,
            priceCurrency: 'CAD',
            availability: 'https://schema.org/InStock',
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
