import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, Download, Phone, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  const orderNumber = "PG-2025-001234"
  const estimatedDelivery = "February 15-22, 2025"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground font-serif">PG Closets</span>
                <p className="text-xs text-muted-foreground">Order Confirmation</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-muted-foreground">
            Order #{orderNumber} • Estimated delivery: {estimatedDelivery}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Order Details</CardTitle>
              <CardDescription>Your premium closet solutions are on their way</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/elegant-barn-door-closet.png"
                      alt="Premium Barn Door System - Elegant sliding closet door with black hardware"
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium">Premium Barn Door System</p>
                      <p className="text-sm text-muted-foreground">Quantity: 1</p>
                    </div>
                  </div>
                  <p className="font-medium">$899</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/luxury-walk-in-closet.png"
                      alt="Luxury Walk-In System - Premium closet organization system with custom shelving"
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium">Luxury Walk-In System</p>
                      <p className="text-sm text-muted-foreground">Quantity: 1</p>
                    </div>
                  </div>
                  <p className="font-medium">$2,499</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>$3,398</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (HST)</span>
                  <span>$441.74</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>$3,839.74</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">
                      We'll prepare your custom closet systems (1-2 business days)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Design Consultation</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will contact you to schedule your consultation
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Manufacturing & Delivery</p>
                    <p className="text-sm text-muted-foreground">Custom manufacturing and delivery (2-3 weeks)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Professional Installation</p>
                    <p className="text-sm text-muted-foreground">Expert installation and final walkthrough</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">(416) 555-CLOSET</p>
                    <p className="text-sm text-muted-foreground">Mon-Sat 9AM-7PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">orders@pgclosets.com</p>
                    <p className="text-sm text-muted-foreground">24/7 Support</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Order Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 bg-transparent"
            >
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Back to Home
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Email Confirmation */}
        <div className="mt-12 text-center">
          <Badge className="bg-accent/20 text-accent-foreground">
            <Mail className="w-3 h-3 mr-2" />
            Order confirmation sent to your email
          </Badge>
        </div>
      </div>
    </div>
  )
}
