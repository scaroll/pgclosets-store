"use client"

import { Check, Calendar, Shield, Ruler, ThumbsUp, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Ruler,
    title: "Free In-Home Measure",
    description: "Professional measurement within 30 km of Ottawa. We ensure perfect fit before fabrication."
  },
  {
    icon: Calendar,
    title: "2-3 Week Install",
    description: "Fast turnaround from measurement to installation. Most projects completed in under 3 weeks."
  },
  {
    icon: Shield,
    title: "Lifetime Workmanship Warranty",
    description: "We stand behind our installation with a lifetime warranty on all workmanship."
  },
  {
    icon: ThumbsUp,
    title: "Official Renin Dealer",
    description: "Authorized dealer offering genuine Renin products with full manufacturer support."
  },
  {
    icon: Sparkles,
    title: "Expert Installation",
    description: "Professional installers with years of experience ensuring flawless results."
  },
  {
    icon: Check,
    title: "Ottawa-Based",
    description: "Local business serving the National Capital Region with personalized service."
  }
]

export function WhyPGSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose PG Closets?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're not just selling doors—we're delivering a complete solution with professional service from start to finish.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-teal-700" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium">Serving Ottawa and surrounding areas since 2020</span>
          </div>
        </div>
      </div>
    </section>
  )
}
