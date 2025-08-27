'use client'

import { Button } from "@/components/ui/button"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { reninProducts } from "@/lib/renin-products"
import Link from "next/link"

export function HeroSection() {
  // Get the featured sale product for hero pricing
  const featuredProducts = reninProducts.getFeaturedProducts()
  const heroProduct = featuredProducts[0] || reninProducts.getBarnDoors()[0]
  const heroPrice = (heroProduct && 'sale_price' in heroProduct ? heroProduct.sale_price as number : null) || heroProduct?.price || 679
  
  return (
    <section className="relative min-h-screen bg-animated-gradient animate-gradient overflow-hidden" style={{backgroundSize: '400% 400%'}}>
      {/* Neural Network Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <pattern id="neural" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" opacity="0.5"/>
              <line x1="20" y1="20" x2="60" y2="20" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              <line x1="20" y1="20" x2="20" y2="60" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              <line x1="20" y1="20" x2="35" y2="35" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural)"/>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-float">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-7xl font-display font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-bright-cyan-500 to-white bg-clip-text text-transparent">
                  Transform Your Space
                </span>
                <br />
                <span className="text-white/90">with</span>{" "}
                <span className="bg-gradient-to-r from-tech-blue-500 via-ai-purple-500 to-electric-green-500 bg-clip-text text-transparent animate-pulse">
                  AI-Powered
                </span>
                <br />
                <span className="text-white/90">Closet Systems</span>
              </h1>
              <p className="text-xl font-body text-white/80 leading-relaxed max-w-2xl">
                Experience the future of home organization with our intelligent closet solutions. 
                Handcrafted precision meets cutting-edge AI design optimization for the discerning modern homeowner.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/store/products">
                <Button 
                  size="lg" 
                  className="group bg-tech-gradient hover:scale-105 text-white px-10 py-6 text-lg font-display font-semibold rounded-lg shadow-2xl transition-all duration-300 hover:shadow-tech-blue-500/50"
                >
                  <span className="flex items-center gap-2">
                    Explore Collection
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link href="/store/inspiration">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group px-10 py-6 text-lg font-display font-semibold rounded-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    AI Design Tool
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              {[
                { number: "500+", label: "AI Optimizations" },
                { number: "15+", label: "Smart Features" },
                { number: "100%", label: "Future Ready" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl font-display font-black text-white mb-2 group-hover:text-bright-cyan-500 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm font-body text-white/70 group-hover:text-white/90 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <GlassCard variant="floating" gradient className="group cursor-pointer">
              <GlassCardContent className="p-0">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={heroProduct?.images[0] || "/modern-walk-in-closet-barn-doors.png"}
                    alt={heroProduct?.name || "AI-optimized closet system"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = "/modern-walk-in-closet-barn-doors.png"
                    }}
                  />
                </div>
              </GlassCardContent>
            </GlassCard>
            
            {/* Floating price tag */}
            <GlassCard 
              variant="glow" 
              className="absolute -bottom-6 -right-6 p-6 bg-gradient-to-br from-tech-blue-600/90 via-ai-purple-600/90 to-electric-green-600/90"
            >
              <GlassCardContent className="p-0 text-center">
                <div className="text-sm font-body text-white/90 mb-1">Smart Pricing from</div>
                <div className="text-3xl font-display font-bold text-white">
                  {reninProducts.formatPrice(heroPrice)}
                </div>
                <div className="text-xs font-body text-white/70 mt-1">AI-Optimized Value</div>
              </GlassCardContent>
            </GlassCard>

            {/* Floating AI indicators */}
            <div className="absolute top-4 left-4 animate-pulse">
              <div className="w-3 h-3 bg-electric-green-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-electric-green-400 rounded-full"></div>
            </div>
            <div className="absolute top-12 right-8 animate-pulse delay-300">
              <div className="w-2 h-2 bg-bright-cyan-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-2 h-2 bg-bright-cyan-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-16 left-8 animate-pulse delay-700">
              <div className="w-2.5 h-2.5 bg-ai-purple-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-ai-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
    </section>
  )
}
