import { NextRequest, NextResponse } from 'next/server';
// Disabled route - required modules not available
// import { z } from 'zod';
// import { format, addMinutes, startOfDay, endOfDay } from 'date-fns';
// import { PrismaClient } from '@prisma/client';
// import { getServiceBySlug } from '@/lib/services';
// import { randomUUID } from 'crypto';
// import { sendBookingConfirmation, generateICSFile, type BookingEmailData } from '@/lib/email';

// Disabled - all helper functions and types not available

// POST endpoint - Create new booking with transaction locking
export async function POST(_request: NextRequest) {
  // This route is disabled - booking functionality not available
  return NextResponse.json(
    { error: "Booking route is disabled" },
    { status: 503 }
  )
}

// GET endpoint - Check availability
export async function GET(_request: NextRequest) {
  // This route is disabled - booking functionality not available
  return NextResponse.json(
    { error: "Booking route is disabled" },
    { status: 503 }
  )
}