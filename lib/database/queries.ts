import { createClient } from "@/lib/supabase/server";
import { sanitizeForSQL, sanitizeText } from "@/lib/validation/sanitization";

/**
 * Database query utilities with built-in SQL injection prevention
 * All queries use parameterized statements through Supabase client
 */

export class DatabaseQueries {
  private static client = createClient();

  /**
   * Safe quote request insertion with validation
   */
  static async insertQuoteRequest(data: {
    quoteNumber: string;
    receivedAt: string;
    productName: string;
    productCategory: string;
    productPrice?: number;
    productOptions?: Record<string, string>;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerProvince?: string;
    notes?: string;
    metadata?: Record<string, any>;
  }) {
    // All parameters are automatically sanitized by Supabase client
    const { data: result, error } = await this.client
      .from("quote_requests")
      .insert({
        quote_number: data.quoteNumber,
        received_at: data.receivedAt,
        product_name: data.productName,
        product_category: data.productCategory,
        product_price: data.productPrice,
        product_options: data.productOptions,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        customer_province: data.customerProvince,
        notes: data.notes,
        metadata: data.metadata,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Database insert error:", error);
      throw new Error("Failed to insert quote request");
    }

    return result[0];
  }

  /**
   * Safe contact form submission
   */
  static async insertContactSubmission(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    const { data: result, error } = await this.client
      .from("contact_submissions")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        metadata: data.metadata,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Database insert error:", error);
      throw new Error("Failed to insert contact submission");
    }

    return result[0];
  }

  /**
   * Safe product retrieval with filtering
   */
  static async getProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    limit?: number;
    offset?: number;
    searchQuery?: string;
  } = {}) {
    let query = this.client
      .from("products")
      .select("*");

    // Apply filters using parameterized queries
    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.searchQuery) {
      // Use Supabase's text search functionality
      query = query.textSearch("name", filters.searchQuery, {
        type: "websearch",
        config: "english",
      });
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database query error:", error);
      throw new Error("Failed to retrieve products");
    }

    return data;
  }

  /**
   * Safe product by ID/handle retrieval
   */
  static async getProductByHandle(handle: string) {
    // Sanitize the handle parameter
    const sanitizedHandle = sanitizeText(handle);

    const { data, error } = await this.client
      .from("products")
      .select("*")
      .eq("handle", sanitizedHandle)
      .eq("status", "active")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No rows found
      }
      console.error("Database query error:", error);
      throw new Error("Failed to retrieve product");
    }

    return data;
  }

  /**
   * Safe file upload record insertion
   */
  static async insertFileUpload(data: {
    originalName: string;
    uniqueName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedBy?: string;
    metadata?: Record<string, any>;
  }) {
    const { data: result, error } = await this.client
      .from("file_uploads")
      .insert({
        original_name: data.originalName,
        unique_name: data.uniqueName,
        url: data.url,
        size: data.size,
        mime_type: data.mimeType,
        uploaded_by: data.uploadedBy,
        metadata: data.metadata,
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Database insert error:", error);
      throw new Error("Failed to record file upload");
    }

    return result[0];
  }

  /**
   * Safe user activity logging
   */
  static async logActivity(data: {
    userId?: string;
    action: string;
    resource?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { error } = await this.client
      .from("activity_logs")
      .insert({
        user_id: data.userId,
        action: data.action,
        resource: data.resource,
        metadata: data.metadata,
        ip_address: data.ipAddress,
        user_agent: data.userAgent?.substring(0, 500), // Limit length
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Activity log error:", error);
      // Don't throw error for logging failures
    }
  }

  /**
   * Safe search with full-text search and filters
   */
  static async searchProducts(query: {
    searchTerm: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  }) {
    // Sanitize search term
    const sanitizedTerm = sanitizeText(query.searchTerm);

    let dbQuery = this.client
      .from("products")
      .select("*")
      .eq("status", "active");

    // Apply text search
    if (sanitizedTerm) {
      dbQuery = dbQuery.or(
        `name.ilike.%${sanitizedTerm}%,description.ilike.%${sanitizedTerm}%,category.ilike.%${sanitizedTerm}%`
      );
    }

    // Apply filters
    if (query.category) {
      dbQuery = dbQuery.eq("category", query.category);
    }

    if (query.minPrice !== undefined) {
      dbQuery = dbQuery.gte("price", query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      dbQuery = dbQuery.lte("price", query.maxPrice);
    }

    // Apply pagination
    if (query.limit) {
      dbQuery = dbQuery.limit(query.limit);
    }

    if (query.offset) {
      dbQuery = dbQuery.range(query.offset, (query.offset + (query.limit || 10)) - 1);
    }

    const { data, error } = await dbQuery.order("name");

    if (error) {
      console.error("Search query error:", error);
      throw new Error("Search failed");
    }

    return data;
  }

  /**
   * Safe aggregate queries with proper grouping
   */
  static async getProductStats() {
    // Get count by category
    const { data: categoryStats, error: categoryError } = await this.client
      .from("products")
      .select("category")
      .eq("status", "active");

    if (categoryError) {
      console.error("Category stats error:", categoryError);
      throw new Error("Failed to get category statistics");
    }

    // Get price statistics
    const { data: priceStats, error: priceError } = await this.client
      .from("products")
      .select("price")
      .eq("status", "active")
      .not("price", "is", null);

    if (priceError) {
      console.error("Price stats error:", priceError);
      throw new Error("Failed to get price statistics");
    }

    // Process results safely
    const categoryCount = categoryStats.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const prices = priceStats.map(p => p.price).filter(Boolean);
    const priceStatistics = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      count: prices.length,
    };

    return {
      categoryCount,
      priceStatistics,
      totalProducts: categoryStats.length,
    };
  }

  /**
   * Safe batch operations with transaction-like behavior
   */
  static async batchInsertProducts(products: Array<{
    name: string;
    description?: string;
    price: number;
    category: string;
    handle: string;
    status?: string;
  }>) {
    // Validate and sanitize all products first
    const sanitizedProducts = products.map(product => ({
      name: sanitizeText(product.name),
      description: product.description ? sanitizeText(product.description) : null,
      price: product.price,
      category: sanitizeText(product.category),
      handle: sanitizeText(product.handle),
      status: product.status || "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await this.client
      .from("products")
      .insert(sanitizedProducts)
      .select();

    if (error) {
      console.error("Batch insert error:", error);
      throw new Error("Failed to insert products");
    }

    return data;
  }
}

/**
 * Helper class for building safe WHERE clauses
 */
export class QueryBuilder {
  private conditions: string[] = [];
  private parameters: any[] = [];

  addCondition(column: string, operator: string, value: any) {
    // Whitelist allowed operators
    const allowedOperators = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "ILIKE", "IN"];
    if (!allowedOperators.includes(operator)) {
      throw new Error(`Invalid operator: ${operator}`);
    }

    // Whitelist allowed columns (implement based on your schema)
    const allowedColumns = [
      "name", "description", "price", "category", "status",
      "created_at", "updated_at", "handle", "id"
    ];
    if (!allowedColumns.includes(column)) {
      throw new Error(`Invalid column: ${column}`);
    }

    this.conditions.push(`${column} ${operator} $${this.parameters.length + 1}`);
    this.parameters.push(value);

    return this;
  }

  build() {
    return {
      where: this.conditions.join(" AND "),
      parameters: this.parameters,
    };
  }
}

/**
 * Database connection health check
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { error } = await createClient()
      .from("products")
      .select("id")
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}