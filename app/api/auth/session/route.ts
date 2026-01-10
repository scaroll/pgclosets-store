import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

// Type definitions
interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  name?: string;
}

interface SessionUser {
  id: string;
  email: string;
  role?: string;
  name?: string | null;
}

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
    } catch {
      // Continue to check custom auth
    }

    // Fallback: Check for custom JWT auth token
    const token = req.cookies.get('auth-token')?.value;

    if (token) {
      try {
        const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
        if (secret) {
          const decoded = jwt.verify(token, secret) as JwtPayload;

          // If we have a valid token, return user info
          const user: SessionUser = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name || null
          };

          return NextResponse.json({
            authenticated: true,
            user,
            csrfToken: null,
            message: 'Active session found (JWT)',
            authType: 'jwt'
          });
        }
      } catch {
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
