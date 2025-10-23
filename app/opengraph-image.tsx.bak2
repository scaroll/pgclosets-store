import { ImageResponse } from 'next/og'
import { BUSINESS_INFO } from '../lib/business-config'

// Image metadata
export const alt = `${BUSINESS_INFO.name} - Custom Closets & Storage Solutions Ottawa`
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              textAlign: 'center',
            }}
          >
            {BUSINESS_INFO.name}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 300,
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            {BUSINESS_INFO.tagline}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              textAlign: 'center',
              marginTop: '40px',
              opacity: 0.95,
              lineHeight: 1.4,
            }}
          >
            Custom Closets & Storage Solutions
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              textAlign: 'center',
              opacity: 0.8,
            }}
          >
            Serving Ottawa & Surrounding Areas
          </div>
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '40px',
              fontSize: 24,
              fontWeight: 300,
              opacity: 0.9,
            }}
          >
            <div>✓ Professional Installation</div>
            <div>✓ Lifetime Warranty</div>
            <div>✓ 2-Week Delivery</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
