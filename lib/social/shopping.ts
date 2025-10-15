/**
 * Social Media Shopping Integration
 * Handles product catalog syncing, shoppable posts, and checkout flows
 * for Instagram, Pinterest, and Facebook
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface ShoppableProduct {
  id: string
  title: string
  description: string
  price: number
  compareAtPrice?: number
  currency: string
  images: string[]
  url: string
  availability: "in stock" | "out of stock" | "preorder"
  condition: "new" | "refurbished" | "used"
  brand: string
  category: string
  googleProductCategory?: string
  gtin?: string
  mpn?: string
  sku: string
  customLabels?: {
    label0?: string
    label1?: string
    label2?: string
    label3?: string
    label4?: string
  }
}

// ============================================================================
// INSTAGRAM SHOPPING
// ============================================================================

export class InstagramShopping {
  private accessToken: string
  private catalogId: string
  private businessAccountId: string

  constructor(accessToken: string, catalogId: string, businessAccountId: string) {
    this.accessToken = accessToken
    this.catalogId = catalogId
    this.businessAccountId = businessAccountId
  }

  /**
   * Sync product catalog to Instagram
   */
  async syncCatalog(products: ShoppableProduct[]): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const batch = products.map((product) => ({
        method: "POST",
        relative_url: `${this.catalogId}/products`,
        body: this.formatProductForFacebook(product),
      }))

      const response = await fetch(`https://graph.facebook.com/v18.0/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          batch: JSON.stringify(batch),
        }),
      })

      const data = await response.json()
      return { success: response.ok, errors: data.error ? [data.error.message] : undefined }
    } catch (error) {
      console.error("Instagram catalog sync error:", error)
      return { success: false, errors: [error instanceof Error ? error.message : "Unknown error"] }
    }
  }

  /**
   * Tag products in an Instagram post
   */
  async tagProductsInPost(
    postId: string,
    productTags: Array<{ product_id: string; x: number; y: number }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${postId}/product_tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          product_tags: productTags,
        }),
      })

      const data = await response.json()
      return { success: response.ok, error: data.error?.message }
    } catch (error) {
      console.error("Product tagging error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  /**
   * Create a product sticker for Instagram Stories
   */
  async createProductSticker(
    storyId: string,
    productId: string
  ): Promise<{ success: boolean; stickerId?: string; error?: string }> {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${storyId}/story_product_tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          product_id: productId,
        }),
      })

      const data = await response.json()
      return {
        success: response.ok,
        stickerId: data.id,
        error: data.error?.message,
      }
    } catch (error) {
      console.error("Product sticker creation error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  /**
   * Get shopping insights for Instagram
   */
  async getShoppingInsights(
    since: Date,
    until: Date
  ): Promise<{
    productViews: number
    productClicks: number
    checkouts: number
    revenue: number
  }> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.businessAccountId}/insights?` +
          `metric=product_views,product_clicks&` +
          `period=day&` +
          `since=${Math.floor(since.getTime() / 1000)}&` +
          `until=${Math.floor(until.getTime() / 1000)}&` +
          `access_token=${this.accessToken}`
      )

      const data = await response.json()

      return {
        productViews: data.data?.find((m: any) => m.name === "product_views")?.values?.[0]?.value || 0,
        productClicks: data.data?.find((m: any) => m.name === "product_clicks")?.values?.[0]?.value || 0,
        checkouts: 0, // Would come from e-commerce integration
        revenue: 0, // Would come from e-commerce integration
      }
    } catch (error) {
      console.error("Instagram shopping insights error:", error)
      return { productViews: 0, productClicks: 0, checkouts: 0, revenue: 0 }
    }
  }

  /**
   * Format product for Facebook/Instagram API
   */
  private formatProductForFacebook(product: ShoppableProduct): string {
    return JSON.stringify({
      retailer_id: product.sku,
      name: product.title,
      description: product.description,
      price: product.price,
      currency: product.currency,
      availability: product.availability === "in stock" ? "in stock" : "out of stock",
      condition: product.condition,
      brand: product.brand,
      url: product.url,
      image_url: product.images[0],
      additional_image_urls: product.images.slice(1),
    })
  }
}

