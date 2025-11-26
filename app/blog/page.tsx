'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/shared/section-header'
import { getBlogPosts } from '@/lib/blog-data'

type Category = 'All' | 'Design Trends' | 'Buying Guides' | 'Organization Tips' | 'Installation'

const categories: Category[] = ['All', 'Design Trends', 'Buying Guides', 'Organization Tips', 'Installation']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  const filteredPosts = getBlogPosts(selectedCategory)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Get featured post (most recent)
  const featuredPost = filteredPosts[0]
  const regularPosts = currentPosts.slice(selectedCategory === 'All' && currentPage === 1 ? 1 : 0)

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Blog"
            title="Design Inspiration & Tips"
            description="Explore our latest articles on closet design trends, buying guides, organization tips, and installation advice"
          />
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post - Only on first page of 'All' category */}
      {selectedCategory === 'All' && currentPage === 1 && featuredPost && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Featured Article</h2>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-2xl overflow-hidden hover:shadow-2xl apple-transition">
                {/* Image */}
                <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover apple-transition group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 group-hover:text-primary apple-transition">
                    {featuredPost.title}
                  </h3>

                  <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4">
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{featuredPost.author.name}</p>
                      <p className="text-sm text-muted-foreground">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-primary font-semibold">
                      Read Full Article
                      <svg className="w-5 h-5 apple-transition group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {regularPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No posts found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="bg-card rounded-2xl overflow-hidden apple-transition hover:shadow-xl hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover apple-transition group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary apple-transition line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground line-clamp-3 text-sm">
                          {post.excerpt}
                        </p>

                        <div className="pt-2 flex items-center gap-3">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className="text-sm">
                            <p className="font-semibold">{post.author.name}</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                            Read More
                            <svg className="w-4 h-4 apple-transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold apple-transition ${
                      currentPage === 1
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold apple-transition ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold apple-transition ${
                      currentPage === totalPages
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
