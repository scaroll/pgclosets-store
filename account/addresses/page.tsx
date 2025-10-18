import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Home, Building } from "lucide-react"
import Link from "next/link"

export default function AddressesPage() {
  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Smith",
      address: "123 Main Street",
      city: "Toronto",
      province: "ON",
      postal: "M5V 3A8",
      phone: "+1 (416) 555-0123",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Smith",
      address: "456 Business Ave, Suite 200",
      city: "Toronto",
      province: "ON",
      postal: "M4W 1A8",
      phone: "+1 (416) 555-0456",
      isDefault: false,
    },
  ]

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
            <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">Address Book</h1>
            <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {address.type === "Home" ? (
                        <Home className="w-4 h-4 text-primary" />
                      ) : (
                        <Building className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{address.type} Address</CardTitle>
                  </div>
                  {address.isDefault && <Badge className="bg-primary/20 text-primary">Default</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold text-foreground">{address.name}</p>
                  <p className="text-muted-foreground">{address.address}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.province} {address.postal}
                  </p>
                  <p className="text-muted-foreground">{address.phone}</p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {!address.isDefault && (
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-primary hover:text-primary/80">
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add New Address Card */}
          <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Add New Address</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a new shipping or billing address to your account
              </p>
              <Button variant="outline" className="bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Address Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              Address Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Shipping Addresses</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure accurate postal codes for faster delivery</li>
                  <li>• Include apartment or unit numbers</li>
                  <li>• Provide a phone number for delivery coordination</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Installation Addresses</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verify access requirements for large items</li>
                  <li>• Include special delivery instructions</li>
                  <li>• Ensure someone is available during delivery window</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
