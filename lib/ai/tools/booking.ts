import { prisma } from '@/lib/db/client'
import { tool } from 'ai'
import { z } from 'zod'

export const checkAvailabilityTool = tool({
  description: 'Check availability for a service on a specific date',
  parameters: z.object({
    date: z.string().describe('Date to check (YYYY-MM-DD)'),
    service: z.enum(['consultation', 'measurement', 'installation']).default('consultation'),
  }),
  execute: async ({ date, service }) => {
    try {
      const selectedDate = new Date(date)
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)

      // Check blocked dates
      const blocked = await prisma.blockedDate.findUnique({
        where: { date: startOfDay },
      })

      if (blocked) {
        return { available: false, reason: blocked.reason || 'Date is blocked' }
      }

      // Check existing bookings
      const bookings = await prisma.booking.findMany({
        where: {
          timeStart: { gte: startOfDay, lte: endOfDay },
          status: { not: 'cancelled' },
        },
        select: { timeStart: true, timeEnd: true },
      })

      // Simple logic: return booked slots
      return {
        available: true,
        bookedSlots: bookings,
        message: `Found ${bookings.length} existing bookings. Please choose a time that doesn't overlap.`,
      }
    } catch (error) {
      console.error('Check availability error:', error)
      return { error: 'Failed to check availability' }
    }
  },
})

export const createBookingTool = tool({
  description: 'Create a booking for a service',
  parameters: z.object({
    service: z.enum(['consultation', 'measurement', 'installation']),
    date: z.string().describe('Date and time (ISO string)'),
    customerName: z.string(),
    customerEmail: z.string().email(),
    customerPhone: z.string(),
    location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']),
  }),
  execute: async ({ service, date, customerName, customerEmail, customerPhone, location }) => {
    try {
      const bookingDate = new Date(date)
      const duration = service === 'installation' ? 240 : 60
      const timeStart = bookingDate
      const timeEnd = new Date(timeStart.getTime() + duration * 60000)

      // Transaction
      const booking = await prisma.$transaction(async tx => {
        const existing = await tx.booking.findFirst({
          where: {
            AND: [
              { timeStart: { lt: timeEnd } },
              { timeEnd: { gt: timeStart } },
              { status: { not: 'cancelled' } },
            ],
          },
        })

        if (existing) {
          throw new Error('Slot occupied')
        }

        return tx.booking.create({
          data: {
            bookingNumber: `BK-${Date.now()}`,
            service,
            duration,
            date: bookingDate,
            timeStart,
            timeEnd,
            guestName: customerName,
            guestEmail: customerEmail,
            guestPhone: customerPhone,
            location,
            status: 'confirmed',
          },
        })
      })

      return { success: true, bookingNumber: booking.bookingNumber }
    } catch (error: any) {
      return { error: error.message || 'Failed to create booking' }
    }
  },
})
