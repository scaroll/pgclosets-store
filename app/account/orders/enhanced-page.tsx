"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Package,
  Search,
  ChevronRight,
  Download,
  RefreshCw,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Order types
type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "installed"

interface OrderSummary {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  itemCount: number
  total: number
  tracking?: string
  installationDate?: string
}

// Mock orders data
const mockOrders: OrderSummary[] = [
  {
    id: "ord_123456",
    orderNumber: "PGC-2024-001234",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "processing",
    itemCount: 3,
    total: 2567.48,
    installationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ord_123455",
    orderNumber: "PGC-2024-001233",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    itemCount: 2,
    total: 1299.99
  },
  {
    id: "ord_123454",
    orderNumber: "PGC-2024-001232",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "installed",
    itemCount: 5,
    total: 3899.99,
    installationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ord_123453",
    orderNumber: "PGC-2024-001231",
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "shipped",
    itemCount: 1,
    total: 599.99,
    tracking: "CP123456789CA"
  }
]

// Status configuration
const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Order is being reviewed"
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Order has been confirmed"
  },
  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-800",
    icon: Package,
    description: "Preparing your order"
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-100 text-indigo-800",
    icon: Truck,
    description: "On the way to you"
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Order has been delivered"
  },
  installed: {
    label: "Installed",
    className: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Installation complete"
  }
}

// Order card component
const OrderCard = ({ order }: { order: OrderSummary }) => {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                <Badge className={cn("px-2 py-0.5", status.className)}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(order.date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
            <StatusIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items</span>
              <span className="font-medium">{order.itemCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
            {order.tracking && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tracking</span>
                <a href="#" className="text-blue-600 hover:underline">
                  {order.tracking}
                </a>
              </div>
            )}
            {order.installationDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Installation: {new Date(order.installationDate).toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/orders/${order.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-2">
                View Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.success("Items added to cart")}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.success("Invoice downloaded")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Empty state component
const EmptyOrders = ({ filter }: { filter: string }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
      <Package className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-medium mb-2">No Orders Found</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {filter === "all"
        ? "You haven't placed any orders yet. Start shopping to see your orders here."
        : `You don't have any ${filter} orders.`}
    </p>
    <Link href="/products">
      <Button>Start Shopping</Button>
    </Link>
  </div>
)

// Stats cards
const OrderStats = ({ orders }: { orders: OrderSummary[] }) => {
  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === "delivered" || o.status === "installed").length,
    pending: orders.filter(o => ["pending", "confirmed", "processing", "shipped"].includes(o.status)).length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-semibold mt-1">{stats.delivered}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold mt-1">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold mt-1">${stats.totalSpent.toFixed(0)}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EnhancedOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    // In production, fetch from API
    setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = [...orders]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        order =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.tracking?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "total-desc":
          return b.total - a.total
        case "total-asc":
          return a.total - b.total
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter, sortBy])

  if (isLoading) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your order history</p>
        </div>

        {/* Stats */}
        <OrderStats orders={orders} />

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order number or tracking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="installed">Installed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="total-desc">Highest Amount</SelectItem>
                  <SelectItem value="total-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyOrders filter={statusFilter} />
        )}
      </div>
    </StandardLayout>
  )
}