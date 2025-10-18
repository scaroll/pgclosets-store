import { tool } from 'ai';
import { z } from 'zod';
import { addDays, format, parse, isValid, isBefore, isAfter, startOfDay } from 'date-fns';

/**
 * Booking Tool for AI SDK 5
 * Allows AI to check availability and create bookings
 */

// Mock availability data - replace with actual database queries
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  timezone: 'America/Toronto',
};

const BLOCKED_DATES = [
  '2025-01-20', // Example blocked date
  '2025-12-25', // Christmas
  '2025-12-26', // Boxing Day
];

const EXISTING_BOOKINGS = [
  { date: '2025-01-18', time: '10:00', service: 'consultation', duration: 60 },
  { date: '2025-01-18', time: '14:00', service: 'measurement', duration: 120 },
  { date: '2025-01-19', time: '11:00', service: 'installation', duration: 240 },
];

/**
 * Check availability tool
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
  execute: async ({ service, date, timePreference = 'any', location }) => {
    console.log('[Check Availability Tool] Parameters:', {
      service,
      date,
      timePreference,
      location
    });

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
        alternativeDates: getNextAvailableDates(service, 3),
      };
    }

    // Check if date is blocked
    if (BLOCKED_DATES.includes(date)) {
      return {
        available: false,
        message: 'This date is not available. We are closed on this day.',
        slots: [],
        alternativeDates: getNextAvailableDates(service, 3, date),
      };
    }

    // Get service duration
    const serviceDuration = getServiceDuration(service);

    // Generate time slots
    const allSlots = generateTimeSlots(BUSINESS_HOURS.start, BUSINESS_HOURS.end, serviceDuration);

    // Filter slots based on existing bookings
    const availableSlots = filterAvailableSlots(allSlots, date, serviceDuration, timePreference);

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
        ? getNextAvailableDates(service, 3, date)
        : undefined,
      location: location || 'Ottawa area',
    };
  },
});

/**
 * Book appointment tool
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
  execute: async ({ service, date, time, customer, projectDetails, location }) => {
    console.log('[Book Appointment Tool] Creating booking:', {
      service,
      date,
      time,
      customer: { ...customer, email: '[REDACTED]', phone: '[REDACTED]' },
      projectDetails,
      location
    });

    // Validate booking slot is still available
    const serviceDuration = getServiceDuration(service);
    const isSlotAvailable = checkSlotAvailability(date, time, serviceDuration);

    if (!isSlotAvailable) {
      return {
        success: false,
        message: 'This time slot is no longer available. Please check availability again.',
        bookingId: null,
      };
    }

    // Create booking (mock - replace with actual database insert)
    const bookingId = `BK-${Date.now()}`;
    const booking = {
      id: bookingId,
      service,
      date,
      time,
      duration: serviceDuration,
      customer,
      projectDetails,
      location: location || { city: 'Ottawa' },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // In production, save to database here
    // await db.bookings.create(booking);

    // In production, send confirmation email here
    // await sendBookingConfirmation(booking);

    const appointmentDateTime = `${format(new Date(date), 'EEEE, MMMM d, yyyy')} at ${formatTime(time)}`;

    return {
      success: true,
      message: `Booking confirmed! Your ${service} appointment is scheduled for ${appointmentDateTime}.`,
      bookingId,
      booking: {
        ...booking,
        formattedDate: format(new Date(date), 'EEEE, MMMM d, yyyy'),
        formattedTime: formatTime(time),
      },
      confirmationSent: true,
      nextSteps: [
        'You will receive a confirmation email shortly',
        'A reminder will be sent 24 hours before your appointment',
        'If you need to reschedule, please call us at (613) 555-1234',
      ],
    };
  },
});

/**
 * Get booking status tool
 */
export const getBookingStatusTool = tool({
  description: `Check the status of an existing booking.
    Use this when customers want to check, modify, or cancel their appointment.`,
  parameters: z.object({
    bookingId: z.string().optional().describe('Booking ID'),
    email: z.string().email().optional().describe('Customer email'),
    phone: z.string().optional().describe('Customer phone'),
  }),
  execute: async ({ bookingId, email, phone }) => {
    console.log('[Get Booking Status Tool] Checking booking:', {
      bookingId,
      email: email ? '[REDACTED]' : undefined,
      phone: phone ? '[REDACTED]' : undefined
    });

    // Mock booking lookup - replace with actual database query
    const mockBooking = {
      id: bookingId || 'BK-1234567890',
      service: 'consultation',
      date: '2025-01-25',
      time: '14:00',
      duration: 60,
      customer: {
        name: 'John Doe',
        email: email || 'customer@example.com',
        phone: phone || '(613) 555-0100',
      },
      status: 'confirmed',
      createdAt: '2025-01-17T10:00:00Z',
    };

    return {
      found: true,
      booking: {
        ...mockBooking,
        formattedDate: format(new Date(mockBooking.date), 'EEEE, MMMM d, yyyy'),
        formattedTime: formatTime(mockBooking.time),
      },
      actions: [
        'Reschedule appointment',
        'Cancel appointment',
        'Update contact information',
      ],
    };
  },
});

/**
 * Reschedule appointment tool
 */
export const rescheduleAppointmentTool = tool({
  description: `Reschedule an existing appointment to a new date and time.`,
  parameters: z.object({
    bookingId: z.string(),
    newDate: z.string(),
    newTime: z.string(),
  }),
  execute: async ({ bookingId, newDate, newTime }) => {
    console.log('[Reschedule Tool] Rescheduling:', { bookingId, newDate, newTime });

    // Check new slot availability
    const serviceDuration = 60; // Get from booking
    const isAvailable = checkSlotAvailability(newDate, newTime, serviceDuration);

    if (!isAvailable) {
      return {
        success: false,
        message: 'The requested time slot is not available.',
      };
    }

    return {
      success: true,
      message: `Appointment rescheduled to ${format(new Date(newDate), 'EEEE, MMMM d, yyyy')} at ${formatTime(newTime)}.`,
      bookingId,
      newDateTime: {
        date: newDate,
        time: newTime,
        formattedDate: format(new Date(newDate), 'EEEE, MMMM d, yyyy'),
        formattedTime: formatTime(newTime),
      },
    };
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
    currentHour += 1;
  }

  return slots;
}

function filterAvailableSlots(
  allSlots: string[],
  date: string,
  duration: number,
  timePreference: string
): Array<{ time: string; duration: number; available: boolean; label: string }> {
  return allSlots
    .filter(time => {
      // Check against existing bookings
      const hasConflict = EXISTING_BOOKINGS.some(booking => {
        if (booking.date !== date) return false;
        return doTimesOverlap(time, duration, booking.time, booking.duration);
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

function doTimesOverlap(time1: string, duration1: number, time2: string, duration2: number): boolean {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const start1 = h1 * 60 + m1;
  const end1 = start1 + duration1;
  const start2 = h2 * 60 + m2;
  const end2 = start2 + duration2;

  return (start1 < end2 && end1 > start2);
}

function checkSlotAvailability(date: string, time: string, duration: number): boolean {
  return !EXISTING_BOOKINGS.some(booking =>
    booking.date === date && doTimesOverlap(time, duration, booking.time, booking.duration)
  );
}

function getNextAvailableDates(service: string, count: number, afterDate?: string): string[] {
  const dates: string[] = [];
  let currentDate = afterDate ? addDays(new Date(afterDate), 1) : addDays(new Date(), 1);
  let found = 0;

  while (found < count) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    if (!BLOCKED_DATES.includes(dateStr)) {
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
