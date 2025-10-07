import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createProtectedRoute, rateLimitConfigs } from "@/lib/validation/middleware"
import { measurementBookingSchema, type MeasurementBookingData } from "@/lib/validation/schemas"
import { sanitizeObject, sanitizationPresets } from "@/lib/validation/sanitization"
import { products } from "@/app/products/products-data"

// Time slots available for booking (9 AM to 4 PM)
const AVAILABLE_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00"
];

// Business rules
const BOOKING_RULES = {
  maxAdvanceDays: 90,
  minAdvanceDays: 1,
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  maxBookingsPerDay: 8,
  estimatedDurationMinutes: 120, // 2 hours default
};

const sendSlackNotification = async (payload: unknown) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn("[measurement-booking] Failed to notify Slack", error)
  }
}

const sendEmailNotification = async (bookingData: MeasurementBookingData, confirmationNumber: string) => {
  // In a real implementation, you would integrate with your email service
  // For example: SendGrid, AWS SES, Mailgun, etc.

  const customerEmail = {
    to: bookingData.customer.email,
    subject: `Measurement Appointment Confirmed - ${confirmationNumber}`,
    html: `
      <h2>Your Measurement Appointment is Confirmed!</h2>
      <p>Dear ${bookingData.customer.firstName} ${bookingData.customer.lastName},</p>

      <p>Thank you for booking a free measurement consultation with PG Closets. Here are your appointment details:</p>

      <div style="background: var(--color-bg-secondary); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Appointment Details</h3>
        <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
        <p><strong>Date:</strong> ${new Date(bookingData.booking.preferredDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingData.booking.preferredTime}</p>
        <p><strong>Duration:</strong> Approximately 2 hours</p>
        <p><strong>Address:</strong> ${bookingData.address.street}, ${bookingData.address.city}, ${bookingData.address.province} ${bookingData.address.postalCode}</p>
      </div>

      <h3>What to Expect</h3>
      <ul>
        <li>Our professional measurement specialist will arrive at your scheduled time</li>
        <li>We'll take precise measurements of your space</li>
        <li>Discuss your project requirements and preferences</li>
        <li>Provide recommendations based on your selected products</li>
        <li>Answer any questions you may have</li>
      </ul>

      <h3>Before Your Appointment</h3>
      <ul>
        <li>Please ensure the areas to be measured are accessible</li>
        <li>Remove any items that might obstruct measurements</li>
        <li>Have any inspiration photos or ideas ready to share</li>
      </ul>

      <p>If you need to reschedule or have any questions, please contact us at <a href="mailto:info@pgclosets.ca">info@pgclosets.ca</a>.</p>

      <p>We look forward to helping you create your perfect space!</p>

      <p>Best regards,<br>The PG Closets Team</p>
    `
  };

  const adminEmail = {
    to: "info@pgclosets.ca",
    subject: `New Measurement Booking - ${confirmationNumber}`,
    html: `
      <h2>New Measurement Booking Received</h2>

      <div style="background: var(--color-bg-secondary); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${bookingData.customer.firstName} ${bookingData.customer.lastName}</p>
        <p><strong>Email:</strong> ${bookingData.customer.email}</p>
        <p><strong>Phone:</strong> ${bookingData.customer.phone}</p>

        <h3>Appointment Details</h3>
        <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
        <p><strong>Date:</strong> ${new Date(bookingData.booking.preferredDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingData.booking.preferredTime}</p>
        <p><strong>Address:</strong> ${bookingData.address.street}, ${bookingData.address.city}, ${bookingData.address.province} ${bookingData.address.postalCode}</p>
        <p><strong>Urgency:</strong> ${bookingData.booking.urgency}</p>

        <h3>Project Details</h3>
        <p><strong>Description:</strong> ${bookingData.booking.projectDescription}</p>

        <h3>Interested Products</h3>
        <ul>
          ${bookingData.booking.interestedProducts.map(productId => {
            const product = products.find(p => p.id === productId);
            return `<li>${product ? product.name : productId}</li>`;
          }).join('')}
        </ul>

        <h3>Rooms</h3>
        <ul>
          ${bookingData.booking.rooms.map(room =>
            `<li><strong>${room.roomType}</strong>${room.dimensions ? ` - ${room.dimensions}` : ''}${room.notes ? ` (${room.notes})` : ''}</li>`
          ).join('')}
        </ul>

        ${bookingData.notes ? `<p><strong>Additional Notes:</strong> ${bookingData.notes}</p>` : ''}
      </div>
    `
  };

  // Log email details (in production, you would actually send these emails)
  console.log("[measurement-booking] Email notifications prepared:", {
    customer: customerEmail.to,
    admin: adminEmail.to,
    confirmationNumber
  });
}

