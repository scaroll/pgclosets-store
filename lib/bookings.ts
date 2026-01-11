// Bookings with dynamic Prisma types

/**
 * Generate a unique booking number
 */
export function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BK-${timestamp}-${random}`
}

export interface BookingData {
  name: string
  email: string
  phone: string
  address?: string
  preferredDate: Date
  preferredTime: string
  type: 'MEASURE' | 'CONSULTATION' | 'INSTALLATION'
  notes?: string
}
