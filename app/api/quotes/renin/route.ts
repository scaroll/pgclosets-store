import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProtectedRoute, rateLimitConfigs } from "@/lib/validation/middleware";
import { z } from "zod";
import {
  OTTAWA_PRICING_CONFIG,
  FINANCING_OPTIONS,
  type ReninQuoteRequest,
  type ReninQuoteResponse,
  type QuoteCalculationResult,
  type QuoteCalculationInput,
  type PriceBreakdown,
  type FinancingTerm
} from "@/types/ottawa-pricing";

// Validation schema for Renin quote requests
const reninQuoteRequestSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Invalid Canadian postal code"),
    customerType: z.enum(["residential", "contractor", "senior"])
  }),
  products: z.array(z.object({
    productId: z.string().min(1),
    productName: z.string().min(1),
    productCategory: z.string().min(1),
    msrpPrice: z.number().min(0),
    width: z.number().min(12).max(120), // 12" to 120" width
    height: z.number().min(60).max(120), // 60" to 120" height
    quantity: z.number().min(1).max(50),
    includeInstallation: z.boolean(),
    customerType: z.enum(["residential", "contractor", "senior"]),
    postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Invalid Canadian postal code"),
    doorType: z.string().optional()
  })).min(1, "At least one product is required"),
  includeFinancing: z.boolean(),
  projectDetails: z.object({
    projectType: z.enum(["new-construction", "renovation", "replacement"]),
    timeline: z.enum(["immediate", "1-3months", "3-6months", "6plus-months"]),
    additionalNotes: z.string().max(1000).optional()
  }).optional(),
  preferredContactMethod: z.enum(["email", "phone", "both"]),
  hearAboutUs: z.string().max(100).optional()
});

// Ottawa pricing calculation functions
function calculateOttawaPricing(input: QuoteCalculationInput): QuoteCalculationResult {
  const config = OTTAWA_PRICING_CONFIG;

  // Base pricing calculations
  const basePrice = input.msrpPrice * input.quantity;
  const markedUpPrice = basePrice * (1 + config.baseMarkup);

  // Volume discount calculation
  const volumeDiscount = calculateVolumeDiscount(input.quantity, markedUpPrice);

  // Customer type discount
  const customerDiscount = calculateCustomerDiscount(input.customerType, markedUpPrice - volumeDiscount);

  // Subtotal after discounts
  const subtotal = markedUpPrice - volumeDiscount - customerDiscount;

  // Installation cost calculation
  const installationCost = input.includeInstallation ?
    calculateInstallationCost(input.doorType || 'standard', input.width, input.height, input.quantity) : 0;

  // Delivery fee calculation
  const deliveryFee = calculateDeliveryFee(input.postalCode, subtotal + installationCost);

  // Subtotal with services
  const subtotalWithServices = subtotal + installationCost + deliveryFee;

  // HST calculation
  const hst = subtotalWithServices * config.hstRate;

  // Final total
  const total = subtotalWithServices + hst;

  // Calculate savings
  const savings = volumeDiscount + customerDiscount +
    (deliveryFee === 0 ? getDeliveryZone(input.postalCode)?.deliveryFee || 0 : 0);

  // Create breakdown
  const breakdown: PriceBreakdown = {
    msrp: basePrice,
    markup: markedUpPrice - basePrice,
    volumeDiscount,
    customerDiscount,
    installation: installationCost,
    delivery: deliveryFee,
    hst,
    total
  };

  const result: QuoteCalculationResult = {
    basePrice,
    markedUpPrice,
    volumeDiscount,
    customerDiscount,
    subtotal,
    installationCost,
    deliveryFee,
    subtotalWithServices,
    hst,
    total,
    savings,
    breakdown
  };

  // Add financing if applicable
  if (total >= FINANCING_OPTIONS.minAmount) {
    result.financing = {
      ...FINANCING_OPTIONS,
      terms: FINANCING_OPTIONS.terms.map(term => calculateFinancingPayment(total, term))
    };
  }

  return result;
}

function calculateVolumeDiscount(quantity: number, markedUpPrice: number): number {
  const config = OTTAWA_PRICING_CONFIG;
  const discount = config.volumeDiscounts.find(d =>
    quantity >= d.minQuantity && (!d.maxQuantity || quantity <= d.maxQuantity)
  );
  return discount ? markedUpPrice * discount.discountPercent : 0;
}

function calculateCustomerDiscount(customerType: string, baseAmount: number): number {
  const config = OTTAWA_PRICING_CONFIG;
  switch (customerType) {
    case 'senior':
      return baseAmount * config.seniorDiscount;
    case 'contractor':
      return baseAmount * config.contractorDiscount;
    default:
      return 0;
  }
}

