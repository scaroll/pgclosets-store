// Removed shadcn import - using native HTML
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Sample blog posts data - in a real app, this would come from a CMS or database
const blogPosts = {
  "choosing-right-closet-doors-ottawa-homes": {
    title: "Choosing the Right Closet Doors for Your Ottawa Home",
    excerpt:
      "A comprehensive guide to selecting the perfect closet doors for Ottawa's diverse housing styles, from heritage homes to modern condos.",
    content: `<p>Ottawa's diverse housing landscape presents unique challenges and opportunities when selecting closet doors.</p>`,
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Home Design",
    image: "/images/arcat/renin_205745_Bypass_Closet_Doors_Savona_2_Panel_Arched_Design.jpg",
    author: "PG Closets Ottawa Team",
    tags: ["Ottawa homes", "closet doors", "home design", "Renin doors", "heritage homes"],
  },
  "barn-doors-vs-traditional-doors-ottawa": {
    title: "Barn Doors vs Traditional Doors: What's Best for Ottawa Homes?",
    excerpt:
      "Compare barn doors and traditional closet doors for Ottawa homes. Learn about space-saving benefits, style options, and installation considerations.",
    content: `<p>The choice between barn doors and traditional closet doors is one of the most common questions we receive from Ottawa homeowners.</p>`,
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Product Comparison",
    image: "/images/arcat/renin_205731_Mix_Match_Hardware_Driftwood_K_Design.jpg",
    author: "PG Closets Ottawa Team",
    tags: ["barn doors", "traditional doors", "Ottawa homes", "space saving", "home design"],
  },
  "renin-doors-official-dealer-ottawa": {
    title: "Why Choose an Official Renin Dealer in Ottawa",
    excerpt:
      "Discover the benefits of working with an authorized Renin dealer for your Ottawa closet door project. Quality, warranty, and professional installation guaranteed.",
    content: `<p>When investing in closet doors for your Ottawa home, choosing an official Renin dealer makes all the difference.</p>`,
    date: "2024-01-05",
    readTime: "5 min read",
    category: "Industry Insights",
    image: "/images/arcat/renin_205739_Bypass_Closet_Doors_Euro_3_Lite.jpg",
    author: "PG Closets Ottawa Team",
    tags: ["Renin dealer", "Ottawa", "warranty", "quality assurance", "professional installation"],
  },
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug as keyof typeof blogPosts]

  if (!post) {
    return {
      title: "Post Not Found | PG Closets Ottawa Blog",
    }
  }

  return {
    title: `${post.title} | PG Closets Ottawa Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      locale: "en_CA",
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  return (
    <main>
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Featured Image */}
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden mb-12 relative">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 100vw"
            priority={true}
          />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Closets?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get expert advice and professional installation from Ottawa's trusted Renin dealer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/request-work">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium">
                Get Free Quote
              </button>
            </Link>
            <Link href="/products">
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">More Helpful Articles</h2>
          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
