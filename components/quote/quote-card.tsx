"use client"

import * as React from "react"
import { Calendar, Mail, Phone, User, FileText, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface QuoteCardProps {
  quoteNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  status: "submitted" | "processing" | "completed" | "cancelled"
  createdAt: Date | string
  projectDescription?: string
  estimatedTotal?: number
  validUntil?: Date | string
  onViewDetails?: () => void
  className?: string
}

const statusColors = {
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  submitted: "Submitted",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
}

export function QuoteCard({
  quoteNumber,
  customerName,
  customerEmail,
  customerPhone,
  status,
  createdAt,
  projectDescription,
  estimatedTotal,
  validUntil,
  onViewDetails,
  className,
}: QuoteCardProps) {
  const formattedDate = React.useMemo(() => {
    const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }, [createdAt])

  const formattedValidUntil = React.useMemo(() => {
    if (!validUntil) return null
    const date = typeof validUntil === "string" ? new Date(validUntil) : validUntil
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }, [validUntil])

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              Quote #{quoteNumber}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge
            className={cn(
              "ml-2",
              statusColors[status]
            )}
          >
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${customerEmail}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {customerEmail}
            </a>
          </div>
          {customerPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${customerPhone}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {customerPhone}
              </a>
            </div>
          )}
        </div>

        {projectDescription && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Project Details
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {projectDescription}
              </p>
            </div>
          </>
        )}

        {(estimatedTotal !== undefined || formattedValidUntil) && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              {estimatedTotal !== undefined && (
                <div>
                  <span className="text-muted-foreground">Estimated Total:</span>
                  <span className="ml-2 font-semibold text-lg">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
              )}
              {formattedValidUntil && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Valid until {formattedValidUntil}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      {onViewDetails && (
        <CardFooter className="pt-0">
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="w-full"
          >
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
