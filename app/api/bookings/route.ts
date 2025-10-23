import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { generateBookingNumber } from '@/lib/bookings';
import { bookingRateLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit';
import { sendBookingConfirmationEmail } from '@/lib/emails';

const createBookingSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']),
  date: z.string().datetime(),
  timeStart: z.string().datetime(),
  location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']),
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Invalid email address'),
  guestPhone: z.string().min(10, 'Valid phone number required'),
  address: z.string().optional(),
  projectType: z.string().optional(),
  projectDescription: z.string().optional(),
  measurements: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number().optional(),
  }).optional(),
  budget: z.number().optional(),
  customerNotes: z.string().optional(),
});

const APPOINTMENT_DURATIONS = {
  consultation: 60, // 60 minutes
  measurement: 45, // 45 minutes
  installation: 120, // 120 minutes
};

// GET /api/bookings - Get user bookings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where = {
      userId: session.user.id,
      ...(status && { status }),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[BOOKINGS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req);
    const { allowed } = await checkRateLimit(identifier, bookingRateLimiter);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many booking attempts' },
        { status: 429 }
      );
    }

    const session = await auth();
    const body = await req.json();

    const validated = createBookingSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validated.error.errors },
        { status: 400 }
      );
    }

    const {
      service,
      date,
      timeStart,
      location,
      guestName,
      guestEmail,
      guestPhone,
      address,
      projectType,
      projectDescription,
      measurements,
      budget,
      customerNotes,
    } = validated.data;

    const bookingDate = new Date(date);
    const bookingStartTime = new Date(timeStart);
    const duration = APPOINTMENT_DURATIONS[service];
    const bookingEndTime = new Date(bookingStartTime.getTime() + duration * 60 * 1000);

    // Validate booking time
    if (bookingStartTime <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        timeStart: { lt: bookingEndTime },
        timeEnd: { gt: bookingStartTime },
        location,
        status: { notIn: ['cancelled', 'no-show'] },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Selected time slot is already booked' },
        { status: 409 }
      );
    }

    // Check if date is blocked
    const blockedDate = await prisma.blockedDate.findUnique({
      where: { date: bookingDate },
    });

    if (blockedDate) {
      return NextResponse.json(
        { error: 'Selected date is not available', reason: blockedDate.reason },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId: session?.user?.id || null,
        guestName,
        guestEmail,
        guestPhone,
        service,
        duration,
        date: bookingDate,
        timeStart: bookingStartTime,
        timeEnd: bookingEndTime,
        location,
        address,
        projectType,
        projectDescription,
        measurements,
        budget: budget ? Math.round(budget * 100) : null, // Convert to cents
        customerNotes,
      },
    });

    // Send confirmation email (async, don't await)
    sendBookingConfirmationEmail(booking).catch(console.error);

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('[BOOKING_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}