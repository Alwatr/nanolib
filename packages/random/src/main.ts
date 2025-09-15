import {getGlobalThis} from '@alwatr/global-this';

const globalThis = /* #__PURE__ */ getGlobalThis();

// Use the native crypto module when available for better randomness.
const hasCrypto = /* #__PURE__ */ (() => typeof globalThis.crypto !== 'undefined')();

/**
 * Converts a `Uint8Array` or a number array into a hexadecimal string.
 * Each byte is converted to a two-character hex string (e.g., `10` -> `'0a'`).
 *
 * @param {number[] | Uint8Array} bytes - The array of bytes to convert.
 * @returns {string} The hexadecimal string representation of the bytes.
 *
 * @example
 * ```ts
 * const bytes = new Uint8Array([10, 255, 0, 16]);
 * console.log(bytesToHex(bytes)); // '0aff0010'
 *
 * const array = [171, 205, 3];
 * console.log(bytesToHex(array)); // 'abcd03'
 * ```
 */
export function bytesToHex(bytes: number[] | Uint8Array): string {
  let result = '';
  for (const byte of bytes) {
    const hex = byte.toString(16);
    result += hex.length === 1 ? '0' + hex : hex;
  }
  return result;
}

/**
 * Returns a random float number between 0 (inclusive) and 1 (exclusive).
 *
 * @returns {number} A random float.
 *
 * @example
 * ```ts
 * console.log(randNumber()); // e.g., 0.7124123
 * ```
 */
export function randNumber(): number {
  return Math.random();
}

/**
 * Generates a random float number within a specified range.
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} A random float within the range.
 *
 * @example
 * ```ts
 * console.log(randFloat(1, 10)); // e.g., 5.34
 * ```
 */
export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer within a specified range.
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer within the range.
 *
 * @example
 * ```ts
 * console.log(randInteger(1, 10)); // e.g., 7
 * ```
 */
export function randInteger(min: number, max: number): number {
  return Math.floor(randFloat(min, max + 1));
}

/**
 * Generates a random string of a specified length from a given set of characters.
 *
 * @param {number} minLength - The minimum length of the string.
 * @param {number} [maxLength=minLength] - The maximum length of the string.
 * @param {string} [chars='...'] - The character set to use.
 * @returns {string} The generated random string.
 *
 * @example
 * ```ts
 * console.log(randString(6)); // e.g., 'Aab1V2'
 * console.log(randString(3, 6)); // A string with a random length between 3 and 6
 * console.log(randString(5, 5, '01')); // e.g., '10101'
 * ```
 */
export function randString(
  minLength: number,
  maxLength: number = minLength,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string {
  const length = maxLength === minLength ? minLength : randInteger(minLength, maxLength);
  if (length <= 0) return '';

  const charsLength = chars.length;

  // Small optimization for short strings
  if (length <= 10) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
  }

  // For longer strings, use array join for better performance
  const resultArray = new Array(length);
  for (let i = 0; i < length; i++) {
    resultArray[i] = chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return resultArray.join('');
}

/**
 * Generates a random integer between a min and max value, with a specified step.
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @param {number} step - The increment step.
 * @returns {number} A random integer that conforms to the step.
 *
 * @example
 * ```ts
 * console.log(randStep(6, 10, 2)); // 6, 8, or 10
 * ```
 */
export function randStep(min: number, max: number, step: number): number {
  if (step === 0) {
    return min; // Avoid division by zero
  }
  const steps = Math.floor((max - min) / step);
  return min + randInteger(0, steps) * step;
}

/**
 * Shuffles an array in place using the Fisher-Yates shuffle algorithm.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to shuffle (modified in place).
 * @returns {T[]} The same array, now shuffled.
 *
 * @example
 * ```ts
 * const array = [1, 2, 3, 4, 5];
 * randShuffle(array);
 * console.log(array); // e.g., [2, 4, 3, 1, 5]
 * ```
 */
export function randShuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randInteger(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Picks a random item from an array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to pick from.
 * @returns {T} A random item from the array.
 * @throws {Error} If the array is empty.
 *
 * @example
 * ```ts
 * const array = ['a', 'b', 'c'];
 * console.log(randPick(array)); // 'a', 'b', or 'c'
 * ```
 */
export function randPick<T>(array: T[]): T {
  if (array.length === 0) throw new Error('Cannot pick from an empty array');
  return array[randInteger(0, array.length - 1)];
}

/**
 * Fills a typed array or a number array with random integer values within a specified range.
 * The array is modified in place.
 *
 * @template T - The type of the array.
 * @param {T} array - The array to fill.
 * @param {number} [min=0] - The minimum random value (inclusive).
 * @param {number} [max=255] - The maximum random value (inclusive).
 * @returns {T} The same array, now filled with random values.
 *
 * @example
 * ```ts
 * const arr = new Uint8Array(10);
 * randArray(arr, 0, 100); // Fills with random numbers between 0 and 100
 * console.log(arr);
 * ```
 */
export function randArray<T extends number[] | Uint8Array | Uint16Array | Uint32Array>(
  array: T,
  min = 0,
  max = 255,
): T {
  for (let i = array.length - 1; i >= 0; i--) {
    array[i] = randInteger(min, max);
  }
  return array;
}

/**
 * A type alias for a UUID (v4) string.
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Generates a random UUID (v4).
 * It uses the native `crypto.randomUUID` if available, otherwise it falls back to a Math.random-based implementation.
 *
 * @returns {UUID} A new UUID string.
 *
 * @example
 * ```ts
 * console.log(randUuid()); // e.g., 'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6'
 * ```
 */
export function randUuid(): UUID {
  if (hasCrypto && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID() as UUID;
  }

  // Fallback implementation
  const bytes = randArray(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0xbf) | 0x80; // variant RFC4122

  // prettier-ignore
  return `${bytesToHex(bytes.subarray(0, 4))}-${bytesToHex(bytes.subarray(4, 6))}-${bytesToHex(
      bytes.subarray(6, 8),
  )}-${bytesToHex(bytes.subarray(8, 10))}-${bytesToHex(bytes.subarray(10, 16))}` as UUID;
}

/**
 * Generates a random boolean with a specified probability of being `true`.
 *
 * @param {number} [probability=0.5] - The probability of returning `true` (a value between 0 and 1).
 * @returns {boolean} The random boolean value.
 *
 * @example
 * ```ts
 * console.log(randBoolean()); // 50% chance of being true
 * console.log(randBoolean(0.8)); // 80% chance of being true
 * ```
 */
export function randBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Generates a random hex color string.
 *
 * @returns {string} A random hex color (e.g., '#a1b2c3').
 *
 * @example
 * ```ts
 * console.log(randColor()); // e.g., '#a1b2c3'
 * ```
 */
export function randColor(): string {
  const bytes = randArray(new Array<number>(3));
  return `#${bytesToHex(bytes)}`;
}
