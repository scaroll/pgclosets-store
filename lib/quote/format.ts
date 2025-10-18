/**
 * Quote Formatting Utilities
 *
 * Helpers to format door selection data for various outputs:
 * - Short labels for productInterest field
 * - Plain-text blocks for emails and mailto body
 * - Subject-safe strings for email subjects
 */

export interface DoorSelection {
  series: string
  doorType: 'sliding' | 'bypass' | 'bifold' | 'pivot' | 'barn' | 'mirror'
  openingWidthIn: number
  openingHeightIn: number
  panelCount: number
  finish: string
  hardware: string
  softClose: boolean
  handles: string
  quantity: number
  notes?: string
  productUrl?: string
  images?: string[]
}

/**
 * Door type display names
 */
const DOOR_TYPE_LABELS: Record<DoorSelection['doorType'], string> = {
  sliding: 'Sliding',
  bypass: 'Bypass',
  bifold: 'Bifold',
  pivot: 'Pivot',
  barn: 'Barn Door',
  mirror: 'Mirror Door',
}

/**
 * Format dimensions with rounding to one decimal
 */
function formatDimensions(widthIn: number, heightIn: number): string {
  const w = Math.round(widthIn * 10) / 10
  const h = Math.round(heightIn * 10) / 10
  return `${w}″ × ${h}″`
}

/**
 * Generate short label for productInterest field
 * Example: "Sliding (Bypass) • 72×80 • 3 panels • Matte Black"
 */
export function formatShortLabel(selection: DoorSelection): string {
  const parts = [
    DOOR_TYPE_LABELS[selection.doorType],
    formatDimensions(selection.openingWidthIn, selection.openingHeightIn),
    `${selection.panelCount} panel${selection.panelCount !== 1 ? 's' : ''}`,
    selection.finish,
  ]

  return parts.join(' • ')
}

/**
 * Generate subject-safe string for mailto and email subjects
 * Example: "Quote Request: Continental Sliding 72x80"
 */
export function formatSubject(selection: DoorSelection): string {
  const dimensions = `${Math.round(selection.openingWidthIn)}x${Math.round(selection.openingHeightIn)}`
  return `Quote Request: ${selection.series} ${DOOR_TYPE_LABELS[selection.doorType]} ${dimensions}"`
}

/**
 * Generate plain-text block for email body and mailto
 * Deterministic ordering with clear formatting
 */
export function formatPlainText(selection: DoorSelection): string {
  const lines = [
    'DOOR CONFIGURATION',
    '═══════════════════════════════════════',
    '',
    `Series:           ${selection.series}`,
    `Door Type:        ${DOOR_TYPE_LABELS[selection.doorType]}`,
    `Opening Size:     ${formatDimensions(selection.openingWidthIn, selection.openingHeightIn)}`,
    `Panel Count:      ${selection.panelCount}`,
    `Finish:           ${selection.finish}`,
    `Hardware:         ${selection.hardware}`,
    `Soft-Close:       ${selection.softClose ? 'Yes' : 'No'}`,
    `Handles:          ${selection.handles}`,
    `Quantity:         ${selection.quantity}`,
  ]

  if (selection.notes) {
    lines.push('', `Notes:            ${selection.notes}`)
  }

  if (selection.productUrl) {
    lines.push('', `Product Page:     ${selection.productUrl}`)
  }

  return lines.join('\n')
}

/**
 * Generate URL-encoded mailto body
 * For fallback email composition
 */
export function formatMailtoBody(selection: DoorSelection, contactInfo?: { name: string; phone: string }): string {
  let body = 'Hello,\n\nI would like to request a quote for the following door configuration:\n\n'
  body += formatPlainText(selection)

  if (contactInfo) {
    body += '\n\nCONTACT INFORMATION\n'
    body += '═══════════════════════════════════════\n\n'
    body += `Name:             ${contactInfo.name}\n`
    body += `Phone:            ${contactInfo.phone}\n`
  }

  body += '\n\nThank you,\n[Your Name]'

  return encodeURIComponent(body)
}

/**
 * Validate door selection data
 */
export function validateDoorSelection(selection: Partial<DoorSelection>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!selection.series?.trim()) {
    errors.push('Series is required')
  }

  if (!selection.doorType) {
    errors.push('Door type is required')
  }

  if (!selection.openingWidthIn || selection.openingWidthIn <= 0) {
    errors.push('Opening width must be greater than 0')
  }

  if (!selection.openingHeightIn || selection.openingHeightIn <= 0) {
    errors.push('Opening height must be greater than 0')
  }

  if (!selection.panelCount || selection.panelCount < 1) {
    errors.push('Panel count must be at least 1')
  }

  if (!selection.finish?.trim()) {
    errors.push('Finish is required')
  }

  if (!selection.hardware?.trim()) {
    errors.push('Hardware is required')
  }

  if (!selection.handles?.trim()) {
    errors.push('Handles selection is required')
  }

  if (!selection.quantity || selection.quantity < 1) {
    errors.push('Quantity must be at least 1')
  }

  // Validate URLs if provided
  if (selection.productUrl) {
    try {
      new URL(selection.productUrl)
    } catch {
      errors.push('Product URL must be a valid URL')
    }
  }

  // Validate image URLs if provided
  if (selection.images && selection.images.length > 0) {
    selection.images.forEach((url, idx) => {
      try {
        new URL(url)
      } catch {
        errors.push(`Image URL ${idx + 1} must be a valid URL`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
