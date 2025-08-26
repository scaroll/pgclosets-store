import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  User,
  Clock,
  BookOpen,
  Lightbulb,
  Ruler,
  Palette,
  Zap,
  Home,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "Complete Walk-In Closet Design Guide 2025 | Ottawa Renovation Experts",
  description: "Ultimate guide to designing your dream walk-in closet. From space planning to material selection, lighting, and organization systems. Expert tips from Ottawa's closet specialists.",
  keywords: "walk-in closet design, closet renovation guide, Ottawa closet design, custom closet planning, closet organization systems, bedroom renovation Ottawa",
  openGraph: {
    title: "Complete Walk-In Closet Design Guide 2025",
    description: "Expert guide to designing the perfect walk-in closet for your Ottawa home",
    images: ["/images/blog/walk-in-design-guide.jpg"],
  },
}

export const revalidate = 86400 // 24 hours

const tableOfContents = [
  { id: "planning", title: "Space Planning & Layout", icon: Home },
  { id: "measurements", title: "Taking Accurate Measurements", icon: Ruler },
  { id: "storage-systems", title: "Storage Systems & Organization", icon: BookOpen },
  { id: "materials", title: "Material Selection Guide", icon: Palette },
  { id: "lighting", title: "Lighting Design & Electrical", icon: Zap },
  { id: "installation", title: "Installation Process", icon: CheckCircle },
]

const designTips = [
  {
    tip: "The 20-60-20 Rule",
    description: "Allocate 20% hanging space for short items, 60% for long items, and 20% for folded storage.",
    category: "Layout"
  },
  {
    tip: "Minimum Walking Space",
    description: "Maintain at least 36 inches of walking space in the center of your walk-in closet.",
    category: "Space Planning"
  },
  {
    tip: "Eye-Level Priority",
    description: "Place frequently used items at eye level (5-6 feet high) for easy access.",
    category: "Organization"
  },
  {
    tip: "Seasonal Rotation",
    description: "Design higher shelves for seasonal items you access less frequently.",
    category: "Storage"
  }
]

