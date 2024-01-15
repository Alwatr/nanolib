/**
 * Duration unit: `s` for seconds, `m` for minutes, `h` for hours, `d` for days, `w` for weeks, `M` for months, `y` for years.
 */
export type DurationUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y';

/**
 * Duration string format: `number + unit`, for example `10m` means 10 minutes.
 */
export type DurationString = `${number}${DurationUnit}`;
