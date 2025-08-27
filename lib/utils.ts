export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

// Fallback clsx implementation
export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const result = clsx(...input)
      if (result) classes.push(result)
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(" ")
}

// Fallback tailwind-merge implementation
export function twMerge(...inputs: string[]): string {
  // Simple deduplication - in production, this would be more sophisticated
  const classes = inputs.join(" ").split(" ").filter(Boolean)
  const uniqueClasses = [...new Set(classes)]
  return uniqueClasses.join(" ")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

export type VariantProps<T extends (...args: any) => any> = Omit<Parameters<T>[0], "class" | "className">

interface CVAConfig {
  variants?: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
}

export function cva(base: string, config?: CVAConfig) {
  return (props: Record<string, any> = {}) => {
    let classes = base

    if (config?.variants) {
      for (const [key, variants] of Object.entries(config.variants)) {
        const value = props[key] || config.defaultVariants?.[key]
        if (value && variants[value]) {
          classes += ` ${variants[value]}`
        }
      }
    }

    if (props.className) {
      classes += ` ${props.className}`
    }

    return classes
  }
}

// URL creation utility for navigation
export function createUrl(pathname: string, params?: URLSearchParams | Record<string, string>): string {
  const url = new URL(pathname, 'https://example.com')
  
  if (params) {
    if (params instanceof URLSearchParams) {
      url.search = params.toString()
    } else {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
  }
  
  return `${url.pathname}${url.search}`
}

// Price formatting utility
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(price)
}
