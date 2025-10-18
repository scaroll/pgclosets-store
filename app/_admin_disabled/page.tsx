import { PrismaClient } from '@prisma/client';
import {
  Package,
  ShoppingCart,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

async function getDashboardMetrics() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Get product counts
  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({
    where: { status: 'active' }
  });

  // Get booking counts
  const todayBookings = await prisma.booking.count({
    where: {
      date: today,
      status: { not: 'cancelled' }
    }
  });

  const monthBookings = await prisma.booking.count({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd
      },
      status: { not: 'cancelled' }
    }
  });

  const pendingBookings = await prisma.booking.count({
    where: {
      date: { gte: today },
      status: 'confirmed'
    }
  });

  // Get recent bookings
  const recentBookings = await prisma.booking.findMany({
    where: {
      status: { not: 'cancelled' }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  // Calculate booking value (example: $500 per consultation, $750 per measurement, $1000 per installation)
  const bookingValues: Record<string, number> = {
    consultation: 50000, // in cents
    measurement: 75000,
    installation: 100000
  };

  const monthBookingValue = await prisma.booking.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd
      },
      status: { not: 'cancelled' }
    },
    select: {
      service: true
    }
  }).then(bookings =>
    bookings.reduce((sum, b) => sum + (bookingValues[b.service] || 50000), 0)
  );

  return {
    products: {
      total: totalProducts,
      active: activeProducts
    },
    bookings: {
      today: todayBookings,
      month: monthBookings,
      pending: pendingBookings,
      monthValue: monthBookingValue
    },
    recentBookings
  };
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(cents / 100);
}

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the PG Closets admin panel</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.products.total}</p>
            <p className="text-sm text-green-600 mt-1">
              {metrics.products.active} active
            </p>
          </div>
        </div>

        {/* Today's Bookings Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Today's Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.bookings.today}</p>
            <p className="text-sm text-blue-600 mt-1">
              {metrics.bookings.pending} pending
            </p>
          </div>
        </div>

        {/* Month Bookings Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Month Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.bookings.month}</p>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(), 'MMMM yyyy')}
            </p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Est. Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.bookings.monthValue)}
            </p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.bookingNumber || booking.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.guestName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="capitalize">{booking.service}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(booking.date), 'MMM d, yyyy')} at{' '}
                    {format(new Date(booking.timeStart), 'h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove products</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">View Bookings</h3>
              <p className="text-sm text-gray-600">Manage appointments and schedule</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Process Orders</h3>
              <p className="text-sm text-gray-600">View and manage customer orders</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}