// ============================================================================
// PINTEREST SHOPPING
// ============================================================================

export class PinterestShopping {
  private accessToken: string
  private merchantId: string

  constructor(accessToken: string, merchantId: string) {
    this.accessToken = accessToken
    this.merchantId = merchantId
  }

  /**
   * Create or update product pins
   */
  async syncCatalog(products: ShoppableProduct[]): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const errors: string[] = []

      for (const product of products) {
        const pinData = this.formatProductForPinterest(product)

        const response = await fetch(`https://api.pinterest.com/v5/pins`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pinData),
        })

        if (!response.ok) {
          const error = await response.json()
          errors.push(`${product.title}: ${error.message}`)
        }
      }

      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      }
    } catch (error) {
      console.error("Pinterest catalog sync error:", error)
      return { success: false, errors: [error instanceof Error ? error.message : "Unknown error"] }
    }
  }

  /**
   * Create a product feed for automatic syncing
   */
  async createProductFeed(feedName: string, feedUrl: string): Promise<{ success: boolean; feedId?: string }> {
    try {
      const response = await fetch(`https://api.pinterest.com/v5/catalogs/feeds`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: feedName,
          format: "TSV",
          location: feedUrl,
          default_availability: "IN_STOCK",
          default_currency: "CAD",
        }),
      })

      const data = await response.json()
      return {
        success: response.ok,
        feedId: data.id,
      }
    } catch (error) {
      console.error("Pinterest feed creation error:", error)
      return { success: false }
    }
  }

  /**
   * Get Pinterest shopping analytics
   */
  async getShoppingAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    impressions: number
    saves: number
    clicks: number
    checkouts: number
  }> {
    try {
      const response = await fetch(
        `https://api.pinterest.com/v5/ad_accounts/${this.merchantId}/analytics?` +
          `start_date=${startDate}&` +
          `end_date=${endDate}&` +
          `metrics=IMPRESSION,SAVE,CLICKTHROUGH,CHECKOUT`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )

      const data = await response.json()

      return {
        impressions: data.metrics?.IMPRESSION || 0,
        saves: data.metrics?.SAVE || 0,
        clicks: data.metrics?.CLICKTHROUGH || 0,
        checkouts: data.metrics?.CHECKOUT || 0,
      }
    } catch (error) {
      console.error("Pinterest analytics error:", error)
      return { impressions: 0, saves: 0, clicks: 0, checkouts: 0 }
    }
  }

  /**
   * Format product for Pinterest API
   */
  private formatProductForPinterest(product: ShoppableProduct) {
    return {
      title: product.title,
      description: product.description,
      link: product.url,
      media_source: {
        source_type: "image_url",
        url: product.images[0],
      },
      product_details: {
        price: product.price / 100, // Convert cents to dollars
        currency: product.currency,
        availability: product.availability === "in stock" ? "IN_STOCK" : "OUT_OF_STOCK",
        condition: product.condition.toUpperCase(),
        brand: product.brand,
      },
    }
  }
}

// ============================================================================
// FACEBOOK SHOPS
// ============================================================================

export class FacebookShops {
  private accessToken: string
  private catalogId: string
  private pageId: string

  constructor(accessToken: string, catalogId: string, pageId: string) {
    this.accessToken = accessToken
    this.catalogId = catalogId
    this.pageId = pageId
  }

