import { handlers } from '@/auth'

// Force Node.js runtime - Prisma and bcryptjs are incompatible with Edge Runtime
export const runtime = 'nodejs'

export const { GET, POST } = handlers
