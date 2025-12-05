/**
 * Stock Notification Sender Script
 *
 * This script should be run when products come back in stock.
 * It fetches all pending notifications for a product and sends emails to subscribers.
 *
 * Usage:
 * - Run manually: npx tsx scripts/send-stock-notifications.ts --productId=prod_123
 * - Run for all restocked products: npx tsx scripts/send-stock-notifications.ts --all
 * - Schedule with cron or use as part of inventory update webhook
 */

import { prisma } from '@/lib/prisma'

interface NotificationEmailData {
  to: string
  productId: string
  productName: string
  productUrl: string
}

/**
 * Send email notification (placeholder - integrate with your email service)
 * Examples: SendGrid, Mailchimp, AWS SES, Resend, etc.
 */
async function sendEmail(data: NotificationEmailData): Promise<boolean> {
  console.log('Sending email notification:', {
    to: data.to,
    subject: `${data.productName} is back in stock!`,
    productUrl: data.productUrl,
  })

  // TODO: Integrate with your email service
  // Example with Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'noreply@pgclosets.com',
    to: data.to,
    subject: `${data.productName} is back in stock!`,
    html: `
      <h1>Good news!</h1>
      <p>${data.productName} is now back in stock.</p>
      <p><a href="${data.productUrl}">Click here to view the product</a></p>
    `,
  })
  */

  // For now, just log to console
  return true
}

/**
 * Process notifications for a specific product
 */
async function processProductNotifications(productId: string): Promise<number> {
  try {
    // Fetch the product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        inStock: true,
      },
    })

    if (!product) {
      console.error(`Product not found: ${productId}`)
      return 0
    }

    if (!product.inStock) {
      console.log(`Product ${product.name} is still out of stock, skipping...`)
      return 0
    }

    // Fetch all pending notifications for this product
    const notifications = await prisma.stockNotification.findMany({
      where: {
        productId,
        status: 'PENDING',
      },
    })

    if (notifications.length === 0) {
      console.log(`No pending notifications for ${product.name}`)
      return 0
    }

    console.log(`Processing ${notifications.length} notifications for ${product.name}`)

    let successCount = 0
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pgclosets.com'}/products/${product.slug}`

    // Send emails
    for (const notification of notifications) {
      try {
        const emailSent = await sendEmail({
          to: notification.email,
          productId: product.id,
          productName: product.name,
          productUrl,
        })

        if (emailSent) {
          // Update notification status
          await prisma.stockNotification.update({
            where: { id: notification.id },
            data: {
              status: 'NOTIFIED',
              notifiedAt: new Date(),
            },
          })

          successCount++
          console.log(`✓ Sent notification to ${notification.email}`)
        }
      } catch (error) {
        console.error(`✗ Failed to send notification to ${notification.email}:`, error)
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(`Sent ${successCount} out of ${notifications.length} notifications`)
    return successCount
  } catch (error) {
    console.error(`Error processing notifications for product ${productId}:`, error)
    return 0
  }
}

/**
 * Process notifications for all in-stock products
 */
async function processAllNotifications(): Promise<void> {
  try {
    // Get all products that are in stock
    const inStockProducts = await prisma.product.findMany({
      where: { inStock: true },
      select: { id: true, name: true },
    })

    console.log(`Found ${inStockProducts.length} products in stock`)

    let totalSent = 0

    for (const product of inStockProducts) {
      const sent = await processProductNotifications(product.id)
      totalSent += sent

      // Add a delay between products
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    console.log(`\nTotal notifications sent: ${totalSent}`)
  } catch (error) {
    console.error('Error processing all notifications:', error)
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2)
  const productIdArg = args.find((arg) => arg.startsWith('--productId='))
  const allFlag = args.includes('--all')

  try {
    if (productIdArg) {
      const productId = productIdArg.split('=')[1]
      console.log(`Processing notifications for product: ${productId}\n`)
      await processProductNotifications(productId)
    } else if (allFlag) {
      console.log('Processing notifications for all in-stock products\n')
      await processAllNotifications()
    } else {
      console.log('Usage:')
      console.log('  npx tsx scripts/send-stock-notifications.ts --productId=<id>')
      console.log('  npx tsx scripts/send-stock-notifications.ts --all')
      process.exit(1)
    }

    console.log('\nDone!')
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

// Export for use in other scripts
export { processProductNotifications, processAllNotifications }
