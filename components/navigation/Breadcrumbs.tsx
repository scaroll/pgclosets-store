'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  productName?: string;
  categoryName?: string;
}

export function Breadcrumbs({ customItems, productName, categoryName }: BreadcrumbsProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');

      // Format segment name
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Handle specific routes
      if (segment === 'products' && index === segments.length - 1 && !productName) {
        label = 'All Products';
      } else if (segment === 'products' && index < segments.length - 1) {
        label = 'Products';
      } else if (index === segments.length - 1 && productName) {
        label = productName;
      } else if (index === segments.length - 1 && categoryName) {
        label = categoryName;
      }

      // Special case handling for specific segments
      switch (segment) {
        case 'faq':
          label = 'FAQ';
          break;
        case 'ottawa':
        case 'kanata':
        case 'barrhaven':
        case 'orleans':
        case 'nepean':
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
          break;
      }

      items.push({ label, href });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }

  // Add schema markup for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${typeof window !== 'undefined' ? window.location.origin : ''}/`
      },
      ...breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': item.label,
        'item': `${typeof window !== 'undefined' ? window.location.origin : ''}${item.href}`
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="py-3 px-4 bg-gray-50 border-b">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}