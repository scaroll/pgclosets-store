import Image from 'next/image'
import type { Metadata } from "next"

// Enable ISR with 24 hour revalidation for homepage
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'PG Closets | Custom Closets & Storage Solutions in Ottawa',
  description: 'Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts. Request your free quote today.',
  keywords: 'custom closets Ottawa, closet design Ottawa, storage solutions Ottawa, pantry organization, garage storage, closet installation, home organization Ottawa, custom storage NCR',
  authors: [{ name: 'PG Closets' }],
  creator: 'PG Closets',
  publisher: 'PG Closets',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  other: {
    'geo.region': 'CA-ON',
    'geo.placename': 'Ottawa',
    'geo.position': '45.4215;-75.6972',
    'ICBM': '45.4215, -75.6972'
  },
  openGraph: {
    title: 'PG Closets | Custom Closets & Storage Solutions in Ottawa',
    description: 'Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.',
    url: 'https://www.pgclosets.ca',
    siteName: 'PG Closets',
    locale: 'en_CA',
    images: [
      {
        url: 'https://www.pgclosets.ca/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Closets - Custom Storage Solutions Ottawa'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pgclosets',
    title: 'PG Closets | Custom Closets & Storage Solutions in Ottawa',
    description: 'Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.',
    images: ['https://www.pgclosets.ca/og-image.jpg']
  },
  alternates: {
    canonical: 'https://www.pgclosets.ca'
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center py-3 text-sm tracking-wide">
            <div className="flex items-center justify-center space-x-8 text-xs uppercase font-light">
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span>Ottawa&apos;s Premier Atelier</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span>500+ Luxury Installations</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span>Award-Winning Design</span>
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex items-center space-x-4">
              <Image
                alt="PG Closets"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
              />
              <div>
                <h1 className="text-2xl font-light tracking-wide text-slate-900">PG CLOSETS</h1>
                <p className="text-xs text-slate-500 font-light uppercase tracking-widest">Ottawa Design Atelier</p>
              </div>
            </a>
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Home</a>
              <a href="/products" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Collection</a>
              <a href="/about" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Atelier</a>
              <a href="/services" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Services</a>
              <a href="/contact" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Contact</a>
              <div className="flex items-center space-x-6 ml-8 pl-8 border-l border-slate-200">
                <a href="tel:6134225800" className="text-slate-600 hover:text-slate-900 font-light tracking-wide transition-colors">(613) 422-5800</a>
                <button className="bg-slate-900 text-white px-8 py-2.5 text-sm font-light tracking-wide hover:bg-slate-800 transition-all duration-300">Schedule Consultation</button>
              </div>
            </nav>
            <div className="lg:hidden">
              <button className="text-slate-700 hover:text-slate-900 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-light tracking-wide">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span>Exclusive December Availability • 3 Consultations Remaining</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extralight mb-8 leading-[1.1] text-slate-900 tracking-tight">
            Bespoke Closet Doors
            <br/>
            <span className="text-slate-600">For Distinguished Homes</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-slate-600 font-light leading-relaxed">
            Ottawa&apos;s premier design atelier crafting luxury closet solutions with
            <span className="text-slate-900 font-normal"> meticulous attention to detail</span>
             and
            <span className="text-slate-900 font-normal"> uncompromising quality</span>
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-light text-slate-900 mb-2">500+</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-light">Luxury Installations</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-light text-slate-900 mb-2">★★★★★</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-light">Client Satisfaction</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-light text-slate-900 mb-2">15+</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-light">Years Mastery</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-light text-slate-900 mb-2">Award</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-light">Winning Design</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-slate-900 text-white hover:bg-slate-800 font-light px-12 py-4 text-lg tracking-wide transition-all duration-500 hover:shadow-2xl hover:scale-105">
              <span className="group-hover:hidden">Request Private Consultation</span>
              <span className="hidden group-hover:inline-flex items-center space-x-2">
                <span>Schedule Your Visit</span>
                <span>→</span>
              </span>
            </button>
            <a href="/products" className="group border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 font-light px-12 py-4 text-lg tracking-wide transition-all duration-300 text-center">
              <span className="group-hover:hidden">Explore Collection</span>
              <span className="hidden group-hover:inline">View Curated Designs</span>
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block text-xs uppercase tracking-[0.3em] text-slate-500 font-light mb-4">Curated Collection</div>
            <h2 className="text-4xl lg:text-5xl font-extralight mb-6 text-slate-900 tracking-tight">Signature Door Designs</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Each piece in our collection represents the pinnacle of craftsmanship,
              <span className="text-slate-900"> handpicked for discerning homeowners</span>
               who appreciate exceptional design
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Continental', image: '/images/arcat/renin_176732_hd.jpg', price: 459, description: 'Premium engineered wood core, durable laminate surface' },
              { name: 'Provincial', image: '/images/arcat/renin_205750_hd.jpg', price: 549, description: 'Traditional styling, heavy-duty pivot hinges' },
              { name: 'Gatsby', image: '/images/arcat/renin_205729_hd.jpg', price: 799, description: 'Modern barn door design, premium hardware included' },
              { name: 'Euro', image: '/images/arcat/renin_199063_hd.jpg', price: 899, description: 'Contemporary European styling, soft-close mechanism' }
            ].map((product) => (
              <div key={product.name} className="group bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                    src={product.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-light tracking-wide">SIGNATURE PIECE</div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400 font-light mb-2">COLLECTION</div>
                  <h3 className="text-2xl font-light text-slate-900 mb-3 tracking-wide">{product.name}</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed font-light">{product.description}</p>
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-2xl font-light text-slate-900">
                      From ${product.price}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">CAD</div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full bg-slate-900 text-white py-3.5 font-light text-sm tracking-wide hover:bg-slate-800 transition-all duration-300">Request Consultation</button>
                    <a href="/products" className="block w-full border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 py-3.5 font-light text-sm tracking-wide transition-all duration-300 text-center">View Details</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}