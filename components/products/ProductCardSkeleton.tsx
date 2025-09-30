"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card variant="elevated" spacing="none">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square rounded-t-xl rounded-b-none" />

      {/* Header Skeleton */}
      <CardHeader className="space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>

      {/* Content Skeleton */}
      <CardContent className="space-y-4">
        {/* Price Skeleton */}
        <Skeleton className="h-9 w-24" />

        {/* Buttons Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardContent>

      {/* Footer Skeleton */}
      <CardFooter className="flex-col items-start space-y-3 border-t pt-4">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between w-full gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-6 w-40 mx-auto" />
      </CardFooter>
    </Card>
  )
}