  /**
   * Create or update Facebook Shop
   */
  async setupShop(shopName: string): Promise<{ success: boolean; shopId?: string }> {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${this.pageId}/commerce_shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          name: shopName,
          catalog_id: this.catalogId,
        }),
      })

      const data = await response.json()
      return {
        success: response.ok,
        shopId: data.id,
      }
    } catch (error) {
      console.error("Facebook Shop setup error:", error)
      return { success: false }
    }
  }

  /**
   * Create a product collection in Facebook Shops
   */
  async createCollection(
    collectionName: string,
    productIds: string[]
  ): Promise<{ success: boolean; collectionId?: string }> {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${this.catalogId}/product_sets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          name: collectionName,
          filter: {
            product_ids: productIds,
          },
        }),
      })

      const data = await response.json()
      return {
        success: response.ok,
        collectionId: data.id,
      }
    } catch (error) {
      console.error("Collection creation error:", error)
      return { success: false }
    }
  }

  /**
   * Get Facebook Shops analytics
   */
  async getShopAnalytics(since: Date, until: Date) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.catalogId}/insights?` +
          `metric=product_views,product_clicks&` +
          `since=${Math.floor(since.getTime() / 1000)}&` +
          `until=${Math.floor(until.getTime() / 1000)}&` +
          `access_token=${this.accessToken}`
      )

      const data = await response.json()

      return {
        productViews: data.data?.find((m: any) => m.name === "product_views")?.values?.[0]?.value || 0,
        productClicks: data.data?.find((m: any) => m.name === "product_clicks")?.values?.[0]?.value || 0,
      }
    } catch (error) {
      console.error("Facebook Shops analytics error:", error)
      return { productViews: 0, productClicks: 0 }
    }
  }
}

// ============================================================================
// UNIFIED CATALOG SYNC
// ============================================================================

export class SocialShoppingManager {
  private instagram?: InstagramShopping
  private pinterest?: PinterestShopping
  private facebook?: FacebookShops

  constructor(config: {
    instagram?: {
      accessToken: string
      catalogId: string
      businessAccountId: string
    }
    pinterest?: {
      accessToken: string
      merchantId: string
    }
    facebook?: {
      accessToken: string
      catalogId: string
      pageId: string
    }
  }) {
    if (config.instagram) {
      this.instagram = new InstagramShopping(
        config.instagram.accessToken,
        config.instagram.catalogId,
        config.instagram.businessAccountId
      )
    }

    if (config.pinterest) {
      this.pinterest = new PinterestShopping(config.pinterest.accessToken, config.pinterest.merchantId)
    }

    if (config.facebook) {
      this.facebook = new FacebookShops(config.facebook.accessToken, config.facebook.catalogId, config.facebook.pageId)
    }
  }

  /**
   * Sync product catalog to all connected platforms
   */
  async syncAllPlatforms(products: ShoppableProduct[]): Promise<{
    instagram?: { success: boolean; errors?: string[] }
    pinterest?: { success: boolean; errors?: string[] }
    facebook?: { success: boolean; errors?: string[] }
  }> {
    const results: any = {}

    if (this.instagram) {
      results.instagram = await this.instagram.syncCatalog(products)
    }

    if (this.pinterest) {
      results.pinterest = await this.pinterest.syncCatalog(products)
    }

    // Facebook uses same catalog as Instagram
    if (this.facebook && !results.instagram) {
      // Only sync if not already synced via Instagram
      // Facebook and Instagram share the same catalog
    }

    return results
  }

  /**
   * Get unified shopping analytics across platforms
   */
  async getUnifiedAnalytics(since: Date, until: Date) {
    const analytics: any = {
      totalViews: 0,
      totalClicks: 0,
      totalCheckouts: 0,
      totalRevenue: 0,
      byPlatform: {},
    }

    if (this.instagram) {
      const igData = await this.instagram.getShoppingInsights(since, until)
      analytics.byPlatform.instagram = igData
      analytics.totalViews += igData.productViews
      analytics.totalClicks += igData.productClicks
      analytics.totalCheckouts += igData.checkouts
      analytics.totalRevenue += igData.revenue
    }

    if (this.pinterest) {
      const pinData = await this.pinterest.getShoppingAnalytics(
        since.toISOString().split("T")[0],
        until.toISOString().split("T")[0]
      )
      analytics.byPlatform.pinterest = pinData
      analytics.totalViews += pinData.impressions
      analytics.totalClicks += pinData.clicks
      analytics.totalCheckouts += pinData.checkouts
    }

    if (this.facebook) {
      const fbData = await this.facebook.getShopAnalytics(since, until)
      analytics.byPlatform.facebook = fbData
      analytics.totalViews += fbData.productViews
      analytics.totalClicks += fbData.productClicks
    }

    return analytics
  }
}

// ============================================================================
// PRODUCT FEED GENERATION
// ============================================================================

/**
 * Generate product feed for social platforms
 * Supports Google Shopping XML format (compatible with Facebook, Instagram, Pinterest)
 */
export async function generateProductFeed(format: "xml" | "csv" | "tsv" = "xml"): Promise<string> {
  try {
    // Fetch products from database
    const products = await prisma.product.findMany({
      where: {
        published: true,
      },
      include: {
        images: true,
        variants: true,
      },
    })

    if (format === "xml") {
      return generateXMLFeed(products)
    } else if (format === "csv") {
      return generateCSVFeed(products)
    } else {
      return generateTSVFeed(products)
    }
  } catch (error) {
    console.error("Product feed generation error:", error)
    throw error
  }
}

function generateXMLFeed(products: any[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n'
  xml += "  <channel>\n"
  xml += "    <title>PG Closets Product Catalog</title>\n"
  xml += "    <link>https://pgclosets.com</link>\n"
  xml += "    <description>Premium barn doors and closet solutions</description>\n"

  for (const product of products) {
    xml += "    <item>\n"
    xml += `      <g:id>${product.sku}</g:id>\n`
    xml += `      <g:title><![CDATA[${product.title}]]></g:title>\n`
    xml += `      <g:description><![CDATA[${product.description}]]></g:description>\n`
    xml += `      <g:link>https://pgclosets.com/products/${product.slug}</g:link>\n`
    xml += `      <g:image_link>${product.images[0]?.url}</g:image_link>\n`

    for (let i = 1; i < Math.min(product.images.length, 10); i++) {
      xml += `      <g:additional_image_link>${product.images[i].url}</g:additional_image_link>\n`
    }

    xml += `      <g:availability>${product.stock > 0 ? "in stock" : "out of stock"}</g:availability>\n`
    xml += `      <g:price>${(product.price / 100).toFixed(2)} CAD</g:price>\n`
    xml += `      <g:brand>PG Closets</g:brand>\n`
    xml += `      <g:condition>new</g:condition>\n`
    xml += `      <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Doors</g:google_product_category>\n`
    xml += `      <g:product_type>${product.category}</g:product_type>\n`
    xml += "    </item>\n"
  }

  xml += "  </channel>\n"
  xml += "</rss>"

  return xml
}

