import { DocsLayout } from '@/docs/components/DocsLayout';
import { colors, typography, spacing, radius, shadows } from '@/lib/design-tokens';
import Link from 'next/link';
import { Metadata } from 'next';
import { CategoryCard } from './CategoryCard';

export const metadata: Metadata = {
  title: 'Documentation | PG Closets',
  description: 'Comprehensive documentation for PG Closets products, design system, and development guides.',
};

const categories = [
  {
    icon: 'FileText',
    title: 'Products',
    description: 'Complete guides for our Renin closet systems, barn doors, and hardware.',
    slug: 'products',
    color: colors.brand.navy,
  },
  {
    icon: 'Palette',
    title: 'Design System',
    description: 'Design tokens, components, and patterns used throughout the PG Closets experience.',
    slug: 'design-system',
    color: colors.materials.metal.roseGold,
  },
  {
    icon: 'Wrench',
    title: 'Installation Guides',
    description: 'Step-by-step installation and maintenance guides for all our products.',
    slug: 'guides',
    color: colors.semantic.success.DEFAULT,
  },
  {
    icon: 'Code',
    title: 'API Reference',
    description: 'Developer documentation for integrating with our APIs and services.',
    slug: 'api',
    color: colors.semantic.info.DEFAULT,
  },
];

export default function DocsHomePage() {
  return (
    <DocsLayout>
      <div>
        {/* Hero */}
        <div style={{ marginBottom: spacing['12'] }}>
          <h1
            style={{
              fontSize: typography.sizes['6xl'][0],
              fontWeight: typography.weights.bold,
              fontFamily: typography.fonts.display,
              color: colors.gray[900],
              marginBottom: spacing['4'],
              lineHeight: typography.lineHeights.tight,
            }}
          >
            Documentation
          </h1>
          <p
            style={{
              fontSize: typography.sizes.xl[0],
              color: colors.gray[600],
              lineHeight: typography.lineHeights.relaxed,
              maxWidth: '42rem',
            }}
          >
            Everything you need to know about PG Closets products, installation, design system, and development.
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing['6'],
            marginBottom: spacing['12'],
          }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        {/* Quick Links */}
        <div
          style={{
            padding: spacing['6'],
            backgroundColor: colors.brand.navy,
            borderRadius: radius.xl,
            color: colors.gray[50],
          }}
        >
          <h2
            style={{
              fontSize: typography.sizes['2xl'][0],
              fontWeight: typography.weights.semibold,
              marginBottom: spacing['4'],
            }}
          >
            Quick Links
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing['4'],
            }}
          >
            <Link
              href="/docs/products/renin-overview"
              style={{
                color: colors.gray[50],
                fontSize: typography.sizes.sm[0],
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              Renin Product Overview →
            </Link>
            <Link
              href="/docs/design-system/tokens"
              style={{
                color: colors.gray[50],
                fontSize: typography.sizes.sm[0],
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              Design Tokens →
            </Link>
            <Link
              href="/docs/guides/installation"
              style={{
                color: colors.gray[50],
                fontSize: typography.sizes.sm[0],
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              Installation Guide →
            </Link>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
