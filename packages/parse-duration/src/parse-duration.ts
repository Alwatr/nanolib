// Define types for duration units and duration strings
export type DurationUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y' | 'ly';
export type DurationString = `${number}${DurationUnit}`;

// Conversion factors for each duration unit to seconds
const unitConversion = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
  M: 2_592_000_000,
  y: 31_536_000_000,
};

// Function to parse a duration string and convert it to a specified unit
export const parseDuration = (duration: Duration, toUnit: DurationUnit | 'ms'='ms'):number=>{
  duration = duration.trim() as DurationString;
  const durationNumberStr = duration.substring(0, duration.length - 1).trimEnd(); // trimEnd for `10 m`
  if (!isNumber(durationNumberStr)) {
    throw new Error(`not_a_number`);
  }
  const durationNumber = +durationNumberStr;
  const durationUnit = duration.substring(duration.length - 1) as DurationUnit;
  if (unitConversion[durationUnit] == null) {
    throw new Error(`invalid_init`);
  }
  return (durationNumber * unitConversion[durationUnit]) / (toUnit === 'ms' ? 1 : unitConversion[toUnit]);
}
