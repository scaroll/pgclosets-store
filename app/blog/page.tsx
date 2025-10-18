import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading-new'
import Section from '@/components/ui/Section-new'
import Text from '@/components/ui/Text-new'
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Closet Door Blog | Tips & Guides | PG Closets Ottawa",
  description:
    "Expert tips on closet doors, installation guides, and home improvement advice from Ottawa&apos;s trusted Renin dealer. Learn about barn doors, bypass doors, and more.",
  keywords:
    "closet door tips, home improvement Ottawa, barn door installation, bypass door guide, Renin doors, closet organization, Ottawa home renovation",
  openGraph: {
    title: "Closet Door Blog | Tips & Guides | PG Closets Ottawa",
    description:
      "Expert tips on closet doors, installation guides, and home improvement advice from Ottawa&apos;s trusted Renin dealer.",
    type: "website",
    locale: "en_CA",
  },
}

const blogPosts = [
  {
    id: "choosing-right-closet-doors-ottawa-homes",
    title: "Choosing the Right Closet Doors for Your Ottawa Home",
    excerpt:
      "A comprehensive guide to selecting the perfect closet doors for Ottawa&apos;s diverse housing styles, from heritage homes to modern condos.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Home Design",
    image: "/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg",
    featured: true,
  },
  {
    id: "barn-doors-vs-traditional-doors-ottawa",
    title: "Barn Doors vs Traditional Doors: What's Best for Ottawa Homes?",
    excerpt:
      "Compare barn doors and traditional closet doors for Ottawa homes. Learn about space-saving benefits, style options, and installation considerations.",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Product Comparison",
    image: "/images/arcat/renin_176732_hd.jpg",
    featured: true,
  },
  {
    id: "renin-doors-official-dealer-ottawa",
    title: "Why Choose an Official Renin Dealer in Ottawa",
    excerpt:
      "Discover the benefits of working with an authorized Renin dealer for your Ottawa closet door project. Quality, warranty, and professional installation guaranteed.",
    date: "2024-01-05",
    readTime: "5 min read",
    category: "Industry Insights",
    image: "/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg",
    featured: false,
  },
  {
    id: "closet-door-installation-ottawa-winter",
    title: "Closet Door Installation During Ottawa Winters",
    excerpt:
      "Tips for successful closet door installation during Ottawa&apos;s cold months. Learn about timing, preparation, and what to expect from your installer.",
    date: "2023-12-20",
    readTime: "7 min read",
    category: "Installation Tips",
    image: "/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite.jpg",
    featured: false,
  },
  {
    id: "small-space-closet-solutions-ottawa-condos",
    title: "Small Space Closet Solutions for Ottawa Condos",
    excerpt:
      "Maximize storage in Ottawa&apos;s downtown condos and apartments with smart closet door choices. Space-saving solutions that don&apos;t compromise on style.",
    date: "2023-12-15",
    readTime: "6 min read",
    category: "Small Spaces",
    image: "/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg",
    featured: false,
  },
  {
    id: "heritage-home-closet-doors-ottawa",
    title: "Closet Door Solutions for Ottawa&apos;s Heritage Homes",
    excerpt:
      "Preserve the character of your heritage Ottawa home while adding modern functionality. Expert tips for closet doors in historic properties.",
    date: "2023-12-10",
    readTime: "9 min read",
    category: "Heritage Homes",
    image: "/images/arcat/renin_155731_Bifold_Closet_Door_Euro_3_Lite.jpg",
    featured: false,
  },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "PG Closets Ottawa Blog",
            description: "Expert tips and guides for closet doors and home improvement in Ottawa",
            url: "https://pgclosets.com/blog",
            publisher: {
              "@type": "Organization",
              name: "PG Closets Ottawa",
              url: "https://pgclosets.com",
            },
            blogPost: blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              url: `https://pgclosets.com/blog/${post.id}`,
              datePublished: post.date,
              author: {
                "@type": "Organization",
                name: "PG Closets Ottawa",
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <Section variant="dark" spacing="lg" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={1} className="text-white mb-4">
            Closet Door Expertise & Tips
          </Heading>
          <Text size="lg" className="text-blue-100 mb-6">
            Expert advice from Ottawa&apos;s trusted Renin dealer on closet doors, installation, and home improvement
          </Text>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-blue-500 px-3 py-1 rounded-full">Installation Guides</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full">Product Reviews</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full">Ottawa Home Tips</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full">Design Inspiration</span>
          </div>
        </div>
      </Section>

      {/* Featured Posts */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <Heading level={2} className="mb-4">
            Featured Articles
          </Heading>
          <Text size="lg" variant="secondary">
            Our most popular guides and expert insights
          </Text>
        </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-blue-100 to-blue-200 relative">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Heading level={3} className="mb-3 line-clamp-2">
                    <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </Heading>
                  <Text variant="secondary" className="mb-4 line-clamp-3">{post.excerpt}</Text>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
      </Section>

      {/* All Posts */}
      <Section spacing="lg" variant="light" className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              All Articles
            </Heading>
            <Text size="lg" variant="secondary">
              Browse our complete collection of closet door guides and tips
            </Text>
          </div>

          <div className="space-y-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 320px"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Heading level={3} className="mb-3">
                      <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </Heading>
                    <Text variant="secondary" className="mb-4">{post.excerpt}</Text>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* Newsletter Signup */}
      <Section spacing="lg" variant="dark" className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="text-white mb-4">
            Stay Updated with Home Improvement Tips
          </Heading>
          <Text size="lg" className="text-blue-100 mb-8">
            Get the latest closet door trends, installation tips, and Ottawa home improvement advice
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900" />
            <Button variant="primary" size="md" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="mb-4">
            Ready to Transform Your Closets?
          </Heading>
          <Text size="lg" variant="secondary" className="mb-8">
            Get expert advice and professional installation from Ottawa&apos;s trusted Renin dealer
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="primary" size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/request-work">Get Free Quote →</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </Section>
    </StandardLayout>
  )
}
