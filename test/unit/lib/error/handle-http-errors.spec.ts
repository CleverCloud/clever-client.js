import { describe, expect, it } from 'vitest';
import { SimpleCommand } from '../../../../src/lib/command/command.js';
import { CcHttpError } from '../../../../src/lib/error/cc-client-errors.js';
import { handleHttpErrors } from '../../../../src/lib/error/handle-http-errors.js';
import type { ApiErrorInfo } from '../../../../src/types/command.types.js';
import type { CcRequest, CcRequestParams, CcResponse } from '../../../../src/types/request.types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class TestSimpleCommand extends SimpleCommand<'test', void, any> {
  get api(): 'test' {
    return 'test';
  }
}

function command(transformErrorCode: (error: ApiErrorInfo) => string): TestSimpleCommand {
  return new (class extends TestSimpleCommand {
    toRequestParams(): Partial<CcRequestParams> {
      return {};
    }

    transformErrorCode(error: ApiErrorInfo): string {
      return transformErrorCode(error);
    }
  })();
}

const REQUEST = {} as CcRequest;

function response(status: number, body: unknown): CcResponse<unknown> {
  return { status, headers: new Headers(), body, requestDuration: 0, hasHitCache: false };
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
    const cmd = command(({ code }) => (code === '550' ? 'clever.some.mapped-code' : code));
    expect(() => handleHttpErrors(REQUEST, response(550, { id: 550, message: 'boom' }), cmd)).toThrow(
      expect.objectContaining({ code: 'clever.some.mapped-code' }),
    );
  });

  it('should give the command the error message and the HTTP status alongside the code', () => {
    const cmd = command(({ code, message, status }) => `${code}/${message}/${status}`);
    expect(() => handleHttpErrors(REQUEST, response(409, { id: 4004, message: 'already exists' }), cmd)).toThrow(
      expect.objectContaining({ code: '4004/already exists/409' }),
    );
  });

  // an endpoint that reuses one code for several failures can still tell them apart by message
  it('should let the command map a single error code to several client codes', () => {
    const cmd = command(({ message }) =>
      message === 'app has never been deployed' ? 'clever.app.never-deployed' : 'clever.app.unknown-failure',
    );
    expect(() =>
      handleHttpErrors(REQUEST, response(400, { id: 4002, message: 'app has never been deployed' }), cmd),
    ).toThrow(expect.objectContaining({ code: 'clever.app.never-deployed' }));
  });

  it('should not call the command when the response carries no error code', () => {
    const cmd = command(() => 'clever.some.mapped-code');
    expect(() => handleHttpErrors(REQUEST, response(400, { message: 'boom' }), cmd)).toThrow(
      expect.objectContaining({ code: 'unknown_error' }),
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
