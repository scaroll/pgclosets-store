import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

// Sample blog posts data - in a real app, this would come from a CMS or database
const blogPosts = {
  "choosing-right-closet-doors-ottawa-homes": {
    title: "Choosing the Right Closet Doors for Your Ottawa Home",
    excerpt:
      "A comprehensive guide to selecting the perfect closet doors for Ottawa's diverse housing styles, from heritage homes to modern condos.",
    content: `
      <p>Ottawa's diverse housing landscape presents unique challenges and opportunities when selecting closet doors. From century-old heritage homes in the Glebe to modern condos downtown, each property type requires careful consideration of style, functionality, and installation requirements.</p>

      <h2>Understanding Ottawa's Housing Styles</h2>
      <p>Ottawa's rich architectural history means homeowners encounter everything from Victorian-era homes with high ceilings and ornate details to contemporary builds with clean lines and open concepts. Each style demands a different approach to closet door selection.</p>

      <h3>Heritage Homes (Pre-1940)</h3>
      <p>Heritage homes in neighborhoods like New Edinburgh, Sandy Hill, and the Glebe often feature:</p>
      <ul>
        <li>High ceilings (9-12 feet)</li>
        <li>Unique room layouts</li>
        <li>Original hardwood floors</li>
        <li>Period-appropriate trim and moldings</li>
      </ul>
      <p>For these homes, consider traditional panel doors or custom-sized options that complement the existing architecture. Renin's Provincial series works beautifully in heritage settings.</p>

      <h3>Mid-Century Homes (1940-1980)</h3>
      <p>Found throughout Nepean, Kanata, and Orleans, these homes typically feature:</p>
      <ul>
        <li>Standard 8-foot ceilings</li>
        <li>Practical layouts</li>
        <li>Mix of original and updated features</li>
      </ul>
      <p>These homes offer flexibility for both traditional and contemporary door styles. Bypass doors work particularly well for smaller bedrooms common in this era.</p>

      <h3>Modern Homes (1980-Present)</h3>
      <p>Contemporary Ottawa homes, especially in Barrhaven and newer Kanata developments, feature:</p>
      <ul>
        <li>Open floor plans</li>
        <li>9-foot ceilings</li>
        <li>Large master suites with walk-in closets</li>
        <li>Clean, minimalist design</li>
      </ul>
      <p>Modern barn doors and sleek bypass systems complement these homes perfectly.</p>

      <h2>Climate Considerations for Ottawa</h2>
      <p>Ottawa's climate presents unique challenges:</p>
      <ul>
        <li><strong>Temperature fluctuations:</strong> Choose materials that handle expansion and contraction</li>
        <li><strong>Humidity changes:</strong> Proper sealing prevents warping</li>
        <li><strong>Heating season:</strong> Well-fitted doors improve energy efficiency</li>
      </ul>

      <h2>Popular Choices by Neighborhood</h2>
      <h3>Downtown Ottawa & Centretown</h3>
      <p>Condo living requires space-saving solutions. Bypass doors and compact bifolds are popular choices.</p>

      <h3>Kanata & Barrhaven</h3>
      <p>Family homes benefit from durable, easy-to-clean finishes. Barn doors add character to open-concept layouts.</p>

      <h3>Orleans & Nepean</h3>
      <p>Mix of traditional and contemporary styles allows for versatile door choices based on home age and personal preference.</p>

      <h2>Working with a Professional</h2>
      <p>As Ottawa's authorized Renin dealer, PG Closets understands local building codes, climate considerations, and architectural styles. Our team provides:</p>
      <ul>
        <li>Free in-home consultations</li>
        <li>Custom sizing for unique openings</li>
        <li>Professional installation</li>
        <li>Lifetime warranty on workmanship</li>
      </ul>

      <p>Ready to find the perfect closet doors for your Ottawa home? Contact us today for a free consultation and discover why hundreds of Ottawa homeowners trust PG Closets for their closet door needs.</p>
    `,
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
    content: `
      <p>The choice between barn doors and traditional closet doors is one of the most common questions we receive from Ottawa homeowners. Both options have distinct advantages, and the best choice depends on your home's layout, style, and your family's needs.</p>

      <h2>Barn Doors: The Modern Space-Saver</h2>
      <p>Barn doors have surged in popularity across Ottawa, from downtown condos to suburban family homes. Here's why:</p>

      <h3>Space-Saving Benefits</h3>
      <ul>
        <li><strong>No swing space required:</strong> Perfect for tight hallways and small bedrooms</li>
        <li><strong>Maximize floor space:</strong> Ideal for Ottawa's compact condo living</li>
        <li><strong>Flexible opening:</strong> Can be positioned anywhere along the track</li>
      </ul>

      <h3>Style Versatility</h3>
      <p>Renin's barn door collection offers options for every Ottawa home style:</p>
      <ul>
        <li><strong>Rustic:</strong> Perfect for heritage homes in the Glebe</li>
        <li><strong>Modern:</strong> Clean lines for contemporary Barrhaven homes</li>
        <li><strong>Industrial:</strong> Great for loft-style downtown condos</li>
      </ul>

      <h3>Installation Considerations</h3>
      <p>Barn doors require:</p>
      <ul>
        <li>Adequate wall space beside the opening</li>
        <li>Proper wall structure for track mounting</li>
        <li>Professional installation for safety and smooth operation</li>
      </ul>

      <h2>Traditional Doors: The Reliable Classic</h2>
      <p>Traditional hinged doors remain popular in Ottawa homes for good reasons:</p>

      <h3>Complete Privacy</h3>
      <ul>
        <li>Full closure with no gaps</li>
        <li>Better sound insulation</li>
        <li>Ideal for master bedrooms and bathrooms</li>
      </ul>

      <h3>Proven Performance</h3>
      <ul>
        <li>Decades of reliable operation</li>
        <li>Easy maintenance and repair</li>
        <li>Wide range of styles and finishes</li>
      </ul>

      <h3>Cost-Effective</h3>
      <ul>
        <li>Generally lower upfront cost</li>
        <li>Standard installation process</li>
        <li>Readily available replacement parts</li>
      </ul>

      <h2>Ottawa-Specific Considerations</h2>

      <h3>Climate Factors</h3>
      <p>Ottawa's temperature swings affect door performance:</p>
      <ul>
        <li><strong>Barn doors:</strong> Track systems handle expansion/contraction well</li>
        <li><strong>Traditional doors:</strong> May require seasonal adjustments</li>
      </ul>

      <h3>Home Types</h3>
      <p><strong>Heritage Homes:</strong> Traditional doors often better match original architecture</p>
      <p><strong>Modern Homes:</strong> Barn doors complement open-concept layouts</p>
      <p><strong>Condos:</strong> Barn doors maximize limited space</p>

      <h2>Making the Right Choice</h2>
      <p>Consider these factors:</p>
      <ul>
        <li><strong>Available space:</strong> Barn doors need wall space; traditional doors need swing space</li>
        <li><strong>Privacy needs:</strong> Traditional doors offer better sound and light blocking</li>
        <li><strong>Style preference:</strong> Match your home's aesthetic</li>
        <li><strong>Budget:</strong> Factor in door cost plus installation</li>
      </ul>

      <h2>Professional Installation Matters</h2>
      <p>Regardless of your choice, professional installation ensures:</p>
      <ul>
        <li>Proper alignment and smooth operation</li>
        <li>Secure mounting for safety</li>
        <li>Warranty protection</li>
        <li>Code compliance</li>
      </ul>

      <p>As Ottawa's authorized Renin dealer, PG Closets helps you make the right choice for your home. We offer free consultations to assess your space and recommend the best solution for your needs and budget.</p>
    `,
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
    content: `
      <p>When investing in closet doors for your Ottawa home, choosing an official Renin dealer makes all the difference. As Ottawa's authorized Renin dealer, PG Closets provides advantages you simply can't get elsewhere.</p>

      <h2>What Makes Renin Special?</h2>
      <p>Renin has been a leader in closet door manufacturing for over 30 years, known for:</p>
      <ul>
        <li>Premium materials and construction</li>
        <li>Innovative designs and finishes</li>
        <li>Rigorous quality control standards</li>
        <li>Comprehensive warranty coverage</li>
      </ul>

      <h2>Benefits of Working with an Official Dealer</h2>

      <h3>Authentic Products</h3>
      <p>Official dealers guarantee you receive genuine Renin products with:</p>
      <ul>
        <li>Factory-direct quality assurance</li>
        <li>Full manufacturer warranty</li>
        <li>Access to the complete product line</li>
        <li>Latest designs and innovations</li>
      </ul>

      <h3>Expert Knowledge</h3>
      <p>Authorized dealers receive ongoing training on:</p>
      <ul>
        <li>Product specifications and features</li>
        <li>Proper installation techniques</li>
        <li>Troubleshooting and maintenance</li>
        <li>New product launches</li>
      </ul>

      <h3>Professional Installation</h3>
      <p>Official dealers provide certified installation services:</p>
      <ul>
        <li>Factory-trained installers</li>
        <li>Proper tools and techniques</li>
        <li>Code-compliant installation</li>
        <li>Installation warranty</li>
      </ul>

      <h2>Ottawa-Specific Advantages</h2>

      <h3>Local Expertise</h3>
      <p>As Ottawa's official Renin dealer, we understand:</p>
      <ul>
        <li>Local building codes and requirements</li>
        <li>Ottawa's diverse housing styles</li>
        <li>Climate considerations for door performance</li>
        <li>Neighborhood preferences and trends</li>
      </ul>

      <h3>Convenient Service</h3>
      <ul>
        <li>Local showroom for hands-on product viewing</li>
        <li>Quick response times for service calls</li>
        <li>Easy warranty claim processing</li>
        <li>Ongoing support and maintenance</li>
      </ul>

      <h2>Warranty Protection</h2>
      <p>Official Renin dealers provide comprehensive warranty coverage:</p>
      <ul>
        <li><strong>Product warranty:</strong> Covers manufacturing defects</li>
        <li><strong>Installation warranty:</strong> Guarantees proper installation</li>
        <li><strong>Local support:</strong> Easy claim processing and service</li>
      </ul>

      <h2>Quality Assurance</h2>
      <p>Working with an official dealer ensures:</p>
      <ul>
        <li>Products meet Renin's quality standards</li>
        <li>Proper handling and storage</li>
        <li>Correct product specifications</li>
        <li>No counterfeit or damaged goods</li>
      </ul>

      <h2>The PG Closets Difference</h2>
      <p>As Ottawa's trusted Renin dealer, we offer:</p>
      <ul>
        <li>Free in-home consultations</li>
        <li>Transparent Canadian pricing</li>
        <li>Professional installation team</li>
        <li>Lifetime workmanship warranty</li>
        <li>Serving Ottawa, Kanata, Nepean, Orleans, and Barrhaven</li>
      </ul>

      <h2>Avoiding Common Pitfalls</h2>
      <p>Non-authorized sellers may offer:</p>
      <ul>
        <li>Counterfeit or damaged products</li>
        <li>No warranty support</li>
        <li>Improper installation</li>
        <li>Limited product selection</li>
      </ul>

      <p>Don't risk your investment. Choose PG Closets, Ottawa's official Renin dealer, for guaranteed quality, professional service, and complete peace of mind.</p>
    `,
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: `https://pgclosets.com${post.image}`,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: post.author,
              url: "https://pgclosets.com",
            },
            publisher: {
              "@type": "Organization",
              name: "PG Closets Ottawa",
              url: "https://pgclosets.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://pgclosets.com/blog/${params.slug}`,
            },
          }),
        }}
      />

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
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden mb-12">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
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
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Free Quote →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/products"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">More Helpful Articles</h2>
          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
