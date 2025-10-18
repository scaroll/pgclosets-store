"use client";

/**
 * Critical CSS Loader Component
 * Extracts and inlines critical CSS for above-the-fold content
 * Reduces First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
 */

import { useEffect } from "react";

const criticalStyles = `
  /* Critical layout styles */
  html {
    color-scheme: light;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: var(--color-primary);
    background: var(--color-secondary);
    font-size: 16px;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Critical navigation */
  .nav-modern {
    height: 64px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid #f1f5f9;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  /* Critical container */
  .container-apple {
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
  }

  /* Critical button styles */
  .btn-primary {
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border-radius: 0;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    padding: 16px 32px;
    border: 2px solid var(--color-primary);
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  /* Critical typography */
  .text-h1 {
    font-size: 48px;
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--color-primary);
  }

  /* Loading skeleton */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }

  /* Prevent layout shift */
  img, video {
    max-width: 100%;
    height: auto;
  }

  /* Critical grid */
  .grid {
    display: grid;
  }

  /* Responsive breakpoints */
  @media (min-width: 1024px) {
    .nav-modern {
      height: 72px;
    }
    .text-h1 {
      font-size: 64px;
    }
    .container-apple {
      padding-left: 32px;
      padding-right: 32px;
    }
  }
`;

export default function CriticalCSS() {
  useEffect(() => {
    // Preload critical fonts
    const fontPreload = document.createElement("link");
    fontPreload.rel = "preload";
    fontPreload.as = "font";
    fontPreload.type = "font/woff2";
    fontPreload.crossOrigin = "anonymous";
    fontPreload.href = "/fonts/inter-var.woff2";
    document.head.appendChild(fontPreload);

    // Mark critical CSS as loaded
    document.documentElement.classList.add("critical-css-loaded");
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{ __html: criticalStyles }}
      data-critical="true"
    />
  );
}
