/* eslint-disable no-prototype-builtins */

/**
 * @module @alwatr/polyfill-has-own
 *
 * A polyfill for `Object.hasOwn`.
 *
 * `Object.hasOwn` is a safer alternative to `Object.prototype.hasOwnProperty` for checking
 * if an object has a property directly on itself (not inherited). It avoids issues with
 * objects that have overridden `hasOwnProperty` or have a `null` prototype.
 *
 * This module should be imported for its side effects to ensure `Object.hasOwn` is available
 * in older JavaScript environments.
 *
 * @example
 * ```ts
 * // Import the polyfill at the top of your application entry point.
 * import '@alwatr/polyfill-has-own';
 *
 * const obj = { foo: 'bar' };
 * console.log(Object.hasOwn(obj, 'foo')); // true
 *
 * const inherited = Object.create({ baz: 'qux' });
 * console.log(Object.hasOwn(inherited, 'baz')); // false
 * ```
 */
if (Object.prototype.hasOwnProperty.call(Object, 'hasOwn') === false) {
  // @ts-expect-error - TS doesn't know about this polyfill.
  Object.hasOwn = Object.call.bind(Object.prototype.hasOwnProperty);
}
