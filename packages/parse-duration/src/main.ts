import {toNumber} from '@alwatr/is-number';

/**
 * A frozen object containing conversion factors from various time units to milliseconds.
 * @private
 */
const unitConversion = /* #__PURE__ */ Object.freeze({
  s: 1_000, // seconds
  m: 60_000, // minutes
  h: 3_600_000, // hours
  d: 86_400_000, // days
  w: 604_800_000, // weeks
  M: 2_592_000_000, // months (30 days)
  y: 31_536_000_000, // years (365 days)
} as const);

/**
 * Represents a duration unit.
 * `s`: seconds, `m`: minutes, `h`: hours, `d`: days, `w`: weeks, `M`: months, `y`: years.
 */
export type DurationUnit = keyof typeof unitConversion;

/**
 * Represents a duration, which can be a number (in milliseconds) or a string in the format `${number}${DurationUnit}`.
 * For example, `10m` for 10 minutes.
 */
export type Duration = `${number}${DurationUnit}` | number;

/**
 * Defines the possible error types that can be thrown by `parseDuration`.
 */
export type DurationError = 'not_a_number' | 'invalid_unit' | 'invalid_format';

/**
 * Parses a duration string (e.g., '10m', '2.5h') or a number (in milliseconds) and converts it to a specified time unit.
 *
 * @param {Duration} duration - The duration to parse, either as a string or a number in milliseconds.
 * @param {DurationUnit} [toUnit] - The unit to convert the duration to. If not provided, the result is in milliseconds.
 * @returns {number} The duration in the specified unit.
 * @throws {Error} Throws an error with a specific message (`not_a_number`, `invalid_unit`, `invalid_format`) if parsing fails.
 *
 * @example
 * ```ts
 * // Convert from string to milliseconds
 * console.log(parseDuration('10m')); // 600000
 *
 * // Convert from string to a specific unit
 * console.log(parseDuration('1.5h', 'm')); // 90
 *
 * // Convert from milliseconds to a specific unit
 * console.log(parseDuration(120_000, 's')); // 120
 *
 * // Handle errors
 * try {
 *   parseDuration('10x'); // throws 'invalid_unit'
 * } catch(err) {
 *   console.error(err.message);
 * }
 * ```
 */
export const parseDuration = (duration: Duration, toUnit?: DurationUnit): number => {
  let ms: number;

  // Convert input to milliseconds
  if (typeof duration === 'number') {
    ms = duration;
  }
  else {
    if (duration.length < 2) {
      throw new Error('invalid_format', {cause: {duration}});
    }

    const durationUnit = duration.slice(-1) as DurationUnit;
    const unitConversionFactor = unitConversion[durationUnit];

    if (unitConversionFactor === undefined) {
      throw new Error('invalid_unit', {cause: {durationUnit}});
    }

    const durationNumber = toNumber(duration.slice(0, -1));
    if (durationNumber === null) {
      throw new Error('not_a_number', {cause: {duration}});
    }

    ms = durationNumber * unitConversionFactor;
  }

  // Return as is if no conversion needed
  if (toUnit === undefined) {
    return ms;
  }

  // Convert to target unit
  const toFactor = unitConversion[toUnit];
  if (toFactor === undefined) {
    throw new Error('invalid_unit', {cause: {toUnit}});
  }

  return ms / toFactor;
};
