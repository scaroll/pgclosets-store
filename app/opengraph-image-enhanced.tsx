/**
 * AGENTS 36-40: Enhanced Dynamic Open Graph Image Generator
 * Creates dynamic OG images for all page types with rich visual content
 */

import { ImageResponse } from 'next/og'
import { BUSINESS_INFO } from '../lib/business-config'

// Image metadata
export const runtime = 'edge'
export const alt = 'PG Closets - Premium Closet Doors & Storage Solutions in Ottawa'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Type definitions for dynamic image generation
interface OGImageProps {
  title?: string
  subtitle?: string
  description?: string
  type?: 'default' | 'product' | 'category' | 'location' | 'service' | 'article'
  price?: string
  rating?: number
  location?: string
  badge?: string
  features?: string[]
  image?: string
}

/**
 * Default Open Graph Image
 */
export default async function Image() {
  return generateOGImage({
    type: 'default'
  })
}

/**
 * Generate dynamic Open Graph images based on page type
 */
export async function generateOGImage(props: OGImageProps) {
  const {
    title = BUSINESS_INFO.name,
    subtitle = BUSINESS_INFO.tagline,
    description = 'Custom Closets & Storage Solutions',
    type = 'default',
    price,
    rating,
    location = 'Ottawa',
    badge,
    features = ['Professional Installation', 'Lifetime Warranty', '2-Week Delivery'],
    image
  } = props

  // Load custom font if available
  // const fontData = await fetch(
  //   new URL('../public/fonts/inter-bold.ttf', import.meta.url),
  // ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: type === 'product'
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            opacity: type === 'product' ? 1 : 0.95,
          }}
        />

        {/* Pattern overlay for visual interest */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Main content container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 80px',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Header with logo and badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Logo placeholder */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: type === 'product' ? '#1e293b' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: type === 'product' ? 'white' : '#1e293b',
                }}
              >
                PG
              </div>
              {badge && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '18px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {badge}
                </div>
              )}
            </div>

            {/* Rating for products */}
            {rating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '20px',
                        color: i < Math.floor(rating) ? '#facc15' : 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      ★
                    </div>
                  ))}
                </div>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: type === 'product' ? '#1e293b' : 'white',
                  }}
                >
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: type === 'product' ? '56px' : '72px',
                fontWeight: 'bold',
                lineHeight: 1.1,
                color: type === 'product' ? '#1e293b' : 'white',
                letterSpacing: '-0.02em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '400',
                  color: type === 'product' ? '#475569' : 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.3,
                }}
              >
                {subtitle}
              </div>
            )}

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '300',
                  color: type === 'product' ? '#64748b' : 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.4,
                  maxWidth: '800px',
                }}
              >
                {description}
              </div>
            )}

            {/* Price for products */}
            {price && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  marginTop: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#ef4444',
                  }}
                >
                  {price}
                </span>
                <span
                  style={{
                    fontSize: '24px',
                    color: '#64748b',
                    textDecoration: 'line-through',
                  }}
                >
                  {/* Original price if on sale */}
                </span>
              </div>
            )}

            {/* Location badge */}
            {location && type === 'location' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  📍
                </div>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: '500',
                    color: 'white',
                  }}
                >
                  Serving {location} & Surrounding Areas
                </span>
              </div>
            )}
          </div>

          {/* Footer with features */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '40px',
              borderTop: type === 'product'
                ? '2px solid rgba(30, 41, 59, 0.1)'
                : '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Features list */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
              }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: type === 'product'
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </div>
                  <span
                    style={{
                      fontSize: '20px',
                      color: type === 'product' ? '#64748b' : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Call to action or website URL */}
            <div
              style={{
                fontSize: '18px',
                fontWeight: '500',
                color: type === 'product' ? '#1e293b' : 'rgba(255, 255, 255, 0.8)',
                letterSpacing: '0.02em',
              }}
            >
              pgclosets.com
            </div>
          </div>
        </div>

        {/* Product image overlay (if provided) */}
        {image && type === 'product' && (
          <div
            style={{
              position: 'absolute',
              right: '80px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '400px',
              height: '400px',
              borderRadius: '20px',
              background: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
      </div>
    ),
    {
      ...size,
      // fonts: [
      //   {
      //     name: 'Inter',
      //     data: fontData,
      //     style: 'normal',
      //     weight: 700,
      //   },
      // ],
    }
  )
}

/**
 * Generate product-specific OG image
 */
export async function generateProductOGImage(product: {
  name: string
  category: string
  price: number
  description?: string
  rating?: number
  image?: string
}) {
  return generateOGImage({
    title: product.name,
    subtitle: product.category,
    ...(product.description !== undefined && { description: product.description }),
    type: 'product',
    price: `$${product.price}`,
    ...(product.rating !== undefined && { rating: product.rating }),
    badge: 'Renin',
    ...(product.image !== undefined && { image: product.image })
  })
}

/**
 * Generate category-specific OG image
 */
export async function generateCategoryOGImage(category: {
  name: string
  description: string
  productCount: number
}) {
  return generateOGImage({
    title: category.name,
    subtitle: `${category.productCount}+ Premium Options`,
    description: category.description,
    type: 'category',
    badge: 'Shop Now'
  })
}

/**
 * Generate location-specific OG image
 */
export async function generateLocationOGImage(location: {
  name: string
  description?: string
}) {
  return generateOGImage({
    title: `Premium Closet Solutions`,
    subtitle: `Serving ${location.name}`,
    description: location.description || 'Professional installation with lifetime warranty',
    type: 'location',
    location: location.name
  })
}

/**
 * Generate service-specific OG image
 */
export async function generateServiceOGImage(service: {
  name: string
  description: string
}) {
  return generateOGImage({
    title: service.name,
    subtitle: 'Professional Service',
    description: service.description,
    type: 'service',
    features: ['Expert Installation', 'Free Consultation', 'Lifetime Support']
  })
}