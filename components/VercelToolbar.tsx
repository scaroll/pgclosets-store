'use client';

import { VercelToolbar } from '@vercel/toolbar/next';

export function VercelToolbarWrapper() {
  // Only show toolbar in preview deployments and development
  const shouldInjectToolbar = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';

  if (!shouldInjectToolbar) {
    return null;
  }

  return <VercelToolbar />;
}
