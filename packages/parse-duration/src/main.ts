import {isNumber} from '@alwatr/is-number';

import type {DurationString, DurationUnit} from './type';

export * from './type';

/**
 * Unit conversion table
 */
const unitConversion_ = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
  M: 2_592_000_000,
  y: 31_536_000_000,
} as const;

/**
 * Parse duration string to milliseconds
 *
 * @param duration - duration string, for example `10m` means 10 minutes.
 * @param toUnit - convert to unit, default is `ms` for milliseconds.
 *
 * @return duration in milliseconds.
 *
 * @example
 * ```ts
 * parseDuration('10m'); // 600000
 * parseDuration('10m', 's'); // 600
 * ```
 */
export const parseDuration = (duration: DurationString, toUnit: DurationUnit | 'ms' = 'ms'): number => {
  duration = duration.trim() as DurationString;
  const durationNumberStr = duration.substring(0, duration.length - 1).trimEnd(); // trimEnd for `10 m`
  if (!isNumber(durationNumberStr)) {
    throw new Error(`not_a_number`);
  }
  const durationNumber = +durationNumberStr;
  const durationUnit = duration.substring(duration.length - 1) as DurationUnit;
  if (unitConversion_[durationUnit] == null) {
    throw new Error(`invalid_init`);
  }
  return (durationNumber * unitConversion_[durationUnit]) / (toUnit === 'ms' ? 1 : unitConversion_[toUnit]);
};
