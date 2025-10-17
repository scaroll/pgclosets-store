import { tool } from 'ai';
import { z } from 'zod';

/**
 * Pricing Calculator Tool for AI SDK 5
 * Calculates project costs including products, installation, and taxes
 */

// Mock pricing data - replace with actual database
const PRODUCT_PRICES: Record<string, number> = {
  'renin-barn-1': 499,
  'renin-bifold-1': 299,
  'hardware-1': 149,
  'bypass-system-1': 399,
  'pivot-door-1': 599,
  'room-divider-1': 799,
  'mirror-1': 199,
};

const INSTALLATION_RATES: Record<string, number> = {
  'barn-doors': 150,
  'bifold-doors': 100,
  'bypass-doors': 125,
  'pivot-doors': 175,
  'room-dividers': 200,
  'closet-systems': 300,
  'hardware': 50,
  'mirrors': 75,
};

const TAX_RATE = 0.13; // 13% HST for Ontario

const TRAVEL_FEES: Record<string, number> = {
  'Ottawa': 0,
  'Kanata': 25,
  'Barrhaven': 25,
  'Nepean': 20,
  'Orleans': 30,
};

/**
 * Calculate project pricing tool
 */
export const calculatePricingTool = tool({
  description: `Calculate the total cost for a closet project including products, installation, and taxes.
    Use this when customers ask about pricing or want a quote.`,
  parameters: z.object({
    productIds: z.array(z.string()).describe('Array of product IDs to include'),
    quantities: z.array(z.number()).optional().describe('Quantity for each product (defaults to 1)'),
    includeInstallation: z.boolean().default(true).describe('Include installation cost'),
    location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']).default('Ottawa'),
    measurements: z.object({
      width: z.number().describe('Width in inches'),
      height: z.number().describe('Height in inches'),
      depth: z.number().optional().describe('Depth in inches'),
    }).optional().describe('Space measurements for custom sizing'),
    rush: z.boolean().default(false).describe('Rush order (20% surcharge)'),
  }),
  execute: async ({
    productIds,
    quantities,
    includeInstallation,
    location,
    measurements,
    rush
  }) => {
    console.log('[Pricing Calculator Tool] Calculating for:', {
      productIds,
      quantities,
      includeInstallation,
      location,
      measurements,
      rush
    });

    // Validate product IDs
    const invalidProducts = productIds.filter(id => !PRODUCT_PRICES[id]);
    if (invalidProducts.length > 0) {
      return {
        success: false,
        error: `Invalid product IDs: ${invalidProducts.join(', ')}`,
      };
    }

    // Set default quantities
    const productQuantities = quantities || productIds.map(() => 1);

    // Calculate product costs
    const productBreakdown = productIds.map((id, index) => {
      const price = PRODUCT_PRICES[id];
      const quantity = productQuantities[index] || 1;
      const total = price * quantity;

      return {
        productId: id,
        quantity,
        unitPrice: price,
        total,
      };
    });

    const subtotal = productBreakdown.reduce((sum, item) => sum + item.total, 0);

    // Calculate installation costs
    let installationCost = 0;
    if (includeInstallation) {
      // Determine primary category from products
      const category = detectPrimaryCategory(productIds);
      const baseInstallation = INSTALLATION_RATES[category] || 100;

      // Adjust for quantity
      const totalQuantity = productQuantities.reduce((sum, q) => sum + q, 0);
      installationCost = baseInstallation * totalQuantity;

      // Add travel fee
      installationCost += TRAVEL_FEES[location];

      // Add complexity fee for custom measurements
      if (measurements) {
        const area = (measurements.width * measurements.height) / 144; // Convert to sq ft
        if (area > 50) {
          installationCost += 100; // Large area surcharge
        }
      }
    }

    // Calculate rush surcharge
    const rushSurcharge = rush ? (subtotal + installationCost) * 0.2 : 0;

    // Calculate subtotal before tax
    const subtotalBeforeTax = subtotal + installationCost + rushSurcharge;

    // Calculate tax
    const tax = subtotalBeforeTax * TAX_RATE;

    // Calculate total
    const total = subtotalBeforeTax + tax;

    // Estimate delivery time
    const estimatedDelivery = rush ? '5-7 business days' : '10-14 business days';

    return {
      success: true,
      quote: {
        subtotal,
        installation: installationCost,
        rushSurcharge,
        subtotalBeforeTax,
        tax,
        total,
        breakdown: productBreakdown,
        location,
        travelFee: TRAVEL_FEES[location],
        estimatedDelivery,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      },
      formatted: {
        subtotal: formatCurrency(subtotal),
        installation: formatCurrency(installationCost),
        rushSurcharge: formatCurrency(rushSurcharge),
        tax: formatCurrency(tax),
        total: formatCurrency(total),
      },
      notes: [
        'All prices in CAD',
        'HST (13%) included in total',
        includeInstallation ? `Installation includes ${location} service area` : 'Installation not included',
        rush ? 'Rush order surcharge applied (20%)' : '',
        'Quote valid for 30 days',
        'Final price may vary based on site conditions',
      ].filter(Boolean),
    };
  },
});

/**
 * Get financing options tool
 */
