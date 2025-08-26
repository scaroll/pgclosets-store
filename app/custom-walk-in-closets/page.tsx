import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Ruler, 
  Hammer, 
  Palette, 
  CheckCircle, 
  Star, 
  Phone, 
  Calendar,
  Award,
  Shield,
  Lightbulb,
  Home
} from "lucide-react"

export const metadata: Metadata = {
  title: "Custom Walk-In Closets Ottawa | Professional Design & Installation | PG Closets",
  description: "Transform your space with custom walk-in closets in Ottawa. Professional design, premium materials, and expert installation. Free consultation and 10-year warranty. Call (613) 555-0123.",
  keywords: "custom walk-in closets Ottawa, closet design Ottawa, walk-in closet renovation, custom storage Ottawa, closet organization Ottawa, bedroom closets Ottawa",
  openGraph: {
    title: "Custom Walk-In Closets Ottawa | PG Closets",
    description: "Professional custom walk-in closet design and installation in Ottawa. Premium materials, expert craftsmanship, 10-year warranty.",
    images: ["/images/custom-closets/walk-in-hero.jpg"],
  },
}

// ISR with 6-hour revalidation
export const revalidate = 21600

const serviceFeatures = [
  {
    icon: Ruler,
    title: "Custom Design Process",
    description: "3D design consultation with precise measurements and personalized layout optimization"
  },
  {
    icon: Hammer,
    title: "Expert Installation",
    description: "Professional installation by certified craftsmen with 15+ years experience"
  },
  {
    icon: Palette,
    title: "Premium Materials",
    description: "High-quality wood, metal, and composite materials from trusted Canadian suppliers"
  },
  {
    icon: Shield,
    title: "10-Year Warranty",
    description: "Comprehensive warranty on materials and workmanship for complete peace of mind"
  }
]

const pricingTiers = [
  {
    name: "Essential Walk-In",
    price: "$2,500 - $4,500",
    features: [
      "Up to 8 linear feet",
      "Basic shelving and hanging rods",
      "Melamine finish options",
      "Standard hardware",
      "Professional installation",
      "2-year warranty"
    ],
    popular: false
  },
  {
    name: "Premium Walk-In",
    price: "$4,500 - $8,500",
    features: [
      "Up to 12 linear feet",
      "Custom shelving and drawers",
      "Wood veneer finishes",
      "Soft-close hardware",
      "LED lighting integration",
      "Shoe racks and specialty storage",
      "5-year warranty"
    ],
    popular: true
  },
  {
    name: "Luxury Walk-In",
    price: "$8,500 - $15,000+",
    features: [
      "Unlimited linear feet",
      "Premium hardwood construction",
      "Custom island and seating",
      "Full mirror integration",
      "Smart home integration",
      "Jewelry and accessory storage",
      "Climate control preparation",
      "10-year warranty"
    ],
    popular: false
  }
]

const portfolioImages = [
  {
    src: "/images/custom-closets/modern-walk-in.jpg",
    alt: "Modern walk-in closet with LED lighting and custom storage",
    title: "Modern Minimalist Design"
  },
  {
    src: "/images/custom-closets/luxury-walk-in.jpg", 
    alt: "Luxury walk-in closet with island and premium finishes",
    title: "Luxury Master Suite"
  },
  {
    src: "/images/custom-closets/compact-walk-in.jpg",
    alt: "Compact walk-in closet maximizing small space storage",
    title: "Space-Optimized Design"
  },
  {
    src: "/images/custom-closets/traditional-walk-in.jpg",
    alt: "Traditional walk-in closet with wood finishes",
    title: "Classic Traditional Style"
  }
]

