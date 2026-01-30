"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
