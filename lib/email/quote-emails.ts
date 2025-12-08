/**
 * Quote Email Service
 * Send transactional emails for quote events
 */

import { Resend } from 'resend'
import QuoteSubmittedEmail from '@/emails/quote-submitted'
import QuoteReadyEmail from '@/emails/quote-ready'
import AppointmentConfirmationEmail from '@/emails/appointment-confirmation'
import PaymentReceivedEmail from '@/emails/payment-received'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'PG Closets <noreply@pgclosets.ca>'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.ca'

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send quote submitted confirmation
 */
export async function sendQuoteSubmittedEmail(data: {
  customerEmail: string
  customerName: string
  quoteNumber: string
  quoteId: string
  totalAmount: number
  configurationsCount: number
}): Promise<SendEmailResult> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Quote Request Received - ${data.quoteNumber}`,
      react: QuoteSubmittedEmail({
        customerName: data.customerName,
        quoteNumber: data.quoteNumber,
        totalAmount: data.totalAmount,
        configurationsCount: data.configurationsCount,
        quoteUrl: `${BASE_URL}/account/quotes/${data.quoteId}`
      })
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[sendQuoteSubmittedEmail] Error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send formal quote ready notification
 */
export async function sendQuoteReadyEmail(data: {
  customerEmail: string
  customerName: string
  quoteNumber: string
  quoteId: string
  totalAmount: number
  depositAmount: number
  validUntil: Date
  pdfUrl?: string
}): Promise<SendEmailResult> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your Quote is Ready - ${data.quoteNumber}`,
      react: QuoteReadyEmail({
        customerName: data.customerName,
        quoteNumber: data.quoteNumber,
        totalAmount: data.totalAmount,
        depositAmount: data.depositAmount,
        validUntil: data.validUntil.toLocaleDateString('en-CA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        quoteUrl: `${BASE_URL}/account/quotes/${data.quoteId}`,
        pdfUrl: data.pdfUrl
      })
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[sendQuoteReadyEmail] Error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send appointment confirmation
 */
export async function sendAppointmentConfirmationEmail(data: {
  customerEmail: string
  customerName: string
  appointmentType: 'MEASUREMENT' | 'INSTALLATION'
  quoteNumber: string
  date: Date
  time: string
  address: string
  techName?: string
  notes?: string
}): Promise<SendEmailResult> {
  try {
    const subject = data.appointmentType === 'MEASUREMENT'
      ? `Measurement Scheduled - ${data.quoteNumber}`
      : `Installation Scheduled - ${data.quoteNumber}`

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject,
      react: AppointmentConfirmationEmail({
        customerName: data.customerName,
        appointmentType: data.appointmentType,
        quoteNumber: data.quoteNumber,
        date: data.date.toLocaleDateString('en-CA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: data.time,
        address: data.address,
        techName: data.techName,
        notes: data.notes,
        rescheduleUrl: `${BASE_URL}/account/appointments`
      })
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[sendAppointmentConfirmationEmail] Error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send payment received confirmation
 */
export async function sendPaymentReceivedEmail(data: {
  customerEmail: string
  customerName: string
  quoteNumber: string
  quoteId: string
  paymentType: 'DEPOSIT' | 'FINAL'
  amountPaid: number
  totalAmount: number
  remainingBalance: number
  receiptUrl?: string
}): Promise<SendEmailResult> {
  try {
    const subject = data.paymentType === 'DEPOSIT'
      ? `Deposit Received - Order Confirmed - ${data.quoteNumber}`
      : `Payment Received - Thank You! - ${data.quoteNumber}`

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject,
      react: PaymentReceivedEmail({
        customerName: data.customerName,
        quoteNumber: data.quoteNumber,
        paymentType: data.paymentType,
        amountPaid: data.amountPaid,
        totalAmount: data.totalAmount,
        remainingBalance: data.remainingBalance,
        receiptUrl: data.receiptUrl,
        quoteUrl: `${BASE_URL}/account/quotes/${data.quoteId}`
      })
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[sendPaymentReceivedEmail] Error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send admin notification for new quote
 */
export async function sendAdminNewQuoteNotification(data: {
  quoteNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  configurationsCount: number
}): Promise<SendEmailResult> {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@pgclosets.ca'

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `New Quote Request - ${data.quoteNumber}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Quote Number:</strong> ${data.quoteNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Phone:</strong> ${data.customerPhone}</p>
        <p><strong>Configurations:</strong> ${data.configurationsCount}</p>
        <p><strong>Estimated Total:</strong> $${data.totalAmount.toLocaleString()}</p>
        <br>
        <p><a href="${BASE_URL}/admin/quotes">View in Admin Dashboard</a></p>
      `
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[sendAdminNewQuoteNotification] Error:', error)
    return { success: false, error: String(error) }
  }
}
