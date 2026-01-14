// Removed shadcn import - using native HTML
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Home, Building } from "lucide-react"
import Link from "next/link"

export default function AddressesPage() {
  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Smith",
      address: "123 Main Street",
      city: "Toronto",
      province: "ON",
      postal: "M5V 3A8",
      phone: "+1 (416) 555-0123",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Smith",
      address: "456 Business Ave, Suite 200",
      city: "Toronto",
      province: "ON",
      postal: "M4W 1A8",
      phone: "+1 (416) 555-0456",
      isDefault: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">PG Closets</span>
                <p className="text-xs text-gray-500">Premium Home Organization</p>
              </div>
            </Link>

            <Link href="/account" className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Address Book</h1>
            <p className="text-gray-500">Manage your shipping and billing addresses</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {address.type === "Home" ? (
                      <Home className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Building className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">{address.type} Address</h3>
                </div>
                {address.isDefault && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Default</span>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <p className="font-semibold text-gray-900">{address.name}</p>
                <p className="text-gray-500">{address.address}</p>
                <p className="text-gray-500">
                  {address.city}, {address.province} {address.postal}
                </p>
                <p className="text-gray-500">{address.phone}</p>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                {!address.isDefault && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!address.isDefault && (
                <button className="w-full mt-2 px-4 py-2 text-blue-600 hover:text-blue-700 text-sm">
                  Set as Default
                </button>
              )}
            </div>
          ))}

          {/* Add New Address Card */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add New Address</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add a new shipping or billing address to your account
            </p>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </button>
          </div>
        </div>

        {/* Address Tips */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Address Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Shipping Addresses</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>- Ensure accurate postal codes for faster delivery</li>
                <li>- Include apartment or unit numbers</li>
                <li>- Provide a phone number for delivery coordination</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Installation Addresses</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>- Verify access requirements for large items</li>
                <li>- Include special delivery instructions</li>
                <li>- Ensure someone is available during delivery window</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
