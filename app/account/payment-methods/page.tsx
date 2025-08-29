import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Edit, Trash2, ArrowLeft, Shield, Calendar } from "lucide-react"
import Link from "next/link"

export default function PaymentMethodsPage() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      name: "John Smith",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "08/25",
      name: "John Smith",
      isDefault: false,
    },
  ]

  const getCardIcon = (type: string) => {
    return <CreditCard className="w-6 h-6 text-primary" />
  }

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

            <Link href="/account">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your saved payment methods</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        <div className="space-y-6">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getCardIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-foreground">
                          {method.type} •••• {method.last4}
                        </p>
                        {method.isDefault && <Badge className="bg-primary/20 text-primary">Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Expires {method.expiry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {!method.isDefault && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Set as Default Payment Method
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add New Payment Method Card */}
          <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Add Payment Method</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a new credit card or payment method to your account
              </p>
              <Button variant="outline" className="bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Your payment information is secure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Secure Processing</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All payments are processed securely with SSL encryption</li>
                  <li>• We never store your full credit card number</li>
                  <li>• PCI DSS compliant payment processing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Accepted Payment Methods</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Visa, Mastercard, American Express</li>
                  <li>• PayPal and Apple Pay</li>
                  <li>• Financing options available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
