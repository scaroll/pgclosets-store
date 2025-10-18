"use client";

/**
 * Client-Side Bundle Size Monitor
 * Tracks and reports bundle performance metrics
 */

import { useEffect } from "react";

interface BundleMetrics {
  totalSize: number;
  resourceCount: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  fontSize: number;
}

export default function BundleAnalyzer() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.performance) return;

    const analyzeBundles = () => {
      const resources = performance.getEntriesByType(
        "resource"
      );

      const metrics: BundleMetrics = {
        totalSize: 0,
        resourceCount: resources.length,
        jsSize: 0,
        cssSize: 0,
        imageSize: 0,
        fontSize: 0,
      };

      resources.forEach((resource) => {
        const size = resource.transferSize || 0;
        metrics.totalSize += size;

        if (resource.name.endsWith(".js")) {
          metrics.jsSize += size;
        } else if (resource.name.endsWith(".css")) {
          metrics.cssSize += size;
        } else if (
          resource.name.match(/\.(png|jpg|jpeg|webp|avif|gif|svg)/)
        ) {
          metrics.imageSize += size;
        } else if (resource.name.match(/\.(woff|woff2|ttf|otf)/)) {
          metrics.fontSize += size;
        }
      });

      // Log metrics in development
      if (process.env.NODE_ENV === "development") {
        console.group("📦 Bundle Analysis");
        console.log("Total Size:", formatBytes(metrics.totalSize));
        console.log("JavaScript:", formatBytes(metrics.jsSize));
        console.log("CSS:", formatBytes(metrics.cssSize));
        console.log("Images:", formatBytes(metrics.imageSize));
        console.log("Fonts:", formatBytes(metrics.fontSize));
        console.log("Resources:", metrics.resourceCount);
        console.groupEnd();
      }

      // Report to analytics in production
      if (process.env.NODE_ENV === "production" && window.gtag) {
        window.gtag("event", "bundle_size", {
          total_size: metrics.totalSize,
          js_size: metrics.jsSize,
          css_size: metrics.cssSize,
          image_size: metrics.imageSize,
          font_size: metrics.fontSize,
        });
      }

      // Check for performance issues
      if (metrics.jsSize > 500 * 1024) {
        console.warn(
          "⚠️ JavaScript bundle exceeds 500KB:",
          formatBytes(metrics.jsSize)
        );
      }

      if (metrics.totalSize > 2 * 1024 * 1024) {
        console.warn(
          "⚠️ Total bundle exceeds 2MB:",
          formatBytes(metrics.totalSize)
        );
      }
    };

    // Run analysis after page load
    if (document.readyState === "complete") {
      analyzeBundles();
    } else {
      window.addEventListener("load", analyzeBundles);
      return () => window.removeEventListener("load", analyzeBundles);
    }
  }, []);

  return null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100  } ${  sizes[i]}`;
}

// Extend Window type
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