function generateConfirmationNumber(): string {
  const prefix = "MB";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return BOOKING_RULES.workingDays.includes(dayOfWeek);
}

function getTimeSlotAvailability(date: string, existingBookings: any[]): { time: string; available: boolean; reason?: string }[] {
  const bookingDate = new Date(date);

  // Check if it's a working day
  if (!isWorkingDay(bookingDate)) {
    return AVAILABLE_TIME_SLOTS.map(time => ({
      time,
      available: false,
      reason: "Weekend/Holiday - We only book appointments Monday to Friday"
    }));
  }

  // Get bookings for this specific date
  const dayBookings = existingBookings.filter(booking => {
    const bookingDateTime = new Date(booking.scheduled_date_time);
    return bookingDateTime.toDateString() === bookingDate.toDateString();
  });

  return AVAILABLE_TIME_SLOTS.map(time => {
    const isBooked = dayBookings.some(booking => {
      const bookingTime = new Date(booking.scheduled_date_time);
      const timeStr = bookingTime.toTimeString().substring(0, 5);
      return timeStr === time;
    });

    return {
      time,
      available: !isBooked,
      reason: isBooked ? "Time slot already booked" : undefined
    };
  });
}

async function handleMeasurementBooking(
  request: NextRequest,
  data: MeasurementBookingData
): Promise<NextResponse> {
  // Sanitize the input data
  const sanitizedData = sanitizeObject(data, {
    ...sanitizationPresets.quoteRequest,
    preserveStructure: true
  });

  const confirmationNumber = generateConfirmationNumber();
  const bookingId = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const scheduledDateTime = new Date(`${sanitizedData.booking.preferredDate}T${sanitizedData.booking.preferredTime}:00`);

  const supabase = createClient();

  // Check if the time slot is still available
  const { data: existingBookings, error: fetchError } = await supabase
    .from("measurement_bookings")
    .select("scheduled_date_time, status")
    .eq("status", "confirmed")
    .gte("scheduled_date_time", new Date().toISOString())
    .lte("scheduled_date_time", new Date(Date.now() + BOOKING_RULES.maxAdvanceDays * 24 * 60 * 60 * 1000).toISOString());

  if (fetchError) {
    console.error("[measurement-booking] Database fetch error:", fetchError);
    throw new Error("Failed to check availability");
  }

  const availability = getTimeSlotAvailability(sanitizedData.booking.preferredDate, existingBookings || []);
  const requestedSlot = availability.find(slot => slot.time === sanitizedData.booking.preferredTime);

  if (!requestedSlot?.available) {
    return NextResponse.json({
      success: false,
      error: "Time slot no longer available",
      reason: requestedSlot?.reason || "Unknown availability issue"
    }, { status: 409 });
  }

  // Create the booking record
  const bookingRecord = {
    booking_id: bookingId,
    confirmation_number: confirmationNumber,
    scheduled_date_time: scheduledDateTime.toISOString(),
    estimated_duration_minutes: BOOKING_RULES.estimatedDurationMinutes,
    status: "confirmed",

    // Customer information
    customer_first_name: sanitizedData.customer.firstName,
    customer_last_name: sanitizedData.customer.lastName,
    customer_email: sanitizedData.customer.email,
    customer_phone: sanitizedData.customer.phone,

    // Address information
    address_street: sanitizedData.address.street,
    address_city: sanitizedData.address.city,
    address_province: sanitizedData.address.province,
    address_postal_code: sanitizedData.address.postalCode,

    // Booking details
    project_description: sanitizedData.booking.projectDescription,
    interested_products: sanitizedData.booking.interestedProducts,
    urgency: sanitizedData.booking.urgency,
    rooms: sanitizedData.booking.rooms,
    notes: sanitizedData.notes || null,

    // Metadata
    created_at: new Date().toISOString(),
    metadata: {
      userAgent: request.headers.get("user-agent")?.substring(0, 200),
      referer: request.headers.get("referer") || request.headers.get("origin"),
      ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown",
    },
  };

  const { error: insertError } = await supabase
    .from("measurement_bookings")
    .insert(bookingRecord);

  if (insertError) {
    console.error("[measurement-booking] Database insert error:", insertError);
    throw new Error("Failed to create booking");
  }

  // Send notifications
  try {
    await sendEmailNotification(sanitizedData, confirmationNumber);

    const slackPayload = {
      text: `📅 New measurement booking from ${sanitizedData.customer.firstName} ${sanitizedData.customer.lastName}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New Measurement Booking*\n• *Customer:* ${sanitizedData.customer.firstName} ${sanitizedData.customer.lastName}\n• *Email:* ${sanitizedData.customer.email}\n• *Phone:* ${sanitizedData.customer.phone}\n• *Date:* ${new Date(sanitizedData.booking.preferredDate).toLocaleDateString()}\n• *Time:* ${sanitizedData.booking.preferredTime}\n• *Address:* ${sanitizedData.address.street}, ${sanitizedData.address.city}\n• *Urgency:* ${sanitizedData.booking.urgency}\n• *Products:* ${sanitizedData.booking.interestedProducts.length} selected\n• *Project:* ${sanitizedData.booking.projectDescription.substring(0, 100)}${sanitizedData.booking.projectDescription.length > 100 ? '...' : ''}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Confirmation: ${confirmationNumber}`,
            },
            {
              type: "mrkdwn",
              text: `Booking ID: ${bookingId}`,
            },
          ],
        },
      ],
    };

    await sendSlackNotification(slackPayload);
  } catch (notificationError) {
    console.warn("[measurement-booking] Notification error:", notificationError);
    // Don't fail the booking if notifications fail
  }

  return NextResponse.json({
    success: true,
    data: {
      bookingId,
      confirmationNumber,
      scheduledDateTime: scheduledDateTime.toISOString(),
      estimatedDuration: BOOKING_RULES.estimatedDurationMinutes,
      status: "confirmed"
    },
  });
}

// GET endpoint for checking availability
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({
      success: false,
      error: "Date parameter is required"
    }, { status: 400 });
  }

  try {
    const supabase = createClient();

    // Get existing bookings for the date
    const { data: existingBookings, error } = await supabase
      .from("measurement_bookings")
      .select("scheduled_date_time, status")
      .eq("status", "confirmed")
      .gte("scheduled_date_time", `${date}T00:00:00.000Z`)
      .lt("scheduled_date_time", `${date}T23:59:59.999Z`);

    if (error) {
      console.error("[measurement-booking] Availability check error:", error);
      throw new Error("Failed to check availability");
    }

    const availability = getTimeSlotAvailability(date, existingBookings || []);

    return NextResponse.json({
      success: true,
      data: {
        date,
        slots: availability
      }
    });

  } catch (error) {
    console.error("[measurement-booking] GET error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to check availability"
    }, { status: 500 });
  }
}

// POST endpoint for creating bookings
export const POST = createProtectedRoute(
  measurementBookingSchema,
  handleMeasurementBooking,
  {
    rateLimit: rateLimitConfigs.standard,
    logRequests: true,
  }
)