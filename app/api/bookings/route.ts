import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { format } from 'date-fns';
import { getServiceBySlug } from '@/lib/services';

// Initialize Resend only if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
};

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
function generateConfirmationEmail(booking: BookingData, service: any): string {
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
          .next-steps {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
          }
          .next-steps h3 {
            margin-top: 0;
            color: #1e40af;
          }
          .step {
            margin: 10px 0;
            padding-left: 20px;
            position: relative;
          }
          .step:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your appointment with PG Closets is scheduled</p>
          </div>

          <div class="content">
            <p>Dear ${booking.firstName} ${booking.lastName},</p>

            <p>Thank you for booking your ${service.name} with PG Closets! We're excited to help you transform your space.</p>

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

              ${booking.projectType ? `
              <div class="detail-row">
                <span class="detail-label">Project Type:</span>
                <span class="detail-value">${booking.projectType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
              </div>
              ` : ''}

              ${booking.budget ? `
              <div class="detail-row">
                <span class="detail-label">Budget Range:</span>
                <span class="detail-value">${booking.budget}</span>
              </div>
              ` : ''}
            </div>

            <div class="next-steps">
              <h3>What Happens Next?</h3>
              <div class="step">We'll send you a reminder 24 hours before your appointment</div>
              <div class="step">Our designer will arrive at the scheduled time with samples and tools</div>
              <div class="step">You'll receive a custom 3D design and quote during the visit</div>
              <div class="step">No obligation - take time to review and decide</div>
            </div>

            <h3>Need to Make Changes?</h3>
            <p>If you need to reschedule or have any questions, please don't hesitate to contact us:</p>
            <ul>
              <li>Phone: <a href="tel:+16135551234">(613) 555-1234</a></li>
              <li>Email: <a href="mailto:info@pgclosets.com">info@pgclosets.com</a></li>
            </ul>

            <center>
              <a href="https://pgclosets.com/account/appointments" class="button">
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
function generateAdminNotification(booking: BookingData, service: any): string {
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
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Booking Received</h2>

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
          <div class="detail">
            <span class="label">Preferred Contact:</span> ${booking.preferredContact || 'Email'}
          </div>

          ${booking.projectType ? `
          <h3>Project Details</h3>
          <div class="detail">
            <span class="label">Type:</span> ${booking.projectType}
          </div>
          <div class="detail">
            <span class="label">Budget:</span> ${booking.budget || 'Not specified'}
          </div>
          <div class="detail">
            <span class="label">Timeline:</span> ${booking.timeline || 'Not specified'}
          </div>
          ` : ''}

          ${booking.roomDimensions ? `
          <div class="detail">
            <span class="label">Room Dimensions:</span>
            ${booking.roomDimensions.width}ft x ${booking.roomDimensions.depth}ft x ${booking.roomDimensions.height}ft height
          </div>
          ` : ''}

          ${booking.additionalNotes ? `
          <div class="detail">
            <span class="label">Additional Notes:</span><br>
            ${booking.additionalNotes}
          </div>
          ` : ''}

          ${booking.hearAboutUs ? `
          <div class="detail">
            <span class="label">Source:</span> ${booking.hearAboutUs}
          </div>
          ` : ''}

          <hr>
          <p><strong>Action Required:</strong> Please confirm this appointment in the CRM system and assign a designer.</p>
        </div>
      </body>
    </html>
  `;
}

// POST endpoint - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate booking data
    const booking = bookingSchema.parse(body);

    // Get service details
    const service = getServiceBySlug(booking.service);
    if (!service) {
      return NextResponse.json(
        { error: 'Invalid service selected' },
        { status: 400 }
      );
    }

    // TODO: Check availability in database
    // For now, we'll assume the slot is available

    // TODO: Save booking to database
    // const savedBooking = await saveBookingToDatabase(booking);

    // Send confirmation email to customer
    try {
      const resend = getResend();
      await resend.emails.send({
        from: 'PG Closets <bookings@pgclosets.com>',
        to: booking.email,
        subject: `Booking Confirmation - ${service.name} on ${format(booking.date, 'MMM d, yyyy')}`,
        html: generateConfirmationEmail(booking, service),
      });
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError);
      // Continue even if email fails
    }

    // Send notification to admin
    try {
      const resend = getResend();
      await resend.emails.send({
        from: 'PG Closets System <system@pgclosets.com>',
        to: process.env.ADMIN_EMAIL || 'admin@pgclosets.com',
        subject: `New Booking: ${booking.firstName} ${booking.lastName} - ${service.name}`,
        html: generateAdminNotification(booking, service),
      });
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError);
      // Continue even if email fails
    }

    // TODO: Add to Google Calendar
    // await addToGoogleCalendar(booking, service);

    // TODO: Send SMS reminder (if opted in)
    // if (booking.preferredContact === 'text') {
    //   await scheduleSMSReminder(booking, service);
    // }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed successfully',
        bookingId: `BK-${Date.now()}`, // Generate proper ID from database
        booking: {
          ...booking,
          service: service.name,
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

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
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
    // TODO: Query database for existing bookings
    // const existingBookings = await getBookingsByDate(date);

    // For now, return mock availability
    const availableSlots = [
      { time: '09:00', available: true, preferred: true },
      { time: '09:30', available: true, preferred: true },
      { time: '10:00', available: false },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: true, preferred: true },
      { time: '14:30', available: true, preferred: true },
      { time: '15:00', available: false },
      { time: '15:30', available: true },
      { time: '16:00', available: true },
      { time: '16:30', available: true },
      { time: '17:00', available: true },
      { time: '17:30', available: true },
      { time: '18:00', available: true, preferred: true },
      { time: '18:30', available: true, preferred: true },
      { time: '19:00', available: true },
      { time: '19:30', available: false },
    ];

    return NextResponse.json(
      {
        date,
        service,
        slots: availableSlots,
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
  }
}