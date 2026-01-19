import { NextRequest, NextResponse } from 'next/server';
// Disabled route - required modules not available
// import { z } from 'zod';
// import * as bcrypt from 'bcryptjs';
// import { randomBytes } from 'crypto';
// import { prisma } from '@/lib/db';
// import { sendPasswordReset, type PasswordResetEmailData } from '@/lib/email';

export async function POST(_request: NextRequest) {
  // This route is disabled - password reset functionality not available
  return NextResponse.json(
    { error: "Password reset route is disabled" },
    { status: 503 }
  )
}