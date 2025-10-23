import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Handle missing database gracefully
const adapter = process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined;

// Only include providers if their environment variables are configured
const providers = [];

// Only add Google provider if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// Only add Credentials provider if database is available
if (process.env.DATABASE_URL) {
  providers.push(
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const validated = credentialsSchema.safeParse(credentials);
          if (!validated.success) return null;

          const { email, password } = validated.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Credentials provider error:', error);
          return null;
        }
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: adapter,
  session: {
    strategy: adapter ? 'database' : 'jwt', // Use database strategy if adapter is available
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'customer';
      }

      // Store provider info for later use
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === 'google') {
        return true;
      }

      // For credentials provider, user is already verified in authorize
      if (account?.provider === 'credentials') {
        return true;
      }

      return false;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Log sign-in events for security auditing
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
    async signOut({ session }) {
      console.log(`User signed out: ${session?.user?.email}`);
    },
  },
});

// Helper function to check if user is admin
export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === 'admin';
}

// Helper function to get session
export async function getSession() {
  return await auth();
}

// Helper function for protected API routes
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

// Helper function for admin-only API routes
export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}

// JWT token signing function for custom auth
export function signToken(payload: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

    // For development only, provide a fallback secret
    if (!secret && process.env.NODE_ENV === 'development') {
      secret = 'development-secret-key-change-in-production';
      console.warn('⚠️ Using development JWT secret - set NEXTAUTH_SECRET in production');
    }

    if (!secret) {
      reject(new Error('JWT secret not configured'));
      return;
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) reject(err);
        else resolve(token!);
      }
    );
  });
}

// JWT token verification function
export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

    // For development only, provide a fallback secret
    if (!secret && process.env.NODE_ENV === 'development') {
      secret = 'development-secret-key-change-in-production';
      console.warn('⚠️ Using development JWT secret - set NEXTAUTH_SECRET in production');
    }

    if (!secret) {
      reject(new Error('JWT secret not configured'));
      return;
    }

    jwt.verify(
      token,
      secret,
      (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      }
    );
  });
}