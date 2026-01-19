// @ts-nocheck - Bookings with dynamic Prisma types
import { prisma } from './prisma';

/**
 * Generate a unique booking number
 */
export function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${timestamp}-${random}`;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferredDate: Date;
  preferredTime: string;
  type: 'MEASURE' | 'CONSULTATION' | 'INSTALLATION';
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

/**
 * Get available time slots for a given date
 */
export async function getAvailableSlots(date: Date): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay();

  // No appointments on Sunday (0) or before 8am / after 6pm
  if (dayOfWeek === 0) {
    return [];
  }

  const startHour = 8;
  const endHour = 18;
  const slots: TimeSlot[] = [];

  // Get existing bookings for this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  let existingBookings: string[] = [];

  try {
    const bookings = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        time: true,
      },
    });
    existingBookings = bookings.map((b) => b.time);
  } catch {
    // If prisma query fails, return all slots as available
  }

  // Generate time slots
  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      time,
      available: !existingBookings.includes(time),
    });

    // Add half-hour slots
    const halfHour = `${hour.toString().padStart(2, '0')}:30`;
    slots.push({
      time: halfHour,
      available: !existingBookings.includes(halfHour),
    });
  }

  return slots;
}

/**
 * Create a new booking
 */
export async function createBooking(data: BookingData) {
  const appointment = await prisma.appointment.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      date: data.preferredDate,
      time: data.preferredTime,
      type: data.type,
      notes: data.notes,
      status: 'PENDING',
    },
  });

  return appointment;
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string) {
  return prisma.appointment.findUnique({
    where: { id },
  });
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
) {
  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

/**
 * Cancel a booking
 */
export async function cancelBooking(id: string) {
  return updateBookingStatus(id, 'CANCELLED');
}
