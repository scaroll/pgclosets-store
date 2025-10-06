import type { MetadataRoute } from 'next'
import { BUSINESS_INFO } from '../lib/business-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BUSINESS_INFO.name} - Custom Closets & Storage Solutions Ottawa`,
    short_name: BUSINESS_INFO.name,
    description:
      'Official Renin dealer providing custom closet doors, storage solutions, and professional installation in Ottawa. Browse barn doors, bifold doors, and complete closet systems.',
    start_url: '/',
    display: 'standalone',
    background_color: 'var(--color-secondary)',
    theme_color: '#1e293b',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-CA',
    dir: 'ltr',
    categories: ['business', 'shopping', 'home improvement'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Products',
        short_name: 'Products',
        description: 'View our complete product catalog',
        url: '/products',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Contact Us',
        short_name: 'Contact',
        description: 'Get in touch for a free consultation',
        url: '/contact',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Request Work',
        short_name: 'Request',
        description: 'Request installation or consultation',
        url: '/request-work',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
