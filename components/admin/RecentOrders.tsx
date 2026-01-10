import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentOrders({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent orders.</div>
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div className="flex items-center" key={order.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{(order.guestName || order.user?.name || 'G')[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.guestName || order.user?.name || 'Guest'}</p>
            <p className="text-sm text-muted-foreground">{order.guestEmail || order.user?.email}</p>
          </div>
          <div className="ml-auto font-medium">
             +${(order.total / 100).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
