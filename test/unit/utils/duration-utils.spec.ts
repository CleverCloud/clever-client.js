import { describe, expect, it } from 'vitest';
import { normalizeDuration, parseDuration } from '../../../src/utils/duration-utils.js';

describe('Duration utils', () => {
  describe('parseDuration', () => {
    it('should handle a duration in hours', () => {
      expect(parseDuration('PT1H')).toBe(3600000);
    });

    it('should handle a duration in minutes', () => {
      expect(parseDuration('PT30M')).toBe(1800000);
    });

    it('should handle every component at once', () => {
      expect(parseDuration('P1DT2H30M15S')).toBe(95415000);
    });

    it('should handle fractional seconds', () => {
      expect(parseDuration('PT0.5S')).toBe(500);
    });

    it('should handle a comma as the fractional separator', () => {
      expect(parseDuration('PT1,25S')).toBe(1250);
    });

    it('should handle a zero duration', () => {
      expect(parseDuration('PT0S')).toBe(0);
    });

    it('should handle a duration negated as a whole', () => {
      expect(parseDuration('-PT1H')).toBe(-3600000);
    });

    it('should handle a negative component', () => {
      expect(parseDuration('PT-6H+3M')).toBe(-21420000);
    });

    it('should be case insensitive', () => {
      expect(parseDuration('pt1h30m')).toBe(5400000);
    });

    it('should throw error for a duration with no component', () => {
      expect(() => parseDuration('PT')).toThrow('Invalid duration: PT');
    });

    it('should throw error for a calendar period', () => {
      expect(() => parseDuration('P1M')).toThrow('Invalid duration: P1M');
    });

    it('should throw error for a week based duration', () => {
      expect(() => parseDuration('P1W')).toThrow('Invalid duration: P1W');
    });

    it('should throw error for a plain number', () => {
      expect(() => parseDuration('3600')).toThrow('Invalid duration: 3600');
    });

    it('should throw error for a non string input', () => {
      // @ts-expect-error deliberately passing an invalid duration value to test the error path
      expect(() => parseDuration(3600000)).toThrow('Invalid duration: 3600000');
    });
  });

  describe('normalizeDuration', () => {
    it('should handle a number of milliseconds', () => {
      expect(normalizeDuration(3600000)).toBe('PT1H');
    });

    it('should render every non zero component', () => {
      expect(normalizeDuration(5445000)).toBe('PT1H30M45S');
    });

    it('should render sub second values as fractional seconds', () => {
      expect(normalizeDuration(90500)).toBe('PT1M30.5S');
    });

    it('should render zero as an explicit zero duration', () => {
      expect(normalizeDuration(0)).toBe('PT0S');
    });

    it('should render a negative duration', () => {
      expect(normalizeDuration(-3600000)).toBe('-PT1H');
    });

    it('should count days as hours', () => {
      expect(normalizeDuration(86400000)).toBe('PT24H');
    });

    it('should leave an ISO duration untouched', () => {
      expect(normalizeDuration('PT30M')).toBe('PT30M');
    });

    it('should leave a calendar period untouched', () => {
      expect(normalizeDuration('P1M')).toBe('P1M');
    });

    it('should return null for null input', () => {
      expect(normalizeDuration(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(normalizeDuration(undefined)).toBeNull();
    });

    it('should throw error for a non finite number', () => {
      expect(() => normalizeDuration(Number.NaN)).toThrow('Invalid duration: NaN');
    });
  });

  describe('parseDuration / normalizeDuration round trip', () => {
    it('should keep the millisecond value across a round trip', () => {
      [0, 1, 999, 1000, 90500, 3600000, 5445000, 86400000, -3600000].forEach((milliseconds) => {
        expect(parseDuration(normalizeDuration(milliseconds)!)).toBe(milliseconds);
      });
    });
  });
});
