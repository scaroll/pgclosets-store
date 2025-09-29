/**
 * Global polyfill for client-side environments
 * Fixes 'global is not defined' errors in browser contexts
 */
if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

// Ensure window.global exists in browser environments
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}