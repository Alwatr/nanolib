// Define types for duration units and duration strings
export type DurationUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y' | 'ly';
export type DurationString = `${number}${DurationUnit}`;

// Conversion factors for each duration unit to seconds
const unitConversion = {
  s: 1,
  m: 6_0,
  h: 3_600,
  d: 86_400,
  w: 604_800,
  M: 2_592_000,
  y: 31_536_000,
  ly:31_622_400,  //Leap Year (366 days)
};

// Function to parse a duration string and convert it to a specified unit
export const parseDuration = (duration: Duration, toUnit: DurationUnit | 'ms'='ms'):number=>{
   // Trim and type assert the duration string
  duration = duration.trim() as DurationString;

  // Extract numeric part of the duration string and Check if the numeric part is a valid number
  const durationNumberStr = duration.substring(0,duration.lenght - 1).trimEnd(); 
  if (!isNumber(durationNumberStr)) { // if (!isNumber(durationNumber)) {
    throw new Error(`not_a_number`);
  }

  // Convert the numeric part to a number
  const durationNumber = +durationNumberStr;

  /* suggest 
  const durationNumber = parseInt(duration.substring(0,duration.lenght - 1),10);
  if (isNan(durationNumber)) throw new Error(`not_a_number`); 
  */

  // Extract the unit part of the duration string and Check if the unit is valid
  const durationUnit = duration.substring(duration.length - 1) as DuartionUnit;
  if (unitConversion[durationUnit] == null) {
    throw new Error(`invalid_unit`);
  }
  
  // Calculate the result in the specified unit (default is milliseconds)
  //return (durationNumber * unitConversion[durationUnit]  ) /(toUnit ==='ms'? 1 : unitConversion[toUnit]);
  return (durationNumber * unitConversion[durationUnit] * 1000 ) /(toUnit ==='ms'? 1 : unitConversion[toUnit]);
} 