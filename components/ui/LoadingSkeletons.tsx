'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
        'animate-shimmer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('rounded-lg border p-4 space-y-3', className)}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 px-4 max-w-4xl">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-48" />
        </div>
        <div className="grid grid-cols-4 gap-8 mt-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const NavigationSkeleton: React.FC = () => {
  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex space-x-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  )
}

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4
}) => {
  return (
    <div className="w-full">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {/* Header */}
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 mb-4" />
        ))}
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={`${rowIndex}-${colIndex}`} className="h-6 mb-2" />
          ))
        )}
      </div>
    </div>
  )
}

export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSkeleton />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </main>
    </div>
  )
}

// Advanced skeleton with content-aware sizing
export const SmartSkeleton: React.FC<{
  lines?: number
  paragraph?: boolean
  className?: string
}> = ({ lines = 1, paragraph = false, className }) => {
  const lineWidths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3', 'w-1/2']

  if (paragraph) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-4',
              lineWidths[i % lineWidths.length],
              i === lines - 1 && lines > 1 ? 'w-1/2' : ''
            )}
          />
        ))}
      </div>
    )
  }

  return <Skeleton className={cn('h-4 w-full', className)} />
}

// Skeleton with fade-in animation
export const FadingSkeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div className={cn(
      'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
      'bg-[length:200%_100%] animate-shimmer opacity-60',
      'transition-opacity duration-1000 ease-in-out',
      className
    )}>
      {children}
    </div>
  )
}

export default {
  Skeleton,
  CardSkeleton,
  ProductGridSkeleton,
  HeroSkeleton,
  NavigationSkeleton,
  TableSkeleton,
  FormSkeleton,
  PageSkeleton,
  SmartSkeleton,
  FadingSkeleton,
}