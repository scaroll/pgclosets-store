// Email utilities and types
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions): Promise<void> {
    // Implementation would connect to your email service
    console.log('Sending email:', options);
  }

  static async sendConfirmation(email: string, bookingId: string): Promise<void> {
    // Implementation would send booking confirmation
    await this.sendEmail({
      to: email,
      subject: 'Your PG Closets Consultation is Confirmed',
      html: `<p>Your consultation has been scheduled. Reference: ${bookingId}</p>`,
    });
  }

  static async sendQuote(email: string, quoteData: any): Promise<void> {
    // Implementation would send price quote
    await this.sendEmail({
      to: email,
      subject: 'Your Free Quote from PG Closets',
      html: `<p>Thank you for your interest. Here is your quote.</p>`,
    });
  }

  static async sendBookingConfirmationEmail(email: string, bookingData: any): Promise<void> {
    // Implementation would send booking confirmation email
    const { bookingNumber, date, type, address } = bookingData;

    await this.sendEmail({
      to: email,
      subject: `Booking Confirmation - ${bookingNumber}`,
      html: `
        <div>
          <h2>Booking Confirmed</h2>
          <p><strong>Booking Number:</strong> ${bookingNumber}</p>
          <p><strong>Service Type:</strong> ${type}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p>We'll see you soon! Thank you for choosing PG Closets.</p>
        </div>
      `,
    });
  }
}

// Export standalone function
export async function sendBookingConfirmationEmail(email: string, bookingData: any): Promise<void> {
  await EmailService.sendBookingConfirmationEmail(email, bookingData);
}
}