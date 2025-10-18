import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { format, addMinutes, startOfDay, endOfDay } from 'date-fns';
import { PrismaClient } from '@prisma/client';
import { getServiceBySlug } from '@/lib/services';
import { randomUUID } from 'crypto';
import { sendBookingConfirmation, generateICSFile, type BookingEmailData } from '@/lib/email';

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Resend only if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured - emails will not be sent");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Rate limiting: Store request timestamps in memory (use Redis in production)
const requestTimestamps = new Map<string, number[]>();

function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(identifier) || [];

  // Filter out timestamps outside the window
  const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp and update map
  recentTimestamps.push(now);
  requestTimestamps.set(identifier, recentTimestamps);

  return true;
}

// Booking validation schema
const bookingSchema = z.object({
  service: z.string(),
  date: z.string().transform(str => new Date(str)),
  timeSlot: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  projectType: z.string().optional(),
  roomDimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    depth: z.number().optional(),
  }).optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  additionalNotes: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'text']).optional(),
  hearAboutUs: z.string().optional(),
});

type BookingData = z.infer<typeof bookingSchema>;

// Format time for display
function formatTimeDisplay(time: string | undefined): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

// Generate booking confirmation email HTML
function generateConfirmationEmail(booking: BookingData & { bookingId: string }, service: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - PG Closets</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
          }
          .booking-details {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #6b7280;
          }
          .detail-value {
            color: #111827;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
          }
          .footer {
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            background-color: #f9fafb;
          }
          .confirmation-number {
            background-color: #eff6ff;
            border: 2px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border-radius: 8px;
          }
          .confirmation-number h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
          }
          .confirmation-number .number {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
            <p>Your appointment with PG Closets is scheduled</p>
          </div>

          <div class="content">
            <p>Dear ${booking.firstName} ${booking.lastName},</p>

            <p>Thank you for booking your ${service.name} with PG Closets! We're excited to help you transform your space.</p>

            <div class="confirmation-number">
              <h3>Confirmation Number</h3>
              <div class="number">${booking.bookingId}</div>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Please save this number for your records</p>
            </div>

            <div class="booking-details">
              <h2 style="margin-top: 0;">Appointment Details</h2>

              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${service.name}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${format(booking.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formatTimeDisplay(booking.timeSlot)}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${service.duration}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${booking.address}, ${booking.city}, ON ${booking.postalCode}</span>
              </div>
            </div>

            <h3>What Happens Next?</h3>
            <ul>
              <li>We'll send you a reminder 24 hours before your appointment</li>
              <li>Our designer will arrive at the scheduled time with samples and tools</li>
              <li>You'll receive a custom 3D design and quote during the visit</li>
              <li>No obligation - take time to review and decide</li>
            </ul>

            <h3>Need to Make Changes?</h3>
            <p>If you need to reschedule or have any questions, please don't hesitate to contact us:</p>
            <ul>
              <li>Phone: <a href="tel:+16137016393">(613) 701-6393</a></li>
              <li>Email: <a href="mailto:info@pgclosets.com">info@pgclosets.com</a></li>
            </ul>

            <center>
              <a href="https://pgclosets.com/booking/manage/${booking.bookingId}" class="button">
                View Appointment Details
              </a>
            </center>

            <p>We look forward to meeting with you!</p>

            <p>Best regards,<br>
            The PG Closets Team</p>
          </div>

          <div class="footer">
            <p>PG Closets - Ottawa's Premium Closet Solutions</p>
            <p>123 Main Street, Ottawa, ON K1A 0B1</p>
            <p>© ${new Date().getFullYear()} PG Closets. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Generate admin notification email
function generateAdminNotification(booking: BookingData & { bookingId: string }, service: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h2 { color: #2563eb; }
          .detail { margin: 10px 0; }
          .label { font-weight: bold; }
          .highlight { background-color: #fffbeb; border: 1px solid #fbbf24; padding: 10px; border-radius: 4px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Booking Received</h2>

          <div class="highlight">
            <strong>Booking ID:</strong> ${booking.bookingId}
          </div>

          <div class="detail">
            <span class="label">Service:</span> ${service.name}
          </div>

          <div class="detail">
            <span class="label">Date/Time:</span> ${format(booking.date, 'EEEE, MMMM d, yyyy')} at ${formatTimeDisplay(booking.timeSlot)}
          </div>

          <h3>Customer Information</h3>
          <div class="detail">
            <span class="label">Name:</span> ${booking.firstName} ${booking.lastName}
          </div>
          <div class="detail">
            <span class="label">Email:</span> ${booking.email}
          </div>
          <div class="detail">
            <span class="label">Phone:</span> ${booking.phone}
          </div>
          <div class="detail">
            <span class="label">Address:</span> ${booking.address}, ${booking.city}, ON ${booking.postalCode}
          </div>

          ${booking.projectType ? `
          <h3>Project Details</h3>
          <div class="detail">
            <span class="label">Type:</span> ${booking.projectType}
          </div>
          <div class="detail">
            <span class="label">Budget:</span> ${booking.budget || 'Not specified'}
          </div>
          ` : ''}

          ${booking.additionalNotes ? `
          <div class="detail">
            <span class="label">Additional Notes:</span><br>
            ${booking.additionalNotes}
          </div>
          ` : ''}

          <hr>
          <p><strong>Action Required:</strong> Please confirm this appointment in the admin dashboard and assign a designer.</p>
          <p><a href="https://pgclosets.com/admin/bookings/${booking.bookingId}">View in Admin Dashboard</a></p>
        </div>
      </body>
    </html>
  `;
}

// POST endpoint - Create new booking with transaction locking
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP, 5, 60000)) { // 5 requests per minute
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate booking data
    const bookingData = bookingSchema.parse(body);

    // Get service details
    const service = getServiceBySlug(bookingData.service);
    if (!service) {
      return NextResponse.json(
        { error: 'Invalid service selected' },
        { status: 400 }
      );
    }

    // Calculate time range for the booking
    const [hours, minutes] = bookingData.timeSlot.split(':').map(Number);
    const timeStart = new Date(bookingData.date);
    timeStart.setHours(hours, minutes, 0, 0);

    // Parse service duration (e.g., "90 minutes" -> 90)
    const durationMatch = service.duration.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60;
    const timeEnd = addMinutes(timeStart, durationMinutes);

    // Generate booking ID
    const bookingId = `BK-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Use transaction with row-level locking to prevent double-bookings
    const savedBooking = await prisma.$transaction(async (tx) => {
      // Check for conflicting bookings
      const existingBookings = await tx.booking.findMany({
        where: {
          date: bookingData.date,
          status: {
            not: 'cancelled'
          },
          OR: [
            {
              AND: [
                { timeStart: { lte: timeStart } },
                { timeEnd: { gt: timeStart } }
              ]
            },
            {
              AND: [
                { timeStart: { lt: timeEnd } },
                { timeEnd: { gte: timeEnd } }
              ]
            },
            {
              AND: [
                { timeStart: { gte: timeStart } },
                { timeEnd: { lte: timeEnd } }
              ]
            }
          ]
        }
      });

      if (existingBookings.length > 0) {
        throw new Error('This time slot is no longer available. Please choose another time.');
      }

      // Create the booking
      return await tx.booking.create({
        data: {
          bookingNumber: bookingId,
          service: bookingData.service,
          date: bookingData.date,
          timeStart,
          timeEnd,
          duration: durationMinutes,
          guestName: `${bookingData.firstName} ${bookingData.lastName}`,
          guestEmail: bookingData.email,
          guestPhone: bookingData.phone,
          location: bookingData.city,
          address: `${bookingData.address}, ${bookingData.city}, ON ${bookingData.postalCode}`,
          projectType: bookingData.projectType,
          budget: bookingData.budget ? Math.round(parseFloat(bookingData.budget.replace(/[^0-9.]/g, '')) * 100) : null, // Convert to cents
          projectDescription: bookingData.additionalNotes,
          status: 'confirmed',
          measurements: bookingData.roomDimensions ? {
            width: bookingData.roomDimensions.width,
            height: bookingData.roomDimensions.height,
            depth: bookingData.roomDimensions.depth
          } : null,
          customerNotes: bookingData.additionalNotes
        }
      });
    });

    // Generate ICS file for calendar
    const icsFile = generateICSFile({
      id: bookingId,
      service: service.name,
      date: timeStart,
      duration: durationMinutes,
      location: `${bookingData.city}, ON`,
      description: `${service.name} appointment with PG Closets`
    });

    // Send confirmation email to customer
    try {
      const emailData: BookingEmailData = {
        bookingId,
        customerName: `${bookingData.firstName} ${bookingData.lastName}`,
        service: service.name,
        date: format(bookingData.date, 'EEEE, MMMM d, yyyy'),
        time: formatTimeDisplay(bookingData.timeSlot),
        duration: service.duration,
        location: bookingData.city,
        address: `${bookingData.address}, ${bookingData.city}, ON ${bookingData.postalCode}`,
        projectType: bookingData.projectType,
        notes: bookingData.additionalNotes,
        icsFile
      };

      // Send via new email system
      await sendBookingConfirmation(emailData);
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed successfully',
        bookingId,
        booking: {
          ...bookingData,
          service: service.name,
          bookingId
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Booking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('no longer available')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint - Check availability
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