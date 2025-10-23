// Booking utilities and types
export interface Booking {
  id: string;
  customerId: string;
  type: 'consultation' | 'measurement' | 'installation';
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
  notes?: string;
}

export class BookingService {
  static async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    // Implementation would connect to your booking system
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...booking,
    };
  }

  static async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    // Implementation would update booking status
    throw new Error('Not implemented');
  }

  static async getAvailability(date: Date): Promise<TimeSlot[]> {
    // Implementation would fetch available time slots
    return [];
  }
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// Generate booking number
export function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK-${timestamp}-${random}`;
}