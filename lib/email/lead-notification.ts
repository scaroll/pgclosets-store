import { sendEmail } from '../emails'

export interface LeadData {
  name: string
  email: string
  phone?: string
  service?: string
  serviceType?: string
  message?: string
  source?: string
  location?: string
  leadId?: string
  productInterest?: string
  preferredContact?: string
  doorSelection?: {
    series?: string
    doorType?: string
    openingWidthIn?: number
    openingHeightIn?: number
    panelCount?: number
    finish?: string
    hardware?: string
    softClose?: boolean
    handles?: string
    quantity?: number
    notes?: string
  }
}

/**
 * Send lead notification to admin
 */
export async function sendLeadNotification(data: LeadData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@pgclosets.com'
  const serviceLabel =
    data.serviceType === 'quote'
      ? 'Quote Request'
      : data.serviceType === 'measure'
        ? 'Consultation Request'
        : 'General Inquiry'

  let doorSelectionHtml = ''
  if (data.doorSelection) {
    const ds = data.doorSelection
    doorSelectionHtml = `
      <div style="background: #e8f4fd; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <h3 style="margin: 0 0 12px; color: #1a365d;">Door Selection Details</h3>
        <p style="margin: 4px 0;"><strong>Series:</strong> ${ds.series || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Door Type:</strong> ${ds.doorType || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Opening Size:</strong> ${ds.openingWidthIn || 0}" W x ${ds.openingHeightIn || 0}" H</p>
        <p style="margin: 4px 0;"><strong>Panel Count:</strong> ${ds.panelCount || 1}</p>
        <p style="margin: 4px 0;"><strong>Finish:</strong> ${ds.finish || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Hardware:</strong> ${ds.hardware || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Soft Close:</strong> ${ds.softClose ? 'Yes' : 'No'}</p>
        <p style="margin: 4px 0;"><strong>Quantity:</strong> ${ds.quantity || 1}</p>
        ${ds.notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${ds.notes}</p>` : ''}
      </div>
    `
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New ${serviceLabel}</h1>
      </div>
      <div style="padding: 24px;">
        <div style="background: #f7fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 16px; color: #1a365d; font-size: 18px;">Contact Information</h2>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
          ${data.location ? `<p style="margin: 8px 0;"><strong>Location:</strong> ${data.location}</p>` : ''}
          ${data.preferredContact ? `<p style="margin: 8px 0;"><strong>Preferred Contact:</strong> ${data.preferredContact}</p>` : ''}
        </div>

        ${
          data.productInterest
            ? `
        <div style="background: #f0fff4; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0;"><strong>Product Interest:</strong> ${data.productInterest}</p>
        </div>
        `
            : ''
        }

        ${
          data.message
            ? `
        <div style="background: #fffaf0; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px; color: #744210;">Message</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        `
            : ''
        }

        ${doorSelectionHtml}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0;">
            Lead ID: ${data.leadId || 'N/A'}<br>
            Received: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} (Eastern Time)
          </p>
        </div>
      </div>
      <div style="background: #f7fafc; padding: 16px; text-align: center;">
        <p style="margin: 0; color: #718096; font-size: 12px;">
          Reply directly to this email to respond to the customer.
        </p>
      </div>
    </div>
  `

  // Send notification to admin
  const adminSent = await sendEmail({
    to: adminEmail,
    subject: `[${serviceLabel}] ${data.name} - ${data.productInterest || data.location || 'PG Closets'}`,
    html,
    replyTo: data.email,
  })

  // Send auto-response to customer
  await sendLeadAutoResponse(data)

  return adminSent
}

/**
 * Send auto-response to lead
 */
export async function sendLeadAutoResponse(data: LeadData): Promise<boolean> {
  const firstName = data.name.split(' ')[0]
  const serviceLabel =
    data.serviceType === 'quote'
      ? 'Quote Request'
      : data.serviceType === 'measure'
        ? 'Consultation Request'
        : 'Inquiry'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pgclosets.com'

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #1a365d; color: white; padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">PG Closets</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Premium Closet Door Solutions</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 32px;">
        <h2 style="color: #1a365d; margin: 0 0 20px; font-size: 24px;">Thank You for Your ${serviceLabel}!</h2>

        <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
          Hi ${firstName},
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
          We've received your ${serviceLabel.toLowerCase()} and our team is already reviewing your project details. You can expect to hear from us within <strong>24 hours</strong>.
        </p>

        ${
          data.leadId
            ? `
        <div style="background: #f7fafc; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 4px;">Your Reference Number</p>
          <p style="color: #1a365d; font-size: 20px; font-weight: 700; margin: 0; font-family: monospace;">${data.leadId.slice(0, 8).toUpperCase()}</p>
        </div>
        `
            : ''
        }

        <!-- What's Next -->
        <div style="background: #f0fff4; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #276749; margin: 0 0 16px; font-size: 18px;">What Happens Next?</h3>
          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; background: #276749; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 12px;">1</span>
            <span style="color: #4a5568; font-size: 14px;">Our team reviews your requirements</span>
          </div>
          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; background: #276749; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 12px;">2</span>
            <span style="color: #4a5568; font-size: 14px;">We contact you to schedule a free measurement</span>
          </div>
          <div>
            <span style="display: inline-block; background: #276749; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 12px;">3</span>
            <span style="color: #4a5568; font-size: 14px;">You receive a detailed, itemized quote</span>
          </div>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
          In the meantime, feel free to explore:
        </p>

        <!-- Quick Links -->
        <div style="margin: 24px 0;">
          <a href="${siteUrl}/products" style="display: inline-block; background: #1a365d; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 8px; margin-bottom: 8px;">Browse Products</a>
          <a href="${siteUrl}/instant-estimate" style="display: inline-block; background: #e2e8f0; color: #1a365d; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 8px;">Get Instant Estimate</a>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 24px 0 0;">
          Have questions? Don't hesitate to reach out:
        </p>

        <!-- Contact Info -->
        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <p style="color: #4a5568; font-size: 14px; margin: 0 0 8px;">
            <strong>Phone:</strong> <a href="tel:+16137016393" style="color: #1a365d;">(613) 701-6393</a>
          </p>
          <p style="color: #4a5568; font-size: 14px; margin: 0 0 8px;">
            <strong>Email:</strong> <a href="mailto:info@pgclosets.com" style="color: #1a365d;">info@pgclosets.com</a>
          </p>
          <p style="color: #4a5568; font-size: 14px; margin: 0;">
            <strong>Hours:</strong> Mon-Fri 9am-6pm, Sat 10am-4pm
          </p>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 24px 0 0;">
          Thank you for considering PG Closets for your project. We look forward to helping you transform your space!
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 24px 0 0;">
          Warm regards,<br>
          <strong>The PG Closets Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f7fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; font-size: 12px; margin: 0 0 8px;">
          PG Closets - Ottawa's Premier Closet Door Specialists
        </p>
        <p style="color: #718096; font-size: 12px; margin: 0 0 8px;">
          Serving Ottawa, Kanata, Barrhaven, Orleans, and surrounding areas
        </p>
        <p style="color: #a0aec0; font-size: 11px; margin: 16px 0 0;">
          You're receiving this email because you submitted a request on pgclosets.com.<br>
          If you didn't make this request, please disregard this email.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: `Your ${serviceLabel} Has Been Received - PG Closets`,
    html,
  })
}
