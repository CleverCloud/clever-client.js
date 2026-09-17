import { describe, expect, it } from 'vitest';
import {
  CcClientError,
  CcHttpError,
  CcNetworkError,
  CcRequestError,
} from '../../../../src/lib/error/cc-client-errors.js';
import type { CcRequest, CcResponse } from '../../../../src/types/request.types.js';

const REQUEST = {} as CcRequest;
const RESPONSE = { status: 500 } as CcResponse<unknown>;

describe('client errors', () => {
  describe('name', () => {
    it.for([
      ['CcClientError', () => new CcClientError('boom', 'CODE')],
      ['CcRequestError', () => new CcRequestError('boom', 'CODE', REQUEST)],
      ['CcNetworkError', () => new CcNetworkError(REQUEST, null)],
      ['CcHttpError', () => new CcHttpError('boom', 'CODE', REQUEST, RESPONSE)],
    ] as const)('should name a %s after its class, as the native errors do', ([name, create]) => {
      const error = create();

      expect(error.name).toBe(name);
      expect(String(error)).toBe(`${name}: ${error.message}`);
      expect(Object.hasOwn(error, 'name')).toBe(false);
      expect(Object.keys(error)).not.toContain('name');
    });
  });

  describe('cause', () => {
    it.for([
      ['CcClientError', (cause?: unknown) => new CcClientError('boom', 'CODE', cause)],
      ['CcRequestError', (cause?: unknown) => new CcRequestError('boom', 'CODE', REQUEST, cause)],
      ['CcNetworkError', (cause?: unknown) => new CcNetworkError(REQUEST, null, cause)],
    ] as const)('should carry the cause of a %s as a non-enumerable own property', ([, create]) => {
      const cause = new Error('root');

      const error = create(cause);

      expect(error.cause).toBe(cause);
      expect(Object.getOwnPropertyDescriptor(error, 'cause')?.enumerable).toBe(false);
    });

    it.for([
      ['CcClientError', () => new CcClientError('boom', 'CODE')],
      ['CcHttpError', () => new CcHttpError('boom', 'CODE', REQUEST, RESPONSE)],
    ] as const)('should not create a cause property on a %s raised without one', ([, create]) => {
      const error = create();

      expect(Object.hasOwn(error, 'cause')).toBe(false);
    });
  });
});
