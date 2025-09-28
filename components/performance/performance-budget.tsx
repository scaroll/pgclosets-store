"use client"

import { useEffect, useState } from "react"

interface BudgetMetric {
  name: string
  current: number
  budget: number
  unit: string
  status: 'good' | 'warning' | 'over-budget'
}

interface PerformanceBudgetProps {
  showInDev?: boolean
}

const PERFORMANCE_BUDGETS = {
  // Core Web Vitals Budgets
  lcp: { budget: 2500, unit: 'ms' }, // Largest Contentful Paint
  cls: { budget: 0.1, unit: 'score' }, // Cumulative Layout Shift
  inp: { budget: 200, unit: 'ms' }, // Interaction to Next Paint
  fcp: { budget: 1800, unit: 'ms' }, // First Contentful Paint
  ttfb: { budget: 800, unit: 'ms' }, // Time to First Byte

  // Resource Budgets
  totalJSSize: { budget: 350, unit: 'kB' }, // Total JavaScript
  mainThreadBlocking: { budget: 150, unit: 'ms' }, // Main thread blocking time
  imageTransferSize: { budget: 1000, unit: 'kB' }, // Images transfer size
  domSize: { budget: 1500, unit: 'nodes' }, // DOM nodes count

  // Loading Performance
  pageLoadTime: { budget: 3000, unit: 'ms' }, // Total page load time
  timeToInteractive: { budget: 3800, unit: 'ms' }, // Time to Interactive
  speedIndex: { budget: 3400, unit: 'ms' }, // Speed Index

  // Third-party Scripts
  thirdPartyTransferSize: { budget: 150, unit: 'kB' }, // Third-party scripts
} as const

function getBudgetStatus(current: number, budget: number): 'good' | 'warning' | 'over-budget' {
  if (current <= budget * 0.8) return 'good'
  if (current <= budget) return 'warning'
  return 'over-budget'
}

function formatValue(value: number, unit: string): string {
  if (unit === 'kB') {
    return `${(value / 1024).toFixed(1)} ${unit}`
  }
  if (unit === 'score') {
    return value.toFixed(3)
  }
  return `${Math.round(value)} ${unit}`
}

