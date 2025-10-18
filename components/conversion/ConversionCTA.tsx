"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Phone, Calendar, Calculator, Check } from "lucide-react"

interface CTAOption {
  title: string
  description: string
  icon: React.ElementType
  href: string
  variant: "primary" | "secondary" | "outline"
  benefits: string[]
}

const ctaOptions: CTAOption[] = [
  {
    title: "Get Instant Estimate",
    description: "See your price in 60 seconds",
    icon: Calculator,
    href: "/instant-estimate",
    variant: "primary",
    benefits: ["No email required", "Real-time pricing", "4 simple questions"]
  },
  {
    title: "Book Free Measure",
    description: "Schedule within 48 hours",
    icon: Calendar,
    href: "/book-measure",
    variant: "secondary",
    benefits: ["Free within 30km", "2-3 week install", "Zero obligation"]
  },
  {
    title: "Call (613) 701-6393",
    description: "Speak with expert now",
    icon: Phone,
    href: "tel:6137016393",
    variant: "outline",
    benefits: ["Instant answers", "Mon-Fri 9-6pm", "Local Ottawa team"]
  }
]

export function ConversionCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the option that works best for you. All paths lead to the same professional result.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ctaOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow duration-300 group">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                    <Icon className="w-6 h-6 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {option.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link href={option.href} className="block">
                  <Button
                    className="w-full group/btn"
                    variant={option.variant as any}
                    size="lg"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium">No pressure sales</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium">Lifetime warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium">500+ Ottawa installations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
