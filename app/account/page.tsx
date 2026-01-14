// Removed shadcn import - using native HTML
import { User, Package, MapPin, CreditCard, Settings, Heart, ArrowRight, ShoppingBag, Clock, Star } from "lucide-react"
import Link from "next/link"

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
    { id: 1, name: "Euro 3-Lite Bypass Door", price: "$459.00", image: "/modern-white-bypass-closet-door.png" },
    { id: 2, name: "Luxury Walk-In System", price: "$2,499.00", image: "/luxury-walk-in-closet.png" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">PG Closets</span>
                <p className="text-xs text-gray-500">Premium Home Organization</p>
              </div>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">John Smith</h2>
                  <p className="text-sm text-gray-500">Premium Member</p>
                </div>
              </div>
              <nav className="space-y-2">
                <Link href="/account" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium">
                  <User className="w-4 h-4" />
                  <span>Account Overview</span>
                </Link>
                <Link href="/account/orders" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </Link>
                <Link href="/account/addresses" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  <MapPin className="w-4 h-4" />
                  <span>Addresses</span>
                </Link>
                <Link href="/account/payment-methods" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Methods</span>
                </Link>
                <Link href="/wishlist" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </Link>
                <Link href="/account/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
              <p className="text-gray-500">Manage your account and track your orders</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-500">Wishlist Items</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Premium</p>
                    <p className="text-sm text-gray-500">Member Status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-500">Your latest purchases and their status</p>
                </div>
                <Link href="/account/orders" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date} - {order.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.total}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
              <p className="text-sm text-gray-500 mb-6">Frequently used account features</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/contact" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  Schedule Consultation
                </Link>
                <Link href="/products" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ShoppingBag className="w-4 h-4 mr-2 text-gray-500" />
                  Browse Products
                </Link>
                <Link href="/account/addresses" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Manage Addresses
                </Link>
                <Link href="/contact" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
