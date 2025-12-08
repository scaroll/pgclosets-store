/**
 * Admin Quote Status Update API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.string(),
  reason: z.string().optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

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

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = updateStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { status, reason } = validation.data

    // Get current quote
    const quote = await prisma.quote.findUnique({
      where: { id },
      select: { id: true, status: true }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Determine timestamp field to update
    const timestampField: Record<string, string> = {
      SUBMITTED: 'submittedAt',
      UNDER_REVIEW: 'reviewedAt',
      QUOTED: 'quotedAt',
      APPROVED: 'approvedAt',
      COMPLETED: 'completedAt',
      CANCELLED: 'cancelledAt'
    }

    const updateData: any = { status }
    if (timestampField[status]) {
      updateData[timestampField[status]] = new Date()
    }

    // Calculate deposit amount if moving to APPROVED
    if (status === 'APPROVED') {
      const fullQuote = await prisma.quote.findUnique({
        where: { id },
        select: { total: true, depositPercent: true }
      })
      if (fullQuote) {
        updateData.depositAmount = Number(fullQuote.total) * (fullQuote.depositPercent / 100)
      }
    }

    // Update quote and create status log
    const [updatedQuote] = await prisma.$transaction([
      prisma.quote.update({
        where: { id },
        data: updateData
      }),
      prisma.quoteStatusLog.create({
        data: {
          quoteId: id,
          fromStatus: quote.status as any,
          toStatus: status as any,
          changedById: user.id,
          reason
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: updatedQuote
    })

  } catch (error) {
    console.error('[PUT /api/admin/quotes/[id]/status] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update status' },
      { status: 500 }
    )
  }
}
