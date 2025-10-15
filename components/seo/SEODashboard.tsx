"use client"

/**
 * SEO AGENT #7: Real-time SEO Health Dashboard
 * Monitors on-page SEO factors and provides instant feedback
 * Only visible in development mode
 */

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface SEOMetrics {
  metaTagsComplete: boolean
  schemaValid: boolean
  canonicalPresent: boolean
  hreflangPresent: boolean
  imageAltTags: number
  totalImages: number
  internalLinks: number
  externalLinks: number
  h1Count: number
  h2Count: number
  titleLength: number
  descriptionLength: number
  keywords: string[]
  openGraphPresent: boolean
  twitterCardPresent: boolean
}

export function SEODashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [score, setScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    // Only show in development
    setIsDev(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost')

    if (!isDev) return

    // Analyze current page SEO
    const analyze = () => {
      const title = document.title
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''

      const totalImages = document.querySelectorAll('img').length
      const imagesWithAlt = document.querySelectorAll('img[alt]').length

      const meta: SEOMetrics = {
        metaTagsComplete: !!description,
        schemaValid: document.querySelectorAll('script[type="application/ld+json"]').length > 0,
        canonicalPresent: !!document.querySelector('link[rel="canonical"]'),
        hreflangPresent: !!document.querySelector('link[rel="alternate"][hreflang]'),
        imageAltTags: imagesWithAlt,
        totalImages: totalImages,
        internalLinks: document.querySelectorAll('a[href^="/"]').length,
        externalLinks: document.querySelectorAll('a[href^="http"]').length,
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        titleLength: title.length,
        descriptionLength: description.length,
        keywords: keywords.split(',').filter(Boolean),
        openGraphPresent: !!document.querySelector('meta[property^="og:"]'),
        twitterCardPresent: !!document.querySelector('meta[name^="twitter:"]')
      }

      setMetrics(meta)

      // Calculate SEO score (out of 100)
      let points = 0
      const checks = [
        { condition: meta.metaTagsComplete, points: 10, label: "Meta description" },
        { condition: meta.schemaValid, points: 15, label: "Schema.org markup" },
        { condition: meta.canonicalPresent, points: 10, label: "Canonical URL" },
        { condition: meta.hreflangPresent, points: 5, label: "Hreflang" },
        { condition: meta.h1Count === 1, points: 10, label: "Single H1" },
        { condition: meta.h2Count >= 3 && meta.h2Count <= 6, points: 5, label: "H2 structure" },
        { condition: meta.titleLength >= 30 && meta.titleLength <= 60, points: 10, label: "Title length" },
        { condition: meta.descriptionLength >= 120 && meta.descriptionLength <= 160, points: 10, label: "Description length" },
        { condition: meta.keywords.length >= 5, points: 5, label: "Keywords" },
        { condition: meta.internalLinks >= 5, points: 5, label: "Internal links" },
        { condition: meta.imageAltTags === meta.totalImages && meta.totalImages > 0, points: 10, label: "Image alt tags" },
        { condition: meta.openGraphPresent, points: 5, label: "OpenGraph" },
        { condition: meta.twitterCardPresent, points: 5, label: "Twitter Card" }
      ]

      checks.forEach(check => {
        if (check.condition) points += check.points
      })

      setScore(Math.min(points, 100))
    }

    // Initial analysis
    analyze()

    // Re-analyze on DOM changes
    const observer = new MutationObserver(analyze)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [isDev])

  if (!isDev || !metrics) return null

  return (
    <>
      {/* Toggle Button */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
        >
          SEO Score: {score}/100
        </button>
      )}

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-w-md w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">SEO Health Dashboard</h3>
              <p className="text-sm text-blue-100">Real-time on-page analysis</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Score Display */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Overall Score</span>
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getScoreGradient(score)} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {getScoreLabel(score)}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="p-4 space-y-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Core Metrics</div>

            <SEOMetric
              label="Meta Description"
              value={metrics.metaTagsComplete}
              detail={`${metrics.descriptionLength} chars`}
              ideal="120-160 chars"
            />

            <SEOMetric
              label="Schema.org Markup"
              value={metrics.schemaValid}
              detail={`${document.querySelectorAll('script[type="application/ld+json"]').length} schemas`}
              ideal="3+ schemas"
            />

            <SEOMetric
              label="Canonical URL"
              value={metrics.canonicalPresent}
            />

            <SEOMetric
              label="Hreflang Tags"
              value={metrics.hreflangPresent}
            />

            <SEOMetric
              label="H1 Tags"
              value={metrics.h1Count === 1}
              detail={`${metrics.h1Count} found`}
              ideal="Exactly 1"
            />

            <SEOMetric
              label="H2 Structure"
              value={metrics.h2Count >= 3 && metrics.h2Count <= 6}
              detail={`${metrics.h2Count} found`}
              ideal="3-6 H2s"
            />

            <SEOMetric
              label="Title Length"
              value={metrics.titleLength >= 30 && metrics.titleLength <= 60}
              detail={`${metrics.titleLength} chars`}
              ideal="30-60 chars"
            />

            <SEOMetric
              label="Keywords"
              value={metrics.keywords.length >= 5}
              detail={`${metrics.keywords.length} keywords`}
              ideal="5-10 keywords"
            />

            <SEOMetric
              label="Internal Links"
              value={metrics.internalLinks >= 5}
              detail={`${metrics.internalLinks} links`}
              ideal="5+ links"
            />

            <SEOMetric
              label="Image Alt Tags"
              value={metrics.imageAltTags === metrics.totalImages && metrics.totalImages > 0}
              detail={`${metrics.imageAltTags}/${metrics.totalImages}`}
              ideal="100% coverage"
            />

            <SEOMetric
              label="OpenGraph Tags"
              value={metrics.openGraphPresent}
            />

            <SEOMetric
              label="Twitter Card"
              value={metrics.twitterCardPresent}
            />
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t rounded-b-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <p>Last analyzed: {new Date().toLocaleTimeString()}</p>
              <p>Page: {window.location.pathname}</p>
              <p className="text-blue-600 font-medium mt-2">
                💡 This dashboard is only visible in development mode
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SEOMetric({
  label,
  value,
  detail,
  ideal
}: {
  label: string
  value: boolean
  detail?: string
  ideal?: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50 px-2 rounded transition-colors">
      <div className="flex-1">
        <span className="text-sm text-gray-700 font-medium">{label}</span>
        {detail && (
          <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
        )}
        {ideal && (
          <div className="text-xs text-blue-500 mt-0.5">Ideal: {ideal}</div>
        )}
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        value ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {value ? (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

function getScoreGradient(score: number): string {
  if (score >= 90) return 'bg-gradient-to-r from-green-500 to-green-600'
  if (score >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  return 'bg-gradient-to-r from-red-500 to-red-600'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent! Your page is well-optimized for search engines.'
  if (score >= 70) return 'Good! A few improvements will boost your rankings.'
  if (score >= 50) return 'Fair. Several optimizations needed for better visibility.'
  return 'Needs work. Critical SEO factors are missing.'
}
