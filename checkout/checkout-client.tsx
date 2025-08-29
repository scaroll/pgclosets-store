"use client"

import { Button } from "@/components/ui/button"

export function CheckoutClient() {
  return (
    <div className="text-center py-12">
      <h2 className="text-h2 mb-4">Quote Request System</h2>
      <p className="text-body-l text-pg-gray mb-8 max-w-2xl mx-auto">
        We've transitioned to a personalized quote system to provide you with the most accurate pricing for your closet
        door project.
      </p>

      <div className="space-y-4">
        <a
          href="https://clienthub.getjobber.com/client_hubs/0193e7c8-2c4b-7a8b-b0c1-4c5e6f7a8b9c/public/request_forms/0193e7c8-2c4b-7a8b-b0c1-4c5e6f7a8b9d"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-pg-blue text-white rounded-xl hover:bg-pg-blue/90 transition-colors"
        >
          Request Quote
        </a>

        <div className="block">
          <Button href="/store" variant="secondary">
            Continue Browsing Products
          </Button>
        </div>
      </div>
    </div>
  )
}
