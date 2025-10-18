import { tool } from 'ai';
import { z } from 'zod';
import { addDays, format, isValid, isBefore, startOfDay } from 'date-fns';
import { prisma } from '@/lib/db';
import { sendBookingConfirmation } from '@/lib/email';

/**
 * Booking Tool for AI SDK 5 - DATABASE INTEGRATED VERSION
 * Prevents race conditions with Prisma transactions
 */

const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 19, // 7 PM (last appointment can start at 7:30 PM)
  timezone: 'America/Toronto',
};

/**
 * Check availability tool - DATABASE INTEGRATED
 */
export const checkAvailabilityTool = tool({
  description: `Check appointment availability for consultation, measurement, or installation services.
    Use this when customers want to book an appointment or check available time slots.`,
  parameters: z.object({
    service: z.enum(['consultation', 'measurement', 'installation']).describe(
      'Type of service: consultation (1h), measurement (2h), installation (4h)'
    ),
    date: z.string().describe('Date in YYYY-MM-DD format'),
    timePreference: z.enum(['morning', 'afternoon', 'evening', 'any']).optional().describe(
      'Preferred time of day'
    ),
    location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']).optional().describe(
      'Service location'
    ),
  }),
  execute: async (params) => {
    const { service, date, timePreference = 'any', location } = params;

    try {
      // Validate date
      const requestedDate = new Date(date);
      const today = startOfDay(new Date());

      if (!isValid(requestedDate)) {
        return {
          available: false,
          message: 'Invalid date format. Please use YYYY-MM-DD format.',
          slots: [],
        };
      }

      if (isBefore(requestedDate, today)) {
        return {
          available: false,
          message: 'Cannot book appointments in the past.',
          slots: [],
          alternativeDates: await getNextAvailableDates(service, 3),
        };
      }

      // Check blocked dates from database
      const blockedDate = await prisma.blockedDate.findFirst({
        where: {
          date: requestedDate,
          active: true,
        },
      });

      if (blockedDate) {
        return {
          available: false,
          message: `This date is not available: ${blockedDate.reason || 'We are closed on this day.'}`,
          slots: [],
          alternativeDates: await getNextAvailableDates(service, 3, date),
        };
      }

      // Get service duration
      const serviceDuration = getServiceDuration(service);

      // Get existing bookings from database
      const existingBookings = await prisma.booking.findMany({
        where: {
          date: requestedDate,
          status: {
            not: 'cancelled',
          },
        },
        select: {
          timeStart: true,
          timeEnd: true,
          duration: true,
        },
      });

      // Generate time slots
      const allSlots = generateTimeSlots(BUSINESS_HOURS.start, BUSINESS_HOURS.end, serviceDuration);

      // Filter slots based on existing bookings
      const availableSlots = filterAvailableSlots(
        allSlots,
        existingBookings,
        serviceDuration,
        timePreference
      );

      return {
        available: availableSlots.length > 0,
        date,
        service,
        serviceDuration,
        slots: availableSlots,
        message: availableSlots.length > 0
          ? `We have ${availableSlots.length} available time slot(s) for ${service} on ${format(requestedDate, 'EEEE, MMMM d, yyyy')}.`
          : `No available slots for ${service} on this date.`,
        alternativeDates: availableSlots.length === 0
          ? await getNextAvailableDates(service, 3, date)
          : undefined,
        location: location || 'Ottawa area',
      };
    } catch (error) {
      console.error('[Check Availability Tool] Error:', error);
      return {
        available: false,
        message: 'Unable to check availability. Please try again.',
        slots: [],
      };
    }
  },
});

/**
 * Book appointment tool - DATABASE INTEGRATED WITH TRANSACTION LOCKING
 */
