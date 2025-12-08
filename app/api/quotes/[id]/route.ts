/**
 * Quote Detail API Routes
 * Handles individual quote operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/quotes/[id]
 * Get a single quote by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
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

    // Get quote
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        configurations: true,
        appointments: {
          orderBy: { scheduledDate: 'asc' },
          include: {
            assignedTech: {
              select: { id: true, name: true, phone: true }
            }
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, image: true }
            }
          }
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changedBy: {
              select: { id: true, name: true }
            }
          }
        },
        assignedRep: {
          select: { id: true, name: true, email: true, phone: true }
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Check access - admin can see all, customers only their own
    if (user.role !== 'ADMIN') {
      const isOwner = quote.customerId === user.id || quote.customerEmail === session.user.email
      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: quote
    })

  } catch (error) {
    console.error('[GET /api/quotes/[id]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/quotes/[id]
 * Update a quote (only if in DRAFT status for customers)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Get user and quote
    const [user, quote] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      }),
      prisma.quote.findUnique({
        where: { id },
        select: { id: true, status: true, customerId: true, customerEmail: true }
      })
    ])

    if (!user || !quote) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      )
    }

    // Check access
    const isAdmin = user.role === 'ADMIN'
    const isOwner = quote.customerId === user.id || quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Customers can only edit draft quotes
    if (!isAdmin && quote.status !== 'DRAFT') {
      return NextResponse.json(
        { success: false, error: 'Cannot edit submitted quotes' },
        { status: 400 }
      )
    }

    // Update allowed fields
    const updateData: any = {}

    if (body.customerName) updateData.customerName = body.customerName
    if (body.customerPhone) updateData.customerPhone = body.customerPhone
    if (body.propertyAddress) updateData.propertyAddress = body.propertyAddress
    if (body.propertyType) updateData.propertyType = body.propertyType
    if (body.propertyNotes) updateData.propertyNotes = body.propertyNotes

    // Admin-only updates
    if (isAdmin) {
      if (body.assignedRepId !== undefined) updateData.assignedRepId = body.assignedRepId
      if (body.discount !== undefined) updateData.discount = body.discount
      if (body.discountReason) updateData.discountReason = body.discountReason
      if (body.installationFee !== undefined) updateData.installationFee = body.installationFee
      if (body.travelFee !== undefined) updateData.travelFee = body.travelFee
      if (body.paymentTerms) updateData.paymentTerms = body.paymentTerms
      if (body.validUntil) updateData.validUntil = new Date(body.validUntil)
      if (body.depositPercent !== undefined) updateData.depositPercent = body.depositPercent
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        configurations: true,
        assignedRep: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedQuote
    })

  } catch (error) {
    console.error('[PUT /api/quotes/[id]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/quotes/[id]
 * Cancel a quote
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and quote
    const [user, quote] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      }),
      prisma.quote.findUnique({
        where: { id },
        select: { id: true, status: true, customerId: true, customerEmail: true }
      })
    ])

    if (!user || !quote) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      )
    }

    // Check access
    const isAdmin = user.role === 'ADMIN'
    const isOwner = quote.customerId === user.id || quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Cannot cancel completed or already cancelled quotes
    const nonCancellableStatuses = ['COMPLETED', 'CANCELLED', 'INSTALLED']
    if (nonCancellableStatuses.includes(quote.status)) {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel this quote' },
        { status: 400 }
      )
    }

    // Update to cancelled
    await prisma.$transaction([
      prisma.quote.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      }),
      prisma.quoteStatusLog.create({
        data: {
          quoteId: id,
          fromStatus: quote.status as any,
          toStatus: 'CANCELLED',
          changedById: user.id,
          reason: 'Cancelled by user'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Quote cancelled successfully'
    })

  } catch (error) {
    console.error('[DELETE /api/quotes/[id]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel quote' },
      { status: 500 }
    )
  }
}
