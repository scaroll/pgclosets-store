import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnPolicyPage() {
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
              <RotateCcw className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Return & Refund Policy</h1>
          <p className="text-lg text-muted-foreground">
            Your satisfaction is our priority. Easy returns and hassle-free refunds.
          </p>
          <Badge className="mt-4 bg-green-100 text-green-700">30-Day Return Window</Badge>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Our Return Promise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We stand behind the quality of our products. If you're not completely satisfied with your purchase, you
                can return most items within 30 days of delivery for a full refund or exchange.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Eligible Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Items eligible for return must meet the following conditions:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Returned within 30 days of delivery
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  In original, unused condition
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  In original packaging with all accessories
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Include original receipt or order confirmation
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Not damaged by normal wear and tear
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                Non-Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">The following items cannot be returned:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Custom-made or personalized items
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items that have been installed or modified
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items damaged by misuse or normal wear
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items returned after 30 days
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Final sale or clearance items
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Return an Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Contact Us</h4>
                  <p className="text-sm text-muted-foreground">
                    Email or call us to initiate your return and receive a return authorization number.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Package Item</h4>
                  <p className="text-sm text-muted-foreground">
                    Securely package the item in its original packaging with all accessories.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Ship Back</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the prepaid return label we provide or ship to our return center.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Return Address</h4>
                <div className="text-sm text-muted-foreground">
                  <p>PG Closets Returns Department</p>
                  <p>456 Return Processing Way</p>
                  <p>Toronto, ON M5V 3A8</p>
                  <p>Canada</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Processing Time</h4>
                  <p className="text-muted-foreground">
                    Refunds are processed within 3-5 business days after we receive your returned item.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Refund Method</h4>
                  <p className="text-muted-foreground">
                    Refunds are issued to the original payment method used for the purchase.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Depending on your bank or credit card company, it may take an additional 5-10
                  business days for the refund to appear on your statement.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We're happy to exchange items for a different size, color, or style. Exchanges follow the same process
                as returns, and we'll ship your replacement item once we receive the original.
              </p>
              <p className="text-muted-foreground">
                If there's a price difference, we'll either refund the difference or charge your original payment method
                for any additional amount.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Our Returns Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help with a return? Our customer service team is here to assist you.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: returns@pgclosets.com</p>
                <p>Phone: 1-800-PG-CLOSET</p>
                <p>Hours: Monday-Friday 9AM-6PM EST</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button className="bg-primary hover:bg-primary/90">Start a Return</Button>
                <Button variant="outline" className="bg-transparent">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
