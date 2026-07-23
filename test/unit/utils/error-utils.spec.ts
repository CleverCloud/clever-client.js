import { describe, expect, it } from 'vitest';
import { CcClientError, CcHttpError, CcRequestError } from '../../../src/lib/error/cc-client-errors.js';
import type { CcRequest, CcResponse } from '../../../src/types/request.types.js';
import {
  isCcClientError,
  isCcHttpError,
  isCcHttpErrorWithCode,
  isCcHttpErrorWithStatus,
  isCcRequestError,
  isRateLimitError,
  tolerateNotFound,
} from '../../../src/utils/error-utils.js';

const REQUEST = {} as CcRequest;

function response(status: number): CcResponse<unknown> {
  return { status, headers: new Headers(), body: undefined, requestDuration: 0, hasHitCache: false };
}

function httpError(status: number, code: string): CcHttpError {
  return new CcHttpError(`Error ${status}`, code, REQUEST, response(status));
}

describe('isCcClientError', () => {
  it('should match any client error', () => {
    expect(isCcClientError(new CcClientError('boom', 'some.code'))).toBe(true);
    expect(isCcClientError(new CcRequestError('boom', 'some.code', REQUEST))).toBe(true);
    expect(isCcClientError(httpError(404, 'some.code'))).toBe(true);
  });

  it('should not match a native error', () => {
    expect(isCcClientError(new Error('boom'))).toBe(false);
  });
});

describe('isCcRequestError', () => {
  it('should match request errors and http errors', () => {
    expect(isCcRequestError(new CcRequestError('boom', 'some.code', REQUEST))).toBe(true);
    expect(isCcRequestError(httpError(404, 'some.code'))).toBe(true);
  });

  it('should not match a plain client error', () => {
    expect(isCcRequestError(new CcClientError('boom', 'some.code'))).toBe(false);
  });
});

describe('isCcHttpError', () => {
  it('should match an http error', () => {
    expect(isCcHttpError(httpError(404, 'some.code'))).toBe(true);
  });

  it('should not match a request error', () => {
    expect(isCcHttpError(new CcRequestError('boom', 'some.code', REQUEST))).toBe(false);
  });
});

describe('isCcHttpErrorWithStatus', () => {
  it('should match when the status is the same', () => {
    expect(isCcHttpErrorWithStatus(httpError(404, 'some.code'), 404)).toBe(true);
  });

  it('should not match when the status differs', () => {
    expect(isCcHttpErrorWithStatus(httpError(500, 'some.code'), 404)).toBe(false);
  });

  it('should not match a non-http error carrying a statusCode', () => {
    expect(isCcHttpErrorWithStatus({ statusCode: 404 }, 404)).toBe(false);
  });

  it('should not match nullish values', () => {
    expect(isCcHttpErrorWithStatus(null, 404)).toBe(false);
    expect(isCcHttpErrorWithStatus(undefined, 404)).toBe(false);
  });
});

describe('isCcHttpErrorWithCode', () => {
  it('should match when the code is the same', () => {
    expect(isCcHttpErrorWithCode(httpError(404, 'clever.some.code'), 'clever.some.code')).toBe(true);
  });

  it('should not match when the code differs', () => {
    expect(isCcHttpErrorWithCode(httpError(404, 'clever.some.other-code'), 'clever.some.code')).toBe(false);
  });

  it('should not match a non-http error carrying a code', () => {
    expect(isCcHttpErrorWithCode({ code: 'clever.some.code' }, 'clever.some.code')).toBe(false);
  });

  it('should not match a request error carrying the same code', () => {
    expect(isCcHttpErrorWithCode(new CcRequestError('boom', 'clever.some.code', REQUEST), 'clever.some.code')).toBe(
      false,
    );
  });
});

describe('isRateLimitError', () => {
  it('should match the normalized rate limit code', () => {
    expect(isRateLimitError(httpError(429, 'clever.core.too-many-requests'))).toBe(true);
  });

  it('should match whatever status the backend used', () => {
    expect(isRateLimitError(httpError(403, 'clever.core.too-many-requests'))).toBe(true);
  });

  it('should not match another error', () => {
    expect(isRateLimitError(httpError(403, 'unknown_error'))).toBe(false);
  });
});

describe('tolerateNotFound', () => {
  it('should resolve to the value when the promise fulfills', async () => {
    await expect(tolerateNotFound(Promise.resolve('value'))).resolves.toBe('value');
  });

  it('should resolve to `undefined` when the promise rejects with a 404', async () => {
    await expect(tolerateNotFound(Promise.reject(httpError(404, 'some.code')))).resolves.toBeUndefined();
  });

  it('should rethrow an http error with another status', async () => {
    const error = httpError(500, 'some.code');
    await expect(tolerateNotFound(Promise.reject(error))).rejects.toBe(error);
  });

  it('should rethrow a non-http error, even one carrying a 404 statusCode', async () => {
    const error = Object.assign(new Error('boom'), { statusCode: 404 });
    await expect(tolerateNotFound(Promise.reject(error))).rejects.toBe(error);
  });
});
