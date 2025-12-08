/**
 * Quote System Types
 * Types for the quote-based sales system
 */

// Quote Status - matches Prisma enum
export type QuoteStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'MEASUREMENT_SCHEDULED'
  | 'MEASUREMENT_COMPLETED'
  | 'QUOTED'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'DEPOSIT_PAID'
  | 'IN_PRODUCTION'
  | 'READY_FOR_INSTALL'
  | 'INSTALLATION_SCHEDULED'
  | 'INSTALLED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED'

export type QuotePaymentType = 'DEPOSIT' | 'PROGRESS' | 'FINAL' | 'REFUND'
export type QuotePaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type QuoteAppointmentType = 'MEASUREMENT' | 'INSTALLATION' | 'FOLLOW_UP'
export type QuoteAppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

// Door types
export type DoorType = 'sliding' | 'bypass' | 'bifold' | 'barn' | 'pivot' | 'mirror'
export type OpeningType = 'closet' | 'room-divider' | 'pantry' | 'laundry' | 'other'

// Property Address
export interface PropertyAddress {
  line1: string
  line2?: string
  city: string
  province: string
  postalCode: string
  country: string
}

// Door Configuration for Quote Builder
export interface DoorConfiguration {
  id: string
  productId?: string
  series: string
  doorType: DoorType
  widthInches: number
  heightInches: number
  panelCount: number
  finish: string
  hardware: string
  handles: string
  softClose: boolean
  mirror: boolean
  customOptions?: Record<string, string>
  unitPrice: number
  quantity: number
  lineTotal: number
}

// Room/Opening Configuration
export interface RoomConfiguration {
  id: string
  roomName: string
  openingType: OpeningType
  doors: DoorConfiguration[]
  notes?: string
  photos: string[]
}

// Customer Info
export interface QuoteCustomerInfo {
  name: string
  email: string
  phone: string
  preferredContact?: 'email' | 'phone'
}

// Property Info
export interface QuotePropertyInfo {
  address: PropertyAddress
  propertyType?: 'house' | 'condo' | 'townhouse' | 'commercial' | 'other'
  notes?: string
}

// Quote Pricing
export interface QuotePricing {
  subtotal: number
  installationFee: number
  travelFee: number
  discount: number
  discountReason?: string
  taxRate: number
  tax: number
  total: number
  depositPercent: number
  depositAmount: number
}

// Quote Item (for useQuote store)
export interface QuoteItem {
  id: string
  productId?: string
  name: string
  image?: string
  price: number
  quantity: number
  customizations?: Record<string, string>
  roomName?: string
  configuration?: DoorConfiguration
}

// Full Quote Request (for submission)
export interface QuoteRequestData {
  customer: QuoteCustomerInfo
  property: QuotePropertyInfo
  configurations: RoomConfiguration[]
  notes?: string
  preferredMeasurementDate?: string
  preferredMeasurementTime?: string
}

// Quote (full database model representation)
export interface Quote {
  id: string
  quoteNumber: string
  status: QuoteStatus

  // Customer
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone: string

  // Property
  propertyAddress?: PropertyAddress
  propertyType?: string
  propertyNotes?: string

  // Configurations
  configurations: QuoteConfigDB[]

  // Pricing
  subtotal: number
  installationFee: number
  travelFee: number
  discount: number
  discountReason?: string
  taxRate: number
  tax: number
  total: number

  // Terms
  depositPercent: number
  depositAmount?: number
  paymentTerms?: string
  validUntil?: string

  // Assignment
  assignedRepId?: string
  assignedRep?: {
    id: string
    name: string
    email: string
  }

  // Documents
  formalQuotePdf?: string
  contractPdf?: string
  signedAt?: string

  // Relationships
  appointments?: QuoteAppointmentDB[]
  payments?: QuotePaymentDB[]
  messages?: QuoteMessageDB[]
  statusHistory?: QuoteStatusLogDB[]

