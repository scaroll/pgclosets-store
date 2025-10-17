import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, addMinutes } from 'date-fns';
import { getServiceBySlug } from '@/lib/services';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const service = searchParams.get('service');

  if (!date || !service) {
    return NextResponse.json(
      { error: 'Date and service are required' },
      { status: 400 }
    );
  }

  try {
    // Parse the date
    const queryDate = new Date(date);

    // Get existing bookings for the date
    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay(queryDate),
          lte: endOfDay(queryDate)
        },
        status: {
          not: 'cancelled'
        }
      },
      select: {
        timeStart: true,
        timeEnd: true,
      }
    });

    // Get service details for duration
    const serviceInfo = getServiceBySlug(service);
    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'Invalid service' },
        { status: 400 }
      );
    }

    // Parse service duration
    const durationMatch = serviceInfo.duration.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60;

    // Generate available time slots (9 AM to 7:30 PM)
    const slots = [];
    const startHour = 9;
    const endHour = 19.5; // 7:30 PM

    for (let hour = startHour; hour <= endHour; hour += 0.5) {
      const slotHour = Math.floor(hour);
      const slotMinute = (hour % 1) * 60;
      const slotTime = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;

      // Check if this slot conflicts with existing bookings
      const slotStart = new Date(queryDate);
      slotStart.setHours(slotHour, slotMinute, 0, 0);
      const slotEnd = addMinutes(slotStart, durationMinutes);

      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.timeStart);
        const bookingEnd = new Date(booking.timeEnd);

        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      // Mark preferred times (morning and late afternoon)
      const isPreferred = (hour >= 9 && hour <= 10) || (hour >= 14 && hour <= 15) || (hour >= 18 && hour <= 19);

      slots.push({
        time: slotTime,
        available: !hasConflict,
        preferred: isPreferred && !hasConflict
      });
    }

    return NextResponse.json(
      {
        date,
        service,
        slots,
        timezone: 'America/Toronto',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}