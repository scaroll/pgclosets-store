import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'
import type { Metadata } from 'next'
import { getBlogPost, getRelatedPosts, blogPosts } from '@/lib/blog-data'
import DOMPurify from 'isomorphic-dompurify'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found - PG Closets Blog',
    }
  }

  return {
    title: `${post.title} - PG Closets Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3)
  const currentUrl = `https://pgclosets.com/blog/${post.slug}`

  return (
    <main className="min-h-screen">
      {/* Back to Blog */}
      <section className="py-6 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary apple-transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground mb-8">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <p className="font-bold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.author.role}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-border" />

            {/* Date and Reading Time */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            {/* eslint-disable-next-line react/no-danger -- Blog content sanitized with DOMPurify - content is from trusted data source */}
            <div
              className="space-y-6 text-lg leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  post.content
                    .split('\n')
                    .map(line => {
                      // Headers
                      if (line.startsWith('# ')) {
                        return `<h1 class="text-4xl font-bold mt-12 mb-6">${line.substring(2)}</h1>`
                      }
                      if (line.startsWith('## ')) {
                        return `<h2 class="text-3xl font-bold mt-10 mb-5">${line.substring(3)}</h2>`
                      }
                      if (line.startsWith('### ')) {
                        return `<h3 class="text-2xl font-bold mt-8 mb-4">${line.substring(4)}</h3>`
                      }
                      // Bold
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return `<p class="font-bold text-xl mb-4">${line.substring(2, line.length - 2)}</p>`
                      }
                      // List items
                      if (line.startsWith('- ')) {
                        return `<li class="ml-6 mb-2">${line.substring(2)}</li>`
                      }
                      // Regular paragraphs
                      if (line.trim()) {
                        return `<p class="mb-4">${line}</p>`
                      }
                      return ''
                    })
                    .join('')
                )
              }}
            />
          </article>
        </div>
      </section>

      {/* Share Buttons */}
      <section className="py-8 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Share this article:</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877f2] text-white hover:opacity-90 apple-transition"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1da1f2] text-white hover:opacity-90 apple-transition"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a66c2] text-white hover:opacity-90 apple-transition"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${currentUrl}`)}`}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground hover:bg-muted/80 apple-transition"
                aria-label="Share via Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-muted/50 rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">About {post.author.name}</h3>
                <p className="text-sm text-primary font-semibold mb-3">{post.author.role}</p>
                <p className="text-muted-foreground leading-relaxed">{post.author.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <article className="bg-card rounded-2xl overflow-hidden apple-transition hover:shadow-xl hover:-translate-y-2">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover apple-transition group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-primary apple-transition line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get expert advice and a free consultation for your closet project
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-full font-semibold hover:opacity-90 apple-transition text-lg"
            >
              Contact Us Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-background text-background rounded-full font-semibold hover:bg-background hover:text-foreground apple-transition text-lg"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
