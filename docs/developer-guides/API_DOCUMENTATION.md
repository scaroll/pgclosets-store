# API Documentation

> **Complete reference for PG Closets API endpoints**

## 📋 Table of Contents

- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Products API](#products-api)
- [Quotes API](#quotes-api)
- [Contact API](#contact-api)
- [Analytics API](#analytics-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🌐 API Overview

### Base URL

```
Development: http://localhost:3000/api
Production:  https://www.pgclosets.com/api
```

### API Versioning

Currently, the API is unversioned. Future versions will use URL path versioning:

```
/api/v1/products
/api/v2/products
```

### Content Type

All requests and responses use JSON:

```
Content-Type: application/json
```

### Response Format

**Success Response:**
```json
{
  "data": { /* response data */ },
  "success": true,
  "timestamp": "2025-10-14T12:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "success": false,
  "timestamp": "2025-10-14T12:00:00Z"
}
```

## 🔐 Authentication

### API Key Authentication

For server-to-server requests:

```typescript
// Request header
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

### User Authentication

For user-specific requests:

```typescript
// Using Supabase Auth
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();
const { data: { session } } = await supabase.auth.getSession();

// Include session token in requests
headers: {
  'Authorization': `Bearer ${session?.access_token}`,
  'Content-Type': 'application/json'
}
```

## 📦 Products API

### List Products

**Endpoint:** `GET /api/products`

**Description:** Retrieve a list of products with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter by category slug |
| `search` | string | No | Search in title and description |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `sort` | string | No | Sort by: `price_asc`, `price_desc`, `title_asc`, `title_desc` |
| `minPrice` | number | No | Minimum price filter |
| `maxPrice` | number | No | Maximum price filter |
| `featured` | boolean | No | Filter featured products only |

**Example Request:**

```typescript
const response = await fetch('/api/products?category=closet-doors&sort=price_asc&limit=12');
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "data": {
    "products": [
      {
        "id": "123",
        "slug": "modern-closet-door",
        "title": "Modern Closet Door",
        "description": "Sleek modern closet door with premium finish",
        "price": 299.99,
        "compareAtPrice": 399.99,
        "category": {
          "id": "cat-1",
          "slug": "closet-doors",
          "name": "Closet Doors"
        },
        "images": [
          {
            "url": "/products/modern-closet-door.jpg",
            "alt": "Modern Closet Door",
            "width": 800,
            "height": 600
          }
        ],
        "featured": true,
        "inStock": true,
        "metadata": {
          "material": "Wood",
          "finish": "Walnut",
          "dimensions": "80x36 inches"
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-10-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 48,
      "pages": 4
    }
  },
  "success": true
}
```

### Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Description:** Retrieve a single product by ID or slug.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product ID or slug |

**Example Request:**

```typescript
const response = await fetch('/api/products/modern-closet-door');
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "123",
    "slug": "modern-closet-door",
    "title": "Modern Closet Door",
    "description": "Detailed product description...",
    "price": 299.99,
    "compareAtPrice": 399.99,
    "category": { /* category object */ },
    "images": [ /* image array */ ],
    "specifications": {
      "material": "Solid Wood",
      "finish": "Walnut Stain",
      "dimensions": "80H x 36W inches",
      "weight": "45 lbs",
      "warranty": "5 years"
    },
    "relatedProducts": [ /* related products */ ],
    "seo": {
      "title": "Modern Closet Door - Premium Wood Finish | PG Closets",
      "description": "High-quality modern closet door...",
      "keywords": ["closet door", "modern door", "wood door"]
    }
  },
  "success": true
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND",
  "success": false
}
```

### Search Products

**Endpoint:** `GET /api/products/search`

**Description:** Full-text search across products.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `category` | string | No | Filter by category |
| `limit` | number | No | Max results (default: 20) |

**Example Request:**

```typescript
const response = await fetch('/api/products/search?q=modern%20door&limit=10');
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "data": {
    "results": [ /* product array */ ],
    "query": "modern door",
    "total": 15,
    "took": 23
  },
  "success": true
}
```

## 💬 Quotes API

### Create Quote Request

**Endpoint:** `POST /api/quotes`

**Description:** Submit a new quote request.

**Request Body:**

```json
{
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-613-555-1234",
    "address": {
      "street": "123 Main St",
      "city": "Ottawa",
      "province": "ON",
      "postalCode": "K1A 0A1"
    }
  },
  "projectInfo": {
    "type": "residential",
    "timeline": "1-3 months",
    "budget": "5000-10000",
    "description": "Looking to install custom closet doors in 3 bedrooms"
  },
  "products": [
    {
      "productId": "123",
      "quantity": 3,
      "notes": "Prefer walnut finish"
    }
  ],
  "preferredContactMethod": "email",
  "source": "website"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "quoteId": "QT-2025-001234",
    "status": "pending",
    "estimatedResponse": "2025-10-16T12:00:00Z",
    "confirmationEmail": "sent",
    "createdAt": "2025-10-14T12:00:00Z"
  },
  "success": true
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "success": false
}
```

### Get Quote Status

**Endpoint:** `GET /api/quotes/:quoteId`

**Description:** Retrieve quote status and details.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `quoteId` | string | Yes | Quote ID |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Customer email for verification |

**Example Request:**

```typescript
const response = await fetch('/api/quotes/QT-2025-001234?email=john@example.com');
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "data": {
    "quoteId": "QT-2025-001234",
    "status": "reviewed",
    "submittedAt": "2025-10-14T12:00:00Z",
    "respondedAt": "2025-10-15T10:00:00Z",
    "estimatedCost": {
      "min": 8500,
      "max": 12000,
      "currency": "CAD"
    },
    "response": {
      "message": "Thank you for your quote request...",
      "nextSteps": "Our team will contact you to schedule a consultation"
    }
  },
  "success": true
}
```

## 📧 Contact API

### Submit Contact Form

**Endpoint:** `POST /api/contact`

**Description:** Submit a general contact form.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-613-555-1234",
  "subject": "Product Inquiry",
  "message": "I have questions about your barn door collection",
  "preferredContact": "email"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "messageId": "MSG-2025-001234",
    "status": "received",
    "estimatedResponse": "24-48 hours",
    "confirmationSent": true
  },
  "success": true
}
```

