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

export function formatPrice(price: number | null | undefined, currency = "CAD") {
  if (price == null || isNaN(price)) {
    return `Price TBD`
  }
  return `$${price.toLocaleString()} ${currency}`
}

export function formatPriceRange(priceMin: number | null | undefined, priceMax?: number | null, currency = "CAD") {
  if (priceMin == null || isNaN(priceMin)) {
    return `Price TBD`
  }
  if (priceMax && !isNaN(priceMax)) {
    return `$${priceMin.toLocaleString()}–$${priceMax.toLocaleString()} ${currency}`
  }
  return `From $${priceMin.toLocaleString()} ${currency}`
}
