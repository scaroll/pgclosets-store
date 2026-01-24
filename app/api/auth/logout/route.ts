import { NextResponse } from 'next/server'

// Force Node.js runtime for consistency with other auth routes
export const runtime = 'nodejs'

export function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      authenticated: false,
      user: null,
      csrfToken: null,
      message: 'Logout successful',
    })

    // Clear auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        csrfToken: null,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