## 📊 Analytics API

### Track Event

**Endpoint:** `POST /api/analytics/events`

**Description:** Track custom analytics events.

**Request Body:**

```json
{
  "event": "product_viewed",
  "properties": {
    "productId": "123",
    "productTitle": "Modern Closet Door",
    "category": "closet-doors",
    "price": 299.99
  },
  "timestamp": "2025-10-14T12:00:00Z"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "tracked": true,
    "eventId": "evt_abc123"
  },
  "success": true
}
```

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Description | When to Use |
|------|-------------|-------------|
| 200 | OK | Successful GET/PUT/PATCH requests |
| 201 | Created | Successful POST requests creating resources |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but lacking permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists or state conflict |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary server issue |

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;           // Human-readable error message
  code: string;            // Machine-readable error code
  details?: any[];         // Additional error details (validation errors, etc.)
  success: false;
  timestamp: string;       // ISO 8601 timestamp
  requestId?: string;      // For support troubleshooting
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_REQUIRED` | Authentication is required |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `DATABASE_ERROR` | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | Third-party service error |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

### Error Handling Example

```typescript
async function fetchProduct(id: string) {
  try {
    const response = await fetch(`/api/products/${id}`);

    if (!response.ok) {
      const error = await response.json();

      switch (response.status) {
        case 404:
          throw new Error('Product not found');
        case 429:
          throw new Error('Too many requests. Please try again later.');
        default:
          throw new Error(error.error || 'Something went wrong');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
```

## 🚦 Rate Limiting

### Rate Limits

| Endpoint Type | Rate Limit | Window |
|--------------|------------|---------|
| Public Endpoints | 100 requests | 1 minute |
| Authenticated Endpoints | 1000 requests | 1 minute |
| Search Endpoints | 30 requests | 1 minute |
| Quote Submissions | 5 requests | 1 hour |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634213400
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60,
  "success": false
}
```

## 🔧 API Client Example

### TypeScript API Client

```typescript
// lib/api/client.ts
class APIClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);

    if (params) {
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
      );
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    return data.data as T;
  }
}

export const apiClient = new APIClient();
```

### Usage Example

```typescript
// Using the API client
import { apiClient } from '@/lib/api/client';

// Fetch products
const products = await apiClient.get('/products', {
  category: 'closet-doors',
  limit: 12
});

// Submit quote
const quote = await apiClient.post('/quotes', {
  customerInfo: { /* ... */ },
  projectInfo: { /* ... */ }
});
```

## 📚 Related Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Data models and relationships
- [Authentication Guide](./AUTHENTICATION.md) - Auth implementation details
- [Security Guide](./SECURITY_GUIDE.md) - API security best practices
- [Testing Guide](./TESTING_GUIDE.md) - API testing strategies

---

For questions or issues with the API, please contact the development team or create an issue on GitHub.
