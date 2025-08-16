import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Settings, Store, MapPin, Phone, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Hero Section with Renin Products */}
      <section className="relative h-[80vh] bg-gradient-to-r from-slate-900 to-slate-700 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-20">
          <div className="relative">
            <Image
              src="/renin_images/barn_doors/gatsby-chevron-white-main.jpg"
              alt="Gatsby Chevron Barn Door"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src="/renin_images/barn_doors/sherwood-invisiglide-main.jpg"
              alt="Sherwood InvisiGlide Door"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src="/renin_images/barn_doors/metal-works-geometric-main.jpg"
              alt="Metal Works Geometric Door"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              Premium Renin
              <span className="block text-orange-400">Barn Doors</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-200">
              Authentic Renin products. Professional installation. Ottawa's premier closet door specialists since 2008.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/store">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  Shop Renin Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/consultation">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-lg">
                  Free Consultation
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Renin Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Renin Products</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our premium selection of authentic Renin barn doors and hardware systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Gatsby Chevron */}
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/renin_images/barn_doors/gatsby-chevron-white-main.jpg"
                  alt="Gatsby Chevron White Barn Door"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  SALE
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gatsby Chevron White</h3>
                <p className="text-slate-600 mb-4">Premium chevron pattern barn door with elegant white finish</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-orange-500">$679 CAD</span>
                  <span className="text-lg text-slate-400 line-through">$849 CAD</span>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Sherwood InvisiGlide */}
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/renin_images/barn_doors/sherwood-invisiglide-main.jpg"
                  alt="Sherwood InvisiGlide System"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  PREMIUM
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sherwood InvisiGlide</h3>
                <p className="text-slate-600 mb-4">Advanced soft-close system with invisible track technology</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-slate-900">$1,049 CAD</span>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Metal Works */}
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/renin_images/barn_doors/metal-works-geometric-main.jpg"
                  alt="Metal Works Geometric Door"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  POPULAR
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Metal Works Geometric</h3>
                <p className="text-slate-600 mb-4">Industrial design with geometric metal frame pattern</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-slate-900">$679 CAD</span>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Hardware Section */}
          <div className="bg-slate-50 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Professional Hardware Systems</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="/renin_images/hardware/standard-track-6ft-main.jpg"
                    alt="Standard Track System"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Standard Track 6ft</h4>
                  <p className="text-slate-600 text-sm">$169 CAD</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="/renin_images/hardware/soft-close-track-8ft-main.jpg"
                    alt="Soft Close Track"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Soft-Close Track 8ft</h4>
                  <p className="text-slate-600 text-sm">$289 CAD</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="/renin_images/hardware/invisiglide-premium-main.jpg"
                    alt="InvisiGlide Premium"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">InvisiGlide Premium</h4>
                  <p className="text-slate-600 text-sm">$399 CAD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Access Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Customer Store</h2>
                <p className="text-slate-600 mb-6">
                  Browse our complete Renin collection with real-time pricing and instant quotes
                </p>
                <Link href="/store">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 group-hover:translate-x-1 transition-transform"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-8 w-8 text-slate-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Dashboard</h2>
                <p className="text-slate-600 mb-6">
                  Manage inventory, track orders, and oversee operations with our admin tools
                </p>
                <Link href="/admin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group-hover:translate-x-1 transition-transform border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Admin Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ottawa Local Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Proudly Serving Ottawa</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Local expertise, professional installation, lifetime support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">500+</h3>
              <p className="text-slate-600">Ottawa Installations</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">15+</h3>
              <p className="text-slate-600">Years Experience</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">100%</h3>
              <p className="text-slate-600">Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
