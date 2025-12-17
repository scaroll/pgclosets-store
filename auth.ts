/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - NextAuth types require internal references that can't be exported
import NextAuth, { type NextAuthResult } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Check if auth is properly configured
const isAuthConfigured = Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET)

// Minimal auth config that works without database
const authResult: NextAuthResult = NextAuth({
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'development-secret-not-for-production',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  providers: isAuthConfigured
    ? [
        Credentials({
          name: 'credentials',
          credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
          },
          authorize(credentials) {
            // Demo/placeholder auth - replace with real logic when needed
            if (credentials?.email === 'demo@pgclosets.com' && credentials?.password === 'demo') {
              return {
                id: '1',
                email: 'demo@pgclosets.com',
                name: 'Demo User',
                role: 'USER',
              }
            }
            return null
          },
        }),
      ]
    : [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role as string
      }
      return session
    },
  },
})

// Export with explicit types to avoid declaration file issues with next-auth internal types
export const handlers = authResult.handlers
export const auth = authResult.auth
export const signIn = authResult.signIn
export const signOut = authResult.signOut
