/**
 * Quote Appointments API
 * Schedule and manage measurement/installation appointments
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAppointmentSchema = z.object({
  quoteId: z.string(),
  type: z.enum(['MEASUREMENT', 'INSTALLATION', 'FOLLOW_UP']),
  scheduledDate: z.string().transform(s => new Date(s)),
  scheduledTime: z.string(),
  duration: z.number().int().positive().default(60),
  notes: z.string().optional(),
  customerNotes: z.string().optional()
})

/**
 * GET /api/appointments
 * List appointments for the user or all for admin
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
    const quoteId = searchParams.get('quoteId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

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

    const where: any = {}

    // Non-admin can only see their own appointments
    if (user.role !== 'ADMIN') {
      where.quote = {
        OR: [
          { customerId: user.id },
          { customerEmail: session.user.email }
        ]
      }
    }

    if (quoteId) where.quoteId = quoteId
    if (type) where.type = type

    if (startDate || endDate) {
      where.scheduledDate = {}
      if (startDate) where.scheduledDate.gte = new Date(startDate)
      if (endDate) where.scheduledDate.lte = new Date(endDate)
    }

    const appointments = await prisma.quoteAppointment.findMany({
      where,
      orderBy: { scheduledDate: 'asc' },
      include: {
        quote: {
          select: {
            id: true,
            quoteNumber: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            propertyAddress: true
          }
        },
        assignedTech: {
          select: { id: true, name: true, phone: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: appointments
    })

  } catch (error) {
    console.error('[GET /api/appointments] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/appointments
 * Create a new appointment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = createAppointmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verify quote exists and user has access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    const quote = await prisma.quote.findUnique({
      where: { id: data.quoteId },
      select: {
        id: true,
        customerId: true,
        customerEmail: true,
        propertyAddress: true,
        status: true
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Check access
    const isAdmin = user?.role === 'ADMIN'
    const isOwner = quote.customerId === user?.id || quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Create appointment
    const appointment = await prisma.quoteAppointment.create({
      data: {
        quoteId: data.quoteId,
        type: data.type,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        duration: data.duration,
        address: quote.propertyAddress || {},
        notes: data.notes,
        customerNotes: data.customerNotes,
        status: 'SCHEDULED'
      },
      include: {
        quote: {
          select: { quoteNumber: true, customerName: true }
        }
      }
    })

    // Update quote status if this is a measurement appointment
    if (data.type === 'MEASUREMENT') {
      await prisma.$transaction([
        prisma.quote.update({
          where: { id: data.quoteId },
          data: { status: 'MEASUREMENT_SCHEDULED' }
        }),
        prisma.quoteStatusLog.create({
          data: {
            quoteId: data.quoteId,
            fromStatus: quote.status as any,
            toStatus: 'MEASUREMENT_SCHEDULED',
            changedById: user?.id,
            reason: `Measurement scheduled for ${data.scheduledDate.toLocaleDateString()}`
          }
        })
      ])
    } else if (data.type === 'INSTALLATION') {
      await prisma.$transaction([
        prisma.quote.update({
          where: { id: data.quoteId },
          data: { status: 'INSTALLATION_SCHEDULED' }
        }),
        prisma.quoteStatusLog.create({
          data: {
            quoteId: data.quoteId,
            fromStatus: quote.status as any,
            toStatus: 'INSTALLATION_SCHEDULED',
            changedById: user?.id,
            reason: `Installation scheduled for ${data.scheduledDate.toLocaleDateString()}`
          }
        })
      ])
    }

    // TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      data: appointment
    }, { status: 201 })

  } catch (error) {
    console.error('[POST /api/appointments] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
