export const metadata = {
  title: "Request Quote | Premium Closet Doors | PG Closets Ottawa",
  description:
    "Request a personalized quote for premium Renin closet doors. Professional installation available. Free consultation in Ottawa area.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function CheckoutPage() {
  return (
    <main className="section-apple">
      <div className="container-apple">
        <div className="mb-8 text-center">
          <h1 className="text-h1 mb-4">Request Your Quote</h1>
          <p className="text-body-l text-pg-gray max-w-2xl mx-auto">
            Get a personalized quote for your premium closet door project. Our team will provide detailed pricing and
            installation options.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-h2 mb-6">Why Choose Our Quote System?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pg-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-h3 mb-2">Accurate Pricing</h3>
                <p className="text-body text-pg-gray">
                  Custom quotes based on your specific measurements and requirements
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pg-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-2-4h4m-4 0l-3-3m3 3l-3 3"
                    />
                  </svg>
                </div>
                <h3 className="text-h3 mb-2">Professional Service</h3>
                <p className="text-body text-pg-gray">Expert consultation and installation services included</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pg-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-h3 mb-2">Quick Response</h3>
                <p className="text-body text-pg-gray">Receive your detailed quote within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://clienthub.getjobber.com/client_hubs/0193e7c8-2c4b-7a8b-b0c1-4c5e6f7a8b9c/public/request_forms/0193e7c8-2c4b-7a8b-b0c1-4c5e6f7a8b9d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-pg-blue text-white rounded-xl hover:bg-pg-blue/90 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Request Your Quote Now
            </a>
            <p className="text-sm text-pg-gray mt-4">Free consultation • No obligation • Instant response</p>
          </div>
        </div>
      </div>
    </main>
  )
}
