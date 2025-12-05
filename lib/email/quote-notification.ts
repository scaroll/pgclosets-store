import { sendEmail } from '../emails';

export interface QuoteRequestData {
  quoteId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType?: string;
  projectDescription?: string;
  budget?: string;
  timeline?: string;
  measurements?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: 'inches' | 'feet' | 'cm' | 'm';
  };
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  preferredContactMethod?: 'email' | 'phone';
  preferredContactTime?: string;
  source?: string;
  notes?: string;
  submittedAt: string;
  ipAddress: string;
}

/**
 * Send quote request notification to admin
 */
export async function sendQuoteNotification(data: QuoteRequestData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pgclosets.com';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0071e3 0%, #0077ed 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">New Quote Request</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Quote ID: ${data.quoteId}</p>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e7; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1d1d1f; font-size: 20px; margin-top: 0;">Contact Information</h2>
        <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #0071e3;">${data.email}</a></p>
          <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #0071e3;">${data.phone}</a></p>
          ${data.company ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${data.company}</p>` : ''}
          ${data.preferredContactMethod ? `<p style="margin: 8px 0;"><strong>Preferred Contact:</strong> ${data.preferredContactMethod}</p>` : ''}
          ${data.preferredContactTime ? `<p style="margin: 8px 0;"><strong>Best Time to Contact:</strong> ${data.preferredContactTime}</p>` : ''}
        </div>

        ${data.projectType || data.projectDescription ? `
          <h2 style="color: #1d1d1f; font-size: 20px;">Project Details</h2>
          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            ${data.projectType ? `<p style="margin: 8px 0;"><strong>Project Type:</strong> ${data.projectType}</p>` : ''}
            ${data.budget ? `<p style="margin: 8px 0;"><strong>Budget Range:</strong> ${data.budget}</p>` : ''}
            ${data.timeline ? `<p style="margin: 8px 0;"><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
            ${data.projectDescription ? `
              <p style="margin: 8px 0;"><strong>Description:</strong></p>
              <p style="margin: 8px 0; white-space: pre-wrap; background: white; padding: 12px; border-radius: 6px;">${data.projectDescription}</p>
            ` : ''}
          </div>
        ` : ''}

        ${data.measurements ? `
          <h2 style="color: #1d1d1f; font-size: 20px;">Measurements</h2>
          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            ${data.measurements.width ? `<p style="margin: 8px 0;"><strong>Width:</strong> ${data.measurements.width} ${data.measurements.unit || 'inches'}</p>` : ''}
            ${data.measurements.height ? `<p style="margin: 8px 0;"><strong>Height:</strong> ${data.measurements.height} ${data.measurements.unit || 'inches'}</p>` : ''}
            ${data.measurements.depth ? `<p style="margin: 8px 0;"><strong>Depth:</strong> ${data.measurements.depth} ${data.measurements.unit || 'inches'}</p>` : ''}
          </div>
        ` : ''}

        ${data.address && (data.address.street || data.address.city) ? `
          <h2 style="color: #1d1d1f; font-size: 20px;">Service Address</h2>
          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            ${data.address.street ? `<p style="margin: 8px 0;">${data.address.street}</p>` : ''}
            ${data.address.city || data.address.province || data.address.postalCode ? `
              <p style="margin: 8px 0;">
                ${data.address.city || ''}${data.address.province ? ', ' + data.address.province : ''}${data.address.postalCode ? ' ' + data.address.postalCode : ''}
              </p>
            ` : ''}
          </div>
        ` : ''}

        ${data.notes ? `
          <h2 style="color: #1d1d1f; font-size: 20px;">Additional Notes</h2>
          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${data.notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e7;">
          <p style="color: #86868b; font-size: 13px; margin: 5px 0;">
            <strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          ${data.source ? `<p style="color: #86868b; font-size: 13px; margin: 5px 0;"><strong>Source:</strong> ${data.source}</p>` : ''}
          <p style="color: #86868b; font-size: 13px; margin: 5px 0;"><strong>IP Address:</strong> ${data.ipAddress}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #fff5e6; border-radius: 8px; border-left: 4px solid #ff9500;">
          <p style="margin: 0; color: #1d1d1f; font-size: 14px;">
            <strong>Action Required:</strong> Please respond to this quote request within 24 hours to maintain customer satisfaction.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Quote Request #${data.quoteId} - ${data.name}`,
    html,
    replyTo: data.email,
  });
}

