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

  // Play sends every `String` result as `text/plain`, so the request layer hands these over as a raw
  // string: notification-api reports a missing hook that way, and forwards cc-api's own error bodies
  // that way too when authentication fails
  describe('with a JSON body sent as text', () => {
    it('should report the message it carries rather than the JSON document', () => {
      expect(() => handleHttpErrors(REQUEST, response(404, '{"error":"webhook not found"}'))).toThrow(
        expect.objectContaining({ message: '[404]: webhook not found' }),
      );
    });

    it('should report the message and the code of a forwarded cc-api error', () => {
      const cmd = command(({ code }) => code);
      expect(() =>
        handleHttpErrors(REQUEST, response(401, '{"id":2001,"message":"Not connected","type":"error"}'), cmd),
      ).toThrow(expect.objectContaining({ message: '[401]: Not connected', code: '2001' }));
    });

    it('should still detect a forwarded cc-api rate limit error', () => {
      expect(() =>
        handleHttpErrors(REQUEST, response(403, '{"id":403,"message":"You have performed that request too much."}')),
      ).toThrow(expect.objectContaining({ code: 'clever.core.too-many-requests' }));
    });
  });

  // the shape play-json's `JsError.toJson` produces, which notification-api returns as is when a
  // hook payload fails validation: no `message` and no `code`, only the paths that failed
  describe('with a Play JSON validation body', () => {
    it('should report the field that failed and why', () => {
      expect(() =>
        handleHttpErrors(REQUEST, response(400, { 'obj.urls': [{ msg: ['error.path.missing'], args: [] }] })),
      ).toThrow(expect.objectContaining({ message: '[400]: urls: error.path.missing' }));
    });

    it('should report every field that failed', () => {
      expect(() =>
        handleHttpErrors(
          REQUEST,
          response(400, {
            'obj.urls': [{ msg: ['error.path.missing'], args: [] }],
            'obj.name': [{ msg: ['error.expected.jsstring'], args: [] }],
          }),
        ),
      ).toThrow(expect.objectContaining({ message: '[400]: urls: error.path.missing. name: error.expected.jsstring' }));
    });

    it('should report every reason a single field failed', () => {
      expect(() =>
        handleHttpErrors(REQUEST, response(400, { 'obj.urls': [{ msg: ['too short', 'not a url'], args: [] }] })),
      ).toThrow(expect.objectContaining({ message: '[400]: urls: too short, not a url' }));
    });

    // play-json indexes into arrays, and names an error on the payload root `obj` with no suffix
    it('should keep a path that does not name a root field', () => {
      expect(() =>
        handleHttpErrors(REQUEST, response(400, { obj: [{ msg: ['error.expected.jsobject'], args: [] }] })),
      ).toThrow(expect.objectContaining({ message: '[400]: obj: error.expected.jsobject' }));
    });

    it('should report an indexed path as play-json wrote it', () => {
      expect(() =>
        handleHttpErrors(REQUEST, response(400, { 'obj.urls[0].url': [{ msg: ['error.path.missing'], args: [] }] })),
      ).toThrow(expect.objectContaining({ message: '[400]: urls[0].url: error.path.missing' }));
    });

    it('should prefer an explicit message over the field errors', () => {
      expect(() =>
        handleHttpErrors(
          REQUEST,
          response(400, { message: 'boom', 'obj.urls': [{ msg: ['error.path.missing'], args: [] }] }),
        ),
      ).toThrow(expect.objectContaining({ message: '[400]: boom' }));
    });

    it('should read the shape through a body sent as text', () => {
      expect(() =>
        handleHttpErrors(REQUEST, response(400, '{"obj.urls":[{"msg":["error.path.missing"],"args":[]}]}')),
      ).toThrow(expect.objectContaining({ message: '[400]: urls: error.path.missing' }));
    });

    // a body only qualifies when every one of its entries matches, so an unrelated document is
    // never dressed up as a list of field errors
    it.each([
      ['an empty body', {}],
      ['a body whose values are not arrays', { context: { key: 'foo' } }],
      ['a body whose entries carry no `msg`', { 'obj.urls': [{ args: [] }] }],
      ['a body where only some entries match', { 'obj.urls': [{ msg: ['nope'], args: [] }], other: 'x' }],
    ])('should not report %s as field errors', (_label, body) => {
      expect(() => handleHttpErrors(REQUEST, response(400, body))).toThrow(
        expect.objectContaining({ message: 'Error 400', code: 'unknown_error' }),
      );
    });

    // the body names the fields at fault but carries no code of its own, where every other backend
    // sends one for the same failure
    describe('error code normalization', () => {
      const FIELD_ERRORS = { 'obj.urls': [{ msg: ['error.path.missing'], args: [] }] };

      it('should report `clever.core.bad-request`', () => {
        expect(() => handleHttpErrors(REQUEST, response(400, FIELD_ERRORS))).toThrow(
          expect.objectContaining({ code: 'clever.core.bad-request' }),
        );
      });

      it('should not let a command override it', () => {
        const cmd = command(() => 'some.other.code');
        expect(() => handleHttpErrors(REQUEST, response(400, FIELD_ERRORS), cmd)).toThrow(
          expect.objectContaining({ code: 'clever.core.bad-request' }),
        );
      });

      it('should normalize a body sent as text too', () => {
        expect(() =>
          handleHttpErrors(REQUEST, response(400, '{"obj.urls":[{"msg":["error.path.missing"],"args":[]}]}')),
        ).toThrow(expect.objectContaining({ code: 'clever.core.bad-request' }));
      });

      // the same document under another status is not evidence of a bad request
      it('should not report it for a status other than 400', () => {
        expect(() => handleHttpErrors(REQUEST, response(422, FIELD_ERRORS))).toThrow(
          expect.objectContaining({ code: 'unknown_error', message: '[422]: urls: error.path.missing' }),
        );
      });

      // a code the backend did send says more, and the command may still map it
      it('should leave a body that carries its own code alone', () => {
        const cmd = command(({ code }) => code);
        expect(() =>
          handleHttpErrors(REQUEST, response(400, { code: 'clever.some.code', ...FIELD_ERRORS }), cmd),
        ).toThrow(expect.objectContaining({ code: 'clever.some.code' }));
      });
    });
  });

  describe('with a body that is not JSON', () => {
    it('should report a plain text error as the text it is', () => {
      expect(() => handleHttpErrors(REQUEST, response(400, 'The request content was malformed'))).toThrow(
        expect.objectContaining({ message: '[400]: The request content was malformed' }),
      );
    });

    // a gateway answering before the request reaches the API sends a whole document, which holds no
    // sentence worth showing — the status alone says more
    it.each([
      ['an HTML error page', '<html><body><h1>503 Service Unavailable</h1></body></html>'],
      ['an HTML page behind a doctype', '<!DOCTYPE html>\n<html><body>502 Bad Gateway</body></html>'],
      ['an XML error document', '<?xml version="1.0"?><Error><Code>NoSuchKey</Code></Error>'],
    ])('should not report %s as the message', (_label, body) => {
      expect(() => handleHttpErrors(REQUEST, response(503, body))).toThrow(
        expect.objectContaining({ message: 'Error 503' }),
      );
    });

    // the document is still there for whoever is debugging
    it('should keep the markup on the response the error carries', () => {
      const page = '<html><body>503</body></html>';
      try {
        handleHttpErrors(REQUEST, response(503, page));
        expect.fail('should have thrown');
      } catch (err) {
        expect((err as CcHttpError).response.body).toBe(page);
      }
    });

    // a body that opens like an object but does not parse must not be lost
    it('should report a truncated JSON body as the text it is', () => {
      expect(() => handleHttpErrors(REQUEST, response(500, '{"message":"boom'))).toThrow(
        expect.objectContaining({ message: '[500]: {"message":"boom' }),
      );
    });
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
