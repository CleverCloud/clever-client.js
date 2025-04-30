import { expect } from 'chai';
import { merge, normalizeDate, omit, randomUUID, safeUrl, sortBy, toArray } from '../../../src/lib/utils.js';

describe('Utils', () => {
  describe('omit', () => {
    it('should remove specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, 'b', 'c');
      expect(result).to.deep.equal({ a: 1 });
    });

    it('should not modify original object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omit(obj, 'b', 'c');
      expect(obj).to.deep.equal({ a: 1, b: 2, c: 3 });
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj);
      expect(result).to.deep.equal(obj);
    });
  });

  describe('toArray', () => {
    it('should convert single value to array', () => {
      const result = toArray('test');
      expect(result).to.deep.equal(['test']);
    });

    it('should return array unchanged', () => {
      const array = ['test', 'test2'];
      const result = toArray(array);
      expect(result).to.deep.equal(array);
    });

    it('should handle null value', () => {
      const result = toArray(null);
      expect(result).to.deep.equal([null]);
    });
  });

  describe('normalizeDate', () => {
    it('should handle Date object', () => {
      const date = new Date('2023-05-22T08:47:10.000Z');
      const result = normalizeDate(date);
      expect(result).to.equal('2023-05-22T08:47:10.000Z');
    });

    it('should handle date string', () => {
      const result = normalizeDate('2023-05-22');
      expect(result).to.match(/^2023-05-22T/);
    });

    it('should handle timestamp number', () => {
      const result = normalizeDate(1700000000000);
      expect(result).to.match(/^2023-11-14T/);
    });

    it('should return null for null input', () => {
      const result = normalizeDate(null);
      expect(result).to.be.null;
    });

    it('should fix [UTC] suffix', () => {
      const result = normalizeDate('2023-05-22T08:47:10.000Z[UTC]');
      expect(result).to.equal('2023-05-22T08:47:10.000Z');
    });

    it('should fix milliseconds on 1 digits', () => {
      const result = normalizeDate('2023-05-22T08:47:10.1Z');
      expect(result).to.equal('2023-05-22T08:47:10.001Z');
    });

    it('should fix milliseconds on 2 digits', () => {
      const result = normalizeDate('2023-05-22T08:47:10.42Z');
      expect(result).to.equal('2023-05-22T08:47:10.042Z');
    });

    it('should throw error for invalid date', () => {
      // @ts-ignore
      expect(() => normalizeDate({})).to.throw('Invalid date: [object Object]');
    });
  });

  describe('safeUrl', () => {
    it('should encode string values', () => {
      const result = safeUrl`https://example.com/?q=${'search term'}`;
      expect(result).to.equal('https://example.com/?q=search%20term');
    });

    it('should handle multiple values', () => {
      const result = safeUrl`https://example.com/${'path'}/${'with spaces'}`;
      expect(result).to.equal('https://example.com/path/with%20spaces');
    });

    it('should convert non-string values to string', () => {
      const result = safeUrl`https://example.com/${123}`;
      expect(result).to.equal('https://example.com/123');
    });

    it('should handle null values', () => {
      const result = safeUrl`https://example.com/`;
      expect(result).to.equal('https://example.com/');
    });

    it('should handle empty string values', () => {
      const result = safeUrl`https://example.com/${''}`;
      expect(result).to.equal('https://example.com/');
    });
  });

  describe('randomUUID', async () => {
    expect(await randomUUID()).to.match(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
  });

  describe('sortBy', () => {
    it('should sort by string property', () => {
      const result = sortBy([{ prop: 'b' }, { prop: 'a' }], 'prop');
      expect(result).to.deep.equal([{ prop: 'a' }, { prop: 'b' }]);
    });

    it('should sort by number property', () => {
      const result = sortBy([{ prop: 2 }, { prop: 1 }], 'prop');
      expect(result).to.deep.equal([{ prop: 1 }, { prop: 2 }]);
    });

    it('should sort by date iso', () => {
      const result = sortBy(
        [
          { prop: new Date('2025-07-28T09:50:02.175Z').toISOString() },
          { prop: new Date('2023-07-28T09:50:02.175Z').toISOString() },
        ],
        'prop',
      );
      expect(result).to.deep.equal([
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
      expect(result).to.deep.equal([
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
      expect(result).to.deep.equal([
        { prop1: 'b', prop2: 1 },
        { prop1: 'b', prop2: 2 },
      ]);
    });

    it('should sort with desc order', () => {
      const result = sortBy([{ prop: 'a' }, { prop: 'b' }], { key: 'prop', order: 'desc' });
      expect(result).to.deep.equal([{ prop: 'b' }, { prop: 'a' }]);
    });

    it('should sort with asc order', () => {
      const result = sortBy([{ prop: 'b' }, { prop: 'a' }], { key: 'prop', order: 'asc' });
      expect(result).to.deep.equal([{ prop: 'a' }, { prop: 'b' }]);
    });
  });

  describe('merge', () => {
    /** @type {{ prop1: string, prop2: string, prop3?: string }} */
    const props = { prop1: 'prop1', prop2: 'prop2' };

    it('should merge objects', () => {
      const result = merge(props, { prop1: 'overridden prop1', prop3: 'prop3' });

      expect(result).to.deep.equal({ prop1: 'overridden prop1', prop2: 'prop2', prop3: 'prop3' });
    });

    it('should not override null property', () => {
      const result = merge(props, { prop1: null });

      expect(result).to.deep.equal({ prop1: 'prop1', prop2: 'prop2' });
    });

    it('should not override undefined property', () => {
      const result = merge(props, { prop1: undefined });

      expect(result).to.deep.equal({ prop1: 'prop1', prop2: 'prop2' });
    });
  });
});
