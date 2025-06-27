import { expect } from 'chai';
import { normalizeDate, omit, randomUUID, safeUrl, toArray } from '../../../src/lib/utils.js';

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
});
