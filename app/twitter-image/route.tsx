import { ImageResponse } from 'next/og'
import { BUSINESS_INFO } from '../../lib/business-config'

export const runtime = 'nodejs'
export const alt = `${BUSINESS_INFO.name} - Custom Closets Ottawa`
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          {BUSINESS_INFO.name}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          Official Renin Dealer
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            textAlign: 'center',
            marginTop: '30px',
            opacity: 0.95,
          }}
        >
          Custom Closets & Storage Solutions in Ottawa
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}