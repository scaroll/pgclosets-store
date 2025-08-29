import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Truck, Clock, MapPin, Package } from "lucide-react"
import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                <span className="text-primary-foreground font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground font-serif">PG Closets</span>
                <p className="text-xs text-muted-foreground">Premium Home Organization</p>
              </div>
            </Link>

            <Link href="/">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Shipping Policy</h1>
          <p className="text-lg text-muted-foreground">Fast, reliable delivery for your premium closet solutions.</p>
          <Badge className="mt-4 bg-green-100 text-green-700">FREE Shipping on ALL Orders!</Badge>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Shipping Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We currently ship to all addresses within Canada and the United States. International shipping may be
                available for select products - please contact us for details.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Canada</h4>
                  <p className="text-sm text-muted-foreground">All provinces and territories</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">United States</h4>
                  <p className="text-sm text-muted-foreground">All 50 states</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Processing & Delivery Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Processing Time</h4>
                <p className="text-muted-foreground mb-4">
                  Orders are typically processed within 1-2 business days. Custom orders may require additional
                  processing time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Delivery Times</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Standard Delivery</p>
                      <p className="text-sm text-muted-foreground">Most orders</p>
                    </div>
                    <Badge variant="outline">5-7 business days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Express Delivery</p>
                      <p className="text-sm text-muted-foreground">Available on request</p>
                    </div>
                    <Badge variant="outline">2-3 business days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Custom Orders</p>
                      <p className="text-sm text-muted-foreground">Made-to-order items</p>
                    </div>
                    <Badge variant="outline">2-4 weeks</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Shipping Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We partner with trusted carriers to ensure your orders arrive safely and on time.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Ground Shipping</h4>
                  <p className="text-sm text-muted-foreground">Standard delivery for most items</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">White Glove</h4>
                  <p className="text-sm text-muted-foreground">Premium delivery with installation</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Express</h4>
                  <p className="text-sm text-muted-foreground">Expedited delivery when needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Once your order ships, you'll receive a tracking number via email. You can also track your order status
                by logging into your account or contacting our customer service team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/account/orders">
                  <Button className="bg-primary hover:bg-primary/90">Track Your Order</Button>
                </Link>
                <Button variant="outline" className="bg-transparent">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Large Items</h4>
                <p className="text-muted-foreground">
                  Large closet systems may require special handling and delivery arrangements. We'll contact you to
                  schedule delivery and discuss any access requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Installation Services</h4>
                <p className="text-muted-foreground">
                  Professional installation is available for most products. Installation scheduling will be coordinated
                  after delivery.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Questions about shipping? Our customer service team is here to help.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: shipping@pgclosets.com</p>
                <p>Phone: 1-800-PG-CLOSET</p>
                <p>Hours: Monday-Friday 9AM-6PM EST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
