import { describe, expect, it } from 'vitest';
import { SimpleCommand } from '../../../../src/lib/command/command.js';
import { CcHttpError } from '../../../../src/lib/error/cc-client-errors.js';
import { handleHttpErrors } from '../../../../src/lib/error/handle-http-errors.js';
import type { CcRequest, CcRequestParams, CcResponse } from '../../../../src/types/request.types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class TestSimpleCommand extends SimpleCommand<'test', void, any> {
  get api(): 'test' {
    return 'test';
  }
}

function command(transformErrorCode: (errorCode: string) => string): TestSimpleCommand {
  return new (class extends TestSimpleCommand {
    toRequestParams(): Partial<CcRequestParams> {
      return {};
    }

    transformErrorCode(errorCode: string): string {
      return transformErrorCode(errorCode);
    }
  })();
}

const REQUEST = {} as CcRequest;

function response(status: number, body: unknown): CcResponse<unknown> {
  return { status, headers: new Headers(), body, requestDuration: 0, cacheHit: false };
}

describe('handleHttpErrors', () => {
  it('should not throw when status is below 400', () => {
    expect(() => handleHttpErrors(REQUEST, response(200, {}))).not.toThrow();
  });

  it('should report `clever.core.too-many-requests` for a 429 response', () => {
    expect(() =>
      handleHttpErrors(REQUEST, response(429, { code: 'clever.core.too-many-requests', error: 'Too many requests' })),
    ).toThrow(expect.objectContaining({ code: 'clever.core.too-many-requests' }));
  });

  it('should report `clever.core.too-many-requests` for a 429 response with no parsable body', () => {
    expect(() => handleHttpErrors(REQUEST, response(429, undefined))).toThrow(
      expect.objectContaining({ code: 'clever.core.too-many-requests' }),
    );
  });

  it('should report `clever.core.too-many-requests` for cc-api legacy `RATE_LIMIT_HIT` (403 + id 403)', () => {
    expect(() =>
      handleHttpErrors(REQUEST, response(403, { id: 403, message: 'You have performed that request too much.' })),
    ).toThrow(expect.objectContaining({ code: 'clever.core.too-many-requests' }));
  });

  it('should not treat every 403 as a rate limit error', () => {
    expect(() =>
      handleHttpErrors(REQUEST, response(403, { id: 1004, message: 'The email address does not belong to you' })),
    ).toThrow(expect.objectContaining({ code: 'unknown_error' }));
  });

  it('should not let a command override the rate limit error code', () => {
    const cmd = command(() => 'some.other.code');
    expect(() => handleHttpErrors(REQUEST, response(429, { code: 'clever.core.too-many-requests' }), cmd)).toThrow(
      expect.objectContaining({ code: 'clever.core.too-many-requests' }),
    );
  });

  it('should still delegate non-rate-limit error codes to the command', () => {
    const cmd = command((errorCode) => (errorCode === '550' ? 'clever.some.mapped-code' : errorCode));
    expect(() => handleHttpErrors(REQUEST, response(550, { id: 550, message: 'boom' }), cmd)).toThrow(
      expect.objectContaining({ code: 'clever.some.mapped-code' }),
    );
  });

  it('should throw a `CcHttpError` carrying the request and response', () => {
    try {
      handleHttpErrors(REQUEST, response(429, { code: 'clever.core.too-many-requests', error: 'slow down' }));
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(CcHttpError);
      const httpError = err as CcHttpError;
      expect(httpError.statusCode).toBe(429);
      expect(httpError.message).toBe('[429]: slow down');
    }
  });
});
