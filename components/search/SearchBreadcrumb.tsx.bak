"use client"

import Link from "next/link"

interface SearchBreadcrumbProps {
  searchQuery: string
  resultsCount: number
}

export function SearchBreadcrumb({ searchQuery, resultsCount }: SearchBreadcrumbProps) {
  return (
    <div className="bg-muted/30 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">
            Search {searchQuery && `"${searchQuery}"`} ({resultsCount} results)
          </span>
        </div>
      </div>
    </div>
  )
}