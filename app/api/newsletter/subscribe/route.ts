import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/email/newsletter';

/**
 * Newsletter Subscription API Route
 *
 * POST /api/newsletter/subscribe
 * Body: { email: string, firstName?: string, lastName?: string }
 *
 * Returns: { success: boolean, message?: string, error?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Validate email presence
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email,
      firstName,
      lastName,
      source: 'website'
    });

    // Return result with appropriate status code
    return NextResponse.json(
      result,
      { status: result.success ? 200 : 400 }
    );

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your subscription'
      },
      { status: 500 }
    );
  }
}
