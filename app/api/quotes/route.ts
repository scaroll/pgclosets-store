/**
 * Quote API Routes
 * Handles quote CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for creating a quote
const createQuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    preferredContact: z.enum(['email', 'phone']).optional()
  }),
  property: z.object({
    address: z.object({
      line1: z.string().min(1, 'Address is required'),
      line2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      province: z.string().min(1, 'Province is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().default('Canada')
    }),
    propertyType: z.string().optional(),
    notes: z.string().optional()
  }),
  configurations: z.array(z.object({
    roomName: z.string().min(1, 'Room name is required'),
    openingType: z.string(),
    doors: z.array(z.object({
      productId: z.string().optional(),
      series: z.string().min(1, 'Series is required'),
      doorType: z.string().min(1, 'Door type is required'),
      widthInches: z.number().positive(),
      heightInches: z.number().positive(),
      panelCount: z.number().int().positive(),
      finish: z.string().min(1, 'Finish is required'),
      hardware: z.string().min(1, 'Hardware is required'),
      handles: z.string().min(1, 'Handles is required'),
      softClose: z.boolean().default(false),
      mirror: z.boolean().default(false),
      customOptions: z.record(z.string()).optional(),
      unitPrice: z.number(),
      quantity: z.number().int().positive(),
      lineTotal: z.number()
    })).min(1, 'At least one door is required'),
    notes: z.string().optional(),
    photos: z.array(z.string()).default([])
  })).min(1, 'At least one room configuration is required'),
  notes: z.string().optional(),
  preferredMeasurementDate: z.string().optional(),
  preferredMeasurementTime: z.string().optional()
})

// Generate quote number
function generateQuoteNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `Q-${year}-${random}`
}

// Calculate totals
function calculateTotals(configurations: any[]) {
  const subtotal = configurations.reduce((total, config) => {
    return total + config.doors.reduce((roomTotal: number, door: any) => {
      return roomTotal + door.lineTotal
    }, 0)
  }, 0)

  const taxRate = 0.13 // 13% HST
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  return { subtotal, taxRate, tax, total }
}

/**
 * GET /api/quotes
 * List quotes for the authenticated user or all quotes for admin
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {}

    // Non-admin users can only see their own quotes
    if (user.role !== 'ADMIN') {
      where.OR = [
        { customerId: user.id },
        { customerEmail: session.user.email }
      ]
    }

    // Filter by status if provided
    if (status) {
      where.status = status
    }

    // Get quotes with pagination
    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          configurations: true,
          appointments: {
            orderBy: { scheduledDate: 'asc' },
            take: 1
          },
          payments: {
            orderBy: { createdAt: 'desc' }
          },
          assignedRep: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.quote.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        quotes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('[GET /api/quotes] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quotes
 * Create a new quote
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createQuoteSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const data = validation.data
    const { subtotal, taxRate, tax, total } = calculateTotals(data.configurations)

    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    let customerId: string | null = null

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      customerId = user?.id || null
    }

    // Create quote with configurations
    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        status: 'SUBMITTED',
        customerId,
        customerName: data.customer.name,
        customerEmail: data.customer.email,
        customerPhone: data.customer.phone,
        propertyAddress: data.property.address,
        propertyType: data.property.propertyType,
        propertyNotes: data.property.notes,
        subtotal,
        taxRate,
        tax,
        total,
        submittedAt: new Date(),
        configurations: {
          create: data.configurations.flatMap(config =>
            config.doors.map(door => ({
              roomName: config.roomName,
              openingType: config.openingType,
              productId: door.productId,
              series: door.series,
              doorType: door.doorType,
              widthInches: door.widthInches,
              heightInches: door.heightInches,
              panelCount: door.panelCount,
              finish: door.finish,
              hardware: door.hardware,
              handles: door.handles,
              softClose: door.softClose,
              mirror: door.mirror,
              customOptions: door.customOptions,
              unitPrice: door.unitPrice,
              quantity: door.quantity,
              lineTotal: door.lineTotal,
              notes: config.notes,
              photos: config.photos
            }))
          )
        },
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: 'SUBMITTED',
            reason: 'Quote submitted by customer'
          }
        }
      },
      include: {
        configurations: true
      }
    })

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      quoteNumber: quote.quoteNumber,
      quoteId: quote.id,
      message: 'Your quote request has been submitted successfully. We will contact you within 24 hours.'
    }, { status: 201 })

  } catch (error) {
    console.error('[POST /api/quotes] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
