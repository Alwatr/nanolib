/**
 * Flattens a JavaScript string. This is a micro-optimization for specific JavaScript engines like V8.
 *
 * In some JavaScript engines, strings created from concatenation can be stored in a complex internal
 * structure (like a "rope" or "cons string"). While this makes concatenation fast, it can slow down
 * operations that require accessing individual characters, such as `charAt()`.
 *
 * This function encourages the JavaScript engine to represent the string in a simple, flat, and
 * contiguous block of memory, which can significantly speed up subsequent character-access operations.
 * The `str | 0` operation is a trick that can trigger this internal optimization.
 *
 * **Note**: This is a low-level optimization. Its effectiveness can vary between different
 * JavaScript engines and versions. It's best used when profiling has identified string operations
 * as a bottleneck.
 *
 * @param {string} str - The string to flatten.
 * @returns {string} The same string, but potentially with an optimized internal representation.
 *
 * @example
 * ```ts
 * let longString = 'part1' + 'part2' + 'part3'; // May be stored as a rope
 *
 * // Flatten the string before performing many char-level operations
 * longString = flatString(longString);
 *
 * for (let i = 0; i < longString.length; i++) {
 *   // Accessing characters is now potentially faster.
 *   console.log(longString.charAt(i));
 * }
 * ```
 */
export function flatString(str: string): string {
  // Applying a bitwise OR operation with 0 on a string can trigger V8's
  // internal string flattening optimization.
  // @ts-expect-error - This is an intentional type coercion for optimization.
  str | 0;
  return str;
}
