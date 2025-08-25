import Medusa from "@medusajs/js-sdk"

// Configure Medusa backend URL
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

// Initialize Medusa SDK
export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// Re-export types for convenience
export type { HttpTypes } from "@medusajs/types"