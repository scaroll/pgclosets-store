import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Settings, Store } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-4">PG Closets</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium closet systems and barn doors with complete store management. Quality craftsmanship meets modern
            e-commerce.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Customer Store</h2>
              <p className="text-muted-foreground mb-6">
                Browse our premium collection of closet systems and barn doors. Discover quality craftsmanship for your
                home.
              </p>
              <Link href="/store">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 group-hover:translate-x-1 transition-transform"
                >
                  Visit Store
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Admin Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Manage products, track inventory, and oversee your e-commerce operations with our comprehensive admin
                tools.
              </p>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="group-hover:translate-x-1 transition-transform bg-transparent"
                >
                  Admin Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-8 text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">15+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm">Quality Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
