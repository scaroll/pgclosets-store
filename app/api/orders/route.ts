import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Order interface
interface Order {
  id: string
  orderNumber: string
  customerId?: string
  date: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "installed"
  items: Array<{
    productId: string
    name: string
    image: string
    price: number
    quantity: number
    selectedOptions?: Record<string, string>
    installationIncluded?: boolean
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
    email: string
    phone: string
    company?: string
    addressLine1: string
    addressLine2?: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  installationDate?: string
  specialInstructions?: string
  paymentMethod: string
  paymentIntentId?: string
  tracking?: {
    carrier: string
    number: string
    url: string
  }
  createdAt: string
  updatedAt: string
}

// Mock database - in production, use a real database
let orders: Order[] = []

// Generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000000)
  return `PGC-${year}-${random.toString().padStart(6, "0")}`
}

// GET /api/orders - Get all orders for current user
export async function GET(request: Request) {
  try {
    // In production, verify user authentication
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    // Filter orders by user (mock implementation)
    const userOrders = orders.filter(order =>
      !userId || order.customerId === userId
    )

    return NextResponse.json({
      success: true,
      data: userOrders,
      count: userOrders.length
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must have at least one item" },
        { status: 400 }
      )
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Shipping address is required" },
        { status: 400 }
      )
    }

    // Create order
    const order: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: generateOrderNumber(),
      customerId: body.customerId,
      date: new Date().toISOString(),
      status: "confirmed",
      items: body.items,
      subtotal: body.subtotal || 0,
      tax: body.tax || 0,
      shipping: body.shipping || 0,
      discount: body.discount || 0,
      installation: body.installation || 0,
      total: body.total || 0,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress,
      installationDate: body.installationDate,
      specialInstructions: body.specialInstructions,
      paymentMethod: body.paymentMethod || "Credit Card",
      paymentIntentId: body.paymentIntentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save order (in production, save to database)
    orders.push(order)

    // Send confirmation email (in production)
    // await sendOrderConfirmationEmail(order)

    return NextResponse.json({
      success: true,
      data: order,
      orderId: order.id,
      orderNumber: order.orderNumber
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    )
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: Request) {
  try {
    const { orderId, status, tracking } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      )
    }

    // Find order
    const orderIndex = orders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    // Update order
    const order = orders[orderIndex];
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    if (status) {
      order.status = status
    }
    if (tracking) {
      order.tracking = tracking
    }
    order.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    )
  }
}