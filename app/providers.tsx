"use client";

import {
  DataThemeProvider,
  IconProvider,
  ThemeProvider,
  ToastProvider,
} from "@once-ui-system/core";

/**
 * Once UI Providers Wrapper
 *
 * Provides theming, icons, and toast notifications for the entire app
 * Integrates Once UI design system with PG Closets branding
 */
export function OnceUIProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DataThemeProvider>
        <ToastProvider>
          <IconProvider>{children}</IconProvider>
        </ToastProvider>
      </DataThemeProvider>
    </ThemeProvider>
  );
}
