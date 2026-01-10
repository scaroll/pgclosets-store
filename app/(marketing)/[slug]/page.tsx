import { getAllStaticSlugs, getStaticPage } from '@/lib/data/static-pages'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getAllStaticSlugs()
  return slugs.map(slug => ({
    slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getStaticPage(params.slug)

  if (!page) {
    return {}
  }

  return {
    title: `${page.title} | PG Closets`,
    description:
      page.type === 'location'
        ? `Expert custom closet design and installation services in ${page.title.replace('Custom Closets in ', '')}.`
        : `${page.title} for PG Closets - Ottawa's Premier Custom Closet Provider.`,
  }
}

export default function StaticPage({ params }: PageProps) {
  const page = getStaticPage(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{page.title}</h1>
        {page.type === 'location' && (
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Service Area
          </div>
        )}
      </header>

      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        // eslint-disable-next-line react/no-danger -- Static page content sanitized with DOMPurify - content is from trusted data source
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
      />
    </article>
  )
}
