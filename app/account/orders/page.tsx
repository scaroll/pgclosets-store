export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-2024-001",
      date: "March 15, 2024",
      status: "Delivered",
      total: "$4,299.00",
      items: 3,
    },
    {
      id: "ORD-2024-002",
      date: "February 28, 2024",
      status: "In Production",
      total: "$6,799.00",
      items: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Order History</h1>
            <p className="text-muted-foreground">Track and manage your PG Closets orders</p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.id}</h3>
                    <p className="text-muted-foreground">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold">{order.total}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-muted-foreground">{order.items} items</span>
                  <div className="flex gap-2">
                    <button className="text-primary hover:underline">View Details</button>
                    <button className="text-primary hover:underline">Track Order</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
