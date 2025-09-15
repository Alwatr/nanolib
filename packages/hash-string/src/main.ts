/**
 * A fast, non-cryptographic hashing function that generates a short, fixed-length hash from a string or number.
 *
 * This function is designed for speed and is suitable for use cases like generating unique IDs,
 * cache keys, or for data partitioning. It is **not** cryptographically secure and should not be
 * used for security-sensitive applications like password hashing.
 *
 * The hashing process can be repeated recursively to increase complexity, though this also
 * increases computation time.
 *
 * @param {string | number} str - The input string or number to hash. If a number is provided, it will be converted to a string.
 * @param {string} prefix - A prefix to be prepended to the final hash result.
 * @param {number} [repeat=1] - The number of times to recursively apply the hashing algorithm. Must be >= 1.
 * @returns {string} The resulting prefixed hash string.
 *
 * @example
 * ```ts
 * // Basic hash
 * const basicHash = nanoHash('hello-world', 'hw-');
 * console.log(basicHash); // e.g., 'hw-2i2u5b2i2u5b'
 *
 * // Hash with multiple repetitions for added complexity
 * const repeatedHash = nanoHash('hello-world', 'hw-', 3);
 * console.log(repeatedHash); // e.g., 'hw-1a2b3c1a2b3c'
 *
 * // Hashing a number
 * const numberHash = nanoHash(12345, 'num-');
 * console.log(numberHash); // e.g., 'num-x5y6z7x5y6z7'
 * ```
 */
export function nanoHash(str: string | number, prefix: string, repeat = 1): string {
  if (repeat < 1) {
    throw new Error('The repeat parameter must be greater than or equal to 1');
  }

  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c6ce57;

  if (typeof str === 'number') {
    str = str.toString();
  }

  const len = str.length;
  for (let i = 0; i < len; i++) {
    const char = str.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ char, 2654435761);
    hash2 = Math.imul(hash2 ^ char, 1597334677);
  }

  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);

  const result = prefix + (hash1 >>> 0).toString(36) + (hash2 >>> 0).toString(36);

  if (repeat === 1) {
    return result;
  }
  else {
    // Recursively hash the result for added complexity.
    return nanoHash(result, prefix, repeat - 1);
  }
}
