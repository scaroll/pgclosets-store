'use client';

import { VercelToolbar } from '@vercel/toolbar/next';
import { useEffect, useState } from 'react';

export function VercelToolbarWrapper() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check URL parameters for toolbar activation
    const params = new URLSearchParams(window.location.search);
    const hasToolbarParam = params.has('vercel-toolbar');

    // Show in development, preview, or when explicitly enabled via URL parameter
    const shouldInjectToolbar =
      process.env.NODE_ENV === 'development' ||
      process.env.VERCEL_ENV === 'preview' ||
      hasToolbarParam;

    setShouldShow(shouldInjectToolbar);
  }, []);

  if (!shouldShow) {
    return null;
  }

  return <VercelToolbar />;
}
