'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, XCircle, RefreshCw, Download, Search, Eye, ShoppingBag, Star, ArrowLeft, ChevronDown, ChevronUp, CreditCard, Box, ArrowUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface OrderItem {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  image: string
  category: string
  customizable: boolean
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  billingAddress: {
    name: string
    address: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  paymentMethod: {
    type: string
    last4: string
    brand: string
  }
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  actualDelivery?: string
  notes?: string
  returnRequests?: Array<{
    id: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    reason: string
    createdAt: string
  }>
  reviews?: Array<{
    productId: string
    rating: number
    comment?: string
    createdAt: string
  }>
}

interface TrackingEvent {
  date: string
  time: string
  status: string
  location: string
  description: string
}

export function OrderHistoryClient() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [isTrackingLoading, setIsTrackingLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: '2024-10-15',
          status: 'delivered',
          total: 2845.00,
          subtotal: 2500.00,
          tax: 325.00,
          shipping: 20.00,
          discount: 0.00,
          items: [
            {
              id: '1',
              productId: 'prod-001',
              name: 'Luxury Walk-in Closet System',
              sku: 'LW-001',
              price: 1500.00,
              quantity: 1,
              image: '/api/placeholder/100/100',
              category: 'Closet Systems',
              customizable: true
            },
            {
              id: '2',
              productId: 'prod-002',
              name: 'Premium Shoe Rack',
              sku: 'PS-042',
              price: 450.00,
              quantity: 2,
              image: '/api/placeholder/100/100',
              category: 'Accessories',
              customizable: false
            },
            {
              id: '3',
              productId: 'prod-003',
              name: 'LED Lighting Kit',
              sku: 'LL-015',
              price: 100.00,
              quantity: 1,
              image: '/api/placeholder/100/100',
              category: 'Lighting',
              customizable: false
            }
          ],
          shippingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          billingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          paymentMethod: {
            type: 'credit_card',
            last4: '4242',
            brand: 'Visa'
          },
          trackingNumber: '1Z98754321',
          carrier: 'FedEx',
          estimatedDelivery: '2024-10-18',
          actualDelivery: '2024-10-17',
          reviews: [
            {
              productId: 'prod-001',
              rating: 5,
              comment: 'Absolutely love my new closet system! Installation was smooth and the quality is exceptional.',
              createdAt: '2024-10-18'
            }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          date: '2024-10-10',
          status: 'shipped',
          total: 1250.00,
          subtotal: 1100.00,
          tax: 143.00,
          shipping: 15.00,
          discount: 8.00,
          items: [
            {
              id: '4',
              productId: 'prod-004',
              name: 'Custom Wardrobe Organizer',
              sku: 'CW-023',
              price: 800.00,
              quantity: 1,
              image: '/api/placeholder/100/100',
              category: 'Organizers',
              customizable: true
            },
            {
              id: '5',
              productId: 'prod-005',
              name: 'Silk Hanger Set (12-pack)',
              sku: 'SH-012',
              price: 45.00,
              quantity: 1,
              image: '/api/placeholder/100/100',
              category: 'Accessories',
              customizable: false
            }
          ],
          shippingAddress: {
            name: 'John Smith',
            address: '456 Sparks Street',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1R 7S8',
            country: 'Canada'
          },
          billingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          paymentMethod: {
            type: 'credit_card',
            last4: '8888',
            brand: 'Mastercard'
          },
          trackingNumber: '1Z98754322',
          carrier: 'UPS',
          estimatedDelivery: '2024-10-22'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          date: '2024-10-05',
          status: 'processing',
          total: 890.00,
          subtotal: 750.00,
          tax: 97.50,
          shipping: 25.00,
          discount: -17.50,
          items: [
            {
              id: '6',
              productId: 'prod-006',
              name: 'Modular Storage Units',
              sku: 'MS-034',
              price: 750.00,
              quantity: 1,
              image: '/api/placeholder/100/100',
              category: 'Storage',
              customizable: true
            }
          ],
          shippingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          billingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          paymentMethod: {
            type: 'paypal',
            last4: '',
            brand: 'PayPal'
          },
          notes: 'Customer requested white glove installation service'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          date: '2024-09-28',
          status: 'cancelled',
          total: 2100.00,
          subtotal: 1800.00,
          tax: 234.00,
          shipping: 30.00,
          discount: 36.00,
          items: [
            {
              id: '7',
              productId: 'prod-007',
              name: 'Executive Closet Package',
              sku: 'EC-001',
              price: 1800.00,
              quantity: 1,
              image: '/api/placeholder/100/100',
              category: 'Closet Systems',
              customizable: true
            }
          ],
          shippingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          billingAddress: {
            name: 'John Smith',
            address: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          paymentMethod: {
            type: 'credit_card',
            last4: '1234',
            brand: 'Amex'
          }
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error loading orders",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTrackingEvents = async (trackingNumber: string) => {
    setIsTrackingLoading(true)
    try {
      // Mock tracking data - replace with actual carrier API
      const mockEvents: TrackingEvent[] = [
        {
          date: '2024-10-17',
          time: '14:30',
          status: 'Delivered',
          location: 'Ottawa, ON',
          description: 'Package delivered to front door. Signed by: J. Smith'
        },
        {
          date: '2024-10-17',
          time: '08:15',
          status: 'Out for Delivery',
          location: 'Ottawa, ON',
          description: 'Package is out for delivery'
        },
        {
          date: '2024-10-16',
          time: '23:45',
          status: 'Arrived at Facility',
          location: 'Ottawa, ON',
          description: 'Package arrived at local distribution center'
        },
        {
          date: '2024-10-15',
          time: '16:20',
          status: 'In Transit',
          location: 'Toronto, ON',
          description: 'Package departed sorting facility'
        },
        {
          date: '2024-10-15',
          time: '09:30',
          status: 'Package Picked Up',
          location: 'Toronto, ON',
          description: 'Package picked up from warehouse'
        }
      ]
      setTrackingEvents(mockEvents)
    } catch (error) {
      toast({
        title: "Error loading tracking information",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsTrackingLoading(false)
    }
  }

  const handleReorder = async (order: Order) => {
    try {
      // Add all items from order to cart
      const reorderedItems = order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))

      // Mock API call to add to cart
      console.log('Reordering items:', reorderedItems)

      toast({
        title: "Items added to cart",
        description: `${order.items.length} items have been added to your cart.`,
      })

      // Redirect to cart
      setTimeout(() => {
        window.location.href = '/cart'
      }, 1500)
    } catch (error) {
      toast({
        title: "Error reordering items",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      // Mock API call to download invoice
      console.log('Downloading invoice for order:', orderId)

      toast({
        title: "Invoice downloaded",
        description: "Your invoice has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error downloading invoice",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleRequestReturn = (orderId: string) => {
    // Redirect to return request page
    window.location.href = `/account/returns/${orderId}`
  }

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order)
    if (order.trackingNumber) {
      fetchTrackingEvents(order.trackingNumber)
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <RefreshCw className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'refunded': return <RefreshCw className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    const matchesDate = dateFilter === 'all' || (() => {
      const orderDate = new Date(order.date)
      const now = new Date()

      switch (dateFilter) {
        case 'last30': return orderDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case 'last90': return orderDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        case 'last6months': return orderDate >= new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        case 'lastyear': return orderDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        default: return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  const calculateTotalSpent = () => {
    return orders.filter(order => order.status !== 'cancelled' && order.status !== 'refunded')
      .reduce((total, order) => total + order.total, 0)
  }

  const getAverageOrderValue = () => {
    const completedOrders = orders.filter(order => order.status !== 'cancelled' && order.status !== 'refunded')
    return completedOrders.length > 0 ? calculateTotalSpent() / completedOrders.length : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                <p className="text-gray-600">View and manage your orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter(o => o.status !== 'cancelled').length}</div>
              <p className="text-xs text-muted-foreground">Lifetime orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${calculateTotalSpent().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getAverageOrderValue().toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order number or item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'You haven\'t placed any orders yet'}
              </p>
              <Button asChild>
                <Link href="/products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription>
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={cn(getStatusColor(order.status))}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      <Collapsible open={expandedOrders.has(order.id)} onOpenChange={() => toggleOrderExpansion(order.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {expandedOrders.has(order.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Total: <span className="font-semibold">${order.total.toLocaleString()}</span>
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-600">
                          Tracking: {order.trackingNumber} ({order.carrier})
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {order.status === 'delivered' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold mb-4">Items</h4>
                              <div className="space-y-4">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <Box className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{item.name}</h5>
                                      <p className="text-sm text-gray-600">SKU: {item.sku} • Category: {item.category}</p>
                                      {item.customizable && (
                                        <Badge variant="outline" className="mt-1">Customizable</Badge>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">${item.price.toLocaleString()}</p>
                                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div>
                              <h4 className="font-semibold mb-4">Order Summary</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>${order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax</span>
                                  <span>${order.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>${order.shipping.toLocaleString()}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discount.toLocaleString()}</span>
                                  </div>
                                )}
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                  <span>Total</span>
                                  <span>${order.total.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Addresses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center">
                                  <Package className="h-4 w-4 mr-2" />
                                  Shipping Address
                                </h4>
                                <p className="text-sm text-gray-600">{order.shippingAddress.name}</p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                                <p className="text-sm text-gray-600">
                                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Payment Method
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {order.paymentMethod.brand} ending in {order.paymentMethod.last4}
                                </p>
                                <p className="text-sm text-gray-600 capitalize">{order.paymentMethod.type.replace('_', ' ')}</p>
                              </div>
                            </div>

                            {order.trackingNumber && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold mb-4 flex items-center">
                                    <Truck className="h-4 w-4 mr-2" />
                                    Tracking Information
                                  </h4>
                                  <div className="space-y-2">
                                    <p className="text-sm">
                                      <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Carrier:</span> {order.carrier}
                                    </p>
                                    {order.estimatedDelivery && (
                                      <p className="text-sm">
                                        <span className="font-medium">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}
                                      </p>
                                    )}
                                    {order.actualDelivery && (
                                      <p className="text-sm">
                                        <span className="font-medium">Delivered:</span> {new Date(order.actualDelivery).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            {order.notes && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold mb-2">Order Notes</h4>
                                  <p className="text-sm text-gray-600">{order.notes}</p>
                                </div>
                              </>
                            )}

                            <div className="flex space-x-3">
                              <Button onClick={() => handleDownloadInvoice(order.id)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download Invoice
                              </Button>
                              {order.trackingNumber && (
                                <Button variant="outline" onClick={() => window.open(`https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`, '_blank')}>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Package
                                </Button>
                              )}
                              {order.status === 'delivered' && !order.reviews?.length && (
                                <Button variant="outline">
                                  <Star className="h-4 w-4 mr-2" />
                                  Leave Review
                                </Button>
                              )}
                              {['delivered', 'shipped'].includes(order.status) && (
                                <Button variant="outline" onClick={() => handleRequestReturn(order.id)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Request Return
                                </Button>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {order.trackingNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrackOrder(order)}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Track
                        </Button>
                      )}
                    </div>
                  </div>

                  <Collapsible open={expandedOrders.has(order.id)}>
                    <CollapsibleContent>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Box className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-medium truncate">{item.name}</h5>
                                <p className="text-xs text-gray-600">Qty: {item.quantity} • ${item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tracking Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tracking Details</DialogTitle>
              <DialogDescription>
                {selectedOrder?.orderNumber} • {selectedOrder?.trackingNumber}
              </DialogDescription>
            </DialogHeader>
            {isTrackingLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-3 h-3 rounded-full border-2",
                        index === 0 ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                      )}></div>
                      {index < trackingEvents.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}