'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MoreHorizontal,
  Send,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Edit,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface QuoteStatusActionsProps {
  quote: {
    id: string
    status: string
    quoteNumber: string
  }
}

const STATUS_TRANSITIONS: Record<string, { label: string; next: string; icon: any }[]> = {
  SUBMITTED: [
    { label: 'Start Review', next: 'UNDER_REVIEW', icon: Edit },
  ],
  UNDER_REVIEW: [
    { label: 'Schedule Measurement', next: 'MEASUREMENT_SCHEDULED', icon: Calendar },
    { label: 'Send Quote', next: 'QUOTED', icon: Send },
  ],
  MEASUREMENT_SCHEDULED: [
    { label: 'Mark Measured', next: 'MEASUREMENT_COMPLETED', icon: CheckCircle },
  ],
  MEASUREMENT_COMPLETED: [
    { label: 'Send Formal Quote', next: 'QUOTED', icon: FileText },
  ],
  QUOTED: [
    { label: 'Mark Approved', next: 'APPROVED', icon: CheckCircle },
    { label: 'Revision Requested', next: 'REVISION_REQUESTED', icon: Edit },
  ],
  REVISION_REQUESTED: [
    { label: 'Send Updated Quote', next: 'QUOTED', icon: Send },
  ],
  APPROVED: [
    { label: 'Record Deposit', next: 'DEPOSIT_PAID', icon: DollarSign },
  ],
  DEPOSIT_PAID: [
    { label: 'Start Production', next: 'IN_PRODUCTION', icon: CheckCircle },
  ],
  IN_PRODUCTION: [
    { label: 'Ready for Install', next: 'READY_FOR_INSTALL', icon: CheckCircle },
  ],
  READY_FOR_INSTALL: [
    { label: 'Schedule Installation', next: 'INSTALLATION_SCHEDULED', icon: Calendar },
  ],
  INSTALLATION_SCHEDULED: [
    { label: 'Mark Installed', next: 'INSTALLED', icon: CheckCircle },
  ],
  INSTALLED: [
    { label: 'Complete Order', next: 'COMPLETED', icon: CheckCircle },
  ],
}

export function QuoteStatusActions({ quote }: QuoteStatusActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{ label: string; next: string } | null>(null)
  const [reason, setReason] = useState('')

  const availableActions = STATUS_TRANSITIONS[quote.status] || []

  const handleStatusChange = async () => {
    if (!selectedAction) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedAction.next,
          reason: reason || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      router.refresh()
      setShowDialog(false)
      setReason('')
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this quote?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/quotes/${quote.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to cancel quote')
      }

      router.refresh()
    } catch (error) {
      console.error('Error cancelling quote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (quote.status === 'COMPLETED' || quote.status === 'CANCELLED') {
    return null
  }

  return (
    <>
      <div className="flex gap-2">
        {availableActions.slice(0, 1).map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.next}
              onClick={() => {
                setSelectedAction(action)
                setShowDialog(true)
              }}
            >
              <Icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {availableActions.slice(1).map((action) => {
              const Icon = action.icon
              return (
                <DropdownMenuItem
                  key={action.next}
                  onClick={() => {
                    setSelectedAction(action)
                    setShowDialog(true)
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              )
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Generate PDF
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={handleCancel}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Quote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAction?.label}</DialogTitle>
            <DialogDescription>
              Update quote {quote.quoteNumber} to &quot;{selectedAction?.next.replace(/_/g, ' ')}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reason">Notes (optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add any notes about this status change..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
