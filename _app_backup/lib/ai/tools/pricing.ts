import { prisma } from '@/lib/db/client'
import { tool } from 'ai'
import { z } from 'zod'

const calculatePricingSchema = z.object({
  productIds: z.array(z.string()).describe('Product IDs to include in calculation'),
  includeInstallation: z.boolean().default(false).describe('Whether to include installation cost'),
  postalCode: z.string().optional().describe('Postal code for tax calculation'),
})

export const calculatePricingTool = tool({
  description: 'Calculate total cost including products, installation, and tax',
  inputSchema: calculatePricingSchema,
  execute: async input => {
    const { productIds, includeInstallation } = input
    try {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      })

      const subtotal = products.reduce((sum, p) => sum + p.price, 0)

      // Installation cost (simplified - $200 base + $50 per product)
      const installationCost = includeInstallation ? 20000 + products.length * 5000 : 0

      // Tax (13% HST Ontario as default)
      const taxRate = 0.13
      const tax = Math.round((subtotal + installationCost) * taxRate)
      const total = subtotal + installationCost + tax

      return {
        subtotal: subtotal / 100, // Convert to dollars
        installationCost: installationCost / 100,
        tax: tax / 100,
        total: total / 100,
        currency: 'CAD',
      }
    } catch {
      return { error: 'Failed to calculate pricing' }
    }
  },
})

const getFinancingOptionsSchema = z.object({
  totalAmount: z.number().describe('Total amount in cents'),
})

export const getFinancingOptionsTool = tool({
  description: 'Show payment plan options for projects over $500',
  inputSchema: getFinancingOptionsSchema,
  execute: input => {
    const { totalAmount } = input
    try {
      const totalDollars = totalAmount / 100

      if (totalDollars < 500) {
        return {
          eligible: false,
          message: 'Financing is available for purchases over $500',
        }
      }

      const options = [
        {
          term: '6 months',
          apr: 0,
          monthlyPayment: totalDollars / 6,
          totalInterest: 0,
        },
        {
          term: '12 months',
          apr: 0,
          monthlyPayment: totalDollars / 12,
          totalInterest: 0,
        },
      ]

      return {
        eligible: true,
        options,
      }
    } catch {
      return { error: 'Failed to get financing options' }
    }
  },
})

const comparePricingSchema = z.object({
  configurations: z
    .array(
      z.object({
        name: z.string(),
        productIds: z.array(z.string()),
        includeInstallation: z.boolean().optional(),
      })
    )
    .min(2)
    .describe('Configurations to compare'),
})

export const comparePricingTool = tool({
  description: 'Compare costs between different product configurations',
  inputSchema: comparePricingSchema,
  execute: async input => {
    const { configurations } = input
    try {
      const results = await Promise.all(
        configurations.map(async config => {
          const products = await prisma.product.findMany({
            where: { id: { in: config.productIds } },
          })

          const subtotal = products.reduce((sum, p) => sum + p.price, 0)
          const installationCost = config.includeInstallation ? 20000 + products.length * 5000 : 0
          const tax = Math.round((subtotal + installationCost) * 0.13)
          const total = subtotal + installationCost + tax

          return {
            name: config.name,
            subtotal: subtotal / 100,
            installationCost: installationCost / 100,
            tax: tax / 100,
            total: total / 100,
          }
        })
      )

      return { configurations: results }
    } catch {
      return { error: 'Failed to compare pricing' }
    }
  },
})
