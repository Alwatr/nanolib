/**
 * A type representing the standard `globalThis` object.
 */
export type GlobalThis = typeof globalThis;

/**
 * A cached, cross-platform reference to the global object.
 * This IIFE (Immediately Invoked Function Expression) finds the global object
 * in any JavaScript environment (browser, Node.js, Web Worker) and caches it.
 * @private
 */
const globalThis__: GlobalThis = /* #__PURE__ */ (() => {
  if (typeof globalThis === 'object' && globalThis) return globalThis;
  if (typeof window === 'object' && window) return window;
  if (typeof global === 'object' && global) return global;
  if (typeof self === 'object' && self) return self;
  throw new Error('alwatr/global-this: Could not find the global object.');
})();

/**
 * Returns a cross-platform reference to the global `this` context.
 *
 * This function is a reliable way to get the global object, which can be `globalThis`,
 * `window`, `global`, or `self` depending on the JavaScript environment. It also allows
 * for type-casting to extend the global object with custom properties for type safety.
 *
 * @template T - An optional generic type to extend the `globalThis` type.
 * @returns {GlobalThis & T} The global `this` object, augmented with type `T`.
 *
 * @example
 * ```ts
 * // Define a type for your custom global properties
 * type MyGlobals = {
 *   myAppConfig: {
 *     version: string;
 *     apiUrl: string;
 *   }
 * };
 *
 * // Get a typed reference to the global object
 * const myGlobal = getGlobalThis<MyGlobals>();
 *
 * // Now you can access your custom properties with type safety
 * myGlobal.myAppConfig = {
 *   version: '1.0.0',
 *   apiUrl: '/api/v1',
 * };
 *
 * console.log(myGlobal.myAppConfig.version); // '1.0.0'
 * ```
 */
export function getGlobalThis<T extends DictionaryOpt = GlobalThis>(): GlobalThis & T {
  return globalThis__ as GlobalThis & T;
}
