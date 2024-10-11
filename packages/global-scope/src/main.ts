/**
 * Alternative to `globalThis` that works cross-platform.
 *
 * @example
 * ```typescript
 * globalScope.alwatr = {
 *  ...globalScope.alwatr,
 *  foo: 'bar',
 * }
 * ```
 */
export const globalScope: typeof globalThis =
  (typeof globalThis === 'object' && globalThis) ||
  (typeof window === 'object' && window) ||
  (typeof global === 'object' && global) ||
  self;

// polyfill for globalThis.
if (globalScope.globalThis !== globalScope) {
  // @ts-expect-error - Cannot assign to 'globalThis' because it is a read-only property.
  globalScope.globalThis = globalScope;
}

/**
 * A global variable that can be used to share state across modules without accessible publicly in the global scope.
 *
 * @example
 * ```typescript
 * // module1.ts
 * shareScope_.foo = 'bar';
 *
 * // module2.ts
 * console.log(shareScope_.foo); // 'bar'
 * ```
 */
export const sharedScope_: Record<string, unknown> = {};

declare global {
  // eslint-disable-next-line no-var
  var __shared_scope_defined__: string | boolean;
}

if (globalScope.__shared_scope_defined__ !== undefined) {
  if (globalScope.__shared_scope_defined__ === true) {
    globalScope.__shared_scope_defined__ = '1.1.x';
  }
  console.error(new Error('duplication_detected', {
    cause: {
      name: __package_name__,
      oldVersion: globalScope.__shared_scope_defined__,
      newVersion: __package_version__
    },
  }));
  // throw new Error('global_scope_module_duplicated');
}
globalScope.__shared_scope_defined__ = __package_version__;
