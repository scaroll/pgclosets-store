"use client"

import { useEffect } from "react"

// Local Business structured data component
export function LocalBusinessJSONLD() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "PG Closets",
      description: "Premium closet doors and custom storage solutions in Ottawa",
      url: "https://www.pgclosets.ca",
      email: "spencer@peoplesgrp.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "45.4215",
        longitude: "-75.6972",
      },
      areaServed: [
        { "@type": "City", name: "Ottawa" },
        { "@type": "City", name: "Kanata" },
        { "@type": "City", name: "Nepean" },
        { "@type": "City", name: "Orleans" },
        { "@type": "City", name: "Barrhaven" },
      ],
      serviceType: ["Custom Closet Design", "Closet Installation", "Storage Solutions", "Pantry Organization"],
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

// Website structured data component
export function WebsiteJSONLD() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PG Closets",
      url: "https://www.pgclosets.ca",
      description: "Premium closet doors and custom storage solutions in Ottawa",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.pgclosets.ca/products?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

// Organization structured data component
export function OrganizationJSONLD() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PG Closets",
      url: "https://www.pgclosets.ca",
      logo: "https://www.pgclosets.ca/logo.png",
      description: "Premium closet doors and custom storage solutions in Ottawa",
      email: "spencer@peoplesgrp.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      sameAs: [],
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

// Product structured data component
interface ProductJSONLDProps {
  product: {
    name: string
    description: string
    sku?: string
    brand?: string
    priceMin?: number
    priceMax?: number
    images?: string[]
    category?: string
    availability?: string
  }
}

export function ProductJSONLD({ product }: ProductJSONLDProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      sku: product.sku || "",
      brand: {
        "@type": "Brand",
        name: product.brand || "Renin",
      },
      offers: {
        "@type": "Offer",
        price: product.priceMin || 0,
        priceCurrency: "CAD",
        availability:
          product.availability === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "PG Closets",
        },
      },
      image: product.images || [],
      category: product.category || "Closet Doors",
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [product])

  return null
}

// Utility functions for metadata generation
export function generateProductMetadata(product: any) {
  return {
    title: `${product.name} | Premium Closet Doors Ottawa | PG Closets`,
    description: `${product.description} Professional installation in Ottawa. ${product.priceMin ? `Starting at $${product.priceMin} CAD.` : "Request quote."} Lifetime warranty.`,
    openGraph: {
      title: `${product.name} | PG Closets Ottawa`,
      description: product.description,
      images: product.images ? [product.images[0]] : [],
      type: "product",
    },
  }
}

export function generateCategoryMetadata(category: string) {
  const categoryNames: Record<string, string> = {
    barn: "Sliding Barn Doors",
    bypass: "Bypass Doors",
    bifold: "Bifold Doors",
    pivot: "Pivot Doors",
    hardware: "Hardware & Accessories",
    mirrors: "Mirrors",
  }

  const categoryName = categoryNames[category] || "Closet Doors"

  return {
    title: `${categoryName} Ottawa | Premium Renin Products | PG Closets`,
    description: `Explore our premium ${categoryName.toLowerCase()} collection. Professional installation in Ottawa with lifetime warranty. Official Renin dealer.`,
    openGraph: {
      title: `${categoryName} | PG Closets Ottawa`,
      description: `Premium ${categoryName.toLowerCase()} with professional installation in Ottawa`,
      type: "website",
    },
  }
}