/**
 * Send auto-response to customer
 */
export async function sendQuoteAutoResponse(data: QuoteRequestData): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0071e3 0%, #0077ed 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 600;">Thank You!</h1>
        <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px;">We've received your quote request</p>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e7; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #1d1d1f; line-height: 1.5;">Hi ${data.name},</p>

        <p style="font-size: 16px; color: #1d1d1f; line-height: 1.5;">
          Thank you for requesting a quote from PG Closets! We're excited about the opportunity to work on your project.
        </p>

        <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #86868b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Quote Reference</p>
          <p style="margin: 0; font-size: 20px; font-weight: 600; color: #1d1d1f;">#${data.quoteId}</p>
        </div>

        <h2 style="color: #1d1d1f; font-size: 20px; margin-top: 30px;">What Happens Next?</h2>

        <div style="margin: 20px 0;">
          <div style="display: flex; margin-bottom: 15px;">
            <div style="background: #0071e3; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; flex-shrink: 0;">1</div>
            <div>
              <p style="margin: 0; color: #1d1d1f; font-weight: 600;">Review</p>
              <p style="margin: 5px 0 0 0; color: #86868b; font-size: 14px;">Our team will review your request and project details</p>
            </div>
          </div>

          <div style="display: flex; margin-bottom: 15px;">
            <div style="background: #0071e3; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; flex-shrink: 0;">2</div>
            <div>
              <p style="margin: 0; color: #1d1d1f; font-weight: 600;">Contact</p>
              <p style="margin: 5px 0 0 0; color: #86868b; font-size: 14px;">We'll reach out within 24 hours to discuss your needs</p>
            </div>
          </div>

          <div style="display: flex; margin-bottom: 15px;">
            <div style="background: #0071e3; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; flex-shrink: 0;">3</div>
            <div>
              <p style="margin: 0; color: #1d1d1f; font-weight: 600;">Quote</p>
              <p style="margin: 5px 0 0 0; color: #86868b; font-size: 14px;">Receive a detailed, customized quote for your project</p>
            </div>
          </div>
        </div>

        <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1d1d1f; font-size: 18px;">In the Meantime</h3>
          <ul style="margin: 0; padding-left: 20px; color: #1d1d1f;">
            <li style="margin-bottom: 8px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'}/products" style="color: #0071e3; text-decoration: none;">Browse our product catalog</a>
            </li>
            <li style="margin-bottom: 8px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'}/gallery" style="color: #0071e3; text-decoration: none;">View our project gallery</a>
            </li>
            <li style="margin-bottom: 8px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'}/about" style="color: #0071e3; text-decoration: none;">Learn more about our process</a>
            </li>
          </ul>
        </div>

        <p style="font-size: 16px; color: #1d1d1f; line-height: 1.5;">
          If you have any questions or need to add information to your request, feel free to reply to this email.
        </p>

        <p style="font-size: 16px; color: #1d1d1f; line-height: 1.5; margin-bottom: 0;">
          Best regards,<br>
          <strong>The PG Closets Team</strong>
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e7; text-align: center;">
          <p style="color: #86868b; font-size: 13px; margin: 5px 0;">
            PG Closets - Premium Closet Doors & Storage Solutions
          </p>
          <p style="color: #86868b; font-size: 13px; margin: 5px 0;">
            Ottawa, ON | (613) 555-0123
          </p>
          <p style="color: #86868b; font-size: 13px; margin: 5px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'}" style="color: #0071e3; text-decoration: none;">www.pgclosets.com</a>
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: `Quote Request Received - Reference #${data.quoteId}`,
    html,
  });
}