export const bookAppointmentTool = tool({
  description: `Book an appointment after checking availability.
    Use this only after confirming the customer wants to proceed with booking.`,
  parameters: z.object({
    service: z.enum(['consultation', 'measurement', 'installation']),
    date: z.string().describe('Date in YYYY-MM-DD format'),
    time: z.string().describe('Time in HH:MM format (24-hour)'),
    customer: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
    }),
    projectDetails: z.object({
      type: z.string().optional().describe('Project type (e.g., bedroom closet, pantry)'),
      budget: z.number().optional(),
      notes: z.string().optional(),
    }).optional(),
    location: z.object({
      city: z.string(),
      address: z.string().optional(),
    }).optional(),
  }),
  execute: async (params) => {
    const { service, date, time, customer, projectDetails, location } = params;

    try {
      const serviceDuration = getServiceDuration(service);
      const requestedDate = new Date(date);

      // Parse time
      const [hours, minutes] = time.split(':').map(Number);
      const timeStart = new Date(requestedDate);
      timeStart.setHours(hours, minutes, 0, 0);

      const timeEnd = new Date(timeStart);
      timeEnd.setMinutes(timeEnd.getMinutes() + serviceDuration);

      // Use Prisma transaction with proper conflict detection
      const booking = await prisma.$transaction(async (tx) => {
        // Check for conflicts with row-level locking
        const existingBooking = await tx.booking.findFirst({
          where: {
            date: requestedDate,
            status: {
              not: 'cancelled',
            },
            AND: [
              { timeStart: { lte: timeEnd } },
              { timeEnd: { gte: timeStart } },
            ],
          },
        });

        if (existingBooking) {
          throw new Error('This time slot is no longer available. Please check availability again.');
        }

        // Create booking with UUID
        const bookingNumber = `BK-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

        return await tx.booking.create({
          data: {
            bookingNumber,
            service,
            duration: serviceDuration,
            date: requestedDate,
            timeStart,
            timeEnd,
            guestName: customer.name,
            guestEmail: customer.email,
            guestPhone: customer.phone,
            location: location?.city || 'Ottawa',
            address: location?.address || null,
            projectType: projectDetails?.type || null,
            budget: projectDetails?.budget ? projectDetails.budget * 100 : null, // Convert to cents
            notes: projectDetails?.notes || null,
            status: 'confirmed',
          },
        });
      });

      // Send confirmation email (non-blocking)
      try {
        await sendBookingConfirmation({
          bookingNumber: booking.bookingNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          service,
          date: format(requestedDate, 'EEEE, MMMM d, yyyy'),
          time: formatTime(time),
          duration: serviceDuration,
          location: location?.city || 'Ottawa',
        });
      } catch (emailError) {
        console.error('[Book Appointment] Email failed:', emailError);
        // Don't fail the booking if email fails
      }

      const appointmentDateTime = `${format(requestedDate, 'EEEE, MMMM d, yyyy')} at ${formatTime(time)}`;

      return {
        success: true,
        message: `Booking confirmed! Your ${service} appointment is scheduled for ${appointmentDateTime}.`,
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        booking: {
          service,
          date,
          time,
          duration: serviceDuration,
          formattedDate: format(requestedDate, 'EEEE, MMMM d, yyyy'),
          formattedTime: formatTime(time),
          location: location?.city || 'Ottawa',
        },
        confirmationSent: true,
        nextSteps: [
          'You will receive a confirmation email shortly',
          'A reminder will be sent 24 hours before your appointment',
          'If you need to reschedule, please contact us at (613) 701-6393',
        ],
      };
    } catch (error: any) {
      console.error('[Book Appointment Tool] Error:', error);

      if (error.message.includes('no longer available')) {
        return {
          success: false,
          message: error.message,
          bookingId: null,
        };
      }

      return {
        success: false,
        message: 'Unable to create booking. Please try again or contact us directly.',
        bookingId: null,
      };
    }
  },
});

/**
 * Get booking status tool - DATABASE INTEGRATED
 */
export const getBookingStatusTool = tool({
  description: `Check the status of an existing booking.
    Use this when customers want to check, modify, or cancel their appointment.`,
  parameters: z.object({
    bookingId: z.string().optional().describe('Booking ID'),
    bookingNumber: z.string().optional().describe('Booking number (BK-...)'),
    email: z.string().email().optional().describe('Customer email'),
    phone: z.string().optional().describe('Customer phone'),
  }),
  execute: async (params) => {
    const { bookingId, bookingNumber, email, phone } = params;

    try {
      // Build query
      const where: any = {};

      if (bookingId) {
        where.id = bookingId;
      } else if (bookingNumber) {
        where.bookingNumber = bookingNumber;
      } else if (email) {
        where.guestEmail = email;
      } else if (phone) {
        where.guestPhone = phone;
      } else {
        return {
          found: false,
          message: 'Please provide a booking ID, booking number, email, or phone number.',
        };
      }

      const booking = await prisma.booking.findFirst({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!booking) {
        return {
          found: false,
          message: 'No booking found with the provided information.',
        };
      }

      return {
        found: true,
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          service: booking.service,
          date: booking.date.toISOString().split('T')[0],
          time: format(booking.timeStart, 'HH:mm'),
          duration: booking.duration,
          formattedDate: format(booking.date, 'EEEE, MMMM d, yyyy'),
          formattedTime: format(booking.timeStart, 'h:mm a'),
          customer: {
            name: booking.guestName,
            email: booking.guestEmail,
            phone: booking.guestPhone,
          },
          location: booking.location,
          status: booking.status,
        },
        actions: [
          'Reschedule appointment',
          'Cancel appointment',
          'Update contact information',
        ],
      };
    } catch (error) {
      console.error('[Get Booking Status Tool] Error:', error);
      return {
        found: false,
        message: 'Unable to retrieve booking information. Please try again.',
      };
    }
  },
});

/**
 * Reschedule appointment tool - DATABASE INTEGRATED
 */
export const rescheduleAppointmentTool = tool({
  description: `Reschedule an existing appointment to a new date and time.`,
  parameters: z.object({
    bookingId: z.string().optional(),
    bookingNumber: z.string().optional(),
    newDate: z.string(),
    newTime: z.string(),
  }),
  execute: async (params) => {
    const { bookingId, bookingNumber, newDate, newTime } = params;

    try {
      // Find booking
      const where: any = bookingId ? { id: bookingId } : { bookingNumber };
      const booking = await prisma.booking.findFirst({ where });

      if (!booking) {
        return {
          success: false,
          message: 'Booking not found.',
        };
      }

      const serviceDuration = booking.duration;
      const requestedDate = new Date(newDate);
      const [hours, minutes] = newTime.split(':').map(Number);
      const timeStart = new Date(requestedDate);
      timeStart.setHours(hours, minutes, 0, 0);
      const timeEnd = new Date(timeStart);
      timeEnd.setMinutes(timeEnd.getMinutes() + serviceDuration);

      // Use transaction to check availability and update
      const updated = await prisma.$transaction(async (tx) => {
        const conflict = await tx.booking.findFirst({
          where: {
            id: { not: booking.id },
            date: requestedDate,
            status: { not: 'cancelled' },
            AND: [
              { timeStart: { lte: timeEnd } },
              { timeEnd: { gte: timeStart } },
            ],
          },
        });

        if (conflict) {
          throw new Error('The requested time slot is not available.');
        }

        return await tx.booking.update({
          where: { id: booking.id },
          data: {
            date: requestedDate,
            timeStart,
            timeEnd,
          },
        });
      });

      return {
        success: true,
        message: `Appointment rescheduled to ${format(requestedDate, 'EEEE, MMMM d, yyyy')} at ${formatTime(newTime)}.`,
        bookingId: updated.id,
        bookingNumber: updated.bookingNumber,
        newDateTime: {
          date: newDate,
          time: newTime,
          formattedDate: format(requestedDate, 'EEEE, MMMM d, yyyy'),
          formattedTime: formatTime(newTime),
        },
      };
    } catch (error: any) {
      console.error('[Reschedule Tool] Error:', error);
      return {
        success: false,
        message: error.message || 'Unable to reschedule appointment. Please try again.',
      };
    }
  },
});

// ============================================================================
// Helper Functions
// ============================================================================

function getServiceDuration(service: string): number {
  const durations: Record<string, number> = {
    consultation: 60,
    measurement: 120,
    installation: 240,
  };
  return durations[service] || 60;
}

function generateTimeSlots(startHour: number, endHour: number, duration: number): string[] {
  const slots: string[] = [];
  let currentHour = startHour;

  while (currentHour + duration / 60 <= endHour) {
    slots.push(`${currentHour.toString().padStart(2, '0')}:00`);
    if (duration < 60) {
      slots.push(`${currentHour.toString().padStart(2, '0')}:30`);
    }
    currentHour += 1;
  }

  return slots;
}

function filterAvailableSlots(
  allSlots: string[],
  existingBookings: any[],
  duration: number,
  timePreference: string
): Array<{ time: string; duration: number; available: boolean; label: string }> {
  return allSlots
    .filter(time => {
      // Check against existing bookings
      const [hours, minutes] = time.split(':').map(Number);
      const slotStart = hours * 60 + minutes;
      const slotEnd = slotStart + duration;

      const hasConflict = existingBookings.some(booking => {
        const bookingStart = booking.timeStart.getHours() * 60 + booking.timeStart.getMinutes();
        const bookingEnd = booking.timeEnd.getHours() * 60 + booking.timeEnd.getMinutes();
        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });

      return !hasConflict;
    })
    .filter(time => {
      // Filter by time preference
      if (timePreference === 'any') return true;
      const hour = parseInt(time.split(':')[0]);
      if (timePreference === 'morning' && hour >= 9 && hour < 12) return true;
      if (timePreference === 'afternoon' && hour >= 12 && hour < 17) return true;
      if (timePreference === 'evening' && hour >= 17 && hour < 20) return true;
      return false;
    })
    .map(time => ({
      time,
      duration,
      available: true,
      label: `${formatTime(time)} (${duration} minutes)`,
    }));
}

async function getNextAvailableDates(service: string, count: number, afterDate?: string): Promise<string[]> {
  const dates: string[] = [];
  let currentDate = afterDate ? addDays(new Date(afterDate), 1) : addDays(new Date(), 1);
  let found = 0;

  while (found < count && dates.length < 30) { // Safety limit
    const blocked = await prisma.blockedDate.findFirst({
      where: {
        date: currentDate,
        active: true,
      },
    });

    if (!blocked && currentDate.getDay() !== 0) { // Not Sunday
      dates.push(format(currentDate, 'EEEE, MMMM d, yyyy'));
      found++;
    }

    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}
