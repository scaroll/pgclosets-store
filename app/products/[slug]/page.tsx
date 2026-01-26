import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { reninProducts } from "../../../data/renin-products"
import { ProductJSONLD } from "../../../lib/seo"
import { Button } from "../../../components/ui/button"

export const dynamic = "force-static"

export function generateStaticParams() {
  return reninProducts.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = reninProducts.find((product) => product.id === slug)
  if (!p) return { title: "Product Not Found | PG Closets" }
  const title = `${p.name} | PG Closets Ottawa`
  const description = `Premium ${p.category} door in Ottawa. ${p.features.join(", ")}. From $${p.price} CAD with professional installation.`
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "en_CA" },
  }
}

export default async function PDP({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = reninProducts.find((product) => product.id === slug)
  if (!p) return notFound()

  const priceText = `From $${p.price.toLocaleString()} CAD`
  const related = reninProducts
    .filter((product) => product.category === p.category && product.id !== p.id)
    .slice(0, 3)

  return (
    <main className="section">
      <div className="container-default">
        <ProductJSONLD
          product={{
            name: p.name,
            description: `Premium ${p.category} door`,
            priceMin: p.price,
            priceMax: p.price,
          }}
        />

        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-body-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-foreground font-medium truncate">{p.name}</li>
          </ol>
        </nav>

        {/* Product Layout */}
        <section className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="card overflow-hidden aspect-square lg:aspect-auto lg:min-h-[480px] relative">
            <Image
              src={
                p.image ||
                `/placeholder.svg?height=900&width=1200&query=${encodeURIComponent(p.name + " closet door")}`
              }
              alt={`${p.name} - PG Closets Ottawa`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={true}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAABBQEBAQEBAQAAAAAAAAAEAQIDBQAGByETIv/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEQMSkf/aAAwDAQACEQMRAD8A0+yeuwiG+4lk5Y3N5YhZFpnelduG0cR7w3Pz0SudECH/2Q=="
            />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <p className="text-overline text-accent mb-2">
                {p.category} {p.category !== "hardware" ? "Door" : ""}
              </p>
              <h1 className="text-h1 mb-3">{p.name}</h1>
              <p className="text-h3 text-muted-foreground">{priceText}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="lg" href="/contact" className="flex-1">
                Request Installation Quote
              </Button>
              <Button variant="outline" size="lg" href="/contact" className="flex-1">
                Schedule Consultation
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="card p-5">
                <h2 className="text-h4 mb-3">Overview</h2>
                <p className="text-body-sm text-muted-foreground">
                  Premium {p.category} system with smooth glide hardware and refined finishes.
                  Professional installation in Ottawa with 2-year workmanship warranty.
                </p>
              </div>
              <div className="card p-5">
                <h2 className="text-h4 mb-3">What&apos;s Included</h2>
                <ul className="text-body-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Track & soft-close hardware
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional installation
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Removal of old doors
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    2-year warranty
                  </li>
                </ul>
              </div>
            </div>

            {/* Features */}
            <div className="card p-5">
              <h3 className="text-h4 mb-4">Features</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {p.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-body-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pt-8 border-t border-border">
            <h2 className="text-h2 mb-8">
              Related {p.category} Products
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.id}`}
                  className="card card-product group"
                >
                  <div className="card-product-image h-40">
                    <Image
                      src={
                        r.image ||
                        `/placeholder.svg?height=160&width=240&query=${encodeURIComponent(r.name + " closet door")}`
                      }
                      alt={`${r.name} - PG Closets Ottawa`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-product-body">
                    <p className="text-overline text-muted-foreground mb-1">
                      {r.category}
                    </p>
                    <h3 className="text-h4 mb-1 group-hover:text-primary transition-colors">
                      {r.name}
                    </h3>
                    <p className="text-body-sm text-muted-foreground">
                      From ${r.price.toLocaleString()} CAD
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
