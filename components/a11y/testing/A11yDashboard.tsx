'use client'

import React, { useEffect, useState } from 'react'
import { auditAccessibility, type AccessibilityIssue } from '@/lib/accessibility/a11y-utils'
import { cn } from '@/lib/utils'

/**
 * Accessibility Testing Dashboard
 * Real-time accessibility monitoring and validation
 */

interface A11yStats {
  totalIssues: number
  errors: number
  warnings: number
  info: number
  wcagA: number
  wcagAA: number
  wcagAAA: number
}

export function A11yDashboard() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [stats, setStats] = useState<A11yStats>({
    totalIssues: 0,
    errors: 0,
    warnings: 0,
    info: 0,
    wcagA: 0,
    wcagAA: 0,
    wcagAAA: 0
  })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    // Run audit on component mount and whenever DOM changes
    const runAudit = () => {
      const auditResults = auditAccessibility()
      setIssues(auditResults)

      // Calculate stats
      const newStats: A11yStats = {
        totalIssues: auditResults.length,
        errors: auditResults.filter((i) => i.type === 'error').length,
        warnings: auditResults.filter((i) => i.type === 'warning').length,
        info: auditResults.filter((i) => i.type === 'info').length,
        wcagA: auditResults.filter((i) => i.wcagLevel === 'A').length,
        wcagAA: auditResults.filter((i) => i.wcagLevel === 'AA').length,
        wcagAAA: auditResults.filter((i) => i.wcagLevel === 'AAA').length
      }
      setStats(newStats)
    }

    runAudit()

    // Re-run audit on DOM mutations
    const observer = new MutationObserver(() => {
      runAudit()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => observer.disconnect()
  }, [])

  // Group issues by category
  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = []
    }
    const category = acc[issue.category]
    if (category) {
      category.push(issue)
    }
    return acc
  }, {} as Record<string, AccessibilityIssue[]>)

  const filteredIssues = selectedCategory
    ? groupedIssues[selectedCategory] || []
    : issues

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 z-[9999]',
          'bg-primary text-primary-foreground',
          'rounded-full p-4 shadow-lg',
          'hover:bg-primary/90 transition-colors',
          'focus:outline-none focus:ring-4 focus:ring-ring',
          {
            'animate-pulse': stats.errors > 0
          }
        )}
        aria-label={`Accessibility Dashboard: ${stats.totalIssues} issues found`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        {stats.totalIssues > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'bg-destructive text-destructive-foreground',
              'rounded-full w-6 h-6',
              'flex items-center justify-center',
              'text-xs font-bold'
            )}
          >
            {stats.totalIssues}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end justify-end p-4">
      <div
        className="bg-background rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-dashboard-title"
      >
        {/* Header */}
        <div className="p-6 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="a11y-dashboard-title"
                className="text-2xl font-bold text-foreground"
              >
                Accessibility Dashboard
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time WCAG 2.1 compliance monitoring
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-md focus:outline-none focus:ring-4 focus:ring-ring"
              aria-label="Close accessibility dashboard"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatCard
              label="Total Issues"
              value={stats.totalIssues}
              color={stats.totalIssues === 0 ? 'green' : 'red'}
            />
            <StatCard label="Errors" value={stats.errors} color="red" />
            <StatCard label="Warnings" value={stats.warnings} color="yellow" />
            <StatCard label="Info" value={stats.info} color="blue" />
          </div>

          {/* WCAG Level Stats */}
          <div className="flex gap-4 mt-4">
            <WCAGBadge level="A" count={stats.wcagA} />
            <WCAGBadge level="AA" count={stats.wcagAA} />
            <WCAGBadge level="AAA" count={stats.wcagAAA} />
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b bg-muted/10">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All"
              count={issues.length}
              active={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            />
            {Object.entries(groupedIssues).map(([category, categoryIssues]) => (
              <FilterButton
                key={category}
                label={category}
                count={categoryIssues.length}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">
                No Issues Found
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedCategory
                  ? `No ${selectedCategory.toLowerCase()} issues detected`
                  : 'This page appears to be fully accessible!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue, index) => (
                <IssueCard key={index} issue={issue} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Automated accessibility testing powered by custom audit utilities.
            For comprehensive testing, use axe-core and manual screen reader
            testing.
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper Components

function StatCard({
  label,
  value,
  color
}: {
  label: string
  value: number
  color: 'red' | 'yellow' | 'blue' | 'green'
}) {
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
      <div
        className={cn('h-1 rounded-full mt-2', colorClasses[color])}
        style={{ width: `${Math.min((value / 10) * 100, 100)}%` }}
      />
    </div>
  )
}

function WCAGBadge({ level, count }: { level: 'A' | 'AA' | 'AAA'; count: number }) {
  return (
    <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
      <span className="text-xs font-semibold text-foreground">
        WCAG {level}
      </span>
      <span className="text-xs font-bold text-muted-foreground">{count}</span>
    </div>
  )
}

function FilterButton({
  label,
  count,
  active,
  onClick
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        {
          'bg-primary text-primary-foreground': active,
          'bg-muted text-muted-foreground hover:bg-muted/80': !active
        }
      )}
    >
      {label} ({count})
    </button>
  )
}

function IssueCard({ issue }: { issue: AccessibilityIssue }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const typeColors = {
    error: 'border-red-500 bg-red-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    info: 'border-blue-500 bg-blue-500/10'
  }

  const typeIcons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const handleFocusElement = () => {
    if (issue.element) {
      issue.element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      issue.element.focus()

      // Highlight element briefly
      const originalOutline = issue.element.style.outline
      issue.element.style.outline = '3px solid #ff0000'
      setTimeout(() => {
        issue.element!.style.outline = originalOutline
      }, 2000)
    }
  }

  return (
    <div
      className={cn(
        'border-l-4 rounded-lg p-4 cursor-pointer transition-all',
        typeColors[issue.type],
        { 'shadow-md': isExpanded }
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeIcons[issue.type]}</span>
            <span className="font-semibold text-foreground">{issue.category}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
              WCAG {issue.wcagLevel}
            </span>
          </div>
          <p className="text-sm text-foreground mt-2">{issue.message}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="p-1 hover:bg-muted rounded"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <svg
            className={cn('w-5 h-5 transition-transform', {
              'rotate-180': isExpanded
            })}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isExpanded && issue.element && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFocusElement()
            }}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Focus Element
          </button>
          <div className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
            {issue.element.outerHTML.substring(0, 200)}
            {issue.element.outerHTML.length > 200 ? '...' : ''}
          </div>
        </div>
      )}
    </div>
  )
}

export default A11yDashboard
