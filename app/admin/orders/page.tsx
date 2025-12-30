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

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/auth/signin')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
    take: 50,
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span>{order.guestName || order.user?.name || 'Guest'}</span>
                        <span className="text-xs text-muted-foreground">{order.guestEmail || order.user?.email}</span>
                    </div>
                </TableCell>
                <TableCell>${(order.total / 100).toFixed(2)}</TableCell>
                <TableCell>
                    <Badge variant={order.fulfillmentStatus === 'delivered' ? 'default' : 'secondary'}>{order.fulfillmentStatus}</Badge>
                </TableCell>
                <TableCell>
                     <Badge variant={order.paymentStatus === 'paid' ? 'outline' : 'destructive'}>{order.paymentStatus}</Badge>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No orders found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
