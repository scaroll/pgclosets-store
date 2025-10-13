import { z } from "zod";

// Common validation patterns
const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/; // Canadian postal code
const nameRegex = /^[a-zA-Z\s'-]+$/;

// Base schemas for reusability
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(320, "Email address too long")
  .toLowerCase()
  .trim();

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .regex(nameRegex, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .trim();

export const postalCodeSchema = z
  .string()
  .optional()
  .refine((val) => !val || postalCodeRegex.test(val), {
    message: "Invalid Canadian postal code format (e.g., K1A 0A6)",
  });

// Enhanced contact form schema
export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long")
    .trim(),
});

// Quote request schema
export const quoteRequestSchema = z.object({
  product: z.object({
    name: z
      .string()
      .min(1, "Product name is required")
      .max(200, "Product name too long")
      .trim(),
    category: z
      .string()
      .min(1, "Product category is required")
      .max(100, "Product category too long")
      .trim(),
    price: z
      .number()
      .min(0, "Price must be positive")
      .max(100000, "Price too large")
      .optional(),
    selectedOptions: z
      .record(z.string().max(200, "Option value too long"))
      .optional(),
  }),
  customer: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(20, "Phone number too long")
      .regex(/^[\d\s\-\(\)\+]+$/, "Phone number contains invalid characters")
      .trim()
      .optional(),
    province: z
      .string()
      .min(2, "Province is required")
      .max(3, "Invalid province code")
      .toUpperCase()
      .optional(),
  }),
  notes: z
    .string()
    .max(1000, "Notes too long")
    .trim()
    .optional(),
});

// File upload schema
export const fileUploadSchema = z.object({
  file: z.object({
    name: z
      .string()
      .min(1, "Filename is required")
      .max(255, "Filename too long")
      .refine((name) => !/[<>:"/\\|?*]/.test(name), {
        message: "Filename contains invalid characters",
      }),
    type: z
      .string()
      .refine((type) =>
        [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "application/pdf",
        ].includes(type),
        {
          message: "Invalid file type. Only JPEG, PNG, WebP, GIF, and PDF files are allowed",
        }
      ),
    size: z
      .number()
      .min(1, "File cannot be empty")
      .max(10 * 1024 * 1024, "File size cannot exceed 10MB"),
  }),
});

// Product schema for API endpoints
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name too long")
    .trim(),
  description: z
    .string()
    .max(2000, "Description too long")
    .trim()
    .optional(),
  price: z
    .number()
    .min(0, "Price must be positive")
    .max(100000, "Price too large"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category too long")
    .trim(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(10, "Too many images")
    .optional(),
  status: z
    .enum(["active", "inactive", "draft"])
    .default("draft"),
});

// User registration/profile schema
export const userProfileSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  address: z.object({
    street: z
      .string()
      .min(1, "Street address is required")
      .max(200, "Street address too long")
      .trim(),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City name too long")
      .trim(),
    province: z
      .string()
      .min(2, "Province is required")
      .max(3, "Invalid province code")
      .toUpperCase(),
    postalCode: postalCodeSchema.refine((val) => !!val, {
      message: "Postal code is required",
    }),
    country: z
      .string()
      .default("CA")
      .refine((val) => val === "CA", {
        message: "Currently only shipping within Canada",
      }),
  }).optional(),
});

// API key validation for admin endpoints
export const apiKeySchema = z
  .string()
  .min(32, "API key too short")
  .max(128, "API key too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid API key format");

// Pagination schema
export const paginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Page must be greater than 0")
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
    .default("10"),
  sort: z
    .enum(["name", "price", "category", "created_at", "updated_at"])
    .default("created_at"),
  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

// Search schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query too long")
    .trim(),
  category: z
    .string()
    .max(100, "Category too long")
    .trim()
    .optional(),
  minPrice: z
    .number()
    .min(0, "Minimum price must be positive")
    .optional(),
  maxPrice: z
    .number()
    .min(0, "Maximum price must be positive")
    .optional(),
}).refine((data) =>
  !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  {
    message: "Minimum price must be less than or equal to maximum price",
    path: ["minPrice"],
  }
);

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type MeasurementBookingData = z.infer<typeof measurementBookingSchema>;
export type AvailabilityCheckData = z.infer<typeof availabilityCheckSchema>;

// Ottawa postal code validation (K0A-K4Z)
const ottawaPostalCodeRegex = /^[Kk][0-4][A-Za-z][ -]?[0-9][A-Za-z][0-9]$/;

// Time slot validation (9 AM to 5 PM in hour increments)
const timeSlotRegex = /^(09|1[0-6]):00$/;

// Measurement booking schema
export const measurementBookingSchema = z.object({
  customer: z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(20, "Phone number too long")
      .regex(/^[\d\s\-\(\)\+]+$/, "Phone number contains invalid characters")
      .trim(),
  }),
  address: z.object({
    street: z
      .string()
      .min(1, "Street address is required")
      .max(200, "Street address too long")
      .trim(),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City name too long")
      .trim(),
    province: z
      .string()
      .min(2, "Province is required")
      .max(3, "Invalid province code")
      .toUpperCase()
      .refine((val) => val === "ON", {
        message: "We currently only provide measurement services in Ontario",
      }),
    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .regex(ottawaPostalCodeRegex, {
        message: "We currently only serve the Ottawa area (postal codes starting with K)",
      }),
  }),
  booking: z.object({
    preferredDate: z
      .string()
      .min(1, "Preferred date is required")
      .refine((date) => {
        const bookingDate = new Date(date);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90); // Max 90 days in advance

        return bookingDate >= tomorrow && bookingDate <= maxDate;
      }, {
        message: "Booking date must be between tomorrow and 90 days from today",
      }),
    preferredTime: z
      .string()
      .regex(timeSlotRegex, {
        message: "Please select a valid time slot between 9:00 AM and 4:00 PM",
      }),
    projectDescription: z
      .string()
      .min(10, "Please provide at least 10 characters describing your project")
      .max(1000, "Project description too long")
      .trim(),
    interestedProducts: z
      .array(z.string().min(1, "Product ID cannot be empty"))
      .min(1, "Please select at least one product you're interested in")
      .max(10, "Too many products selected"),
    urgency: z.enum(["low", "medium", "high"]).default("medium"),
    rooms: z
      .array(
        z.object({
          roomType: z
            .string()
            .min(1, "Room type is required")
            .max(50, "Room type too long"),
          dimensions: z
            .string()
            .max(100, "Dimensions description too long")
            .optional(),
          notes: z
            .string()
            .max(200, "Notes too long")
            .optional(),
        })
      )
      .min(1, "Please add at least one room")
      .max(5, "Too many rooms - contact us directly for larger projects"),
  }),
  notes: z
    .string()
    .max(500, "Notes too long")
    .trim()
    .optional(),
});

// Availability check schema
export const availabilityCheckSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => {
      const checkDate = new Date(date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 90);

      return checkDate >= tomorrow && checkDate <= maxDate;
    }, {
      message: "Date must be between tomorrow and 90 days from today",
    }),
});

// Schema registry for dynamic validation
export const schemaRegistry = {
  contact: contactFormSchema,
  quote: quoteRequestSchema,
  fileUpload: fileUploadSchema,
  product: productSchema,
  userProfile: userProfileSchema,
  pagination: paginationSchema,
  search: searchSchema,
  measurementBooking: measurementBookingSchema,
  availabilityCheck: availabilityCheckSchema,
} as const;

export type SchemaName = keyof typeof schemaRegistry;