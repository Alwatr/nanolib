/**
 * Number.isFinite simple polyfill
 */
if (typeof Number.isFinite !== 'function') {
  Number.isFinite = isFinite;
}

/**
 * Check the value is number or can convert to a number, for example string ' 123 ' can be converted to 123
 *
 * @param value - the value must check numeric.
 *
 * @return true if the value is number or can convert to a number, otherwise false.
 *
 * @example
 * ```ts
 * isNumber(123); // true
 * isNumber('123'); // true
 * isNumber(' 123 '); // true
 * isNumber(''); // false
 * isNumber('  '); // false
 * isNumber(' 123a '); // false
 * isNumber(' 123 a '); // false
 * ```
 */
export function isNumber(value: unknown): boolean {
  if (typeof value === 'number') {
    return value - value === 0;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Number.isFinite(+value);
  }
  return false;
}
