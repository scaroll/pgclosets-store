import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'

export const metadata = {
  title: 'Blog | PG Closets',
  description: 'Expert tips, trends, and inspiration for your custom closet and storage needs.',
}

export default function BlogListingPage() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Latest from the Blog</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                {/* Placeholder for image - using div if no real image to avoid 404s in demo */}
                <div className="flex h-full items-center justify-center text-gray-400">
                  Image: {post.title}
                </div>
              </div>
              <CardHeader>
                <div className="text-sm text-gray-500">{post.date}</div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="font-medium text-primary">Read More &rarr;</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
