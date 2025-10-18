import { z } from "zod"

export const quoteFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number (at least 10 digits).",
  }),
  address: z.string().min(5, {
    message: "Please enter your address.",
  }),
  projectType: z.string().min(1, {
    message: "Please select a project type.",
  }),
  roomDimensions: z.string().optional(),
  preferredDate: z.string().optional(),
  timeline: z.string().optional(),
  notes: z.string().optional(),
})

export type QuoteFormValues = z.infer<typeof quoteFormSchema>