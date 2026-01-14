'use client'

import { useEffect, useState } from 'react'
import { Activity, Wifi, Clock, Zap } from 'lucide-react'

interface WebVitals {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
}

interface PerformanceData {
  webVitals: WebVitals
  networkInfo: {
    effectiveType: string
    downlink: number
    rtt: number
  } | null
  memoryInfo: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null
  timestamp: number
}

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    webVitals: {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null
    },
    networkInfo: null,
    memoryInfo: null,
    timestamp: Date.now()
  })

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const updatePerformanceData = () => {
      const data: PerformanceData = {
        webVitals: (window as any).webVitals || {
          lcp: null,
          fid: null,
          cls: null,
          fcp: null,
          ttfb: null
        },
        networkInfo: null,
        memoryInfo: null,
        timestamp: Date.now()
      }

      // Network Information API
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        data.networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        }
      }

      // Memory Information API
      if ('memory' in performance) {
        const memory = (performance as any).memory
        data.memoryInfo = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        }
      }

      setPerformanceData(data)
    }

    // Initial update
    updatePerformanceData()

    // Update every 2 seconds
    const interval = setInterval(updatePerformanceData, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null
  }

  const getVitalStatus = (metric: string, value: number | null) => {
    if (value === null) return 'unknown'

    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
      case 'fcp':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
      case 'ttfb':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
      default:
        return 'unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50'
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50'
      case 'poor':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-strong border border-gray-200 p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-pg-navy" />
            <h3 className="text-sm font-semibold text-pg-navy">Performance Monitor</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Web Vitals */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Core Web Vitals</h4>

          {Object.entries(performanceData.webVitals).map(([metric, value]) => {
            const status = getVitalStatus(metric, value)
            const statusColor = getStatusColor(status)

            return (
              <div key={metric} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 uppercase">{metric}</span>
                <span className={`px-2 py-1 rounded ${statusColor}`}>
                  {value !== null ? `${Math.round(value)}${metric === 'cls' ? '' : 'ms'}` : 'N/A'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Network Info */}
        {performanceData.networkInfo && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Wifi className="w-3 h-3 mr-1" />
              Network
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-500">Type</div>
                <div className="font-medium">{performanceData.networkInfo.effectiveType}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Down</div>
                <div className="font-medium">{performanceData.networkInfo.downlink} Mbps</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">RTT</div>
                <div className="font-medium">{performanceData.networkInfo.rtt} ms</div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Info */}
        {performanceData.memoryInfo && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Memory
            </h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Used</span>
                <span className="font-medium">{formatBytes(performanceData.memoryInfo.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-medium">{formatBytes(performanceData.memoryInfo.totalJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Limit</span>
                <span className="font-medium">{formatBytes(performanceData.memoryInfo.jsHeapSizeLimit)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Updated: {new Date(performanceData.timestamp).toLocaleTimeString()}
            </span>
            <span>Ctrl+Shift+P to toggle</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor