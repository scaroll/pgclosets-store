"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Package,
  Truck,
  CheckCircle,
  Calendar,
  Download,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock
} from "lucide-react"
import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Order status types
type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "installed"

// Order interface
interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  items: Array<{
    id: string
    name: string
    image: string
    price: number
    quantity: number
    options?: Record<string, string>
  }>
  subtotal: number
  tax: number
  shipping: number
  discount: number
  installation: number
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    province: string
    postalCode: string
    country: string
    phone: string
    email: string
  }
  installationDate?: string
  paymentMethod: string
  tracking?: {
    carrier: string
    number: string
    url: string
  }
}

// Mock order data - in production, fetch from API
const mockOrder: Order = {
  id: "ord_123456",
  orderNumber: "PGC-2024-001234",
  date: new Date().toISOString(),
  status: "processing",
  items: [
    {
      id: "1",
      name: "Premium Sliding Barn Door - White Oak",
      image: "/images/products/barn-door.jpg",
      price: 899,
      quantity: 2,
      options: {
        Size: "36\" x 84\"",
        Finish: "White Oak"
      }
    },
    {
      id: "2",
      name: "Soft-Close Hardware Kit",
      image: "/images/products/hardware-kit.jpg",
      price: 149,
      quantity: 2
    }
  ],
  subtotal: 2096,
  tax: 272.48,
  shipping: 0,
  discount: 100,
  installation: 299,
  total: 2567.48,
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    addressLine1: "123 Main Street",
    addressLine2: "Unit 4B",
    city: "Ottawa",
    province: "ON",
    postalCode: "K1A 0B1",
    country: "Canada",
    phone: "(613) 701-6393",
    email: "john.doe@example.com"
  },
  installationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  paymentMethod: "Visa ending in 4242",
  tracking: {
    carrier: "Canada Post",
    number: "CP123456789CA",
    url: "https://www.canadapost.ca/track/CP123456789CA"
  }
}

// Order status timeline component
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  const steps = [
    { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
    { id: "processing", label: "Processing", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle },
    { id: "installed", label: "Installed", icon: CheckCircle }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === status)

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index <= currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isCompleted ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500",
                    isCurrent && "ring-4 ring-green-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <p className="absolute top-12 -left-8 w-24 text-xs text-center">
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    index < currentStepIndex ? "bg-green-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Status badge component
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
    processing: { label: "Processing", className: "bg-purple-100 text-purple-800" },
    shipped: { label: "Shipped", className: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-800" },
    installed: { label: "Installed", className: "bg-green-100 text-green-800" }
  }

  const config = statusConfig[status]

  return (
    <Badge className={cn("px-3 py-1", config.className)}>
      {config.label}
    </Badge>
  )
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In production, fetch order from API
    // const fetchOrder = async () => {
    //   const response = await fetch(`/api/orders/${params.id}`)
    //   const data = await response.json()
    //   setOrder(data)
    // }
    // fetchOrder()

    // Mock data for now
    setTimeout(() => {
      setOrder(mockOrder)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleDownloadInvoice = () => {
    // In production, generate and download PDF invoice
    toast.success("Invoice downloaded")
  }

  const handleReorder = () => {
    // Add items back to cart
    toast.success("Items added to cart")
    router.push("/cart")
  }

  if (isLoading) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </StandardLayout>
    )
  }

  if (!order) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-medium mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <Link href="/account/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-light mb-2">Order Details</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Order #{order.orderNumber}</span>
                <span>•</span>
                <span>
                  {new Date(order.date).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Timeline */}
        <Card className="mb-8">
          <CardContent className="py-8">
            <OrderTimeline status={order.status} />
          </CardContent>
        </Card>

        {/* Tracking Information */}
        {order.tracking && order.status === "shipped" && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Truck className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">
                      Your order has been shipped!
                    </p>
                    <p className="text-sm text-blue-700">
                      {order.tracking.carrier} • Tracking: {order.tracking.number}
                    </p>
                  </div>
                </div>
                <a
                  href={order.tracking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Track Package →
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.options && (
                          <div className="flex gap-2 mt-1">
                            {Object.entries(item.options).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>Shipping Address</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Contact Information</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>{order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.email}</p>
                    </div>

                    {order.installationDate && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>Installation Scheduled</span>
                        </div>
                        <p className="text-sm font-medium">
                          {new Date(order.installationDate).toLocaleDateString("en-CA", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.installation > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Installation</span>
                      <span>${order.installation.toFixed(2)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (HST)</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={handleDownloadInvoice}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
                <Button
                  onClick={handleReorder}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Order Again
                </Button>
                <Link href="/contact">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Need Help? */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our customer service team is here to assist you.
                </p>
                <div className="space-y-2 text-sm">
                  <a
                    href="tel:6137016393"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    (613) 701-6393
                  </a>
                  <a
                    href="mailto:support@pgclosets.com"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    support@pgclosets.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-4">
                  <Clock className="w-3 h-3" />
                  <span>Mon-Fri 9AM-6PM EST</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StandardLayout>
  )
}