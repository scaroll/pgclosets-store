/**
 * AGENTS 4-6: Newsletter Management System
 *
 * Agent 4: Weekly Newsletter Scheduler
 * Agent 5: Newsletter Template Engine
 * Agent 6: Newsletter Content Generator
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// AGENT 4: Weekly Newsletter Scheduler
export class WeeklyNewsletterAgent {
  async scheduleWeeklyNewsletter(content: NewsletterContent) {
    const schedule = {
      frequency: 'weekly',
      dayOfWeek: 'Tuesday',
      time: '10:00 AM EST',
      nextSend: this.getNextTuesday(),
    };

    console.log('📅 Newsletter scheduled:', schedule);
    return schedule;
  }

  private getNextTuesday(): Date {
    const today = new Date();
    const daysUntilTuesday = (2 + 7 - today.getDay()) % 7 || 7;
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    nextTuesday.setHours(10, 0, 0, 0);
    return nextTuesday;
  }

  async sendNewsletter(recipients: string[], content: NewsletterContent) {
    if (!process.env.RESEND_API_KEY) return { success: false };

    const html = newsletterTemplates.getTemplate(content);

    // In production, use batch sending
    for (const email of recipients) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'PG Closets <newsletter@pgclosets.ca>',
        to: email,
        subject: content.subject,
        html,
        tags: [
          { name: 'type', value: 'newsletter' },
          { name: 'edition', value: content.edition },
        ],
      });
    }

    return { success: true, sent: recipients.length };
  }
}

// AGENT 5: Newsletter Template Engine
export interface NewsletterContent {
  subject: string;
  edition: string;
  heroImage?: string;
  sections: NewsletterSection[];
  cta?: { text: string; url: string };
}

export interface NewsletterSection {
  type: 'article' | 'tips' | 'showcase' | 'offer' | 'social';
  title: string;
  content: string;
  image?: string;
  link?: string;
}

export const newsletterTemplates = {
  getTemplate(content: NewsletterContent): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #F9FAFB; }
            .container { max-width: 600px; margin: 0 auto; background: var(--color-secondary); }
            .header { background: linear-gradient(135deg, #1B4A9C 0%, #2563EB 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 32px; }
            .hero { width: 100%; height: auto; }
            .content { padding: 30px; }
            .section { margin: 30px 0; }
            .section-title { color: #1B4A9C; font-size: 22px; font-weight: 700; margin-bottom: 15px; }
            .cta-button { display: inline-block; background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #1F2937; color: white; padding: 30px; text-align: center; }
            .social-links a { display: inline-block; margin: 0 10px; color: white; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PG Closets Newsletter</h1>
              <p>${content.edition}</p>
            </div>

            ${content.heroImage ? `<img src="${content.heroImage}" alt="Newsletter hero" class="hero">` : ''}

            <div class="content">
              ${content.sections.map(section => this.renderSection(section)).join('')}

              ${content.cta ? `
                <center>
                  <a href="${content.cta.url}" class="cta-button">${content.cta.text}</a>
                </center>
              ` : ''}
            </div>

            <div class="footer">
              <div class="social-links">
                <a href="https://facebook.com/pgclosets">Facebook</a>
                <a href="https://instagram.com/pgclosets">Instagram</a>
                <a href="https://www.pgclosets.com">Website</a>
              </div>
              <p style="margin-top: 20px; font-size: 12px;">
                You're receiving this because you subscribed to PG Closets updates.<br>
                <a href="{{unsubscribe_url}}" style="color: #9CA3AF;">Unsubscribe</a> |
                <a href="https://www.pgclosets.com/privacy" style="color: #9CA3AF;">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  renderSection(section: NewsletterSection): string {
    switch (section.type) {
      case 'article':
        return `
          <div class="section">
            ${section.image ? `<img src="${section.image}" alt="${section.title}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">` : ''}
            <h2 class="section-title">${section.title}</h2>
            <p>${section.content}</p>
            ${section.link ? `<a href="${section.link}" style="color: #1B4A9C; font-weight: 600;">Read More →</a>` : ''}
          </div>
        `;

      case 'tips':
        return `
          <div class="section" style="background: #F0F9FF; padding: 20px; border-radius: 8px;">
            <h2 class="section-title">💡 ${section.title}</h2>
            <p>${section.content}</p>
          </div>
        `;

      case 'showcase':
        return `
          <div class="section">
            <h2 class="section-title">✨ ${section.title}</h2>
            ${section.image ? `<img src="${section.image}" alt="${section.title}" style="width: 100%; border-radius: 8px; margin: 15px 0;">` : ''}
            <p>${section.content}</p>
          </div>
        `;

      case 'offer':
        return `
          <div class="section" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px;">
            <h2 class="section-title">🎁 ${section.title}</h2>
            <p>${section.content}</p>
            ${section.link ? `<a href="${section.link}" style="color: #D97706; font-weight: 600;">Claim Offer →</a>` : ''}
          </div>
        `;

      default:
        return `
          <div class="section">
            <h2 class="section-title">${section.title}</h2>
            <p>${section.content}</p>
          </div>
        `;
    }
  }
};

// AGENT 6: Newsletter Content Generator
export class NewsletterContentAgent {
  generateWeeklyContent(): NewsletterContent {
    const date = new Date();
    const edition = `${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Edition`;

    return {
      subject: 'Transform Your Space: New Projects & Expert Tips Inside',
      edition,
      heroImage: 'https://www.pgclosets.com/images/newsletter-hero.jpg',
      sections: [
        {
          type: 'article',
          title: 'Featured Project: Luxury Walk-In Closet in Kanata',
          content: 'See how we transformed a cramped bedroom into a stunning walk-in closet with custom shelving, LED lighting, and premium finishes.',
          image: 'https://www.pgclosets.com/images/projects/kanata-walkin.jpg',
          link: 'https://www.pgclosets.com/projects/kanata-luxury-walkin',
        },
        {
          type: 'tips',
          title: '5 Ways to Maximize Small Closet Space',
          content: `
            1. Use vertical space with double hanging rods\n
            2. Add pull-out drawers for better visibility\n
            3. Install corner shelves for awkward spaces\n
            4. Use matching hangers for a streamlined look\n
            5. Add LED lighting to see everything clearly
          `,
        },
        {
          type: 'showcase',
          title: 'New: Renin Sliding Door Collection',
          content: 'Discover our latest collection of modern sliding doors, perfect for closets, room dividers, and barn door applications.',
          image: 'https://www.pgclosets.com/images/products/renin-sliding-doors.jpg',
          link: 'https://www.pgclosets.com/renin/sliding-doors',
        },
        {
          type: 'offer',
          title: 'Limited Time: Free Design Consultation',
          content: 'Book your free in-home consultation this month and receive a complimentary 3D design rendering of your new space!',
          link: 'https://www.pgclosets.com/book-consultation',
        },
        {
          type: 'social',
          title: 'Follow Us for Daily Inspiration',
          content: 'Join our growing community on Instagram and Facebook for organization tips, before & after transformations, and exclusive sneak peeks!',
        },
      ],
      cta: {
        text: 'Get Your Free Quote',
        url: 'https://www.pgclosets.com/quote',
      },
    };
  }

  generateMonthlyRecap(): NewsletterContent {
    return {
      subject: 'Your Monthly PG Closets Update',
      edition: 'Monthly Recap',
      sections: [
        {
          type: 'article',
          title: 'This Month\'s Highlights',
          content: 'A roundup of our favorite projects, customer stories, and organization tips from the past month.',
        },
      ],
    };
  }

  generateSeasonalContent(season: 'spring' | 'summer' | 'fall' | 'winter'): NewsletterContent {
    const seasonalTips = {
      spring: 'Spring Cleaning: Declutter & Organize Your Space',
      summer: 'Summer Storage Solutions for Seasonal Items',
      fall: 'Fall Organization: Prepare Your Home for the Holidays',
      winter: 'Winter Wardrobe Organization Tips',
    };

    return {
      subject: seasonalTips[season],
      edition: `${season.charAt(0).toUpperCase() + season.slice(1)} Edition`,
      sections: [
        {
          type: 'article',
          title: seasonalTips[season],
          content: `Seasonal organization tips and tricks for ${season}.`,
        },
      ],
    };
  }
}

export const weeklyNewsletterAgent = new WeeklyNewsletterAgent();
export const newsletterContentAgent = new NewsletterContentAgent();
