import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get basic stats
  const [{ count: totalProducts }, { count: activeProducts }, { count: totalCategories }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Total Products",
      value: totalProducts || 0,
      description: "All products in catalog",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Products",
      value: activeProducts || 0,
      description: "Currently available",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Categories",
      value: totalCategories || 0,
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