  // Timestamps
  submittedAt?: string
  reviewedAt?: string
  quotedAt?: string
  approvedAt?: string
  completedAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

// Database model types
export interface QuoteConfigDB {
  id: string
  quoteId: string
  roomName: string
  openingType: string
  productId?: string
  series: string
  doorType: string
  widthInches: number
  heightInches: number
  panelCount: number
  finish: string
  hardware: string
  handles: string
  softClose: boolean
  mirror: boolean
  customOptions?: Record<string, string>
  unitPrice: number
  quantity: number
  lineTotal: number
  notes?: string
  photos: string[]
  createdAt: string
  updatedAt: string
}

export interface QuoteStatusLogDB {
  id: string
  quoteId: string
  fromStatus?: QuoteStatus
  toStatus: QuoteStatus
  changedById?: string
  changedBy?: {
    id: string
    name: string
  }
  reason?: string
  createdAt: string
}

export interface QuoteMessageDB {
  id: string
  quoteId: string
  senderId: string
  sender: {
    id: string
    name: string
    image?: string
  }
  message: string
  attachments: string[]
  isInternal: boolean
  readAt?: string
  createdAt: string
}

export interface QuotePaymentDB {
  id: string
  quoteId: string
  type: QuotePaymentType
  amount: number
  method: string
  status: QuotePaymentStatus
  stripePaymentId?: string
  invoiceNumber?: string
  invoicePdf?: string
  dueDate?: string
  paidAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface QuoteAppointmentDB {
  id: string
  quoteId: string
  type: QuoteAppointmentType
  status: QuoteAppointmentStatus
  scheduledDate: string
  scheduledTime: string
  duration: number
  assignedTechId?: string
  assignedTech?: {
    id: string
    name: string
    phone?: string
  }
  address: PropertyAddress
  notes?: string
  customerNotes?: string
  completedAt?: string
  completionNotes?: string
  photos: string[]
  signature?: string
  createdAt: string
  updatedAt: string
}

// API Response types
export interface QuoteListResponse {
  quotes: Quote[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface QuoteResponse {
  success: boolean
  quote?: Quote
  error?: string
}

export interface QuoteSubmitResponse {
  success: boolean
  quoteNumber?: string
  quoteId?: string
  message?: string
  error?: string
}

// Quote Builder State
export interface QuoteBuilderState {
  step: number
  rooms: RoomConfiguration[]
  customer: QuoteCustomerInfo | null
  property: QuotePropertyInfo | null
  notes: string
  preferredDate?: string
  preferredTime?: string
}

// Status display info
export interface QuoteStatusInfo {
  status: QuoteStatus
  label: string
  description: string
  color: string
  icon: string
  nextActions: string[]
}

// Status configuration
export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, QuoteStatusInfo> = {
  DRAFT: {
    status: 'DRAFT',
    label: 'Draft',
    description: 'Quote is being built',
    color: 'gray',
    icon: 'edit',
    nextActions: ['Continue editing', 'Submit for review']
  },
  SUBMITTED: {
    status: 'SUBMITTED',
    label: 'Submitted',
    description: 'Awaiting review from our team',
    color: 'blue',
    icon: 'send',
    nextActions: ['View details']
  },
  UNDER_REVIEW: {
    status: 'UNDER_REVIEW',
    label: 'Under Review',
    description: 'Our team is reviewing your request',
    color: 'yellow',
    icon: 'eye',
    nextActions: ['View details']
  },
  MEASUREMENT_SCHEDULED: {
    status: 'MEASUREMENT_SCHEDULED',
    label: 'Measurement Scheduled',
    description: 'A measurement appointment has been scheduled',
    color: 'purple',
    icon: 'calendar',
    nextActions: ['View appointment', 'Reschedule']
  },
  MEASUREMENT_COMPLETED: {
    status: 'MEASUREMENT_COMPLETED',
    label: 'Measurement Completed',
    description: 'Measurement has been taken, preparing formal quote',
    color: 'indigo',
    icon: 'check-circle',
    nextActions: ['View details']
  },
  QUOTED: {
    status: 'QUOTED',
    label: 'Quoted',
    description: 'Formal quote is ready for your review',
    color: 'green',
    icon: 'document',
    nextActions: ['Review quote', 'Request revision', 'Approve']
  },
  REVISION_REQUESTED: {
    status: 'REVISION_REQUESTED',
    label: 'Revision Requested',
    description: 'You requested changes to the quote',
    color: 'orange',
    icon: 'refresh',
    nextActions: ['View details']
  },
  APPROVED: {
    status: 'APPROVED',
    label: 'Approved',
    description: 'Quote approved, awaiting deposit payment',
    color: 'green',
    icon: 'thumb-up',
    nextActions: ['Pay deposit']
  },
  DEPOSIT_PAID: {
    status: 'DEPOSIT_PAID',
    label: 'Deposit Paid',
    description: 'Order confirmed, production will begin',
    color: 'teal',
    icon: 'currency-dollar',
    nextActions: ['View order status']
  },
  IN_PRODUCTION: {
    status: 'IN_PRODUCTION',
    label: 'In Production',
    description: 'Your doors are being manufactured',
    color: 'cyan',
    icon: 'cog',
    nextActions: ['View order status']
  },
  READY_FOR_INSTALL: {
    status: 'READY_FOR_INSTALL',
    label: 'Ready for Installation',
    description: 'Doors are ready, scheduling installation',
    color: 'lime',
    icon: 'truck',
    nextActions: ['Schedule installation']
  },
  INSTALLATION_SCHEDULED: {
    status: 'INSTALLATION_SCHEDULED',
    label: 'Installation Scheduled',
    description: 'Installation appointment confirmed',
    color: 'emerald',
    icon: 'calendar-check',
    nextActions: ['View appointment', 'Reschedule']
  },
  INSTALLED: {
    status: 'INSTALLED',
    label: 'Installed',
    description: 'Installation complete, final payment due',
    color: 'green',
    icon: 'home',
    nextActions: ['Pay balance', 'Leave review']
  },
  COMPLETED: {
    status: 'COMPLETED',
    label: 'Completed',
    description: 'Order complete! Thank you for choosing PG Closets',
    color: 'green',
    icon: 'badge-check',
    nextActions: ['Leave review', 'View invoice']
  },
  EXPIRED: {
    status: 'EXPIRED',
    label: 'Expired',
    description: 'This quote has expired',
    color: 'gray',
    icon: 'clock',
    nextActions: ['Request new quote']
  },
  CANCELLED: {
    status: 'CANCELLED',
    label: 'Cancelled',
    description: 'This quote was cancelled',
    color: 'red',
    icon: 'x-circle',
    nextActions: ['Request new quote']
  }
}

// Helper function to get status info
export function getQuoteStatusInfo(status: QuoteStatus): QuoteStatusInfo {
  return QUOTE_STATUS_CONFIG[status]
}

// Check if quote can be edited
export function canEditQuote(status: QuoteStatus): boolean {
  return status === 'DRAFT'
}

// Check if quote can be approved
export function canApproveQuote(status: QuoteStatus): boolean {
  return status === 'QUOTED'
}

// Check if deposit can be paid
export function canPayDeposit(status: QuoteStatus): boolean {
  return status === 'APPROVED'
}
