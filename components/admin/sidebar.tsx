import { cn } from "@/lib/utils"
import { BarChart3, Home, Package, Settings, ShoppingCart, Tags, Upload, ImageIcon } from "lucide-react"
import Link from "next/link"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Import Tools", href: "/admin/import", icon: Upload },
  { name: "Media Extraction", href: "/admin/media", icon: ImageIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">PG Closets Admin</h2>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                  "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
