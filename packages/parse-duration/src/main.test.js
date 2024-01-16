import {parseDuration} from '@alwatr/parse-duration';

describe('@alwatr/parse-duration', () => {
  it('should parse duration in seconds', () => {
    expect(parseDuration('5s')).toBe(5 * 1000);
  });

  it('should parse duration in minutes', () => {
    expect(parseDuration('3m')).toBe(3 * 60 * 1000);
  });

  it('should parse duration in hours', () => {
    expect(parseDuration('2h')).toBe(2 * 60 * 60 * 1000);
  });

  it('should convert duration to specified unit', () => {
    expect(parseDuration('2h', 'm')).toBe(2 * 60);
  });

  it('should convert duration to different units', () => {
    expect(parseDuration('1d', 'h')).toBe(24);
    expect(parseDuration('1w', 'd')).toBe(7);
    expect(parseDuration('1M', 'm')).toBe(30 * 24 * 60);
    expect(parseDuration('1y', 'd')).toBe(365);
  });

  it('should throw error for invalid duration', () => {
    expect(() => parseDuration('1x')).toThrow('invalid_unit');
  });

  it('should throw error for invalid conversion unit', () => {
    expect(() => parseDuration('1h', 'x')).toThrow('invalid_unit');
  });

  it('should throw error for non-numeric duration', () => {
    expect(() => parseDuration('xh')).toThrow('not_a_number');
  });
});
