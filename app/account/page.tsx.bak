import StandardLayout from "@/components/layout/StandardLayout"
import { ArrowRight, Clock, CreditCard, Heart, MapPin, Package, Settings, ShoppingBag, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

export default function AccountPage() {
  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "March 15, 2024",
      status: "Delivered",
      total: "$4,299.00",
      items: 3,
    },
    {
      id: "ORD-2024-002",
      date: "February 28, 2024",
      status: "In Production",
      total: "$6,799.00",
      items: 5,
    },
  ]

  const wishlistItems = [
    { id: 1, name: "Euro 3-Lite Bypass Door", price: "$459.00", image: "/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg" },
    { id: 2, name: "Luxury Walk-In System", price: "$2,499.00", image: "/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg" },
  ]

  return (
    <StandardLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 grid-spacing-lg">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="card-brand-elevated">
                <CardHeader className="card-spacing-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-h4">John Smith</CardTitle>
                      <CardDescription>Premium Member</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="content-spacing-xs">
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                    >
                      <User className="w-4 h-4" />
                      <span>Account Overview</span>
                    </Link>
                    <Link
                      href="/account/profile"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Addresses</span>
                    </Link>
                    <Link
                      href="/account/payment-methods"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Payment Methods</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      href="/account/settings"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 grid-spacing-lg">
              {/* Welcome Section */}
              <div className="content-spacing-sm">
                <h1 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">Welcome back, John!</h1>
                <p className="text-slate-600 font-light tracking-wide">Manage your account and track your orders</p>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">12</p>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">8</p>
                        <p className="text-sm text-muted-foreground">Wishlist Items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">Premium</p>
                        <p className="text-sm text-muted-foreground">Member Status</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases and their status</CardDescription>
                  </div>
                  <Link href="/account/orders">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.date} • {order.items} items
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{order.total}</p>
                          <Badge
                            className={
                              order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Wishlist Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">Wishlist</CardTitle>
                    <CardDescription>Items you&apos;re interested in</CardDescription>
                  </div>
                  <Link href="/wishlist">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-primary font-semibold">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Quick Actions</CardTitle>
                  <CardDescription>Frequently used account features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/contact">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule Consultation
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Browse Products
                      </Button>
                    </Link>
                    <Link href="/account/addresses">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MapPin className="w-4 h-4 mr-2" />
                        Manage Addresses
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <User className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}
