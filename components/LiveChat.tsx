"use client"

import { useState } from "react"

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-navy-900 text-white rounded-full shadow-lg hover:bg-navy-800 transition-all duration-200 flex items-center justify-center z-50"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Chat with PG Closets</h3>
            <p className="text-sm opacity-90">We're here to help with your closet needs</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg max-w-xs">
                <p className="text-sm text-navy-900">Hi! How can we help you with your closet project today?</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
              />
              <button className="bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
