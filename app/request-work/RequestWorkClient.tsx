"use client"
import Script from "next/script"
import { useEffect, useState } from "react"

export default function RequestWorkClient() {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css"
    link.media = "screen"
    document.head.appendChild(link)

    const checkJobberForm = setTimeout(() => {
      const jobberContainer = document.getElementById("83a3d24e-c18d-441c-80d1-d85419ea28ae")
      if (jobberContainer && jobberContainer.children.length === 0) {
        console.log("[v0] Jobber form container is empty, script may have failed")
        setScriptError(true)
      }
    }, 5000)

    return () => {
      clearTimeout(checkJobberForm)
      const existingLink = document.querySelector(
        'link[href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css"]',
      )
      if (existingLink) {
        document.head.removeChild(existingLink)
      }
    }
  }, [])

  const handleScriptLoad = () => {
    console.log("[v0] Jobber script loaded successfully")
    setScriptLoaded(true)
    setScriptError(false)
  }

  const handleScriptError = () => {
    console.log("[v0] Jobber script failed to load")
    setScriptError(true)
    setScriptLoaded(false)
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Request Your Free Consultation</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Transform your Ottawa home with premium Renin closet doors
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free Ottawa Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Transparent Canadian Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell Us About Your Project</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and we'll provide you with a detailed quote within 24 hours. Our Ottawa team
                will handle everything from design to installation.
              </p>
            </div>

            {/* Jobber embed container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div id="83a3d24e-c18d-441c-80d1-d85419ea28ae">
                {!scriptLoaded && !scriptError && (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="text-gray-500 text-lg">Loading work request form...</div>
                    </div>
                  </div>
                )}
                {scriptError && (
                  <div className="py-16 text-center">
                    <div className="text-gray-600 mb-6 text-lg">
                      Unable to load the work request form. Please contact us directly:
                    </div>
                    <div className="space-y-4">
                      <a
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                        href="mailto:spencer@peoplesgrp.com?subject=Closet Door Installation Request"
                      >
                        Email spencer@peoplesgrp.com
                      </a>
                      <div className="text-gray-500">Or call us to discuss your project directly</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose PG Closets Ottawa?</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Official Renin Dealer</h4>
                <p className="text-gray-600">
                  Authorized dealer with access to the complete Renin product line and warranty support.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Local Ottawa Team</h4>
                <p className="text-gray-600">
                  Licensed and insured installers serving Ottawa, Kanata, Nepean, Orleans, and Barrhaven.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Installation</h4>
                <p className="text-gray-600">
                  Professional installation within 2 weeks of order confirmation with lifetime warranty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Serving the Greater Ottawa Area</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["Ottawa", "Kanata", "Nepean", "Orleans", "Barrhaven"].map((city) => (
                <div key={city} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="text-lg font-semibold text-gray-900">{city}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-gray-600">
              Free consultation within 30km of Ottawa • Same-day quotes available
            </div>
          </div>
        </section>
      </main>

      <Script
        src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      <Script id="jobber-config" strategy="afterInteractive">
        {`
          window.jobberConfig = {
            clienthub_id: "83a3d24e-c18d-441c-80d1-d85419ea28ae",
            form_url: "https://clienthub.getjobber.com/client_hubs/83a3d24e-c18d-441c-80d1-d85419ea28ae/public/work_request/embedded_work_request_form"
          };
        `}
      </Script>
    </>
  )
}
