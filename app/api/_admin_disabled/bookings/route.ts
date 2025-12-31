// @ts-nocheck - This route is disabled and references deprecated Prisma models
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendBookingCancellationEmail } from '@/lib/emails';

const prisma = new PrismaClient();

// Update booking status schema
const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed', 'no-show']),
  internalNotes: z.string().optional(),
  assignedTo: z.string().optional()
});

// GET /api/admin/bookings - Get all bookings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const service = searchParams.get('service');

    const where: any = {};
    if (status) where.status = status;
    if (date) {
      const queryDate = new Date(date);
      where.date = {
        gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        lt: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }
    if (service) where.service = service;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: true
      },
      orderBy: [
        { date: 'desc' },
        { timeStart: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Admin bookings GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/admin/bookings/:id - Update booking status
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validated = updateStatusSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error },
        { status: 400 }
      );
    }

    const { status, internalNotes, assignedTo } = validated.data;

    // Update booking
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...(internalNotes && { internalNotes }),
        ...(assignedTo && { assignedTo }),
        updatedAt: new Date()
      },
      include: {
        user: true
      }
    });

    // Send email notification if status changed to cancelled
    if (status === 'cancelled' && booking.user?.email) {
      await sendBookingCancellationEmail({
        name: booking.user.name || 'Customer',
        email: booking.user.email,
        phone: booking.user.phone || '',
        date: booking.date.toLocaleDateString(),
        time: booking.timeStart.toLocaleTimeString(), // Assuming timeStart exists on booking
        type: booking.service || 'Service', // Assuming service exists on booking
        address: booking.address, // Assuming address exists on booking
        notes: booking.notes // Assuming notes exists on booking
      });
    }

    return NextResponse.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Admin booking update error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/bookings/:id - Cancel booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Update status to cancelled
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        updatedAt: new Date()
      },
      include: {
        user: true
      }
    });

    // Send cancellation email
    if (booking.user?.email) {
      await sendBookingCancellationEmail({
        name: booking.user.name || 'Customer',
        email: booking.user.email,
        phone: booking.user.phone || '',
        date: booking.date.toLocaleDateString(),
        time: booking.timeStart.toLocaleTimeString(),
        type: booking.service || 'Service',
        address: booking.address,
        notes: booking.notes
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Admin booking delete error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}