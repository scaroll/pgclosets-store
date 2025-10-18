import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/order-confirmation';
import { BookingConfirmationEmail } from '@/emails/booking-confirmation';
import { WelcomeEmail } from '@/emails/welcome';
import { PasswordResetEmail } from '@/emails/password-reset';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email
const DEFAULT_FROM = process.env.EMAIL_FROM || 'PG Closets <noreply@pgclosets.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pgclosets.com';

// Types for email data
export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  estimatedDelivery?: string;
  installationDate?: string;
}

export interface BookingEmailData {
  bookingId: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  address?: string;
  projectType?: string;
  notes?: string;
  icsFile?: string; // Base64 encoded ICS file for calendar
}

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetToken: string;
}

// Email sending functions
export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: data.customerEmail,
      subject: `Order Confirmation - #${data.orderNumber}`,
      react: OrderConfirmationEmail(data),
    });

    if (error) {
      console.error('[Email] Failed to send order confirmation:', error);
      throw error;
    }

    // Also send admin notification
    await sendAdminOrderNotification(data);

    return emailData;
  } catch (error) {
    console.error('[Email] Error sending order confirmation:', error);
    throw error;
  }
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  try {
    const attachments = [];

    // Add ICS calendar file if provided
    if (data.icsFile) {
      attachments.push({
        filename: `booking-${data.bookingId}.ics`,
        content: data.icsFile,
        contentType: 'text/calendar',
      });
    }

    const { data: emailData, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: data.customerName.includes('@') ? data.customerName : `${data.customerName} <${data.customerName}>`,
      subject: `Booking Confirmation - ${data.service} on ${data.date}`,
      react: BookingConfirmationEmail(data),
      attachments,
    });

    if (error) {
      console.error('[Email] Failed to send booking confirmation:', error);
      throw error;
    }

    // Also send admin notification
    await sendAdminBookingNotification(data);

    return emailData;
  } catch (error) {
    console.error('[Email] Error sending booking confirmation:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: data.email,
      subject: 'Welcome to PG Closets!',
      react: WelcomeEmail(data),
    });

    if (error) {
      console.error('[Email] Failed to send welcome email:', error);
      throw error;
    }

    return emailData;
  } catch (error) {
    console.error('[Email] Error sending welcome email:', error);
    throw error;
  }
}

export async function sendPasswordReset(data: PasswordResetEmailData) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/auth/reset-password?token=${data.resetToken}`;

    const { data: emailData, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: data.email,
      subject: 'Reset Your Password - PG Closets',
      react: PasswordResetEmail({ ...data, resetUrl }),
    });

    if (error) {
      console.error('[Email] Failed to send password reset email:', error);
      throw error;
    }

    return emailData;
  } catch (error) {
    console.error('[Email] Error sending password reset email:', error);
    throw error;
  }
}

// Admin notification functions
async function sendAdminOrderNotification(data: OrderEmailData) {
  try {
    await resend.emails.send({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `New Order Received - #${data.orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Total:</strong> $${(data.total / 100).toFixed(2)}</p>
        <p><strong>Items:</strong> ${data.items.length} products</p>
        <p><strong>Date:</strong> ${data.orderDate}</p>
        ${data.installationDate ? `<p><strong>Installation Date:</strong> ${data.installationDate}</p>` : ''}
        <hr>
        <p>View full order details in the <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/admin/orders">admin dashboard</a>.</p>
      `,
    });
  } catch (error) {
    console.error('[Email] Failed to send admin order notification:', error);
    // Don't throw - admin notification failure shouldn't stop customer email
  }
}

async function sendAdminBookingNotification(data: BookingEmailData) {
  try {
    await resend.emails.send({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `New Booking - ${data.service} on ${data.date}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Duration:</strong> ${data.duration}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
        ${data.projectType ? `<p><strong>Project Type:</strong> ${data.projectType}</p>` : ''}
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        <hr>
        <p>View full booking details in the <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/admin/bookings">admin dashboard</a>.</p>
      `,
    });
  } catch (error) {
    console.error('[Email] Failed to send admin booking notification:', error);
    // Don't throw - admin notification failure shouldn't stop customer email
  }
}

// Utility function to generate ICS calendar file
export function generateICSFile(booking: {
  id: string;
  service: string;
  date: Date;
  duration: number; // in minutes
  location: string;
  description?: string;
}): string {
  const startDate = booking.date;
  const endDate = new Date(startDate.getTime() + booking.duration * 60000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z');
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PG Closets//Booking System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${booking.id}@pgclosets.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${booking.service} - PG Closets
LOCATION:${booking.location}
DESCRIPTION:${booking.description || `Your ${booking.service} appointment with PG Closets`}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return Buffer.from(icsContent).toString('base64');
}

// Email template preview function for development
export async function previewEmail(
  template: 'order' | 'booking' | 'welcome' | 'password-reset',
  data: any
) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Email preview is only available in development');
  }

  switch (template) {
    case 'order':
      return OrderConfirmationEmail(data as OrderEmailData);
    case 'booking':
      return BookingConfirmationEmail(data as BookingEmailData);
    case 'welcome':
      return WelcomeEmail(data as WelcomeEmailData);
    case 'password-reset':
      return PasswordResetEmail({ ...data, resetUrl: '#' } as PasswordResetEmailData & { resetUrl: string });
    default:
      throw new Error('Invalid template');
  }
}