export const getFinancingOptionsTool = tool({
  description: `Calculate financing options for a project based on total cost.
    Use this when customers ask about payment plans or financing.`,
  parameters: z.object({
    totalCost: z.number().describe('Total project cost in CAD'),
    downPayment: z.number().optional().describe('Down payment amount'),
    term: z.number().default(12).describe('Financing term in months (6, 12, 24, 36)'),
  }),
  execute: async ({ totalCost, downPayment = 0, term }) => {
    console.log('[Financing Options Tool] Calculating:', { totalCost, downPayment, term });

    if (totalCost <= 0) {
      return {
        success: false,
        error: 'Total cost must be greater than 0',
      };
    }

    const financedAmount = totalCost - downPayment;

    if (financedAmount <= 0) {
      return {
        success: true,
        message: 'Down payment covers full cost. No financing needed.',
        options: [],
      };
    }

    // Interest rates by term
    const interestRates: Record<number, number> = {
      6: 0.0, // 0% for 6 months
      12: 0.0, // 0% for 12 months
      24: 0.089, // 8.9% for 24 months
      36: 0.119, // 11.9% for 36 months
    };

    const rate = interestRates[term] || 0.119;

    // Calculate monthly payment
    let monthlyPayment: number;
    if (rate === 0) {
      monthlyPayment = financedAmount / term;
    } else {
      const monthlyRate = rate / 12;
      monthlyPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) /
                       (Math.pow(1 + monthlyRate, term) - 1);
    }

    const totalPayments = monthlyPayment * term;
    const totalInterest = totalPayments - financedAmount;

    return {
      success: true,
      financing: {
        totalCost,
        downPayment,
        financedAmount,
        term,
        interestRate: rate,
        monthlyPayment,
        totalPayments,
        totalInterest,
        firstPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      formatted: {
        monthlyPayment: formatCurrency(monthlyPayment),
        totalPayments: formatCurrency(totalPayments),
        totalInterest: formatCurrency(totalInterest),
        interestRate: `${(rate * 100).toFixed(1)}%`,
      },
      availableTerms: [
        { months: 6, rate: '0%', payment: formatCurrency(financedAmount / 6) },
        { months: 12, rate: '0%', payment: formatCurrency(financedAmount / 12) },
        { months: 24, rate: '8.9%', payment: formatCurrency(calculatePayment(financedAmount, 0.089, 24)) },
        { months: 36, rate: '11.9%', payment: formatCurrency(calculatePayment(financedAmount, 0.119, 36)) },
      ],
      notes: [
        'Subject to credit approval',
        '0% financing available for 6 or 12 months',
        'No prepayment penalties',
        'First payment due 30 days after project completion',
      ],
    };
  },
});

/**
 * Compare pricing tool
 */
export const comparePricingTool = tool({
  description: `Compare pricing between different product options or configurations.
    Use this to help customers choose between alternatives.`,
  parameters: z.object({
    options: z.array(z.object({
      name: z.string(),
      productIds: z.array(z.string()),
      includeInstallation: z.boolean().default(true),
    })),
    location: z.string().default('Ottawa'),
  }),
  execute: async ({ options, location }) => {
    console.log('[Compare Pricing Tool] Comparing options:', options.length);

    const comparisons = await Promise.all(
      options.map(async (option) => {
        // Calculate pricing for this option
        const result = await calculatePricingTool.execute({
          productIds: option.productIds,
          includeInstallation: option.includeInstallation,
          location: location as any,
          rush: false,
        });

        return {
          name: option.name,
          ...result,
        };
      })
    );

    const successful = comparisons.filter(c => c.success);

    if (successful.length === 0) {
      return {
        success: false,
        error: 'Could not calculate pricing for any options',
      };
    }

    // Find best value
    const sortedByPrice = [...successful].sort((a, b) =>
      (a.quote?.total || 0) - (b.quote?.total || 0)
    );

    return {
      success: true,
      comparisons: successful,
      recommendation: {
        bestValue: sortedByPrice[0].name,
        lowestPrice: sortedByPrice[0].formatted?.total,
        highestPrice: sortedByPrice[sortedByPrice.length - 1].formatted?.total,
        savings: formatCurrency(
          (sortedByPrice[sortedByPrice.length - 1].quote?.total || 0) -
          (sortedByPrice[0].quote?.total || 0)
        ),
      },
    };
  },
});

// ============================================================================
// Helper Functions
// ============================================================================

function detectPrimaryCategory(productIds: string[]): string {
  // Simple category detection based on product ID prefixes
  const categoryCount: Record<string, number> = {};

  productIds.forEach(id => {
    if (id.includes('barn')) categoryCount['barn-doors'] = (categoryCount['barn-doors'] || 0) + 1;
    else if (id.includes('bifold')) categoryCount['bifold-doors'] = (categoryCount['bifold-doors'] || 0) + 1;
    else if (id.includes('bypass')) categoryCount['bypass-doors'] = (categoryCount['bypass-doors'] || 0) + 1;
    else if (id.includes('pivot')) categoryCount['pivot-doors'] = (categoryCount['pivot-doors'] || 0) + 1;
    else if (id.includes('divider')) categoryCount['room-dividers'] = (categoryCount['room-dividers'] || 0) + 1;
    else if (id.includes('hardware')) categoryCount['hardware'] = (categoryCount['hardware'] || 0) + 1;
    else if (id.includes('mirror')) categoryCount['mirrors'] = (categoryCount['mirrors'] || 0) + 1;
    else categoryCount['closet-systems'] = (categoryCount['closet-systems'] || 0) + 1;
  });

  // Return category with highest count
  return Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'closet-systems';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculatePayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;

  const monthlyRate = annualRate / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
         (Math.pow(1 + monthlyRate, months) - 1);
}
