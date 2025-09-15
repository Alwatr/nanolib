/**
 * A polyfill for `Number.isFinite`. It checks if a value is a finite number
 * without performing type coercion, which is stricter than the global `isFinite` function.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} `true` if the value is a finite number, otherwise `false`.
 */
export function isFiniteNumber(value: unknown): value is number {
  if (typeof Number.isFinite === 'function') {
    return Number.isFinite(value);
  }
  // Fallback for environments without Number.isFinite
  return typeof value === 'number' && isFinite(value);
}

/**
 * Checks if a value is a number or a string that can be converted into a finite number.
 * It handles integers, floats, and hexadecimal strings, but rejects empty strings,
 * `NaN`, and `Infinity`.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} `true` if the value is a number or a numeric string, otherwise `false`.
 *
 * @example
 * ```ts
 * isNumber(123);        // true
 * isNumber('123');      // true
 * isNumber(' 123 ');    // true
 * isNumber('0xff');     // true
 * isNumber('-1.1');     // true
 * isNumber('');         // false
 * isNumber('  ');       // false
 * isNumber(' 123a ');   // false
 * isNumber(NaN);        // false
 * isNumber(Infinity);   // false
 * isNumber({});         // false
 * isNumber(null);       // false
 * ```
 */
export function isNumber(value: unknown): value is number | string {
  if (typeof value === 'number') {
    // This check (`value - value === 0`) is a reliable way to filter out NaN and Infinity.
    return value - value === 0;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return false;

    // The unary plus operator (+) is a fast way to convert a string to a number.
    const num = +trimmed;
    return isFiniteNumber(num);
  }

  return false;
}

/**
 * Converts a value to a finite number if possible.
 * If the value is a valid number or a numeric string, it returns the number.
 * Otherwise, it returns `null`.
 *
 * @param {*} value - The value to convert.
 * @returns {number | null} The converted number, or `null` if the conversion is not possible.
 *
 * @example
 * ```ts
 * toNumber(123);        // 123
 * toNumber('123');      // 123
 * toNumber(' 123 ');    // 123
 * toNumber('0xff');     // 255
 * toNumber('-1.1');     // -1.1
 * toNumber('');         // null
 * toNumber('  ');       // null
 * toNumber('123a');     // null
 * toNumber(NaN);        // null
 * toNumber(Infinity);   // null
 * toNumber({});         // null
 * toNumber(null);       // null
 * ```
 */
export function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return value - value === 0 ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;

    const num = +trimmed;
    return isFiniteNumber(num) ? num : null;
  }

  return null;
}
