import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/db';
import { sendPasswordReset, type PasswordResetEmailData } from '@/lib/email';

// Request password reset schema
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*[0-9])/, 'Password must contain at least one number')
    .regex(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),
});

// POST /api/auth/reset-password - Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a reset request or password update
    if (body.token) {
      // Reset password with token
      const validatedData = resetPasswordSchema.parse(body);

      // Find the verification token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token: validatedData.token },
      });

      if (!verificationToken) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        );
      }

      // Check if token is expired
      if (new Date() > verificationToken.expires) {
        // Delete expired token
        await prisma.verificationToken.delete({
          where: { token: validatedData.token },
        });

        return NextResponse.json(
          { error: 'Reset token has expired. Please request a new one.' },
          { status: 400 }
        );
      }

      // Find user by email from token identifier
      const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Delete used token
      await prisma.verificationToken.delete({
        where: { token: validatedData.token },
      });

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully! You can now sign in with your new password.',
      });

    } else {
      // Request password reset
      const validatedData = requestResetSchema.parse(body);

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      // Always return success even if user doesn't exist (security best practice)
      if (!user) {
        return NextResponse.json({
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link.',
        });
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

      // Delete any existing tokens for this user
      await prisma.verificationToken.deleteMany({
        where: { identifier: user.email },
      });

      // Create new verification token
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: resetToken,
          expires,
        },
      });

      // Send password reset email
      try {
        const emailData: PasswordResetEmailData = {
          name: user.name || user.email,
          email: user.email,
          resetToken,
        };
        await sendPasswordReset(emailData);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Still return success for security
      }

      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }
  } catch (error) {
    console.error('Password reset error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process password reset request. Please try again.' },
      { status: 500 }
    );
  }
}