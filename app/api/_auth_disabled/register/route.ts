import { NextRequest, NextResponse } from 'next/server';
// Disabled route - required modules not available
// import { z } from 'zod';
// import * as bcrypt from 'bcryptjs';
// import { prisma } from '@/lib/db';
// import { sendWelcomeEmail, type WelcomeEmailData } from '@/lib/email';
// import { signIn } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  // This route is disabled - registration functionality not available
  return NextResponse.json(
    { error: "Registration route is disabled" },
    { status: 503 }
  )
}