import { Shield, Truck, Award, Phone } from "lucide-react"

export function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "All products backed by our comprehensive lifetime warranty for peace of mind.",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Complimentary shipping on all orders over $500 across Canada.",
    },
    {
      icon: Award,
      title: "Expert Installation",
      description: "Professional installation services available with certified technicians.",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Dedicated customer support team ready to help with any questions.",
    },
  ]

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Choose PG Closets?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering exceptional quality and service that exceeds your expectations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, index) => {
            const Icon = signal.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{signal.title}</h3>
                  <p className="text-muted-foreground">{signal.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>15+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>500+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Quality Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
