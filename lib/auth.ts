// Re-export auth from root auth.ts
export { auth } from '@/auth';

// Export signToken for JWT-based auth routes
import jwt from 'jsonwebtoken';

export async function signToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret';
  return jwt.verify(token, secret);
}
