import { notFound } from 'next/navigation';
import { getPages, getAdjacentPages, formatDate } from '@/docs/utils/getPages';
import { CustomMDX } from '@/docs/components/mdx-components';
import { DocsLayout } from '@/docs/components/DocsLayout';
import { colors, typography, spacing, radius, shadows } from '@/lib/design-tokens';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = routeParams.slug.join('/');
  const pages = getPages();
  const page = pages.find((p) => p.slug === slugPath);

  if (!page) return {};

  return {
    title: `${page.metadata.title} | PG Closets Documentation`,
    description: page.metadata.summary || `Documentation for ${page.metadata.title}`,
    openGraph: {
      title: page.metadata.title,
      description: page.metadata.summary,
      type: 'article',
      ...(page.metadata.image && { images: [page.metadata.image] }),
    },
  };
}

export async function generateStaticParams() {
  const pages = getPages();
  return pages.map((page) => ({
    slug: page.slug.split('/'),
  }));
}

export default async function DocPage({ params }: PageProps) {
  const routeParams = await params;
  const slugPath = routeParams.slug.join('/');
  const pages = getPages();
  const page = pages.find((p) => p.slug === slugPath);

  if (!page) {
    notFound();
  }

  const { prevPage, nextPage } = getAdjacentPages(slugPath, 'section');

  // Determine section title
  const sectionTitle = slugPath.includes('/')
    ? (slugPath.split('/')[0] || '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Documentation';

  return (
    <DocsLayout>
      <article>
        {/* Header */}
        <div style={{ marginBottom: spacing['8'] }}>
          <p
            style={{
              fontSize: typography.sizes.sm[0],
              fontWeight: typography.weights.medium,
              color: colors.brand.navy,
              marginBottom: spacing['2'],
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {sectionTitle}
          </p>
          <h1
            style={{
              fontSize: typography.sizes['5xl'][0],
              fontWeight: typography.weights.bold,
              fontFamily: typography.fonts.display,
              color: colors.gray[900],
              marginBottom: spacing['4'],
              lineHeight: typography.lineHeights.tight,
            }}
          >
            {page.metadata.title}
          </h1>
          {page.metadata.summary && (
            <p
              style={{
                fontSize: typography.sizes.xl[0],
                color: colors.gray[600],
                marginBottom: spacing['4'],
                lineHeight: typography.lineHeights.relaxed,
              }}
            >
              {page.metadata.summary}
            </p>
          )}
          <p
            style={{
              fontSize: typography.sizes.sm[0],
              color: colors.gray[500],
            }}
          >
            Last updated: {formatDate(page.metadata.updatedAt)}
          </p>
        </div>

        {/* Cover image */}
        {page.metadata.image && (
          <div
            style={{
              marginBottom: spacing['8'],
              borderRadius: radius.xl,
              overflow: 'hidden',
            }}
          >
            <img
              src={page.metadata.image}
              alt={page.metadata.title}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            fontSize: typography.sizes.base[0],
            lineHeight: typography.lineHeights.relaxed,
            color: colors.gray[700],
          }}
        >
          <CustomMDX source={page.content} />
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: prevPage && nextPage ? '1fr 1fr' : '1fr',
            gap: spacing['4'],
            marginTop: spacing['12'],
            paddingTop: spacing['8'],
            borderTop: `1px solid ${colors.gray[200]}`,
          }}
        >
          {prevPage && (
            <Link
              href={`/docs/${prevPage.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing['3'],
                padding: spacing['4'],
                backgroundColor: colors.gray[50],
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: radius.lg,
                textDecoration: 'none',
                transition: 'all 150ms ease',
                boxShadow: shadows.sm,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[100];
                e.currentTarget.style.boxShadow = shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[50];
                e.currentTarget.style.boxShadow = shadows.sm;
              }}
            >
              <ChevronLeft size={20} color={colors.gray[600]} />
              <div>
                <div
                  style={{
                    fontSize: typography.sizes.xs[0],
                    color: colors.gray[500],
                    marginBottom: spacing['1'],
                  }}
                >
                  Previous
                </div>
                <div
                  style={{
                    fontSize: typography.sizes.sm[0],
                    fontWeight: typography.weights.medium,
                    color: colors.gray[900],
                  }}
                >
                  {prevPage.metadata.title}
                </div>
              </div>
            </Link>
          )}
          {nextPage && (
            <Link
              href={`/docs/${nextPage.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: spacing['3'],
                padding: spacing['4'],
                backgroundColor: colors.gray[50],
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: radius.lg,
                textDecoration: 'none',
                transition: 'all 150ms ease',
                boxShadow: shadows.sm,
                gridColumn: prevPage ? 'auto' : '1',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[100];
                e.currentTarget.style.boxShadow = shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[50];
                e.currentTarget.style.boxShadow = shadows.sm;
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: typography.sizes.xs[0],
                    color: colors.gray[500],
                    marginBottom: spacing['1'],
                  }}
                >
                  Next
                </div>
                <div
                  style={{
                    fontSize: typography.sizes.sm[0],
                    fontWeight: typography.weights.medium,
                    color: colors.gray[900],
                  }}
                >
                  {nextPage.metadata.title}
                </div>
              </div>
              <ChevronRight size={20} color={colors.gray[600]} />
            </Link>
          )}
        </div>
      </article>
    </DocsLayout>
  );
}