export default function WalkInClosetDesignGuidePage() {
  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
              <BookOpen className="w-4 h-4 mr-2" />
              Complete Design Guide
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              The Complete Walk-In Closet Design Guide for 2025
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Transform your bedroom with a professionally designed walk-in closet. This comprehensive guide covers everything from initial planning to final installation.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                PG Closets Team
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Updated January 2025
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                15 min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-slate-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Table of Contents</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tableOfContents.map((item, index) => (
                <Link
                  key={index}
                  href={`#${item.id}`}
                  className="flex items-center p-4 bg-white rounded-lg border hover:border-amber-300 hover:shadow-md transition-all group"
                >
                  <item.icon className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="text-slate-700 group-hover:text-amber-700 font-medium">
                    {item.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <section className="mb-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                A well-designed walk-in closet is more than just storage—it's a personal sanctuary that can transform your daily routine and add significant value to your Ottawa home. With over 15 years of experience designing custom closets, we've learned what works and what doesn't. This guide shares our professional insights to help you create the perfect walk-in closet.
              </p>
            </div>
            
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <Lightbulb className="w-8 h-8 text-amber-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Pro Tip</h3>
                    <p className="text-slate-700">
                      Before you begin planning, spend a week tracking how you use your current closet. Note which items you access daily, weekly, and seasonally. This insight will inform your new design and ensure maximum functionality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Space Planning Section */}
          <section id="planning" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <Home className="w-8 h-8 text-amber-600 mr-3" />
              Space Planning & Layout Design
            </h2>
            
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p>
                  The foundation of any successful walk-in closet is thoughtful space planning. Whether you're converting a spare bedroom or working with an existing closet space, understanding the basics of layout design will ensure your investment delivers maximum functionality and satisfaction.
                </p>
                
                <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Minimum Space Requirements</h3>
                <ul className="space-y-2">
                  <li><strong>Width:</strong> Minimum 6 feet (prefer 8+ feet for comfortable movement)</li>
                  <li><strong>Depth:</strong> Minimum 6.5 feet (prefer 7+ feet for hanging clothes plus walkway)</li>
                  <li><strong>Height:</strong> Standard 8-foot ceilings work well, 9+ feet allow for additional storage</li>
                </ul>
                
                <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Popular Layout Configurations</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>L-Shape Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Ideal for corner spaces or rectangular rooms. Maximizes storage while maintaining clear walkway.
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Best for 8x8 feet or larger spaces</li>
                      <li>• Allows for island or seating area</li>
                      <li>• Easy to organize by clothing type</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>U-Shape Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Maximum storage capacity for larger spaces. Three walls of storage with central walkway.
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Requires minimum 10x8 feet space</li>
                      <li>• Perfect for couples sharing space</li>
                      <li>• Can include dressing area</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Galley Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Two parallel walls of storage. Efficient for narrower spaces while maintaining accessibility.
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Works in 5x12 feet spaces</li>
                      <li>• Cost-effective design</li>
                      <li>• Easy his/hers organization</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Island Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Central island for folded clothes with perimeter hanging. Luxury option for large spaces.
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Requires 12x10 feet minimum</li>
                      <li>• Provides additional drawer storage</li>
                      <li>• Creates boutique-like experience</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Measurements Section */}
          <section id="measurements" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <Ruler className="w-8 h-8 text-amber-600 mr-3" />
              Taking Accurate Measurements
            </h2>
            
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p>
                  Precise measurements are critical for a successful closet installation. Here's our professional approach to measuring your space accurately.
                </p>
              </div>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Essential Measuring Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li>• 25-foot measuring tape</li>
                      <li>• Laser level for straight lines</li>
                      <li>• Stud finder for wall anchoring</li>
                      <li>• Graph paper for sketching</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>• Pencil and notepad</li>
                      <li>• Camera for reference photos</li>
                      <li>• Flashlight for dark areas</li>
                      <li>• Step ladder for high measurements</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Step-by-Step Measurement Process</h3>
                
                <ol className="space-y-4">
                  <li>
                    <strong>Overall Room Dimensions</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Measure length, width, and height at multiple points</li>
                      <li>• Note any irregularities in walls or ceiling</li>
                      <li>• Check for square corners using 3-4-5 triangle method</li>
                    </ul>
                  </li>
                  
                  <li>
                    <strong>Wall Analysis</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Locate all electrical outlets and switches</li>
                      <li>• Mark HVAC vents and returns</li>
                      <li>• Note any plumbing or structural elements</li>
                    </ul>
                  </li>
                  
                  <li>
                    <strong>Door and Window Placement</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Measure door swing clearance</li>
                      <li>• Record window heights and trim details</li>
                      <li>• Account for baseboards and crown molding</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Storage Systems Section */}
          <section id="storage-systems" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <BookOpen className="w-8 h-8 text-amber-600 mr-3" />
              Storage Systems & Organization
            </h2>
            
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p>
                  The key to an efficient walk-in closet is understanding the different types of storage and how to use them effectively. Each clothing type and accessory requires specific storage solutions for optimal organization and preservation.
                </p>
              </div>
              
              <div className="grid gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Hanging Storage Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Short Hanging (36-42")</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Shirts and blouses</li>
                          <li>• Suit jackets and blazers</li>
                          <li>• Skirts and short dresses</li>
                          <li>• Folded pants (doubled)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Long Hanging (60-72")</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Dresses and gowns</li>
                          <li>• Long coats and trench coats</li>
                          <li>• Pants hung full length</li>
                          <li>• Robes and long garments</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Double Hanging</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Two rods, one above the other</li>
                          <li>• Maximizes hanging space</li>
                          <li>• Perfect for shirts and pants</li>
                          <li>• Most space-efficient option</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Shelving and Drawer Solutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Adjustable Shelving</h4>
                        <p className="text-slate-600 text-sm mb-4">
                          Provides flexibility for changing needs. Ideal for folded clothes, shoes, and accessories.
                        </p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Standard depth: 12-14 inches</li>
                          <li>• Spacing: 12-16 inches between shelves</li>
                          <li>• Materials: Melamine, wood veneer, solid wood</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Drawer Systems</h4>
                        <p className="text-slate-600 text-sm mb-4">
                          Perfect for delicate items, undergarments, and jewelry. Soft-close hardware recommended.
                        </p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Standard depth: 20-22 inches</li>
                          <li>• Heights: 4", 6", 8", 10" for different items</li>
                          <li>• Consider dividers and organizers</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Design Tips Grid */}
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Professional Design Tips</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {designTips.map((tip, index) => (
                    <Card key={index} className="border-l-4 border-l-amber-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-900">{tip.tip}</h4>
                          <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                        </div>
                        <p className="text-slate-600 text-sm">{tip.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Materials Section */}
          <section id="materials" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <Palette className="w-8 h-8 text-amber-600 mr-3" />
              Material Selection Guide
            </h2>
            
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p>
                  Choosing the right materials impacts both the appearance and longevity of your walk-in closet. Here's our guide to the most popular options and their characteristics.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Melamine (Thermofoil)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">
                      Most popular choice for custom closets. Durable, affordable, and available in many colors and wood grain patterns.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Advantages</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Moisture resistant</li>
                          <li>• Easy to clean</li>
                          <li>• Cost effective</li>
                          <li>• Consistent color</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Considerations</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Can chip if impacted</li>
                          <li>• Visible seams</li>
                          <li>• Limited repair options</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded">
                      <p className="text-sm font-medium">Price Range: $15-30 per sq ft</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Wood Veneer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">
                      Real wood veneer over engineered substrate. Offers natural wood beauty with improved stability.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Advantages</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Natural wood grain</li>
                          <li>• Can be stained</li>
                          <li>• Premium appearance</li>
                          <li>• Repairable</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Considerations</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Higher cost</li>
                          <li>• Requires maintenance</li>
                          <li>• Color variation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded">
                      <p className="text-sm font-medium">Price Range: $35-60 per sq ft</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Solid Wood</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">
                      Premium option using solid wood construction. Most durable and customizable but requires proper climate control.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Advantages</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Maximum durability</li>
                          <li>• Fully customizable</li>
                          <li>• Premium value</li>
                          <li>• Ages beautifully</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Considerations</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Highest cost</li>
                          <li>• Climate sensitive</li>
                          <li>• Longer lead times</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded">
                      <p className="text-sm font-medium">Price Range: $60-120 per sq ft</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Wire Shelving</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">
                      Ventilated option that prevents moisture buildup. Good for certain applications but limited aesthetic appeal.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Advantages</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Excellent ventilation</li>
                          <li>• Most affordable</li>
                          <li>• Easy installation</li>
                          <li>• Moisture resistant</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Considerations</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Limited aesthetics</li>
                          <li>• Items can fall through</li>
                          <li>• Less stable</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded">
                      <p className="text-sm font-medium">Price Range: $8-20 per sq ft</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="my-16 p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Design Your Dream Walk-In Closet?
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Let our experienced design team help you create the perfect walk-in closet for your Ottawa home. We offer free consultations and 3D design visualization.
              </p>
              <Button 
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                asChild
              >
                <Link href="https://clienthub.getjobber.com/client_hubs/0b8c7c5a-c5d8-4a9b-9e6f-8b2c1a0d3e4f/public/request_estimate">
                  Schedule Free Design Consultation
                </Link>
              </Button>
            </div>
          </section>

        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Complete Walk-In Closet Design Guide 2025",
            "description": "Ultimate guide to designing your dream walk-in closet. From space planning to material selection, lighting, and organization systems.",
            "image": "/images/blog/walk-in-design-guide.jpg",
            "author": {
              "@type": "Organization",
              "name": "PG Closets"
            },
            "publisher": {
              "@type": "Organization",
              "name": "PG Closets",
              "logo": {
                "@type": "ImageObject",
                "url": "/images/pg-logo.jpg"
              }
            },
            "datePublished": "2025-01-15",
            "dateModified": "2025-01-15"
          })
        }}
      />
    </article>
  )
}