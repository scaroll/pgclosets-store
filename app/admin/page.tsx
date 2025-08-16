import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { reninProducts } from "@/lib/renin-products"

export default function AdminDashboard() {
  // Get basic stats from Renin products
  const allBarnDoors = reninProducts.getBarnDoors()
  const allHardware = reninProducts.getHardware()
  const totalProducts = allBarnDoors.length + allHardware.length
  const activeProducts = totalProducts // All Renin products are active
  const totalCategories = 2 // Barn doors and hardware

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "All products in catalog",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Products",
      value: activeProducts,
      description: "Currently available",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Categories",
      value: totalCategories,
      description: "Product categories",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Low Stock",
      value: 0,
      description: "Items need restocking",
      icon: Users,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your store management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
