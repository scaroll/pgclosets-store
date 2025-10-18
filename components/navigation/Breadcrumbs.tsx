'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

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
      const href = `/${  segments.slice(0, index + 1).join('/')}`;

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
      <nav aria-label="Breadcrumb" className="py-4 px-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="container mx-auto">
          <motion.ol
            className="flex items-center space-x-2 text-sm overflow-x-auto scrollbar-hide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.li
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="/"
                className="flex items-center p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group"
                title="Go to homepage"
              >
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="sr-only">Home</span>
              </Link>
            </motion.li>
            {breadcrumbs.map((item, index) => (
              <motion.li
                key={item.href}
                className="flex items-center space-x-2 min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className="text-gray-900 font-medium px-2 py-1 rounded-md bg-amber-50 border border-amber-200 truncate max-w-xs"
                    aria-current="page"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-amber-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-all duration-200 truncate max-w-xs"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                )}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </nav>
    </>
  );
}