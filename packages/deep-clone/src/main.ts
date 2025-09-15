/**
 * Creates a deep clone of a given value.
 *
 * This function handles deeply nested objects and arrays. It uses `JSON.parse(JSON.stringify(value))`
 * for cloning, which is fast but has some limitations:
 * - Functions, `undefined` properties, and Symbols are lost.
 * - `Date` objects are converted to ISO date strings.
 * - `RegExp`, `Map`, `Set`, and other complex types are not handled correctly.
 * - Circular references will cause an error.
 *
 * It's suitable for cloning plain objects and arrays that are serializable to JSON.
 *
 * @template T The type of the value to clone.
 *
 * @param {T} obj - The value to clone. Can be an object, array, or primitive.
 * @returns {T} A deep clone of the input value.
 *
 * @example
 * ```ts
 * const original = {
 *   a: 1,
 *   b: {
 *     c: 'hello',
 *     d: new Date(),
 *   },
 *   e: [1, { f: 2 }],
 *   g: undefined,
 * };
 *
 * const cloned = deepClone(original);
 *
 * console.log(original.b.c); // 'hello'
 * console.log(cloned.b.c);   // 'hello'
 *
 * cloned.b.c = 'world';
 *
 * console.log(original.b.c); // 'hello'
 * console.log(cloned.b.c);   // 'world'
 *
 * console.log(original.b.d instanceof Date); // true
 * console.log(typeof cloned.b.d); // 'string'
 *
 * console.log('g' in original); // true
 * console.log('g' in cloned);   // false
 * ```
 */
export function deepClone<T>(obj: T): T;
/**
 * Creates a deep clone of a given value, handling null and undefined.
 *
 * @param {T | null | undefined} obj - The value to clone.
 * @returns {T | null} A deep clone of the object, or `null` if the input is `null` or `undefined`.
 */
export function deepClone<T>(obj: T | null | undefined): T | null;
export function deepClone<T>(obj: T | null | undefined): T | null {
  if (obj == null) return null;

  // `structuredClone` is generally more robust, but the original author noted that
  // `JSON.stringify` was faster for their use cases. We'll stick with the original
  // implementation for now, but this is a potential area for future improvement.
  //
  // if (typeof structuredClone === 'function') {
  //   return structuredClone(obj);
  // }
  return JSON.parse(JSON.stringify(obj));
}
