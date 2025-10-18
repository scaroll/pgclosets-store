export interface QuoteItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  customizations?: {
    width?: number
    height?: number
    hardware?: string
    installation?: boolean
    notes?: string
  }
}

export interface QuoteRequest {
  id: string
  items: QuoteItem[]
  customerInfo: {
    name: string
    email: string
    phone: string
    address?: string
    city?: string
    postalCode?: string
  }
  projectDetails?: {
    projectType?: string
    timeline?: string
    budget?: string
    notes?: string
  }
  subtotal: number
  tax: number
  total: number
  status: "draft" | "submitted" | "reviewed" | "quoted" | "accepted" | "declined"
  createdAt: Date
  updatedAt: Date
}

export interface QuoteFormData {
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  postalCode?: string
  projectType?: string
  timeline?: string
  budget?: string
  notes?: string
}
