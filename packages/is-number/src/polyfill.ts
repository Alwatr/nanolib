/**
 * Number.isFinite simple polyfill
 */
if (typeof Number.isFinite !== 'function') {
  Number.isFinite = isFinite;
}
