/**
 * First 32-bit seed for the cyrb53 hash function.
 * @private
 */
const H1_SEED = 0xdeadbeef;

/**
 * Second 32-bit seed for the cyrb53 hash function.
 * @private
 */
const H2_SEED = 0x41c6ce57;

/**
 * Multiplication constant for the first hash part.
 * @private
 */
const M_K1 = 2654435761;

/**
 * Multiplication constant for the second hash part.
 * @private
 */
const M_K2 = 1597334677;

/**
 * Finalization constant for the first hash part.
 * @private
 */
const F_K1 = 2246822507;

/**
 * Finalization constant for the second hash part.
 * @private
 */
const F_K2 = 3266489909;

/**
 * Constant for combining the two 32-bit hash parts into a 53-bit hash. Represents 2^32.
 * @private
 */
const P_K1 = 4294967296; // 2^32

/**
 * Mask for combining the two 32-bit hash parts into a 53-bit hash. Represents 2^21 - 1.
 * @private
 */
const P_K2 = 2097151; // 2^21 - 1

/**
 * cyrb53: A modern, high-quality, and fast 53-bit string hash function.
 *
 * This function provides excellent collision resistance due to its large 53-bit output space,
 * making it a great choice for general-purpose string hashing in JavaScript/TypeScript.
 * It is a non-cryptographic hash function.
 *
 * @param {string} str - The input string to hash.
 * @param {number} [seed=0] - An optional seed value to initialize the hash.
 * @returns {number} A 53-bit hash number.
 *
 * @example
 * ```ts
 * // Basic usage
 * const hash1 = cyrb53('some string');
 * console.log(hash1);
 *
 * // Usage with a seed
 * const hash2 = cyrb53('some string', 123);
 * console.log(hash2);
 * ```
 */
export function cyrb53(str: string, seed = 0): number {
  let h1 = H1_SEED ^ seed;
  let h2 = H2_SEED ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, M_K1);
    h2 = Math.imul(h2 ^ ch, M_K2);
  }

  // Finalize hashes
  h1 = Math.imul(h1 ^ (h1 >>> 16), F_K1);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), F_K2);
  h2 = Math.imul(h2 ^ (h2 >>> 16), F_K1);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), F_K2);

  return P_K1 * (P_K2 & h2) + (h1 >>> 0);
}
