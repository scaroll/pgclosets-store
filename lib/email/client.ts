import { Resend } from 'resend'

// Only initialize if key exists, otherwise let it fail gracefully or throw explicit error when used
const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

if (!apiKey) {
  console.warn('⚠️ RESEND_API_KEY is missing. Email sending will be disabled.')
}
