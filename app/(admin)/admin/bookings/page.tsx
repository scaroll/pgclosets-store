import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { prisma } from '@/lib/db/client'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                  <TableCell className="capitalize">{booking.service}</TableCell>
                  <TableCell>
                    {format(booking.date, 'MMM d, yyyy')} <br />
                    <span className="text-xs text-muted-foreground">
                      {format(booking.timeStart, 'h:mm a')} - {format(booking.timeEnd, 'h:mm a')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {booking.guestName} <br />
                    <span className="text-xs text-muted-foreground">{booking.guestEmail}</span>
                  </TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