function calculateInstallationCost(doorType: string, width: number, height: number, quantity: number): number {
  const config = OTTAWA_PRICING_CONFIG;
  const rate = config.installationRates.find(r => r.doorType === doorType) ||
    config.installationRates.find(r => r.doorType === 'standard')!;

  const squareFeet = (width * height) / 144; // Convert square inches to square feet
  const perUnitCost = rate.baseRate + (rate.perSquareFootRate || 0) * squareFeet;

  return Math.round(perUnitCost * quantity);
}

function calculateDeliveryFee(postalCode: string, orderTotal: number): number {
  const zone = getDeliveryZone(postalCode);
  if (!zone) return 175; // Default to outer Ottawa rate

  if (zone.freeDeliveryThreshold && orderTotal >= zone.freeDeliveryThreshold) {
    return 0;
  }

  return zone.deliveryFee;
}

function getDeliveryZone(postalCode: string) {
  const config = OTTAWA_PRICING_CONFIG;
  const prefix = postalCode.substring(0, 3).toUpperCase();
  return config.deliveryZones.find(zone =>
    zone.postalCodes.some(code => prefix.startsWith(code))
  );
}

function calculateFinancingPayment(amount: number, term: FinancingTerm): FinancingTerm {
  const principal = amount;
  const monthlyRate = term.interestRate / 12;

  let monthlyPayment: number;
  let totalAmount: number;

  if (term.interestRate === 0) {
    // 0% APR - simple division
    monthlyPayment = principal / term.months;
    totalAmount = principal;
  } else {
    // Calculate with interest
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term.months)) /
      (Math.pow(1 + monthlyRate, term.months) - 1);
    totalAmount = monthlyPayment * term.months;
  }

  return {
    ...term,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
}

// Slack notification function
async function sendSlackNotification(quote: ReninQuoteRequest, calculation: QuoteCalculationResult, quoteNumber: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const productSummary = quote.products.map(p =>
    `• ${p.productName} (${p.width}"x${p.height}") - Qty: ${p.quantity}${p.includeInstallation ? ' +Install' : ''}`
  ).join('\n');

  const slackPayload = {
    text: `🏠 New Renin Quote Request - Ottawa`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🏠 New Renin Quote Request*\n\n*Customer:* ${quote.customer.firstName} ${quote.customer.lastName}\n*Email:* ${quote.customer.email}\n*Type:* ${quote.customer.customerType}\n*Postal Code:* ${quote.customer.postalCode}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Products:*\n${productSummary}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Quote Summary:*\n• Subtotal: $${calculation.subtotal.toFixed(2)}\n• Installation: $${calculation.installationCost.toFixed(2)}\n• Delivery: $${calculation.deliveryFee.toFixed(2)}\n• HST: $${calculation.hst.toFixed(2)}\n• *Total: $${calculation.total.toFixed(2)}*\n• Savings: $${calculation.savings.toFixed(2)}`
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Quote #${quoteNumber} | ${quote.preferredContactMethod} contact | ${quote.projectDetails?.timeline || 'No timeline specified'}`
          }
        ]
      }
    ]
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackPayload)
    });
  } catch (error) {
    console.warn("[quotes/renin] Failed to notify Slack", error);
  }
}

