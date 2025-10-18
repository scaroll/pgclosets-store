export const HST = 0.13
export const BASE_BY_TYPE: Record<"Barn" | "Bypass" | "Bifold" | "Pivot", number> = {
  Barn: 799,
  Bypass: 549,
  Bifold: 449,
  Pivot: 499,
}

export function computeSubtotal(type: keyof typeof BASE_BY_TYPE, hardware: number, installPro: boolean) {
  return BASE_BY_TYPE[type] + hardware + (installPro ? 299 : 0)
}

export function totalsCAD(subtotal: number) {
  const hst = Math.round(subtotal * HST)
  return { subtotal, hst, total: subtotal + hst }
}

export function formatPrice(price: number, currency = "CAD") {
  return `$${price.toLocaleString()} ${currency}`
}

export function formatPriceRange(priceMin: number, priceMax?: number, currency = "CAD") {
  if (priceMax) {
    return `$${priceMin.toLocaleString()}–$${priceMax.toLocaleString()} ${currency}`
  }
  return `From $${priceMin.toLocaleString()} ${currency}`
}