export default function PerformanceBudget({ showInDev = false }: PerformanceBudgetProps) {
  const [metrics, setMetrics] = useState<BudgetMetric[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only show in development unless explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !showInDev) return

    const updateMetrics = () => {
      const updatedMetrics: BudgetMetric[] = []

      // Check navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        const ttfb = navigation.responseStart - navigation.fetchStart
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0

        updatedMetrics.push(
          {
            name: 'Page Load Time',
            current: pageLoadTime,
            budget: PERFORMANCE_BUDGETS.pageLoadTime.budget,
            unit: PERFORMANCE_BUDGETS.pageLoadTime.unit,
            status: getBudgetStatus(pageLoadTime, PERFORMANCE_BUDGETS.pageLoadTime.budget)
          },
          {
            name: 'TTFB',
            current: ttfb,
            budget: PERFORMANCE_BUDGETS.ttfb.budget,
            unit: PERFORMANCE_BUDGETS.ttfb.unit,
            status: getBudgetStatus(ttfb, PERFORMANCE_BUDGETS.ttfb.budget)
          }
        )

        if (fcp > 0) {
          updatedMetrics.push({
            name: 'FCP',
            current: fcp,
            budget: PERFORMANCE_BUDGETS.fcp.budget,
            unit: PERFORMANCE_BUDGETS.fcp.unit,
            status: getBudgetStatus(fcp, PERFORMANCE_BUDGETS.fcp.budget)
          })
        }
      }

      // Check resource sizes
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      let totalJSSize = 0
      let totalImageSize = 0
      let thirdPartySize = 0

      resources.forEach(resource => {
        const transferSize = resource.transferSize || 0
        const isThirdParty = !resource.name.includes(window.location.hostname)

        if (isThirdParty) {
          thirdPartySize += transferSize
        }

        if (resource.name.includes('.js')) {
          totalJSSize += transferSize
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)) {
          totalImageSize += transferSize
        }
      })

      updatedMetrics.push(
        {
          name: 'Total JS Size',
          current: totalJSSize,
          budget: PERFORMANCE_BUDGETS.totalJSSize.budget * 1024,
          unit: PERFORMANCE_BUDGETS.totalJSSize.unit,
          status: getBudgetStatus(totalJSSize, PERFORMANCE_BUDGETS.totalJSSize.budget * 1024)
        },
        {
          name: 'Image Transfer Size',
          current: totalImageSize,
          budget: PERFORMANCE_BUDGETS.imageTransferSize.budget * 1024,
          unit: PERFORMANCE_BUDGETS.imageTransferSize.unit,
          status: getBudgetStatus(totalImageSize, PERFORMANCE_BUDGETS.imageTransferSize.budget * 1024)
        },
        {
          name: 'Third-party Size',
          current: thirdPartySize,
          budget: PERFORMANCE_BUDGETS.thirdPartyTransferSize.budget * 1024,
          unit: PERFORMANCE_BUDGETS.thirdPartyTransferSize.unit,
          status: getBudgetStatus(thirdPartySize, PERFORMANCE_BUDGETS.thirdPartyTransferSize.budget * 1024)
        }
      )

      // Check DOM size
      const domSize = document.querySelectorAll('*').length
      updatedMetrics.push({
        name: 'DOM Size',
        current: domSize,
        budget: PERFORMANCE_BUDGETS.domSize.budget,
        unit: PERFORMANCE_BUDGETS.domSize.unit,
        status: getBudgetStatus(domSize, PERFORMANCE_BUDGETS.domSize.budget)
      })

      setMetrics(updatedMetrics)
    }

    // Update metrics after page load
    setTimeout(updateMetrics, 2000)

    // Listen for performance entries
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(() => updateMetrics())
      try {
        observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] })
      } catch (e) {
        console.warn('Performance observer not supported for some entry types')
      }

      return () => observer.disconnect()
    }
  }, [showInDev])

  const overBudgetCount = metrics.filter(m => m.status === 'over-budget').length
  const warningCount = metrics.filter(m => m.status === 'warning').length

  if (metrics.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`
          mb-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${overBudgetCount > 0
            ? 'bg-red-500 text-white'
            : warningCount > 0
            ? 'bg-yellow-500 text-white'
            : 'bg-green-500 text-white'
          }
          hover:scale-105 shadow-lg
        `}
        title="Performance Budget Monitor"
      >
        📊 {overBudgetCount > 0 ? `${overBudgetCount} Over` : warningCount > 0 ? `${warningCount} Warning` : 'All Good'}
      </button>

      {/* Budget Panel */}
      {isVisible && (
        <div className="bg-white rounded-lg shadow-2xl border p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Performance Budget</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{metric.name}</span>
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${metric.status === 'good' ? 'bg-green-100 text-green-800' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {metric.status === 'good' ? '✓' :
                     metric.status === 'warning' ? '⚠' : '✗'}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>
                    {formatValue(metric.current, metric.unit)} / {formatValue(metric.budget, metric.unit)}
                  </span>
                  <span>
                    {Math.round((metric.current / metric.budget) * 100)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`
                      h-1.5 rounded-full transition-all duration-300
                      ${metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'}
                    `}
                    style={{
                      width: `${Math.min((metric.current / metric.budget) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Total Metrics: {metrics.length}</span>
              <span>Good: {metrics.filter(m => m.status === 'good').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for programmatic budget checking
export function usePerformanceBudget() {
  const [budgetStatus, setBudgetStatus] = useState<{
    isOverBudget: boolean
    warnings: string[]
    violations: string[]
  }>({
    isOverBudget: false,
    warnings: [],
    violations: []
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkBudgets = () => {
      const warnings: string[] = []
      const violations: string[] = []

      // Check Core Web Vitals against budgets
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart
        if (ttfb > PERFORMANCE_BUDGETS.ttfb.budget) {
          violations.push(`TTFB: ${Math.round(ttfb)}ms exceeds ${PERFORMANCE_BUDGETS.ttfb.budget}ms`)
        } else if (ttfb > PERFORMANCE_BUDGETS.ttfb.budget * 0.8) {
          warnings.push(`TTFB: ${Math.round(ttfb)}ms approaching budget`)
        }
      }

      // Check DOM size
      const domSize = document.querySelectorAll('*').length
      if (domSize > PERFORMANCE_BUDGETS.domSize.budget) {
        violations.push(`DOM size: ${domSize} nodes exceeds ${PERFORMANCE_BUDGETS.domSize.budget}`)
      } else if (domSize > PERFORMANCE_BUDGETS.domSize.budget * 0.8) {
        warnings.push(`DOM size: ${domSize} nodes approaching budget`)
      }

      setBudgetStatus({
        isOverBudget: violations.length > 0,
        warnings,
        violations
      })
    }

    setTimeout(checkBudgets, 2000)
  }, [])

  return budgetStatus
}