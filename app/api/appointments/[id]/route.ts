/**
 * Individual Appointment API
 * Update, complete, or cancel appointments
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const updateAppointmentSchema = z.object({
  scheduledDate: z.string().transform(s => new Date(s)).optional(),
  scheduledTime: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  assignedTechId: z.string().optional(),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
  completionNotes: z.string().optional()
})

/**
 * GET /api/appointments/[id]
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

    const appointment = await prisma.quoteAppointment.findUnique({
      where: { id },
      include: {
        quote: {
          select: {
            id: true,
            quoteNumber: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            customerId: true,
            propertyAddress: true
          }
        },
        assignedTech: {
          select: { id: true, name: true, phone: true, email: true }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    const isAdmin = user?.role === 'ADMIN'
    const isOwner = appointment.quote.customerId === user?.id ||
                   appointment.quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment
    })

  } catch (error) {
    console.error('[GET /api/appointments/[id]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/appointments/[id]
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
    const validation = updateAppointmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const data = validation.data

    // Get appointment and user
    const [appointment, user] = await Promise.all([
      prisma.quoteAppointment.findUnique({
        where: { id },
        include: {
          quote: {
            select: { id: true, customerId: true, customerEmail: true, status: true }
          }
        }
      }),
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      })
    ])

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    const isAdmin = user?.role === 'ADMIN'
    const isOwner = appointment.quote.customerId === user?.id ||
                   appointment.quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Build update data - customers can only update certain fields
    const updateData: any = {}

    if (isAdmin) {
      if (data.scheduledDate) updateData.scheduledDate = data.scheduledDate
      if (data.scheduledTime) updateData.scheduledTime = data.scheduledTime
      if (data.status) updateData.status = data.status
      if (data.assignedTechId !== undefined) updateData.assignedTechId = data.assignedTechId
      if (data.notes) updateData.notes = data.notes
      if (data.completionNotes) updateData.completionNotes = data.completionNotes

      // Handle completion
      if (data.status === 'COMPLETED') {
        updateData.completedAt = new Date()

        // Update quote status based on appointment type
        if (appointment.type === 'MEASUREMENT') {
          await prisma.$transaction([
            prisma.quote.update({
              where: { id: appointment.quoteId },
              data: { status: 'MEASUREMENT_COMPLETED' }
            }),
            prisma.quoteStatusLog.create({
              data: {
                quoteId: appointment.quoteId,
                fromStatus: appointment.quote.status as any,
                toStatus: 'MEASUREMENT_COMPLETED',
                changedById: user?.id,
                reason: 'Measurement appointment completed'
              }
            })
          ])
        } else if (appointment.type === 'INSTALLATION') {
          await prisma.$transaction([
            prisma.quote.update({
              where: { id: appointment.quoteId },
              data: { status: 'INSTALLED' }
            }),
            prisma.quoteStatusLog.create({
              data: {
                quoteId: appointment.quoteId,
                fromStatus: appointment.quote.status as any,
                toStatus: 'INSTALLED',
                changedById: user?.id,
                reason: 'Installation completed'
              }
            })
          ])
        }
      }
    }

    // Customers can only update customer notes
    if (data.customerNotes) updateData.customerNotes = data.customerNotes

    const updatedAppointment = await prisma.quoteAppointment.update({
      where: { id },
      data: updateData,
      include: {
        quote: {
          select: { quoteNumber: true }
        },
        assignedTech: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedAppointment
    })

  } catch (error) {
    console.error('[PUT /api/appointments/[id]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/appointments/[id]
 * Cancel an appointment
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

    const [appointment, user] = await Promise.all([
      prisma.quoteAppointment.findUnique({
        where: { id },
        include: {
          quote: {
            select: { customerId: true, customerEmail: true }
          }
        }
      }),
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      })
    ])

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    const isAdmin = user?.role === 'ADMIN'
    const isOwner = appointment.quote.customerId === user?.id ||
                   appointment.quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Cannot cancel completed appointments
    if (appointment.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel completed appointments' },
        { status: 400 }
      )
    }

    await prisma.quoteAppointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled'
    })

  } catch (error) {
    console.error('[DELETE /api/appointments/[id]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}