export default function CustomWalkInClosetsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Award className="w-4 h-4 mr-2" />
              Ottawa's Premier Custom Closet Specialists
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Custom Walk-In Closets
              <span className="block text-amber-400">Designed for You</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Transform your bedroom into a luxury retreat with a professionally designed walk-in closet. 
              Custom storage solutions that maximize space and reflect your personal style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 text-lg"
                asChild
              >
                <Link href="https://clienthub.getjobber.com/client_hubs/0b8c7c5a-c5d8-4a9b-9e6f-8b2c1a0d3e4f/public/request_estimate">
                  <Calendar className="w-5 h-5 mr-2" />
                  Free Design Consultation
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-black bg-white hover:bg-slate-100 px-8 py-4 text-lg"
                asChild
              >
                <Link href="tel:+16135550123">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (613) 555-0123
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Why Choose PG Closets for Your Walk-In?
            </h2>
            <p className="text-xl text-slate-600">
              With over 15 years of experience, we've transformed hundreds of Ottawa bedrooms 
              into organized, beautiful spaces that our clients love.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Recent Walk-In Closet Projects
            </h2>
            <p className="text-xl text-slate-600">
              See how we've transformed Ottawa bedrooms with custom walk-in closet designs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioImages.map((image, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="relative h-80">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">{image.title}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Investment Levels & Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Transparent pricing based on your space and needs. All projects include free consultation and design.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative overflow-hidden ${tier.popular ? 'ring-2 ring-amber-500 scale-105' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-black">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-amber-600">{tier.price}</div>
                  <p className="text-slate-600">Canadian pricing, taxes included</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                    asChild
                  >
                    <Link href="https://clienthub.getjobber.com/client_hubs/0b8c7c5a-c5d8-4a9b-9e6f-8b2c1a0d3e4f/public/request_estimate">
                      Get Quote for {tier.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Our Design Process
            </h2>
            <p className="text-xl text-slate-600">
              From concept to completion, we guide you through every step of creating your perfect walk-in closet
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Process Steps */}
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Free Consultation & Measurement",
                    description: "We visit your home to assess the space, discuss your needs, and take precise measurements. This consultation is completely free with no obligation.",
                    icon: Home
                  },
                  {
                    step: "02", 
                    title: "Custom Design & 3D Visualization",
                    description: "Our design team creates a custom layout optimized for your space and lifestyle, complete with 3D renderings so you can visualize the final result.",
                    icon: Lightbulb
                  },
                  {
                    step: "03",
                    title: "Material Selection & Approval",
                    description: "Choose from our premium selection of finishes, hardware, and accessories. We provide samples and detailed pricing for your approval.",
                    icon: Palette
                  },
                  {
                    step: "04",
                    title: "Professional Installation",
                    description: "Our certified installers complete your walk-in closet with precision and care, typically within 1-2 days depending on complexity.",
                    icon: Hammer
                  }
                ].map((processStep, index) => (
                  <div key={index} className="flex items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">{processStep.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <processStep.icon className="w-6 h-6 text-amber-600" />
                        <h3 className="text-2xl font-semibold text-slate-900">{processStep.title}</h3>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed">{processStep.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Connecting Line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-amber-200 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Bedroom?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Schedule your free consultation today and discover how a custom walk-in closet 
              can transform your daily routine and add value to your Ottawa home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 text-lg"
                asChild
              >
                <Link href="https://clienthub.getjobber.com/client_hubs/0b8c7c5a-c5d8-4a9b-9e6f-8b2c1a0d3e4f/public/request_estimate">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Consultation
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
                asChild
              >
                <Link href="/portfolio">
                  <Star className="w-5 h-5 mr-2" />
                  View Our Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Walk-In Closets",
            "description": "Professional custom walk-in closet design and installation in Ottawa",
            "provider": {
              "@type": "LocalBusiness",
              "name": "PG Closets",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ottawa",
                "addressRegion": "ON",
                "addressCountry": "CA"
              },
              "telephone": "+1-613-555-0123"
            },
            "areaServed": {
              "@type": "City",
              "name": "Ottawa",
              "addressRegion": "ON", 
              "addressCountry": "CA"
            },
            "offers": {
              "@type": "Offer",
              "priceRange": "$2,500-$15,000",
              "priceCurrency": "CAD"
            }
          })
        }}
      />
    </div>
  )
}