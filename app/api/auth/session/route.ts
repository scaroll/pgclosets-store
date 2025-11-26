import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    // First try NextAuth session
    try {
      const session = await auth();

      if (session) {
        return NextResponse.json({
          authenticated: true,
          user: session.user,
          csrfToken: null, // NextAuth handles CSRF automatically
          message: 'Active session found',
          authType: 'nextauth'
        });
      }
    } catch (nextAuthError) {
      console.log('[NEXTAUTH_SESSION_ERROR]', nextAuthError);
      // Continue to check custom auth
    }

    // Fallback: Check for custom JWT auth token
    const token = req.cookies.get('auth-token')?.value;

    if (token) {
      try {
        const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
        if (secret) {
          const decoded = jwt.verify(token, secret) as any;

          // If we have a valid token, return user info
          return NextResponse.json({
            authenticated: true,
            user: {
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role,
              name: decoded.name || null
            },
            csrfToken: null,
            message: 'Active session found (JWT)',
            authType: 'jwt'
          });
        }
      } catch (jwtError) {
        console.log('[JWT_SESSION_ERROR]', jwtError);
        // Invalid token, continue to return unauthenticated
      }
    }

    // No valid session found - return unauthenticated response (not an error)
    return NextResponse.json({
      authenticated: false,
      user: null,
      csrfToken: null,
      message: 'No active session'
    });

  } catch (error) {
    console.error('[SESSION_ERROR]', error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        csrfToken: null,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}