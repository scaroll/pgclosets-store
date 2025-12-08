/**
 * Quote PDF Generation API
 * Generate formal quote PDFs
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/quotes/[id]/pdf
 * Generate and return a PDF for the quote
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get quote with all details
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        configurations: true,
        customer: {
          select: { name: true, email: true, phone: true }
        },
        assignedRep: {
          select: { name: true, email: true, phone: true }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Verify access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    const isAdmin = user?.role === 'ADMIN'
    const isOwner = quote.customerId === user?.id || quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Generate HTML for PDF
    const address = quote.propertyAddress as any
    const html = generateQuotePdfHtml(quote, address)

    // Return HTML that can be converted to PDF client-side
    // Or use a service like Puppeteer/Playwright for server-side PDF generation
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${quote.quoteNumber}.html"`
      }
    })

  } catch (error) {
    console.error('[GET /api/quotes/[id]/pdf] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

function generateQuotePdfHtml(quote: any, address: any): string {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const configRows = quote.configurations.map((config: any, index: number) => `
    <tr>
      <td>${config.roomName}</td>
      <td>${config.series} - ${config.doorType}</td>
      <td>${Number(config.widthInches)}" x ${Number(config.heightInches)}"</td>
      <td>${config.finish}</td>
      <td style="text-align: center">${config.quantity}</td>
      <td style="text-align: right">${formatCurrency(Number(config.lineTotal))}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote ${quote.quoteNumber} - PG Closets</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
    }
    .logo-sub {
      font-size: 12px;
      color: #666;
    }
    .quote-info {
      text-align: right;
    }
    .quote-number {
      font-size: 18px;
      font-weight: bold;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .info-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
    }
    .info-box h4 {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
    }
    .totals {
      width: 300px;
      margin-left: auto;
    }
    .totals tr td {
      border: none;
      padding: 8px 10px;
    }
    .totals tr.total {
      font-size: 16px;
      font-weight: bold;
      border-top: 2px solid #000;
    }
    .totals tr.total td {
      padding-top: 15px;
    }
    .terms {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      margin-top: 30px;
    }
    .terms h4 {
      margin-bottom: 10px;
    }
    .terms ul {
      padding-left: 20px;
    }
    .terms li {
      margin-bottom: 5px;
    }
    .signature-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 20px;
    }
    .signature-box {
      border-top: 1px solid #000;
      padding-top: 10px;
    }
    .signature-label {
      font-size: 10px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 10px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .header {
        margin-bottom: 30px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">PG Closets</div>
      <div class="logo-sub">Ottawa's Premier Closet Door Specialists</div>
      <p style="margin-top: 10px; font-size: 11px; color: #666;">
        Phone: 613-701-6393<br>
        Email: info@pgclosets.ca<br>
        Web: pgclosets.ca
      </p>
    </div>
    <div class="quote-info">
      <div class="quote-number">${quote.quoteNumber}</div>
      <p>Date: ${formatDate(quote.createdAt)}</p>
      ${quote.validUntil ? `<p>Valid Until: ${formatDate(quote.validUntil)}</p>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="info-grid">
      <div class="info-box">
        <h4>Bill To</h4>
        <p><strong>${quote.customerName}</strong></p>
        <p>${quote.customerEmail}</p>
        <p>${quote.customerPhone}</p>
      </div>
      <div class="info-box">
        <h4>Installation Address</h4>
        ${address ? `
          <p>${address.line1}</p>
          ${address.line2 ? `<p>${address.line2}</p>` : ''}
          <p>${address.city}, ${address.province} ${address.postalCode}</p>
        ` : '<p>To be confirmed</p>'}
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Configuration Details</h3>
    <table>
      <thead>
        <tr>
          <th>Room</th>
          <th>Product</th>
          <th>Size</th>
          <th>Finish</th>
          <th style="text-align: center">Qty</th>
          <th style="text-align: right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${configRows}
      </tbody>
    </table>

    <table class="totals">
      <tbody>
        <tr>
          <td>Subtotal</td>
          <td style="text-align: right">${formatCurrency(Number(quote.subtotal))}</td>
        </tr>
        ${Number(quote.installationFee) > 0 ? `
          <tr>
            <td>Installation</td>
            <td style="text-align: right">${formatCurrency(Number(quote.installationFee))}</td>
          </tr>
        ` : ''}
        ${Number(quote.travelFee) > 0 ? `
          <tr>
            <td>Travel Fee</td>
            <td style="text-align: right">${formatCurrency(Number(quote.travelFee))}</td>
          </tr>
        ` : ''}
        ${Number(quote.discount) > 0 ? `
          <tr style="color: #16a34a">
            <td>Discount ${quote.discountReason ? `(${quote.discountReason})` : ''}</td>
            <td style="text-align: right">-${formatCurrency(Number(quote.discount))}</td>
          </tr>
        ` : ''}
        <tr>
          <td>HST (${(Number(quote.taxRate) * 100).toFixed(0)}%)</td>
          <td style="text-align: right">${formatCurrency(Number(quote.tax))}</td>
        </tr>
        <tr class="total">
          <td>Total</td>
          <td style="text-align: right">${formatCurrency(Number(quote.total))}</td>
        </tr>
        <tr>
          <td style="color: #666">Deposit (${quote.depositPercent}%)</td>
          <td style="text-align: right; color: #666">${formatCurrency(Number(quote.total) * (quote.depositPercent / 100))}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="terms">
    <h4>Terms & Conditions</h4>
    <ul>
      <li>50% deposit required to confirm order</li>
      <li>Balance due upon completion of installation</li>
      <li>Quote valid for 30 days from date of issue</li>
      <li>Prices include all materials, hardware, and professional installation</li>
      <li>5-year warranty on materials, 2-year warranty on installation</li>
      <li>Any modifications to the scope of work may result in price adjustments</li>
    </ul>
  </div>

  <div class="signature-section">
    <p><strong>Acceptance:</strong> By signing below, you agree to the terms and conditions stated above.</p>
    <div class="signature-grid">
      <div>
        <div class="signature-box">
          <div class="signature-label">Customer Signature</div>
        </div>
        <p style="margin-top: 10px; font-size: 10px">Date: _________________</p>
      </div>
      <div>
        <div class="signature-box">
          <div class="signature-label">PG Closets Representative</div>
        </div>
        <p style="margin-top: 10px; font-size: 10px">Date: _________________</p>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for choosing PG Closets!</p>
    <p>PG Closets • Ottawa, Ontario • 613-701-6393 • info@pgclosets.ca • pgclosets.ca</p>
  </div>
</body>
</html>
  `
}
