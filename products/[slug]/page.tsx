import { notFound } from "next/navigation"
import { reninProducts } from "../../../data/renin-products"
import { ProductJSONLD } from "../../../lib/seo"

export const dynamic = "force-static"

export function generateStaticParams() {
  return reninProducts.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = reninProducts.find((product) => product.id === params.slug)
  if (!p) return { title: "Product Not Found | PG Closets" }
  const title = `${p.name} | PG Closets Ottawa`
  const description = `Premium ${p.category} door in Ottawa. ${p.features.join(", ")}. From $${p.price} CAD with professional installation.`
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "en_CA" },
  }
}

export default function PDP({ params }: { params: { slug: string } }) {
  const p = reninProducts.find((product) => product.id === params.slug)
  if (!p) return notFound()

  const priceText = `From $${p.price.toLocaleString()} CAD`
  const related = reninProducts.filter((product) => product.category === p.category && product.id !== p.id).slice(0, 3)

  return (
    <main className="section-apple">
      <div className="container-apple">
        <ProductJSONLD product={{ title: p.name, priceMin: p.price, priceMax: p.price }} />

        <section className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Image block with exact specifications: white card, sky border, 16px radius, min-height requirements */}
          <div className="card-apple p-0 overflow-hidden min-h-[320px] lg:min-h-[480px]">
            <img
              src={
                p.image ||
                `/placeholder.svg?height=900&width=1200&query=${encodeURIComponent(p.name + " closet door") || "/placeholder.svg"}`
              }
              alt={`${p.name} - PG Closets Ottawa`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content column with exact spacing and typography specifications */}
          <div className="space-y-6">
            {/* Title H1 with exact 32-40px size in navy */}
            <div className="space-y-2">
              <h1 className="text-h1" style={{ fontSize: "40px" }}>
                {p.name}
              </h1>
              <div className="text-sm text-blue-600 font-medium uppercase tracking-wider">
                {p.category} {p.category !== "hardware" ? "Door" : ""}
              </div>
              {/* Price line with exact 16-18px size, dark/80% opacity, 8px spacing from title */}
              <div className="text-lg text-pg-dark" style={{ opacity: 0.8, fontSize: "18px" }}>
                {priceText}
              </div>
            </div>

            {/* CTA row with exact 24px spacing from price */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/contact" className="btn-primary">
                Request Installation Quote
              </a>
              <a href="/contact" className="btn-secondary">
                Schedule Consultation
              </a>
            </div>

            {/* Two panels side-by-side with exact 32px spacing from CTA row */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="card-apple p-6">
                <h2 className="text-h3 mb-3">Overview</h2>
                <p className="text-body-s text-pg-dark" style={{ opacity: 0.8 }}>
                  Premium {p.category} system with smooth glide hardware and refined finishes. Professional installation
                  in Ottawa with 2‑year workmanship warranty.
                </p>
              </div>
              <div className="card-apple p-6">
                <h2 className="text-h3 mb-3">What's Included</h2>
                <ul className="text-body-s text-pg-dark space-y-1" style={{ opacity: 0.8 }}>
                  <li>• Track & soft‑close hardware</li>
                  <li>• Professional installation (Ottawa)</li>
                  <li>• Removal/disposal of old doors</li>
                  <li>• 2‑year workmanship warranty</li>
                </ul>
              </div>
            </div>

            <div className="card-apple p-6">
              <h3 className="text-h3 mb-4">Features</h3>
              <ul className="text-body-s text-pg-dark space-y-2" style={{ opacity: 0.8 }}>
                {p.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Related products with exact 48px spacing from section edge and H2 24-28px */}
        {related.length > 0 && (
          <section className="pt-12">
            <h2 className="text-h2 mb-8" style={{ fontSize: "28px" }}>
              Related {p.category} Products
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <a key={r.id} href={`/products/${r.id}`} className="card-apple overflow-hidden group">
                  {/* Small height image (160px) as specified for related products */}
                  <div className="h-40 overflow-hidden">
                    <img
                      src={
                        r.image ||
                        `/placeholder.svg?height=160&width=240&query=${encodeURIComponent(r.name + " closet door") || "/placeholder.svg"}`
                      }
                      alt={`${r.name} - PG Closets Ottawa`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-micro text-pg-gray mb-1">{r.category.toUpperCase()}</div>
                    <h3 className="font-semibold text-lg text-pg-navy" style={{ fontSize: "18px", fontWeight: 600 }}>
                      {r.name}
                    </h3>
                    <div className="text-sm text-pg-dark mt-1">From ${r.price.toLocaleString()} CAD</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
