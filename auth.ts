// @ts-nocheck
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Check if auth is properly configured
const isAuthConfigured = Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET)

// Minimal auth config that works without database
export const { handlers, auth, signIn, signOut } = NextAuth({
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
          async authorize(credentials) {
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
})
