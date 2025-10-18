import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';

const prisma = new PrismaClient();

async function getBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: [
      { date: 'desc' },
      { timeStart: 'desc' }
    ],
    include: {
      user: true
    }
  });

  return bookings;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'no-show':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatTimeRange(start: Date, end: Date) {
  return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  // Group bookings by date
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const dateKey = format(new Date(booking.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(booking);
    return acc;
  }, {} as Record<string, typeof bookings>);

  // Count bookings by status
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600 mt-2">View and manage all customer appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link
              href="/admin/bookings/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {statusCounts.confirmed || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {statusCounts.completed || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">
                {statusCounts.cancelled || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
            <div key={date} className="p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>

              <div className="space-y-4">
                {dateBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {booking.guestName}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            #{booking.bookingNumber || booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTimeRange(
                                  new Date(booking.timeStart),
                                  new Date(booking.timeEnd)
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="capitalize">{booking.service}</span>
                              <span className="text-gray-400">
                                ({booking.duration} min)
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <a
                                href={`mailto:${booking.guestEmail}`}
                                className="hover:text-blue-600"
                              >
                                {booking.guestEmail}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <a
                                href={`tel:${booking.guestPhone}`}
                                className="hover:text-blue-600"
                              >
                                {booking.guestPhone}
                              </a>
                            </div>
                            {booking.projectType && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <span className="capitalize">
                                  {booking.projectType.replace(/-/g, ' ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {booking.projectDescription && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
                            <p className="font-medium text-gray-700 mb-1">Notes:</p>
                            {booking.projectDescription}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created {format(new Date(booking.createdAt), 'MMM d, h:mm a')}</span>
                        {booking.assignedTo && (
                          <span>Assigned to: {booking.assignedTo}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                          Cancel
                        </button>
                        <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}