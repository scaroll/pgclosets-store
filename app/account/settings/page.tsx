// Removed shadcn import - using native HTML
import { Settings, Bell, Shield, Globe, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-500">Manage your account preferences and security settings</p>
        </div>

        <div className="space-y-8">
          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Notifications
            </h2>
            <p className="text-gray-500 text-sm mb-6">Choose how you want to be notified</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive order updates and promotions via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Get text messages for important order updates</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive newsletters and promotional offers</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Privacy & Security
            </h2>
            <p className="text-gray-500 text-sm mb-6">Control your privacy and security preferences</p>
            <div className="space-y-4">
              <div>
                <label className="font-medium block mb-2">Change Password</label>
                <div className="space-y-3">
                  <input type="password" placeholder="Current password" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  <input type="password" placeholder="New password" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Update Password
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Preferences
            </h2>
            <p className="text-gray-500 text-sm mb-6">Customize your experience</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium block mb-2">Language</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="font-medium block mb-2">Currency</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <option value="cad">CAD ($)</option>
                  <option value="usd">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Account Management
            </h2>
            <p className="text-gray-500 text-sm mb-6">Manage your account data and preferences</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Download Account Data</p>
                  <p className="text-sm text-gray-500">Download a copy of all your account data</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                  Download Data
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-red-700">Delete Account</p>
                  <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
