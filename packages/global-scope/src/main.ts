/**
 * Alternative to `globalThis` that works cross-platform.
 */
export const globalScope =
  (typeof globalThis === 'object' && globalThis) ||
  ('object' === typeof window && window) ||
  ('object' === typeof global && global) ||
  self;