// Main quote request handler
async function handleReninQuoteRequest(
  request: NextRequest,
  data: ReninQuoteRequest
): Promise<NextResponse> {
  // Sanitize the input data
  const sanitizedData = data; // We'll use the validated data directly from Zod

  // Generate quote number
  const quoteNumber = `REN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const receivedAt = new Date().toISOString();

  // Calculate total quote for all products
  const totalQuote: QuoteCalculationResult = {
    basePrice: 0,
    markedUpPrice: 0,
    volumeDiscount: 0,
    customerDiscount: 0,
    subtotal: 0,
    installationCost: 0,
    deliveryFee: 0,
    subtotalWithServices: 0,
    hst: 0,
    total: 0,
    savings: 0,
    breakdown: {
      msrp: 0,
      markup: 0,
      volumeDiscount: 0,
      customerDiscount: 0,
      installation: 0,
      delivery: 0,
      hst: 0,
      total: 0
    }
  };

  // Calculate pricing for each product and aggregate
  const productQuotes = sanitizedData.products.map(product => {
    const input: QuoteCalculationInput = {
      productId: product.productId,
      productName: product.productName,
      productCategory: product.productCategory,
      msrpPrice: product.msrpPrice,
      width: product.width,
      height: product.height,
      quantity: product.quantity,
      includeInstallation: product.includeInstallation,
      customerType: product.customerType,
      postalCode: product.postalCode,
      doorType: product.doorType
    };

    return calculateOttawaPricing(input);
  });

  // Aggregate all product quotes
  productQuotes.forEach(quote => {
    totalQuote.basePrice += quote.basePrice;
    totalQuote.markedUpPrice += quote.markedUpPrice;
    totalQuote.volumeDiscount += quote.volumeDiscount;
    totalQuote.customerDiscount += quote.customerDiscount;
    totalQuote.subtotal += quote.subtotal;
    totalQuote.installationCost += quote.installationCost;
    totalQuote.subtotalWithServices += quote.subtotalWithServices;
    totalQuote.hst += quote.hst;
    totalQuote.total += quote.total;
    totalQuote.savings += quote.savings;
  });

  // Use delivery fee from first product (assuming single delivery)
  totalQuote.deliveryFee = productQuotes[0]?.deliveryFee || 0;

  // Recalculate breakdown
  totalQuote.breakdown = {
    msrp: totalQuote.basePrice,
    markup: totalQuote.markedUpPrice - totalQuote.basePrice,
    volumeDiscount: totalQuote.volumeDiscount,
    customerDiscount: totalQuote.customerDiscount,
    installation: totalQuote.installationCost,
    delivery: totalQuote.deliveryFee,
    hst: totalQuote.hst,
    total: totalQuote.total
  };

  // Add financing if applicable
  if (totalQuote.total >= FINANCING_OPTIONS.minAmount && sanitizedData.includeFinancing) {
    totalQuote.financing = {
      ...FINANCING_OPTIONS,
      terms: FINANCING_OPTIONS.terms.map(term => calculateFinancingPayment(totalQuote.total, term))
    };
  }

  // Send Slack notification
  await sendSlackNotification(sanitizedData, totalQuote, quoteNumber);

  // Store in database
  const supabase = await createClient();
  const record = {
    quote_number: quoteNumber,
    quote_type: 'renin_ottawa',
    received_at: receivedAt,
    customer_data: sanitizedData.customer,
    products_data: sanitizedData.products,
    quote_calculation: totalQuote,
    project_details: sanitizedData.projectDetails || null,
    preferred_contact: sanitizedData.preferredContactMethod,
    include_financing: sanitizedData.includeFinancing,
    total_amount: totalQuote.total,
    status: 'pending',
    metadata: {
      userAgent: request.headers.get("user-agent")?.substring(0, 200),
      referer: request.headers.get("referer") || request.headers.get("origin"),
      ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown",
    }
  };

  const { error: supabaseError } = await supabase
    .from("renin_quote_requests")
    .insert(record);

  if (supabaseError) {
    console.warn("[quotes/renin] Failed to persist quote request", supabaseError);
    // Continue without throwing - quote was generated successfully
  }

  // Prepare response
  const response: ReninQuoteResponse = {
    success: true,
    quoteNumber,
    quote: totalQuote,
    estimatedDelivery: calculateEstimatedDelivery(sanitizedData.projectDetails?.timeline),
    validUntil: calculateQuoteExpiry(),
    salesContact: {
      name: "Ottawa Renin Sales Team",
      email: "ottawa@pgclosets.com"
    },
    nextSteps: [
      "Our sales team will contact you within 24 hours",
      "Schedule a free online quote",
      "Finalize product selection and measurements",
      "Book your installation appointment"
    ]
  };

  return NextResponse.json(response);
}

function calculateEstimatedDelivery(timeline?: string): string {
  const baseDelivery = 7; // 7 days base delivery
  const today = new Date();

  let additionalDays = 0;
  switch (timeline) {
    case 'immediate':
      additionalDays = 0;
      break;
    case '1-3months':
      additionalDays = 30;
      break;
    case '3-6months':
      additionalDays = 90;
      break;
    case '6plus-months':
      additionalDays = 180;
      break;
    default:
      additionalDays = 14;
  }

  const deliveryDate = new Date(today.getTime() + (baseDelivery + additionalDays) * 24 * 60 * 60 * 1000);
  return deliveryDate.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateQuoteExpiry(): string {
  const today = new Date();
  const expiryDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  return expiryDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Create protected route with validation and rate limiting
export const POST = createProtectedRoute(
  reninQuoteRequestSchema,
  handleReninQuoteRequest,
  {
    rateLimit: rateLimitConfigs.standard,
    logRequests: true,
  }
);