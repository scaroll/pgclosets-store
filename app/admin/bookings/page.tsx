import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function AdminBookingsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/auth/signin')

  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                <TableCell className="capitalize">{booking.service}</TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span>{booking.guestName}</span>
                        <span className="text-xs text-muted-foreground">{booking.guestEmail}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">
                             {new Date(booking.timeStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </TableCell>
                <TableCell>{booking.location}</TableCell>
                <TableCell>
                     <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
             {bookings.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No bookings found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
