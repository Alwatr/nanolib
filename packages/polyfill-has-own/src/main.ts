/* eslint-disable no-prototype-builtins */

/**
 * A polyfill for Object.hasOwn
 *
 * @example
 * ```typescript
 * import '@alwatr/polyfill-has-own';
 *
 * const obj = { foo: 'bar' };
 * Object.hasOwn(obj, 'foo'); // true
 * ```
 */
if (Object.hasOwnProperty('hasOwn') === false) {
  // @ts-expect-error - TS doesn't know about this polyfill
  Object.hasOwn = Object.call.bind(Object.hasOwnProperty);
}
