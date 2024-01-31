import {isNumber} from '@alwatr/is-number';

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-123)).toBe(true);
    expect(isNumber(1.23)).toBe(true);
  });

  it('should return true for numeric strings', () => {
    expect(isNumber('123')).toBe(true);
    expect(isNumber('0')).toBe(true);
    expect(isNumber('-123')).toBe(true);
    expect(isNumber('1.23')).toBe(true);
  });

  it('should return false for non-numeric strings', () => {
    expect(isNumber('abc')).toBe(false);
    expect(isNumber('123abc')).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber(' ')).toBe(false);
  });

  it('should return false for boolean values', () => {
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });

  it('should return false for objects and arrays', () => {
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
  });

  it('should return false for NaN and Infinity', () => {
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(-Infinity)).toBe(false);
  });
});
