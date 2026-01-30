import { prisma } from '@/lib/db/client'
import { type NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const date = new Date(dateStr)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Fetch existing bookings for the day
    const bookings = await prisma.booking.findMany({
      where: {
        timeStart: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: 'cancelled' },
      },
      select: {
        timeStart: true,
        timeEnd: true,
      },
    })

    // Also check blocked dates
    const blocked = await prisma.blockedDate.findUnique({
      where: { date: startOfDay },
    })

    if (blocked) {
      return NextResponse.json({ slots: [] }) // No slots if blocked
    }

    // In a real app, generate slots (e.g. 9-5) and filter out overlapping
    // For now, return the booked periods so frontend can disable them
    return NextResponse.json({ bookedSlots: bookings })
  } catch (error) {
    console.error('[Booking Availability API] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
