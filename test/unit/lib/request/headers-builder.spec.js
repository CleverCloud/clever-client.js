import { describe, expect, it } from 'vitest';
import { HeadersBuilder } from '../../../../src/lib/request/headers-builder.js';

describe('HeadersBuilder', () => {
  describe('constructor', () => {
    it('should initialize with no headers when no arguments provided', () => {
      const builder = new HeadersBuilder();
      const headers = builder.build();
      const entries = getHeadersEntries(headers);
      expect(entries).toHaveLength(0);
    });

    it('should initialize with provided Headers object', () => {
      const initialHeaders = new Headers({ 'x-test': 'value' });
      const builder = new HeadersBuilder(initialHeaders);
      const headers = builder.build();
      expect(headers.get('x-test')).toBe('value');
    });

    it('should initialize with provided plain object', () => {
      const initialHeaders = { 'x-test': 'value' };
      const builder = new HeadersBuilder(initialHeaders);
      const headers = builder.build();
      const entries = getHeadersEntries(headers);
      expect(entries).toEqual([['x-test', 'value']]);
      expect(headers.get('x-test')).toBe('value');
    });
  });

  describe('accept methods', () => {
    it('should set Accept header to JSON', () => {
      const headers = new HeadersBuilder().acceptJson().build();
      const entries = getHeadersEntries(headers);
      expect(entries).toEqual([['accept', 'application/json']]);
      expect(headers.get('accept')).toBe('application/json');
    });

    it('should set Accept header to text/plain', () => {
      const headers = new HeadersBuilder().acceptTextPlain().build();
      const entries = getHeadersEntries(headers);
      expect(entries).toEqual([['accept', 'text/plain']]);
      expect(headers.get('accept')).toBe('text/plain');
    });

    it('should set custom Accept header', () => {
      const headers = new HeadersBuilder().accept('application/xml').build();
      const entries = getHeadersEntries(headers);
      expect(entries).toEqual([['accept', 'application/xml']]);
      expect(headers.get('accept')).toBe('application/xml');
    });
  });

  describe('contentType methods', () => {
    it('should set Content-Type header to JSON', () => {
      const headers = new HeadersBuilder().contentTypeJson().build();
      expect(headers.get('content-type')).toBe('application/json');
    });

    it('should set Content-Type header to text/plain', () => {
      const headers = new HeadersBuilder().contentTypeTextPlain().build();
      expect(headers.get('content-type')).toBe('text/plain');
    });

    it('should set custom Content-Type header', () => {
      const headers = new HeadersBuilder().contentType('text/xml').build();
      expect(headers.get('content-type')).toBe('text/xml');
    });
  });

  describe('authorization', () => {
    it('should set Authorization header', () => {
      const token = 'Bearer abc123';
      const headers = new HeadersBuilder().authorization(token).build();
      expect(headers.get('authorization')).toBe(token);
    });
  });

  describe('withHeader', () => {
    it('should set custom header', () => {
      const headers = new HeadersBuilder().withHeader('x-custom', 'value').build();
      expect(headers.get('x-custom')).toBe('value');
    });

    it('should override existing header', () => {
      const headers = new HeadersBuilder().withHeader('x-test', 'initial').withHeader('x-test', 'updated').build();
      expect(headers.get('x-test')).toBe('updated');
    });

    it('should be chainable', () => {
      const builder = new HeadersBuilder();
      const result = builder.withHeader('x-test', 'value');
      expect(result).toBe(builder);
    });
  });

  describe('method chaining', () => {
    it('should allow method chaining', () => {
      const headers = new HeadersBuilder().acceptJson().contentTypeJson().withHeader('x-custom', 'value').build();

      expect(headers.get('accept')).toBe('application/json');
      expect(headers.get('content-type')).toBe('application/json');
      expect(headers.get('x-custom')).toBe('value');
    });
  });

  describe('build', () => {
    it('should return a Headers instance', () => {
      const builder = new HeadersBuilder();
      const headers = builder.build();
      expect(headers).toBeInstanceOf(Headers);
    });
  });

  describe('case insensitivity', () => {
    it('should treat header names case-insensitively', () => {
      const builder = new HeadersBuilder();
      builder.withHeader('X-Custom', 'value');

      const headers = builder.build();
      expect(headers.get('x-custom')).toBe('value');
      expect(headers.get('X-CUSTOM')).toBe('value');
      expect(headers.get('x-CuStOm')).toBe('value');
    });
  });
});

/** @param {Headers} headers */
function getHeadersEntries(headers) {
  return Array.from(headers.entries());
}
