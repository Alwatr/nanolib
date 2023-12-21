/**
 * Clone deeply nested objects and arrays.
 *
 * @param obj The object to clone.
 * @returns A clone of the object.
 * @example
 * ```typescript
 * const obj2 = deepClone(obj1);
 * ```
 */
export function deepClone<T>(obj: T): T;

/**
 * Clone deeply nested objects and arrays.
 *
 * if the object is null or undefined, it returns null.
 *
 * @param obj The object to clone.
 * @returns A clone of the object.
 * @example
 * ```typescript
 * const obj2 = deepClone(obj1);
 * ```
 */
export function deepClone<T>(obj: T | null | undefined): T | null;

export function deepClone<T>(obj: T | null | undefined): T | null {
  if (obj == null) return null;
  return JSON.parse(JSON.stringify(obj));
}
