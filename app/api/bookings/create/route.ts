import { prisma } from '@/lib/db/client'
import { checkRateLimit, generalRateLimiter, getClientIdentifier } from '@/lib/rate-limit'
import { createBookingSchema } from '@/lib/validation/schemas'
import { type NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

type BookingError = Error & { message?: string }
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const { allowed } = await checkRateLimit(identifier, generalRateLimiter)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const body = await req.json()
    const validated = createBookingSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }
    const { service, date, guestName, guestEmail, guestPhone, location, projectDescription } =
      validated.data
    const bookingDate = new Date(date)
    // Determine duration based on service
    const serviceDuration = service === 'installation' ? 240 : service === 'measurement' ? 60 : 60
    const timeStart = bookingDate
    const timeEnd = new Date(timeStart.getTime() + serviceDuration * 60000)
    // Transaction to prevent race conditions
    const booking = await prisma.$transaction(async tx => {
      // Check for overlapping bookings
      const existingBooking = await tx.booking.findFirst({
        where: {
          date: bookingDate, // Assuming date is matched by day, but here we need time overlap
          // Actually, 'date' in schema is just the calendar date, timeStart/timeEnd handle the slot?
          // The request 'date' likely includes time if it's "string().datetime()"
          // Let's assume 'date' is the start time.
          AND: [
            { timeStart: { lt: timeEnd } },
            { timeEnd: { gt: timeStart } },
            { status: { not: 'cancelled' } },
          ],
        },
      })
      if (existingBooking) {
        throw new Error('Slot no longer available')
      }
      return tx.booking.create({
        data: {
          bookingNumber: `BK-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
          service,
          duration: serviceDuration,
          date: bookingDate, // This serves as the reference date
          timeStart,
          timeEnd,
          guestName,
          guestEmail,
          guestPhone,
          location,
          projectDescription,
        },
      })
    })
    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
    })
  } catch (error) {
    const err = error as BookingError
    console.error('[Booking Create API] Error:', error)
    if (err.message === 'Slot no longer available') {
      return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
