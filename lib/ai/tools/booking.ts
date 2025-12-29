import { prisma } from '@/lib/db/client'
import { tool } from 'ai'
import { z } from 'zod'

const checkAvailabilitySchema = z.object({
  date: z.string().describe('Date to check (YYYY-MM-DD)'),
  service: z.enum(['consultation', 'measurement', 'installation']).default('consultation'),
})

export const checkAvailabilityTool = tool({
  description: 'Check availability for a service on a specific date',
  inputSchema: checkAvailabilitySchema,
  execute: async input => {
    const { date } = input
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

      return {
        available: true,
        bookedSlots: bookings,
        message: `Found ${bookings.length} existing bookings. Please choose a time that doesn't overlap.`,
      }
    } catch {
      return { error: 'Failed to check availability' }
    }
  },
})

const bookAppointmentSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']),
  date: z.string().describe('Date and time (ISO string)'),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']),
})

export const bookAppointmentTool = tool({
  description: 'Create a booking for a service',
  inputSchema: bookAppointmentSchema,
  execute: async input => {
    const { service, date, customerName, customerEmail, customerPhone, location } = input
    try {
      const bookingDate = new Date(date)
      const duration = service === 'installation' ? 240 : 60
      const timeStart = bookingDate
      const timeEnd = new Date(timeStart.getTime() + duration * 60000)

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
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Failed to create booking' }
    }
  },
})

export const createBookingTool = bookAppointmentTool

const getBookingStatusSchema = z.object({
  bookingNumber: z.string().describe('Booking number (e.g., BK-1234567890)'),
})

export const getBookingStatusTool = tool({
  description: 'Look up existing appointment status',
  inputSchema: getBookingStatusSchema,
  execute: async input => {
    const { bookingNumber } = input
    try {
      const booking = await prisma.booking.findUnique({
        where: { bookingNumber },
      })

      if (!booking) {
        return { error: 'Booking not found' }
      }

      return {
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        date: booking.date,
        timeStart: booking.timeStart,
        timeEnd: booking.timeEnd,
        location: booking.location,
      }
    } catch {
      return { error: 'Failed to get booking status' }
    }
  },
})

const rescheduleAppointmentSchema = z.object({
  bookingNumber: z.string().describe('Booking number to reschedule'),
  newDate: z.string().describe('New date and time (ISO string)'),
})

export const rescheduleAppointmentTool = tool({
  description: 'Modify an existing booking time',
  inputSchema: rescheduleAppointmentSchema,
  execute: async input => {
    const { bookingNumber, newDate } = input
    try {
      const booking = await prisma.booking.findUnique({
        where: { bookingNumber },
      })

      if (!booking) {
        return { error: 'Booking not found' }
      }

      const newBookingDate = new Date(newDate)
      const duration = booking.duration
      const newTimeStart = newBookingDate
      const newTimeEnd = new Date(newTimeStart.getTime() + duration * 60000)

      const updated = await prisma.booking.update({
        where: { bookingNumber },
        data: {
          date: newBookingDate,
          timeStart: newTimeStart,
          timeEnd: newTimeEnd,
        },
      })

      return { success: true, booking: updated }
    } catch {
      return { error: 'Failed to reschedule appointment' }
    }
  },
})
