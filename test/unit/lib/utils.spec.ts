import { describe, expect, it } from 'vitest';
import {
  combineWithSignal,
  isAbsoluteUrl,
  isUrlWithinBaseUrl,
  merge,
  mergeRequestConfig,
  mergeRequestConfigPartial,
  normalizeDate,
  omit,
  randomUUID,
  safeUrl,
  sortBy,
  toArray,
} from '../../../src/lib/utils.js';

describe('Utils', () => {
  describe('omit', () => {
    it('should remove specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, 'b', 'c');
      expect(result).toEqual({ a: 1 });
    });

    it('should not modify original object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omit(obj, 'b', 'c');
      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj);
      expect(result).toEqual(obj);
    });
  });

  describe('toArray', () => {
    it('should convert single value to array', () => {
      const result = toArray('test');
      expect(result).toEqual(['test']);
    });

    it('should return array unchanged', () => {
      const array = ['test', 'test2'];
      const result = toArray(array);
      expect(result).toEqual(array);
    });

    it('should handle null value', () => {
      const result = toArray(null);
      expect(result).toEqual([null]);
    });
  });

  describe('normalizeDate', () => {
    it('should handle Date object', () => {
      const date = new Date('2023-05-22T08:47:10.000Z');
      const result = normalizeDate(date);
      expect(result).toBe('2023-05-22T08:47:10.000Z');
    });

    it('should handle date string', () => {
      const result = normalizeDate('2023-05-22');
      expect(result).toMatch(/^2023-05-22T/);
    });

    it('should handle timestamp number', () => {
      const result = normalizeDate(1700000000000);
      expect(result).toMatch(/^2023-11-14T/);
    });

    it('should return undefined for null input', () => {
      const result = normalizeDate(null);
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      const result = normalizeDate(undefined);
      expect(result).toBeUndefined();
    });

    it('should fix [UTC] suffix', () => {
      const result = normalizeDate('2023-05-22T08:47:10.000Z[UTC]');
      expect(result).toBe('2023-05-22T08:47:10.000Z');
    });

    it('should throw error for invalid date', () => {
      // @ts-expect-error deliberately passing an invalid date value to test the error path
      expect(() => normalizeDate({})).toThrow('Invalid date: [object Object]');
    });
  });

  describe('safeUrl', () => {
    it('should encode string values', () => {
      const result = safeUrl`https://example.com/?q=${'search term'}`;
      expect(result).toBe('https://example.com/?q=search%20term');
    });

    it('should handle multiple values', () => {
      const result = safeUrl`https://example.com/${'path'}/${'with spaces'}`;
      expect(result).toBe('https://example.com/path/with%20spaces');
    });

    it('should convert non-string values to string', () => {
      const result = safeUrl`https://example.com/${123}`;
      expect(result).toBe('https://example.com/123');
    });

    it('should handle null values', () => {
      const result = safeUrl`https://example.com/`;
      expect(result).toBe('https://example.com/');
    });

    it('should handle empty string values', () => {
      const result = safeUrl`https://example.com/${''}`;
      expect(result).toBe('https://example.com/');
    });
  });

  describe('isAbsoluteUrl', () => {
    it('should return true for an http url', () => {
      expect(isAbsoluteUrl('http://example.com/path')).toBe(true);
    });

    it('should return true for an https url', () => {
      expect(isAbsoluteUrl('https://example.com/path')).toBe(true);
    });

    it('should return true whatever the scheme case', () => {
      expect(isAbsoluteUrl('HTTPS://example.com/path')).toBe(true);
    });

    it('should return false for a root relative url', () => {
      expect(isAbsoluteUrl('/path/subPath')).toBe(false);
    });

    it('should return false for a relative url', () => {
      expect(isAbsoluteUrl('path/subPath')).toBe(false);
    });

    it('should return false for an empty url', () => {
      expect(isAbsoluteUrl('')).toBe(false);
    });

    it('should return false for a protocol relative url', () => {
      expect(isAbsoluteUrl('//example.com/path')).toBe(false);
    });

    it('should return false when the scheme is not at the start of the url', () => {
      expect(isAbsoluteUrl('/redirect?to=https://example.com')).toBe(false);
    });

    it('should return false for a non http scheme', () => {
      expect(isAbsoluteUrl('ws://example.com/path')).toBe(false);
    });
  });

  describe('isUrlWithinBaseUrl', () => {
    it('should return true when the url is the base url itself', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api')).toBe(true);
    });

    it('should return true when the url is a sub path of the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api/2')).toBe(true);
    });

    it('should return false when the url only shares a path prefix with the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api2')).toBe(false);
    });

    it('should return true when the url adds a query string to the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api?foo=bar')).toBe(true);
    });

    it('should return true when the url adds a fragment to the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api#foo')).toBe(true);
    });

    it('should ignore the trailing slash of the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api/', 'https://example.com/api/2')).toBe(true);
      expect(isUrlWithinBaseUrl('https://example.com/api/', 'https://example.com/api')).toBe(true);
      expect(isUrlWithinBaseUrl('https://example.com/api/', 'https://example.com/api2')).toBe(false);
    });

    it('should return false when the url targets another host', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://evil.com/api/2')).toBe(false);
    });

    it('should return false when the url targets a host having the base url host as prefix', () => {
      expect(isUrlWithinBaseUrl('https://example.com', 'https://example.com.evil.com/api')).toBe(false);
    });

    it('should return false when the url targets another scheme', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'http://example.com/api/2')).toBe(false);
    });

    it('should return false when the url targets another port', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com:8080/api/2')).toBe(false);
    });

    it('should resolve dot segments escaping the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api/../other')).toBe(false);
    });

    it('should resolve dot segments staying within the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/api/sub/../2')).toBe(true);
    });

    it('should resolve dot segments of the base url', () => {
      expect(isUrlWithinBaseUrl('https://example.com/other/../api', 'https://example.com/api/2')).toBe(true);
    });

    it('should ignore the default port of the scheme', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com:443/api/2')).toBe(true);
    });

    it('should ignore the host case', () => {
      expect(isUrlWithinBaseUrl('https://EXAMPLE.com/api', 'https://example.com/api/2')).toBe(true);
    });

    it('should keep the path case significant', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'https://example.com/API/2')).toBe(false);
    });

    it('should return false when the url cannot be parsed', () => {
      expect(isUrlWithinBaseUrl('https://example.com/api', 'not an url')).toBe(false);
    });
  });

  it('randomUUID', async () => {
    expect(await randomUUID()).toMatch(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
  });

  describe('sortBy', () => {
    it('should sort by string property', () => {
      const result = sortBy([{ prop: 'b' }, { prop: 'a' }], 'prop');
      expect(result).toEqual([{ prop: 'a' }, { prop: 'b' }]);
    });

    it('should sort by number property', () => {
      const result = sortBy([{ prop: 2 }, { prop: 1 }], 'prop');
      expect(result).toEqual([{ prop: 1 }, { prop: 2 }]);
    });

    it('should sort by date iso', () => {
      const result = sortBy(
        [
          { prop: new Date('2025-07-28T09:50:02.175Z').toISOString() },
          { prop: new Date('2023-07-28T09:50:02.175Z').toISOString() },
        ],
        'prop',
      );
      expect(result).toEqual([
        { prop: new Date('2023-07-28T09:50:02.175Z').toISOString() },
        { prop: new Date('2025-07-28T09:50:02.175Z').toISOString() },
      ]);
    });

    it('should sort by multiple properties (on first property)', () => {
      const result = sortBy(
        [
          { prop1: 'b', prop2: 2 },
          { prop1: 'a', prop2: 1 },
        ],
        'prop1',
        'prop2',
      );
      expect(result).toEqual([
        { prop1: 'a', prop2: 1 },
        { prop1: 'b', prop2: 2 },
      ]);
    });

    it('should sort by multiple properties (on second property)', () => {
      const result = sortBy(
        [
          { prop1: 'b', prop2: 2 },
          { prop1: 'b', prop2: 1 },
        ],
        'prop1',
        'prop2',
      );
      expect(result).toEqual([
        { prop1: 'b', prop2: 1 },
        { prop1: 'b', prop2: 2 },
      ]);
    });

    it('should sort with desc order', () => {
      const result = sortBy([{ prop: 'a' }, { prop: 'b' }], { key: 'prop', order: 'desc' });
      expect(result).toEqual([{ prop: 'b' }, { prop: 'a' }]);
    });

    it('should sort with asc order', () => {
      const result = sortBy([{ prop: 'b' }, { prop: 'a' }], { key: 'prop', order: 'asc' });
      expect(result).toEqual([{ prop: 'a' }, { prop: 'b' }]);
    });
  });

  describe('merge', () => {
    const props: { prop1: string | null; prop2: string; prop3?: string } = { prop1: 'prop1', prop2: 'prop2' };

    it('should merge objects', () => {
      const result = merge(props, { prop1: 'overridden prop1', prop3: 'prop3' });

      expect(result).toEqual({ prop1: 'overridden prop1', prop2: 'prop2', prop3: 'prop3' });
    });

    it('should not override null property', () => {
      const result = merge(props, { prop1: null });

      expect(result).toEqual({ prop1: 'prop1', prop2: 'prop2' });
    });

    it('should not override undefined property', () => {
      const result = merge(props, { prop1: undefined });

      expect(result).toEqual({ prop1: 'prop1', prop2: 'prop2' });
    });
  });

  describe('combineWithSignal', () => {
    it('should combine', async () => {
      const ac1 = new AbortController();
      const ac2 = new AbortController();
      combineWithSignal(ac1, ac2.signal);

      const result = await new Promise((resolve) => {
        ac1.signal.addEventListener('abort', () => resolve('ok'));
        ac2.abort();
      });

      expect(result).toBe('ok');
    });
  });

  describe('mergeRequestConfig', () => {
    it('should merge request config with null config', () => {
      const config = mergeRequestConfig(
        {
          isCorsEnabled: true,
          timeout: 0,
          cache: null,
          isDebugEnabled: true,
        },
        // @ts-expect-error testing null override config
        null,
      );
      expect(config).toEqual({
        isCorsEnabled: true,
        timeout: 0,
        cache: null,
        isDebugEnabled: true,
      });
    });

    it('should merge request config with empty config', () => {
      const config = mergeRequestConfig(
        {
          isCorsEnabled: true,
          timeout: 0,
          cache: null,
          isDebugEnabled: true,
        },
        {},
      );
      expect(config).toEqual({
        isCorsEnabled: true,
        timeout: 0,
        cache: null,
        isDebugEnabled: true,
      });
    });

    it('should merge request config with config', () => {
      const config = mergeRequestConfig(
        {
          isCorsEnabled: true,
          timeout: 0,
          cache: null,
          isDebugEnabled: true,
        },
        {
          isCorsEnabled: false,
          timeout: 10,
          cache: { ttl: 1000 },
          isDebugEnabled: false,
        },
      );
      expect(config).toEqual({
        isCorsEnabled: false,
        timeout: 10,
        cache: { ttl: 1000 },
        isDebugEnabled: false,
      });
    });

    it('should merge request config with partial config', () => {
      const config = mergeRequestConfig(
        {
          isCorsEnabled: true,
          timeout: 0,
          cache: null,
          isDebugEnabled: true,
        },
        {
          cache: { ttl: 1000 },
          isDebugEnabled: false,
        },
      );
      expect(config).toEqual({
        isCorsEnabled: true,
        timeout: 0,
        cache: { ttl: 1000 },
        isDebugEnabled: false,
      });
    });

    describe('cache config', () => {
      it('should not merge null cache with undefined cache', () => {
        const config = mergeRequestConfig(
          {
            isCorsEnabled: true,
            timeout: 0,
            cache: null,
            isDebugEnabled: true,
          },
          {},
        );
        expect(config.cache).toEqual(null);
      });

      it('should not merge cache with undefined cache', () => {
        const config = mergeRequestConfig(
          {
            isCorsEnabled: true,
            timeout: 0,
            cache: { ttl: 1000 },
            isDebugEnabled: true,
          },
          {},
        );
        expect(config.cache).toEqual({ ttl: 1000 });
      });

      it('should merge cache with null cache', () => {
        const config = mergeRequestConfig(
          {
            isCorsEnabled: true,
            timeout: 0,
            cache: { ttl: 1000 },
            isDebugEnabled: true,
          },
          {
            cache: null,
          },
        );
        expect(config.cache).toEqual(null);
      });

      it('should merge null cache with cache', () => {
        const config = mergeRequestConfig(
          {
            isCorsEnabled: true,
            timeout: 0,
            cache: null,
            isDebugEnabled: true,
          },
          {
            cache: { ttl: 10 },
          },
        );
        expect(config.cache).toEqual({ ttl: 10 });
      });

      it('should merge null cache with partial cache (use `0` ttl)', () => {
        const config = mergeRequestConfig(
          {
            isCorsEnabled: true,
            timeout: 0,
            cache: null,
            isDebugEnabled: true,
          },
          {
            cache: { mode: 'reload' },
          },
        );
        expect(config.cache).toEqual({ mode: 'reload', ttl: 0 });
      });

      it('should merge cache with partial cache', () => {
        const config = mergeRequestConfig(
          {
            isCorsEnabled: true,
            timeout: 0,
            cache: { ttl: 1000 },
            isDebugEnabled: true,
          },
          {
            cache: { mode: 'reload' },
          },
        );
        expect(config.cache).toEqual({ mode: 'reload', ttl: 1000 });
      });
    });
  });

  describe('mergeRequestConfigPartial', () => {
    it('should merge undefined with undefined', () => {
      const config = mergeRequestConfigPartial(undefined, undefined);
      expect(config).toEqual({});
    });

    it('should merge partial config with undefined', () => {
      const config = mergeRequestConfigPartial({ isCorsEnabled: true }, undefined);
      expect(config).toEqual({ isCorsEnabled: true });
    });

    it('should merge partial config with empty config', () => {
      const config = mergeRequestConfigPartial({ isCorsEnabled: true }, {});
      expect(config).toEqual({ isCorsEnabled: true });
    });

    it('should merge partial config with partial config', () => {
      const config = mergeRequestConfigPartial(
        { isCorsEnabled: true, isDebugEnabled: true },
        { isCorsEnabled: false, timeout: 10 },
      );
      expect(config).toEqual({ isCorsEnabled: false, timeout: 10, isDebugEnabled: true });
    });

    describe('cache config', () => {
      it('should not merge null cache with undefined cache', () => {
        const config = mergeRequestConfigPartial(
          {
            cache: null,
          },
          {},
        );
        expect(config.cache).toEqual(null);
      });

      it('should not merge partial cache with undefined cache', () => {
        const config = mergeRequestConfigPartial(
          {
            cache: { ttl: 1000 },
          },
          {},
        );
        expect(config.cache).toEqual({ ttl: 1000 });
      });

      it('should merge partial cache with null cache', () => {
        const config = mergeRequestConfigPartial(
          {
            cache: { ttl: 1000 },
          },
          { cache: null },
        );
        expect(config.cache).toEqual(null);
      });

      it('should merge partial cache with partial cache', () => {
        const config = mergeRequestConfigPartial(
          {
            cache: { ttl: 1000 },
          },
          { cache: { mode: 'reload' } },
        );
        expect(config.cache).toEqual({ mode: 'reload', ttl: 1000 });
      });
    });
  });
});