function generateCSVFeed(products: any[]): string {
  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "availability",
    "price",
    "brand",
    "condition",
    "google_product_category",
    "product_type",
  ]

  let csv = headers.join(",") + "\n"

  for (const product of products) {
    const row = [
      product.sku,
      `"${product.title.replace(/"/g, '""')}"`,
      `"${product.description.replace(/"/g, '""')}"`,
      `https://pgclosets.com/products/${product.slug}`,
      product.images[0]?.url,
      product.stock > 0 ? "in stock" : "out of stock",
      `${(product.price / 100).toFixed(2)} CAD`,
      "PG Closets",
      "new",
      "Home & Garden > Decor > Doors",
      product.category,
    ]

    csv += row.join(",") + "\n"
  }

  return csv
}

function generateTSVFeed(products: any[]): string {
  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "availability",
    "price",
    "brand",
    "condition",
    "google_product_category",
    "product_type",
  ]

  let tsv = headers.join("\t") + "\n"

  for (const product of products) {
    const row = [
      product.sku,
      product.title,
      product.description,
      `https://pgclosets.com/products/${product.slug}`,
      product.images[0]?.url,
      product.stock > 0 ? "in stock" : "out of stock",
      `${(product.price / 100).toFixed(2)} CAD`,
      "PG Closets",
      "new",
      "Home & Garden > Decor > Doors",
      product.category,
    ]

    tsv += row.join("\t") + "\n"
  }

  return tsv
}

// ============================================================================
// EXPORTS
// ============================================================================

export { InstagramShopping, PinterestShopping, FacebookShops, SocialShoppingManager, generateProductFeed }
