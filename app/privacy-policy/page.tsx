// Removed shadcn import - using native HTML
import { Shield, Eye, Lock, Database } from "lucide-react"
import PgHeader from "@/components/PgHeader"
import PgFooter from "@/components/PgFooter"

export default function PrivacyPolicyPage() {
  return (
    <>
      <PgHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-800" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <p className="text-gray-600">
                    We collect information you provide directly to us, such as when you create an account, make a
                    purchase, or contact us for support. This may include your name, email address, phone number,
                    shipping address, and payment information.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Information</h4>
                  <p className="text-gray-600">
                    We automatically collect certain information about your use of our website, including your IP
                    address, browser type, pages visited, and the time and date of your visits.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                How We Use Your Information
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Process and fulfill your orders and provide customer service
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Send you important information about your orders and account
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Improve our website and services based on your feedback and usage patterns
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Send you marketing communications (with your consent)
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Comply with legal obligations and protect our rights
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Lock className="w-5 h-5 mr-2 text-blue-600" />
                Information Security
              </h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However, no method
                of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee
                absolute security.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Your Rights and Choices</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Access and update your personal information
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Request deletion of your personal information
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Opt out of marketing communications
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Request a copy of your personal information
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p className="text-sm">Email: privacy@pgclosets.com</p>
                <p className="text-sm">Phone: 1-800-PG-CLOSET</p>
                <p className="text-sm">Address: 123 Organization Way, Toronto, ON M5V 3A8</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PgFooter />
    </>
  )
}
