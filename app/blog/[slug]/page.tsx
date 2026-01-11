import { getPostBySlug } from '@/lib/blog'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | PG Closets Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-2 text-gray-500">
          {post.date} • {post.author}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {post.title}
        </h1>
      </div>

      <div className="prose prose-lg mx-auto text-gray-600">
        <p className="lead text-xl">{post.excerpt}</p>
        <hr className="my-8" />
        <p>{post.content}</p>
        <p>
          (This is placeholder content. In a real application, this would be a rich text field or
          MDX content.)
        </p>
      </div>
    </div>
  )
}
